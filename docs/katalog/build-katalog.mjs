#!/usr/bin/env node
/**
 * AmbiVolt Produktkatalog — Generator
 * Liest katalog-daten.json und erzeugt katalog.html (druckperfektes A4,
 * klickbares Inhaltsverzeichnis, QR-Codes zu Montagevideos).
 * PDF-Rendering danach via Edge headless (siehe render.sh / README).
 *
 * Aufruf:  node build-katalog.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, "katalog-daten.json"), "utf8"));

/* --final: Review-Marker (gapNotes/Quellen-Hinweise) für den Kundenversand
   ausblenden — Daten bleiben unverändert, nur das Rendering unterdrückt sie. */
const FINAL = process.argv.includes("--final");

/* ---------- Helfer ---------- */
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// **fett** aus den Quellen → <b>, danach erst escapen wäre falsch herum:
// wir escapen zuerst und ersetzen dann die Marker.
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
// Bildpfade /images/... → relativ zum Repo (public/)
const img = (p) => (p ? "../../public" + p : null);

// Produktname im Display-Stil: AMBI (fett) LIGHT (mager) ECO (fett)
function displayName(name) {
  const m = name.match(/^Ambi([A-Z][a-zäöü]+)(.*)$/);
  if (m) {
    return `Ambi<span class="thin">${esc(m[1])}</span>${esc(m[2])}`;
  }
  return esc(name);
}

