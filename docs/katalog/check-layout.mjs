#!/usr/bin/env node
/**
 * Deterministischer Layout-Check: lädt katalog.html in Edge headless (via CDP)
 * und misst pro Seite, ob Inhalte überlaufen oder kollidieren.
 *
 * Prüfungen je .sheet:
 *  1. Vertikaler/horizontaler Überlauf über die Seitenkanten
 *  2. Footer-Kollision (Inhalt ragt in die Fußzeile)
 *  3. Foto-Leisten-Kollision (Inhalt hinter der absoluten .photo-strip)
 *  4. Clipping in overflow:hidden-Containern (z. B. .mini-item)
 *
 * Gemessen werden TEXT-KNOTEN (via Range — erfasst auch Mixed-Content wie
 * <li><b>…</b> Text…</li>) und ersetzte Elemente (IMG/SVG/TABLE/FIGURE).
 *
 * Sicherheitsnetz gegen Leerlauf-Grün: Die Soll-Seitenzahl wird aus der
 * lokalen katalog.html gelesen; weicht die gemessene Zahl ab (z. B. Server
 * down, 404-Seite, alter Build), schlägt der Check fehl.
 *
 * Aufruf: node docs/katalog/check-layout.mjs  (Server auf :8321 muss laufen)
 * Exit-Codes: 0 = sauber · 1 = Befunde/Seitenzahl-Mismatch · 2 = Infrastruktur
 */