/* ---------- QR-Codes (SVG inline) ---------- */
const qrCache = new Map();
async function qrSvg(url) {
  if (!qrCache.has(url)) {
    const svg = await QRCode.toString(url, {
      type: "svg",
      margin: 0,
      color: { dark: "#2a2938", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    qrCache.set(url, svg.replace("<svg ", '<svg class="qr" '));
  }
  return qrCache.get(url);
}

/* ---------- Bausteine ---------- */
function gapNote(p) {
  return p.gapNote && !FINAL
    ? `<div class="gap-note">Review: ${esc(p.gapNote)}</div>`
    : "";
}
// Inline-Quellenhinweis auf Sonderseiten (im Final-Build unterdrückt)
function gapInline(text) {
  return FINAL ? "" : ` <span class="gap-inline">${text}</span>`;
}

function sealsRow() {
  return `<div class="seals">
    <span class="seal iso"><span class="big">ISO 9001</span>Eingetragene Firma</span>
    <span class="seal"><span class="big">10 Jahre</span>Haltbarkeits&shy;garantie</span>
    <span class="seal mig"><span class="big">DE</span>Made in Germany<span class="flagbar"></span></span>
  </div>`;
}

async function videoCard(p) {
  if (!p.video) return "";
  return `<a class="video-card" href="${esc(p.video)}">
    ${await qrSvg(p.video)}
    <div>
      <div class="t1">Montagevideo</div>
      <div class="t2">QR-Code scannen oder klicken — Schritt für Schritt zum fertigen System.</div>
    </div>
  </a>`;
}

/* Layout A — ganze Seite */
async function layoutA(p) {
  const sections = (p.featureSections || [])
    .map(
      (s) => `<div class="feature-sec">
        <h3>${esc(s.heading)}</h3>
        <ul>${s.bullets.map((b) => `<li>${md(b)}</li>`).join("")}</ul>
      </div>`
    )
    .join("");
  // ALLE Specs rendern — kein stilles Kappen; Überlänge fängt check-layout.mjs
  if ((p.specs || []).length > 9)
    console.warn(`WARNUNG: ${p.id} hat ${p.specs.length} Spec-Zeilen — Seite auf Überlauf prüfen.`);
  const specs = (p.specs || [])
    .map(
      (s) =>
        `<div class="spec-row"><span class="k">${esc(s.label)}</span><span class="v">${md(s.value)}</span></div>`
    )
    .join("");
  const photos = (p.photos || [])
    .slice(0, 2)
    .map(
      (f) => `<figure>
        <img src="${img(f.src)}" alt="">
        <figcaption>${esc(f.caption)}</figcaption>
      </figure>`
    )
    .join("");

  return `
  <div class="prod-hero">
    <div>
      <div class="mono eyebrow">${esc(p.eyebrow)}</div>
      <h2 class="display prod-name" id="${esc(p.id)}">${displayName(p.name)}</h2>
      <p class="prod-sub">${md(p.subtitle)}</p>
      <div class="badges">${(p.badges || []).slice(0, 4).map((b) => `<span class="badge">${esc(b)}</span>`).join("")}</div>
      ${gapNote(p)}
    </div>
    <div class="hero-img">${p.image ? `<img src="${img(p.image)}" alt="${esc(p.name)}">` : '<div class="no-img mono">Bild folgt</div>'}</div>
  </div>
  <div class="prod-body">
    <div>${sections}</div>
    <div class="side-stack">
      ${specs ? `<div class="spec-card"><h4>Technische Daten</h4>${specs}</div>` : ""}
      ${await videoCard(p)}
    </div>
  </div>
  ${photos ? `<div class="photo-strip${(p.photos || []).length === 1 ? " single" : ""}">${photos}</div>` : ""}`;
}

/* Layout B — halbe Seite */
function layoutB(p) {
  const half = Math.ceil((p.bullets || []).length / 2);
  const col1 = (p.bullets || []).slice(0, half);
  const col2 = (p.bullets || []).slice(half);
  // Chips ausblenden, die nur Bullets wiederholen (weniger Redundanz)
  const plainBullets = (p.bullets || []).map((b) => b.replace(/\*\*/g, "").toLowerCase());
  const chips = (p.chips || []).filter(
    (c) => !plainBullets.some((b) => b.includes(c.toLowerCase()))
  );
  const keyspecs = (p.keySpecs || [])
    .slice(0, 3)
    .map(
      (s) =>
        `<span class="keyspec"><span class="k">${esc(s.k)}</span><span class="v">${esc(s.v)}${s.unit ? ` <small>${esc(s.unit)}</small>` : ""}</span></span>`
    )
    .join("");
  return `<article class="compact-item">
    <div class="compact-media">
      <div class="compact-img">${p.image ? `<img src="${img(p.image)}" alt="${esc(p.name)}">` : '<div class="no-img mono">Bild folgt</div>'}</div>
      ${keyspecs ? `<div class="keyspecs">${keyspecs}</div>` : ""}
    </div>
    <div>
      <div class="mono eyebrow">${esc(p.eyebrow)}</div>
      <h2 class="display compact-name" id="${esc(p.id)}">${displayName(p.name)}</h2>
      <p class="compact-sub">${md(p.subtitle)}</p>
      <div class="compact-cols">
        <ul>${col1.map((b) => `<li>${md(b)}</li>`).join("")}</ul>
        <ul>${col2.map((b) => `<li>${md(b)}</li>`).join("")}</ul>
      </div>
      ${chips.length ? `<div class="chip-row">${chips.slice(0, 3).map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>` : ""}
      ${gapNote(p)}
    </div>
  </article>`;
}

/* Layout C — Kleinteil (2×2-Raster) */
function layoutC(p) {
  return `<article class="mini-item">
    <div class="mini-img">${p.image ? `<img src="${img(p.image)}" alt="${esc(p.name)}">` : '<div class="no-img mono">Bild folgt</div>'}</div>
    <div class="mini-body">
      <h3 class="display mini-name" id="${esc(p.id)}">${displayName(p.name)}</h3>
      ${(p.badges || []).length ? `<div class="chip-row">${p.badges.slice(0, 2).map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>` : ""}
      <p class="mini-sub">${md(p.subtitle)}</p>
      <ul>${(p.bullets || []).slice(0, 4).map((b) => `<li>${md(b)}</li>`).join("")}</ul>
      ${gapNote(p)}
    </div>
  </article>`;
}

/* ---------- Seiten-Gerüst ---------- */
function sheet({ body, chapterLabel, pageNo, cls = "" }) {
  const head =
    chapterLabel != null
      ? `<header class="page-head">
          <span class="mono">${esc(chapterLabel)}</span>
          <span class="rule"></span>
          <span class="mono pageno">Seite ${pageNo}</span>
        </header>`
      : "";
  const foot =
    chapterLabel != null
      ? `<footer class="page-foot">
          <span class="mono">${esc(data.meta.kontakt.firma)} · ${esc(data.meta.kontakt.strasse)} · ${esc(data.meta.kontakt.ort)}</span>
          <span class="mono brand">Schnell montiert, dauerhaft stark!</span>
        </footer>`
      : "";
  return `<section class="sheet ${cls}" id="page-${pageNo}">${head}${body}${foot}</section>`;
}

/* ---------- Sonderseiten ---------- */
function coverPage(pageNo) {
  const k = data.meta.kontakt;
  return `<section class="sheet cover" id="page-${pageNo}">
  <div class="cover-grid blueprint-dark"></div>
  <div class="cover-inner">
    <div class="cover-top">
      <div class="logo-plate"><img src="../../public/ambivolt-logo.svg" alt="AmbiVolt"></div>
      <div class="cover-meta">
        <span class="mono">Produktkatalog <span class="amber">${esc(data.meta.ausgabe)}</span></span>
        <span class="mono">Photovoltaik-Montagesysteme</span>
      </div>
    </div>
    <div class="cover-title-wrap">
      <div class="mono cover-kicker">Made in Germany · ISO 9001 · 10 Jahre Garantie</div>
      <h1 class="cover-title">Montage&shy;systeme<br>für jedes Dach<span class="accent">.</span></h1>
      <p class="cover-sub">${esc((data.meta.coverChips || []).slice(0, -1).join(", "))} oder ${esc((data.meta.coverChips || []).slice(-1)[0] ?? "")} — durchdachte Unterkonstruktionen vom Hersteller. Schnell montiert, dauerhaft stark.</p>
      <div class="cover-cats">${(data.meta.coverChips || []).map((c) => `<span class="cover-cat">${esc(c)}</span>`).join("")}</div>
    </div>
    <div class="cover-photo">
      <span class="cover-claim">Schnell montiert, dauerhaft stark!</span>
      <img src="../../public/images/products/ambivolt-ambilight-gruendachsystem-OW-1000x600px-01.jpg" alt="">
    </div>
  </div>
  <div class="cover-foot">
    <span class="mono">${esc(k.firma)}</span>
    <span class="mono">${esc(k.web).replace(/^www\./, "")}</span>
  </div>
</section>`;
}

function tocPage(pageNo, entries) {
  // Kapitel + zugehörige Untereinträge gruppieren (2-Spalten-Satz ohne
  // Umbruch mitten in einer Gruppe)
  const groups = [];
  for (const e of entries) {
    if (!e.sub || !groups.length) groups.push([e]);
    else groups[groups.length - 1].push(e);
  }
  const rows = groups
    .map(
      (g) => `<div class="toc-group">${g
        .map(
          (e) => `<a class="toc-row${e.sub ? " sub" : ""}" href="#page-${e.page}">
        <span class="toc-num mono">${e.num ? esc(e.num) : ""}</span>
        <span class="toc-title">${esc(e.title)}</span>
        <span class="toc-dots"></span>
        <span class="toc-page mono">${e.page}</span>
      </a>`
        )
        .join("")}</div>`
    )
    .join("");
  return sheet({
    pageNo,
    chapterLabel: "Inhalt",
    body: `<div class="content-pad">
      <div class="mono eyebrow">Produktkatalog ${esc(data.meta.ausgabe)}</div>
      <h2 class="display page-title">Inhalts<span class="thin">verzeichnis</span></h2>
      <p class="page-intro">Alle Einträge sind klickbar und springen direkt zur Seite. QR-Codes im Katalog führen zu den Montagevideos.</p>
      <div class="toc">${rows}</div>
    </div>`,
  });
}

function unternehmenPage(pageNo) {
  const m = data.meta;
  return sheet({
    pageNo,
    chapterLabel: "Kap. 02 — Das Unternehmen",
    body: `<div class="content-pad">
      <div class="mono eyebrow">Über uns</div>
      <h2 class="display page-title">Das <span class="thin">Unternehmen</span></h2>
      <p class="page-intro">${md(m.unternehmen)}</p>
      <div class="two-col-info">
        <div class="info-card">
          <h3>Sicherheitsbestimmungen</h3>
          <p>${md(m.sicherheit)}</p>
        </div>
        <div class="info-card dark">
          <h3>Material &amp; Qualität</h3>
          <ul>${(m.legierungen || []).map((l) => `<li>${md(l)}</li>`).join("")}</ul>
        </div>
      </div>
      ${sealsRow()}
      <div class="photo-strip lower">
        <figure><img src="${img("/images/products/ambivolt-ambilight-eco-plus-sued-bild01.jpg")}" alt=""><figcaption>Montage durch den Fachbetrieb</figcaption></figure>
        <figure><img src="${img("/images/products/ambivolt-ambilight-gruendachsystem-OW-1000x600px-01.jpg")}" alt=""><figcaption>Systeme für jede Dachform</figcaption></figure>
      </div>
    </div>`,
  });
}

function chapterOpener(ch, pageNo) {
  return sheet({
    pageNo,
    chapterLabel: `Kap. ${ch.num} — ${ch.title}`,
    cls: "chapter-open",
    body: `<div class="content-pad">
      <div class="opener-num display">${esc(ch.num)}</div>
      <div class="mono eyebrow">Kapitel ${esc(ch.num)}</div>
      <h2 class="display page-title big">${esc(ch.title)}</h2>
      <p class="page-intro">${md(ch.intro || "")}</p>
      ${ch.id === "easyclick" ? easyclickExtra() : ""}
      ${ch.openerImage ? `<div class="opener-photo"><img src="${img(ch.openerImage)}" alt=""></div>` : ""}
    </div>`,
  });
}

function easyclickExtra() {
  return `<div class="steps-band">
    <div class="steps-title mono">Die EasyClick-Klemme von AmbiVolt</div>
    <div class="steps">
      <div class="step"><span class="step-n" style="background:var(--amber)">1</span><span>Schräg ansetzen</span></div>
      <div class="step"><span class="step-n" style="background:var(--green)">2</span><span>Einfach reindrehen</span></div>
    </div>
  </div>`;
}

function cmpTable(rows, columns) {
  const head = `<tr><th></th>${columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`;
  const body = rows
    .map((r) => {
      // Spaltenübergreifende Zellen wie im Original: identische Werte mergen
      const allSame = r.values.length > 1 && r.values.every((x) => x === r.values[0]);
      const cells = allSame
        ? `<td colspan="${r.values.length}" class="span">${md(r.values[0])}</td>`
        : r.values.map((x) => `<td>${md(x)}</td>`).join("");
      return `<tr><td class="rowlabel">${esc(r.label)}</td>${cells}</tr>`;
    })
    .join("");
  return `<table class="cmp-table">${head}${body}</table>`;
}

/* Systemvergleich auf 2 Seiten: Eigenschaften | technische Werte */
function vergleichSplit() {
  const v = data.vergleich.systemvergleich;
  let cut = v.rows.findIndex((r) => /^Fußfläche/.test(r.label));
  if (cut < 1) cut = Math.ceil(v.rows.length / 2);
  return [v.rows.slice(0, cut), v.rows.slice(cut)];
}

function vergleichPage1(pageNo, chapterLabel) {
  const v = data.vergleich.systemvergleich;
  const [qual] = vergleichSplit();
  return sheet({
    pageNo,
    chapterLabel,
    body: `<div class="content-pad">
      <div class="mono eyebrow">AmbiLight-Familie · Systemvergleich 1/2</div>
      <h2 class="display page-title">System<span class="thin">vergleich</span></h2>
      <p class="page-intro">${v.columns.length === 2 ? "Eco oder Eco Plus" : `${v.columns.length} Systeme, ein Baukasten`}: Welches AmbiLight passt zu Ihrem Dach?${gapInline("Quelle: AmbiLight-Broschüre.")}</p>
      ${cmpTable(qual, v.columns)}
    </div>`,
  });
}

function vergleichPage2(pageNo, chapterLabel) {
  const v = data.vergleich.systemvergleich;
  const [, tech] = vergleichSplit();
  return sheet({
    pageNo,
    chapterLabel,
    body: `<div class="content-pad">
      <div class="mono eyebrow">AmbiLight-Familie · Systemvergleich 2/2</div>
      <h2 class="display page-title">Technische <span class="thin">Werte</span></h2>
      <p class="page-intro">Ballast, Schneelasten und Maße der vier Systeme im Überblick. Technische Änderungen vorbehalten.${gapInline("Quelle: AmbiLight-Broschüre.")}</p>
      ${cmpTable(tech, v.columns)}
    </div>`,
  });
}

/* Familien-Features: nach Textmenge fair auf 2 Seiten verteilt */
function familieSplit() {
  const f = data.vergleich?.familienFeatures || [];
  const weight = (s) => s.bullets.join(" ").length + 80;
  const total = f.reduce((sum, s) => sum + weight(s), 0);
  let acc = 0;
  let cut = f.length;
  for (let i = 0; i < f.length; i++) {
    acc += weight(f[i]);
    if (acc >= total / 2) { cut = i + 1; break; }
  }
  return [f.slice(0, cut), f.slice(cut)];
}

function familiePage(pageNo, sections, part, chapterLabel) {
  const feats = sections
    .map(
      (s) => `<div class="feature-sec">
      <h3>${esc(s.heading)}</h3>
      <ul>${s.bullets.map((b) => `<li>${md(b)}</li>`).join("")}</ul>
    </div>`
    )
    .join("");
  return sheet({
    pageNo,
    chapterLabel,
    body: `<div class="content-pad">
      <div class="mono eyebrow">AmbiLight-Familie ${part}</div>
      <h2 class="display page-title">Ein System, <span class="thin">durchdacht</span></h2>
      <p class="page-intro">Was alle AmbiLight-Systeme gemeinsam haben.${gapInline("Quelle: AmbiLight-Broschüre.")}</p>
      <div class="feat-cols">${feats}</div>
    </div>`,
  });
}

function ertragPage(pageNo, chapterLabel) {
  const e = data.vergleich.ertragsvergleich;
  if (!e) return "";
  return sheet({
    pageNo,
    chapterLabel,
    body: `<div class="content-pad">
      <div class="mono eyebrow">AmbiLight-Familie</div>
      <h2 class="display page-title">Ertrags<span class="thin">vergleich</span></h2>
      <p class="page-intro">${md(e.intro || "Ost-West-Aufständerung nutzt Ihre Dachfläche doppelt so dicht wie eine Süd-Aufständerung — und liefert pro Quadratmeter deutlich mehr Jahresertrag.")}</p>
      <div class="prod-body no-top">
        <div>
          <div class="feature-sec">
            <h3>Ihre Vorteile mit Ost-West</h3>
            <ul>${(e.vorteile || []).map((b) => `<li>${md(b)}</li>`).join("")}</ul>
          </div>
        </div>
        <div class="side-stack">
          <div class="spec-card">
            <h4>Ost-West vs. Süd (1.000 m² Dach)</h4>
            ${e.rows.map((r) => `<div class="spec-row triple"><span class="k">${esc(r.label)}</span><span class="v">${md(r.ow)}</span><span class="v sued">${md(r.sued)}</span></div>`).join("")}
            <div class="spec-legend mono"><span></span><span>Ost-West</span><span class="sued">Süd/SW</span></div>
          </div>
          ${sealsRow()}
        </div>
      </div>
    </div>`,
  });
}

function mengenPage(pageNo, chapterLabel) {
  const m = data.vergleich?.mengenermittlung;
  if (!m) return "";
  return sheet({
    pageNo,
    chapterLabel,
    body: `<div class="content-pad">
      <div class="mono eyebrow">Planung</div>
      <h2 class="display page-title">Mengen<span class="thin">ermittlung</span></h2>
      <p class="page-intro">${md(m.intro)}</p>
      <div class="legend-grid">
        ${m.legende.map((l) => `<div class="legend-item"><span class="legend-nr display">${esc(l.nr)}</span><span>${esc(l.name)}</span></div>`).join("")}
      </div>
      <div class="info-card">
        <h3>Belegungsbeispiele &amp; Ballastberechnung</h3>
        <p>Detaillierte Belegungsbeispiele mit Stückzahlen je Feldgröße sowie die projektbezogene Ballastberechnung finden Sie in unserer <b>AmbiLight-Planungshilfe</b> — oder Sie senden uns Ihren Belegungsplan: Wir übernehmen die Mengenermittlung kostenlos.</p>
        ${FINAL ? "" : `<p class="gap-inline">Hinweis (Review): Die grafischen Belegungsbeispiele des alten Katalogs (S. 19) sind textlich nicht reproduzierbar — hier ersetzt durch Verweis auf Planungshilfe + Service-Angebot.</p>`}
      </div>
      ${sealsRow()}
    </div>
    <div class="photo-strip single">
      <figure>
        <img src="${img("/images/products/ambivolt-ambilight-eco-1000x600-01-web.jpg")}" alt="">
        <figcaption>Optimale Ausnutzung Ihrer Dachfläche</figcaption>
      </figure>
    </div>`,
  });
}

function backPage(pageNo) {
  const k = data.meta.kontakt;
  return `<section class="sheet cover back" id="page-${pageNo}">
  <div class="cover-grid blueprint-dark"></div>
  <div class="cover-inner">
    <div class="cover-top"><div class="logo-plate"><img src="../../public/ambivolt-logo.svg" alt="AmbiVolt"></div></div>
    <div class="cover-title-wrap">
      <div class="mono cover-kicker">Kontakt</div>
      <h1 class="cover-title small">Sprechen wir über Ihr Projekt<span class="accent">.</span></h1>
      <div class="contact-grid">
        <div><span class="mono">Anschrift</span><p>${esc(k.firma)}<br>${esc(k.strasse)}<br>${esc(k.ort)}</p></div>
        <div><span class="mono">Telefon</span><p>${esc(k.tel)}</p></div>
        <div><span class="mono">E-Mail</span><p>${esc(k.mail)}</p></div>
        <div><span class="mono">Web</span><p>${esc(k.web)}</p></div>
      </div>
      <p class="cover-sub">Angebot in 2 Minuten: Konfigurieren Sie Ihr Montagesystem online unter <b>angebot.ambivolt.de</b> — oder senden Sie uns Ihren Belegungsplan.</p>
    </div>
    <div class="cover-foot-note mono">Produktkatalog ${esc(data.meta.ausgabe)} · Änderungen und Irrtümer vorbehalten. Alle Angaben ohne Gewähr.</div>
  </div>
</section>`;
}

/* ---------- Pagination ---------- */
async function buildPages() {
  const pages = []; // {html-fn oder html, chapterLabel, tocEntries}
  const toc = [];
  let pageNo = 1;

  // Cover (Seitenzahl aus dem Zähler — keine Literale)
  const coverNo = pageNo++;
  pages.push({ html: () => coverPage(coverNo) });

  // TVZ (Platzhalter, wird nach Nummerierung gefüllt)
  const tocPageNo = pageNo++;
  pages.push({ html: () => tocPage(tocPageNo, toc) });

  // Unternehmen + Sicherheit
  const unterNo = pageNo++;
  toc.push({ num: "02/03", title: "Das Unternehmen · Sicherheitsbestimmungen", page: unterNo });
  pages.push({ html: () => unternehmenPage(unterNo) });

  for (const ch of data.chapters) {
    const label = `Kap. ${ch.num} — ${ch.title}`;
    const chStart = pageNo;
    toc.push({ num: ch.num, title: ch.title, page: chStart });

    // Kapitel-Opener, wenn explizit gesetzt ODER ein Intro-Text existiert
    // (sonst würden redaktionelle Kapitel-Einleitungen still verworfen)
    if (ch.opener || ch.intro) {
      const n = pageNo++;
      pages.push({ html: () => chapterOpener(ch, n) });
    }

    // Produkte paginieren: A einzeln, B paarweise, C in 4er-Rastern
    const prods = ch.products;
    let i = 0;
    while (i < prods.length) {
      const p = prods[i];
      if (p.layout === "A") {
        const n = pageNo++;
        toc.push({ title: p.name, page: n, sub: true });
        pages.push({ html: async () => sheet({ pageNo: n, chapterLabel: label, body: await layoutA(p) }) });
        i++;
      } else if (p.layout === "B") {
        const pair = [p];
        if (prods[i + 1]?.layout === "B") pair.push(prods[i + 1]);
        const n = pageNo++;
        for (const pp of pair) toc.push({ title: pp.name, page: n, sub: true });
        pages.push({
          html: () =>
            sheet({
              pageNo: n,
              chapterLabel: label,
              body: `<div class="compact${pair.length === 1 ? " single" : ""}">${pair.map(layoutB).join("")}</div>`,
            }),
        });
        i += pair.length;
      } else {
        const quad = [p];
        while (quad.length < 4 && prods[i + quad.length]?.layout === "C") quad.push(prods[i + quad.length]);
        const n = pageNo++;
        // Auch Kleinteile ins Inhaltsverzeichnis (Konsistenz mit A/B)
        for (const pp of quad) toc.push({ title: pp.name, page: n, sub: true });
        pages.push({
          html: () =>
            sheet({
              pageNo: n,
              chapterLabel: label,
              body: `<div class="mini-grid">${quad.map(layoutC).join("")}</div>`,
            }),
        });
        i += quad.length;
      }
    }

    // Sonderseiten des Flachdach-Kapitels — Guards VOR Seitenzahl/TVZ-Vergabe,
    // sonst entstehen Geisterseiten (Nummer + TVZ-Eintrag ohne Sheet)
    if (ch.id === "flachdach") {
      if (data.vergleich?.systemvergleich?.rows?.length) {
        const n1 = pageNo++;
        toc.push({ title: "Systemvergleich AmbiLight", page: n1, sub: true });
        pages.push({ html: () => vergleichPage1(n1, label) });
        const n1b = pageNo++;
        toc.push({ title: "Systemvergleich — technische Werte", page: n1b, sub: true });
        pages.push({ html: () => vergleichPage2(n1b, label) });
      }
      const [famA, famB] = familieSplit();
      if (famA.length) {
        const n2 = pageNo++;
        toc.push({ title: "Die AmbiLight-Familie", page: n2, sub: true });
        pages.push({ html: () => familiePage(n2, famA, famB.length ? "1/2" : "", label) });
        if (famB.length) {
          const n2b = pageNo++;
          pages.push({ html: () => familiePage(n2b, famB, "2/2", label) });
        }
      }
      if (data.vergleich?.ertragsvergleich) {
        const n3 = pageNo++;
        toc.push({ title: "Ertragsvergleich Ost-West vs. Süd", page: n3, sub: true });
        pages.push({ html: () => ertragPage(n3, label) });
      }
      if (data.vergleich?.mengenermittlung) {
        const n4 = pageNo++;
        toc.push({ title: "Mengenermittlung", page: n4, sub: true });
        pages.push({ html: () => mengenPage(n4, label) });
      }
    }
  }

  // Rückseite
  const backNo = pageNo++;
  toc.push({ title: "Kontakt", page: backNo, num: "" });
  pages.push({ html: () => backPage(backNo) });

  const rendered = [];
  for (const p of pages) rendered.push(await p.html());
  return rendered.join("\n");
}

/* ---------- CSS (aus dem freigegebenen Muster, erweitert) ---------- */
const css = readFileSync(join(__dirname, "katalog.css"), "utf8");
/* Lokal eingebettete Schriften (docs/katalog/fonts/) — kein CDN-Zugriff beim
   Rendern, deterministische Fonts auch offline */
const fontsCss = readFileSync(join(__dirname, "fonts", "fonts-local.css"), "utf8");

/* ---------- HTML ---------- */
const bodyHtml = await buildPages();
const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>AmbiVolt Produktkatalog ${esc(data.meta.ausgabe)}</title>
<style>${fontsCss}</style>
<style>${css}</style>
</head>
<body>
${bodyHtml}
<script>
  // Vorschau-Helfer: ?only=N zeigt nur Seite N randlos (für Screenshot-Rendering).
  const only = new URLSearchParams(location.search).get("only");
  if (only) {
    document.querySelectorAll(".sheet").forEach((s, i) => {
      if (i !== Number(only) - 1) s.style.display = "none";
      else { s.style.margin = "0"; s.style.boxShadow = "none"; }
    });
    document.body.style.background = "#fff";
  }
</script>
</body>
</html>`;

writeFileSync(join(__dirname, "katalog.html"), html, "utf8");
const pageCount = (html.match(/class="sheet/g) || []).length;
console.log(`katalog.html geschrieben — ${pageCount} Seiten.`);