import { execFile } from "node:child_process";
import { readFileSync, existsSync, mkdtempSync, rmSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import http from "node:http";
import { connect } from "node:net";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PAGE_URL = "http://localhost:8321/docs/katalog/katalog.html";
const WATCHDOG_MS = 90_000;

/* Soll-Seitenzahl aus dem lokalen Build — Leerlauf-Grün unmöglich machen */
const htmlPath = join(__dirname, "katalog.html");
if (!existsSync(htmlPath)) {
  console.error("FEHLER: katalog.html fehlt — erst build-katalog.mjs ausführen.");
  process.exit(2);
}
const EXPECTED_SHEETS = (readFileSync(htmlPath, "utf8").match(/class="sheet/g) || []).length;
if (EXPECTED_SHEETS === 0) {
  console.error("FEHLER: katalog.html enthält keine .sheet-Elemente.");
  process.exit(2);
}

/* Frisches user-data-dir + Port 0: keine Kollision mit hängenden Instanzen */
const userDataDir = mkdtempSync(join(tmpdir(), "edge-cdp-check-"));
const edge = execFile(EDGE, [
  "--headless", "--disable-gpu", "--force-device-scale-factor=1",
  "--remote-debugging-port=0", `--user-data-dir=${userDataDir}`,
  PAGE_URL,
]);

/* Aufräumen: Edge beenden, auf Prozess-Exit warten, Wegwerf-Profil löschen */
async function cleanup() {
  if (edge.exitCode === null) {
    // Prozess lebt noch: killen und auf Exit warten (max. 5s) —
    // Timer räumen, sonst hält er die Event-Loop 5s im Leerlauf offen
    const exited = new Promise((r) => edge.once("exit", r));
    try { edge.kill(); } catch { /* egal */ }
    let timer;
    await Promise.race([exited, new Promise((r) => { timer = setTimeout(r, 5000); })]);
    clearTimeout(timer);
  }
  try {
    rmSync(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch { /* Handles noch offen — Rest räumt der nächste Lauf weg */ }
  // Verwaiste Profile früherer (abgebrochener) Läufe mit entsorgen
  try {
    const base = dirname(userDataDir);
    for (const d of readdirSync(base)) {
      if (d.startsWith("edge-cdp-check-") && join(base, d) !== userDataDir) {
        try { rmSync(join(base, d), { recursive: true, force: true }); } catch { /* in Benutzung */ }
      }
    }
  } catch { /* optional */ }
}

/* Watchdog: hängender Handshake/Evaluate darf den Lauf nicht ewig blockieren */
const watchdog = setTimeout(async () => {
  console.error(`FEHLER: Layout-Check hängt (> ${WATCHDOG_MS / 1000}s) — Edge wird beendet.`);
  await cleanup();
  process.exit(2);
}, WATCHDOG_MS);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function readDebugPort() {
  // Edge schreibt "DevToolsActivePort" (Zeile 1 = Port) ins user-data-dir
  const file = join(userDataDir, "DevToolsActivePort");
  for (let i = 0; i < 60; i++) {
    try {
      // readFileSync kann transient EBUSY werfen (Edge hält die Datei noch) —
      // das ist ein Poll-Fall, kein Abbruchgrund
      const port = Number(readFileSync(file, "utf8").split(/\r?\n/)[0]);
      if (port > 0) return port;
    } catch { /* ENOENT/EBUSY/EACCES → weiter pollen */ }
    await sleep(250);
  }
  throw new Error("DevToolsActivePort erschien nicht — Edge-Start fehlgeschlagen?");
}

const get = (port, path) => new Promise((res, rej) => {
  http.get({ host: "127.0.0.1", port, path }, (r) => {
    let d = ""; r.on("data", (c) => (d += c)); r.on("end", () => {
      try { res(JSON.parse(d)); } catch (e) { rej(e); }
    });
  }).on("error", rej);
});

/* WebSocket-Mini-Client (CDP): Text-Frames senden/empfangen, mit Fehlerpfaden */
function wsConnect(wsUrl) {
  const { hostname, port, pathname } = new URL(wsUrl);
  return new Promise((resolve, reject) => {
    const key = randomBytes(16).toString("base64");
    const sock = connect(Number(port), hostname, () => {
      sock.write(
        `GET ${pathname} HTTP/1.1\r\nHost: ${hostname}:${port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`
      );
    });
    let up = false, buf = Buffer.alloc(0);
    const pending = new Map();
    let idc = 0;
    const failAll = (err) => {
      for (const [, p] of pending) p.reject(err);
      pending.clear();
      if (!up) reject(err);
    };
    sock.on("error", failAll);
    sock.on("close", () => failAll(new Error("CDP-WebSocket wurde geschlossen")));
    const api = {
      send(method, params) {
        const id = ++idc;
        const payload = Buffer.from(JSON.stringify({ id, method, params }));
        const mask = randomBytes(4);
        let header;
        if (payload.length < 126) header = Buffer.from([0x81, 0x80 | payload.length]);
        else if (payload.length < 65536) { header = Buffer.alloc(4); header[0] = 0x81; header[1] = 0x80 | 126; header.writeUInt16BE(payload.length, 2); }
        else { header = Buffer.alloc(10); header[0] = 0x81; header[1] = 0x80 | 127; header.writeBigUInt64BE(BigInt(payload.length), 2); }
        const masked = Buffer.from(payload);
        for (let i = 0; i < masked.length; i++) masked[i] ^= mask[i % 4];
        sock.write(Buffer.concat([header, mask, masked]));
        return new Promise((res, rej) => pending.set(id, { resolve: res, reject: rej }));
      },
      close() { sock.destroy(); },
    };
    sock.on("data", (chunk) => {
      if (!up) {
        const s = chunk.toString();
        const i = s.indexOf("\r\n\r\n");
        if (i >= 0) { up = true; resolve(api); chunk = chunk.slice(Buffer.byteLength(s.slice(0, i + 4))); }
        else return;
      }
      buf = Buffer.concat([buf, chunk]);
      while (buf.length >= 2) {
        let len = buf[1] & 0x7f, off = 2;
        if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4; }
        else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); off = 10; }
        if (buf.length < off + len) return;
        const payload = buf.slice(off, off + len);
        buf = buf.slice(off + len);
        try {
          const msg = JSON.parse(payload.toString());
          if (msg.id && pending.has(msg.id)) { pending.get(msg.id).resolve(msg); pending.delete(msg.id); }
        } catch { /* Nicht-JSON-Frames ignorieren */ }
      }
    });
  });
}

/* Misst Text-Knoten (Range) + ersetzte Elemente — erfasst Mixed-Content */
const CHECK_JS = `(() => {
  const out = [];
  const sheets = [...document.querySelectorAll('.sheet')];
  const label = (el) => (el.tagName || '') + '.' + (typeof el.className === 'string' ? el.className : (el.className?.baseVal ?? ''));
  sheets.forEach((sheet, idx) => {
    const s = sheet.getBoundingClientRect();
    const page = idx + 1;
    const foot = sheet.querySelector('.page-foot');
    const footTop = foot ? foot.getBoundingClientRect().top : s.bottom;
    const strips = [...sheet.querySelectorAll('.photo-strip')].filter((el) => getComputedStyle(el).position === 'absolute');
    const inSkip = (node) => {
      const el = node.nodeType === 1 ? node : node.parentElement;
      return !el || el.closest('.page-foot') || strips.some((st) => st === el || st.contains(el));
    };
    // Zu messende Rechtecke einsammeln: Text-Knoten + ersetzte Elemente
    const rects = [];
    const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT);
    let tn;
    while ((tn = walker.nextNode())) {
      if (!tn.textContent.trim() || inSkip(tn)) continue;
      const range = document.createRange();
      range.selectNodeContents(tn);
      for (const r of range.getClientRects()) {
        if (r.width && r.height) rects.push({ r, el: tn.parentElement, text: tn.textContent.trim().slice(0, 60) });
      }
      range.detach?.();
    }
    for (const el of sheet.querySelectorAll('img, svg, table, figure')) {
      if (inSkip(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width && r.height) rects.push({ r, el, text: '<' + el.tagName.toLowerCase() + '>' });
    }
    // Prüfen
    for (const { r, el, text } of rects) {
      if (r.bottom > s.bottom + 0.5) out.push({ page, type: 'v-overflow', el: label(el), text, px: Math.round(r.bottom - s.bottom) });
      if (r.right > s.right + 0.5) out.push({ page, type: 'h-overflow', el: label(el), text, px: Math.round(r.right - s.right) });
      if (foot && r.bottom > footTop + 0.5 && r.top < s.bottom) out.push({ page, type: 'footer-collision', el: label(el), text, px: Math.round(r.bottom - footTop) });
      for (const st of strips) {
        const sr = st.getBoundingClientRect();
        if (r.bottom > sr.top + 0.5 && r.top < sr.bottom) out.push({ page, type: 'strip-collision', el: label(el), text, px: Math.round(r.bottom - sr.top) });
      }
    }
    // Clipping in overflow:hidden-Containern (außer der Seite selbst)
    for (const el of sheet.querySelectorAll('*')) {
      if (el === sheet || inSkip(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.overflow !== 'hidden' && cs.overflowY !== 'hidden') continue;
      if (el.scrollHeight > el.clientHeight + 1) out.push({ page, type: 'clipped', el: label(el), text: el.textContent.trim().slice(0, 60), px: el.scrollHeight - el.clientHeight });
    }
  });
  return JSON.stringify({ sheets: sheets.length, problems: out, url: document.URL, ready: document.readyState, fonts: document.fonts.status });
})()`;

try {
  const port = await readDebugPort();
  let targets;
  for (let i = 0; i < 30; i++) {
    try { targets = await get(port, "/json/list"); if (targets?.length) break; } catch { /* retry */ }
    await sleep(500);
  }
  if (!targets?.length) throw new Error("CDP lieferte keine Targets — Edge-Start fehlgeschlagen?");
  const target = targets.find((t) => t.url.includes("katalog.html"));
  if (!target) throw new Error(`Katalog-Tab nicht gefunden (Targets: ${targets.map((t) => t.url).join(", ")})`);
  const ws = await wsConnect(target.webSocketDebuggerUrl);
  await ws.send("Runtime.enable", {});
  for (let i = 0; i < 20; i++) {
    const r = await ws.send("Runtime.evaluate", { expression: "document.readyState + ':' + document.fonts.status", returnByValue: true });
    if (r.result?.result?.value === "complete:loaded") break;
    await sleep(500);
  }
  // Evaluate mit Retry: direkt nach dem Start kann kurz noch das
  // Initialdokument (about:blank, 0 Sheets) aktiv sein. Fonts müssen im
  // SELBEN Aufruf geladen sein — sonst misst Range mit Fallback-Metriken.
  let sheets, problems, url, ready, fonts;
  for (let attempt = 0; attempt < 20; attempt++) {
    const res = await ws.send("Runtime.evaluate", { expression: CHECK_JS, returnByValue: true });
    if (res.result?.exceptionDetails) throw new Error("CHECK_JS warf: " + JSON.stringify(res.result.exceptionDetails).slice(0, 400));
    ({ sheets, problems, url, ready, fonts } = JSON.parse(res.result.result.value));
    if (sheets === EXPECTED_SHEETS && ready === "complete" && fonts === "loaded") break;
    await sleep(500);
  }
  ws.close();
  if (fonts !== "loaded") {
    console.error(`FEHLER: Schriften nicht geladen (fonts=${fonts}) — Messung wäre unzuverlässig.`);
    process.exitCode = 2;
    throw new Error("Font-Timeout");
  }
  if (sheets !== EXPECTED_SHEETS) {
    console.error(`FEHLER: ${sheets} Seiten gemessen, ${EXPECTED_SHEETS} erwartet — gemessen wurde: ${url} (readyState=${ready})`);
    process.exitCode = 1;
  } else {
    console.log(`Geprüft: ${sheets}/${EXPECTED_SHEETS} Seiten — ${problems.length} Probleme`);
    for (const p of problems) console.log(`  S.${String(p.page).padStart(2)} [${p.type}] +${p.px}px ${p.el} "${p.text}"`);
    process.exitCode = problems.length ? 1 : 0;
  }
} catch (err) {
  console.error("FEHLER:", err.message);
  process.exitCode = 2;
} finally {
  clearTimeout(watchdog);
  await cleanup();
}
