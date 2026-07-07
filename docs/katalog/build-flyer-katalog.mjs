#!/usr/bin/env node
/**
 * AmbiVolt Produktkatalog — Flyer-Fassung.
 * Deckblatt + klickbares Inhaltsverzeichnis (im Flyer-Design) + die 9 Original-
 * Flyer 1:1, vereinheitlicht auf DIN A4, mit Seitenzahlen und anklickbaren
 * Montagevideo-QR-Codes.
 *
 * Aufruf: node docs/katalog/build-flyer-katalog.mjs  →  katalog.pdf
 */
import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { PDFDocument, PDFName, PDFString, rgb } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const AUSGABE = "2026-02";
const ORANGE = "#F39100"; // Flyer-Orange (aus Flyer gemessen)

// Montagevideos (Kundenangabe): pitched roof / Flachdach / Gründach
const VIDEO = {
  schraegdach: "https://youtube.com/shorts/gKhsxOPFNvU?feature=share",
  flachdach: "https://youtube.com/shorts/IWcKyLY68Wo?feature=share",
  gruendach: "https://youtube.com/shorts/4k-6rLaxiV8?feature=share",
};

// Reihenfolge lt. Kunde. qr = Montagevideo-QR auf Flyer-Seite 1 (null = keiner).
const FLYER = [
  { file: "01-ambihook-v5.pdf", nr: "01", titel: "AmbiHook V5", sub: "Dachhaken für Ziegel- & Steindächer", qr: VIDEO.schraegdach },
  { file: "02-ambihook-v6.pdf", nr: "02", titel: "AmbiHook V6", sub: "Dachhaken — maximaler Wind-Widerstand", qr: null },
  { file: "06-flachdach-ecoplus.pdf", nr: "03", titel: "AmbiLight EcoPlus", sub: "Flachdach — Ost-West & Süd", qr: VIDEO.flachdach },
  { file: "08-gruendach.pdf", nr: "04", titel: "AmbiLight Gründach", sub: "Gründach — Ost-West & Süd", qr: VIDEO.gruendach },
  { file: "07-flachdach-eco.pdf", nr: "05", titel: "AmbiLight Eco", sub: "Flachdach — höchste Schnee- & Windlast", qr: VIDEO.flachdach },
  { file: "03-ambinano-ambiu.pdf", nr: "06", titel: "AmbiNano + AmbiU", sub: "Trapezblech — Quermontage & Hinterlüftung", qr: null },
  { file: "04-ambimicro-ambiu.pdf", nr: "07", titel: "AmbiMicro", sub: "Trapezblech — Hochkantmontage", qr: null },
  { file: "05-stockschraube.pdf", nr: "08", titel: "Stockschraube", sub: "Welldach — Wellblech & Welleternit", qr: null },
  { file: "09-ambitop.pdf", nr: "09", titel: "AmbiTop", sub: "Trapezblech- & Sandwichdächer", qr: null },
];

const VORSPANN_SEITEN = 2;

// QR-Rechteck auf Flyer-Seite 1 (per Pixel-Analyse ermittelt, identisch auf
// allen QR-Flyern, in Original-MediaBox-Koordinaten, pt)
const QR_RECT = [41.0, 33.1, 180.7, 167.7];

/* TVZ-Geometrie (mm) — Grundlage der Link-Rechtecke auf der TVZ-Seite */
const MM = { pageW: 210, pageH: 297, tocTop: 96, rowH: 15, left: 16, right: 194, footer: 22 };
const mm2pt = (mm) => mm * 2.834645669;
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const flyerDir = join(__dirname, "flyer-pdfs");

/* ---------- Schritt 1: Flyer laden, Verzeichnis abgleichen, Startseiten ---------- */
const vorhandene = readdirSync(flyerDir).filter((f) => f.toLowerCase().endsWith(".pdf"));
const gelistet = new Set(FLYER.map((f) => f.file));
const extra = vorhandene.filter((f) => !gelistet.has(f));
if (extra.length)
  throw new Error(`Nicht gelistete PDFs in flyer-pdfs/: ${extra.join(", ")} — im Skript ergänzen oder entfernen.`);

const flyerDocs = [];
let cursor = VORSPANN_SEITEN;
for (const f of FLYER) {
  const doc = await PDFDocument.load(readFileSync(join(flyerDir, f.file)));
  const count = doc.getPageCount();
  flyerDocs.push({ ...f, doc, count, start: cursor, printNr: cursor + 1 });
  cursor += count;
}
const GESAMT_SEITEN = cursor;

/* ---------- Schritt 2: Vorspann-HTML (Flyer-Design, echte Startseiten) ---------- */
function vorspannHtml() {
  // Switzer = eine der beiden Original-Flyer-Schriften (frei lizenziert).
  const fontsCss = readFileSync(join(__dirname, "fonts", "switzer", "switzer.css"), "utf8");
  const rows = flyerDocs
    .map(
      (f) => `<a class="toc-row">
      <span class="nr">${esc(f.nr)}</span>
      <span class="tt"><b>${esc(f.titel)}</b><small>${esc(f.sub)}</small></span>
      <span class="dots"></span>
      <span class="pg">${f.printNr}</span>
    </a>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>AmbiVolt Produktkatalog ${esc(AUSGABE)}</title>
<style>${fontsCss}</style>
<style>
  :root { --orange: ${ORANGE}; --ink: #2a2938; --ink2: #6b6b76; --text: #4a4a52; --line: #e6e6ea; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Switzer durchgehend (Flyer-Schrift) */
  body { font-family: "Switzer", system-ui, sans-serif; color: var(--text); }
  @page { size: A4; margin: 0; }
  .sheet { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; background: #fff; display: flex; flex-direction: column; }
  .label { font-family: "Switzer", sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: .14em; }

  /* Oberer Orange-Keil wie Flyer S.1/2: volle Breite, dick links → dünn rechts
     (Unterkante schräg; läuft rechts NICHT auf 0 aus, sondern ~2,3 mm Reststreifen) */
  .topwedge { position: absolute; top: 0; left: 0; width: 100%; height: 9mm; background: var(--orange); clip-path: polygon(0 0, 100% 0, 100% 25%, 0 100%); z-index: 1; }
  .head { position: relative; z-index: 3; display: flex; justify-content: space-between; align-items: flex-start; padding: 13mm 16mm 0; }
  .eyebrow { display: inline-block; background: var(--orange); color: #fff; font-family: "Switzer", sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: .16em; font-size: 9pt; padding: 2.4mm 4mm; }
  .logo { height: 13mm; }

  /* Deckblatt */
  h1 { font-family: "Switzer", sans-serif; font-weight: 800; letter-spacing: -0.015em; text-transform: uppercase; color: var(--ink); font-size: 40pt; line-height: 1.03; margin-top: 8mm; }
  h1 .thin { color: var(--ink2); font-weight: 600; }
  h1 .accent { color: var(--orange); }
  .lead { margin: 6mm 16mm 0; }
  .sub { font-size: 12.5pt; line-height: 1.55; color: var(--text); max-width: 150mm; margin-top: 6mm; }
  .badges { display: flex; gap: 2.5mm; margin-top: 7mm; flex-wrap: wrap; }
  .badge { background: var(--orange); color: #fff; font-family: "Switzer", sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; font-size: 8.5pt; padding: 2.2mm 4mm; }
  /* Claim wie Flyer: orange Band direkt unter dem Titel, textbreit */
  .claim { display: inline-block; background: var(--orange); color: #fff; font-family: "Switzer", sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; font-size: 12pt; padding: 2.6mm 5mm; margin-top: 5mm; }
  .hero { margin: 8mm 16mm 0; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; }
  .hero img { max-width: 100%; max-height: 122mm; object-fit: contain; }

  /* EIN Fußband wie Flyer S.1/2: orange, Oberkante schräg — dünn links → dick rechts
     (Neigung an Original angeglichen: links ~22 mm, rechts ~32 mm hoch, ~10 mm Δ) */
  .footer { position: relative; background: var(--orange); color: #fff; min-height: 32mm; padding: 5mm 16mm; display: flex; justify-content: space-between; align-items: flex-end; clip-path: polygon(0 31%, 100% 0, 100% 100%, 0 100%); }
  .footer .contact { font-family: "Switzer", sans-serif; font-weight: 500; font-size: 8pt; letter-spacing: .01em; line-height: 1.7; }
  .footer .plate { background: #fff; padding: 2.4mm 3.4mm; border-radius: 1.5mm; }
  .footer .plate img { height: 8mm; display: block; }

  /* Inhaltsverzeichnis */
  .toc-title { padding: 4mm 16mm 0; }
  .toc-title h2 { font-family: "Switzer", sans-serif; font-weight: 800; letter-spacing: -0.015em; text-transform: uppercase; color: var(--ink); font-size: 30pt; }
  .toc-title h2 .thin { color: var(--ink2); font-weight: 600; }
  .toc-title p { margin-top: 3.5mm; font-size: 11pt; color: var(--text); }
  .toc { position: absolute; top: ${MM.tocTop}mm; left: ${MM.left}mm; right: ${MM.pageW - MM.right}mm; }
  .toc-row { height: ${MM.rowH}mm; display: flex; align-items: center; gap: 6mm; border-bottom: 1px solid var(--line); color: inherit; text-decoration: none; }
  .toc-row .nr { font-family: "Switzer", sans-serif; color: var(--orange); font-size: 13pt; font-weight: 800; width: 11mm; flex: none; }
  .toc-row .tt { display: flex; flex-direction: column; gap: 1mm; }
  .toc-row .tt b { font-family: "Switzer", sans-serif; font-weight: 700; color: var(--ink); font-size: 13pt; letter-spacing: -0.005em; }
  .toc-row .tt small { font-size: 9pt; color: var(--ink2); }
  .toc-row .dots { flex: 1; border-bottom: 1.5px dotted #c9c9d0; }
  .toc-row .pg { font-family: "Switzer", sans-serif; color: var(--ink); font-size: 12.5pt; font-weight: 700; }
  .toc-hint { position: absolute; bottom: 34mm; left: ${MM.left}mm; right: 16mm; display: flex; align-items: center; gap: 4mm; color: var(--ink2); font-size: 9.5pt; }
  .toc-hint .qr-ico { width: 9mm; height: 9mm; border: 1.5px solid var(--orange); border-radius: 1.5mm; position: relative; flex: none; }
  .toc-hint .qr-ico::before { content: "▶"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--orange); font-size: 10pt; }
</style>
</head>
<body>

<!-- Seite 1: Deckblatt -->
<section class="sheet">
  <div class="topwedge"></div>
  <div class="head">
    <span class="eyebrow">Produktkatalog ${esc(AUSGABE)}</span>
    <img class="logo" src="../../public/ambivolt-logo.svg" alt="AmbiVolt">
  </div>
  <div class="lead">
    <h1>Montage&shy;systeme<br><span class="thin">für jedes</span> Dach<span class="accent">.</span></h1>
    <div class="claim">Schnell montiert, dauerhaft stark!</div>
    <p class="sub">Photovoltaik-Montagesysteme für Ziegel-, Blech-, Flach-, Well- und Gründächer — durchdachte Unterkonstruktionen vom Hersteller.</p>
    <div class="badges">
      <span class="badge">9 Montagesysteme</span>
      <span class="badge">Made in Germany</span>
      <span class="badge">ISO 9001</span>
      <span class="badge">10 Jahre Garantie</span>
    </div>
  </div>
  <div class="hero"><img src="../../public/images/products/flyer/gd-ow.png" alt=""></div>
  <div class="footer">
    <div class="contact">AmbiVolt Energietechnik GmbH · Oberalmsham 1 · 84140 Gangkofen<br>+49 8722 966 85 77 · anfrage@ambivolt.de · www.ambivolt.de</div>
    <div class="plate"><img src="../../public/ambivolt-logo.svg" alt="AmbiVolt"></div>
  </div>
</section>

<!-- Seite 2: Inhaltsverzeichnis -->
<section class="sheet">
  <div class="topwedge"></div>
  <div class="head">
    <span class="eyebrow">Inhalt</span>
    <img class="logo" src="../../public/ambivolt-logo.svg" alt="AmbiVolt">
  </div>
  <div class="toc-title">
    <h2>Inhalts<span class="thin">verzeichnis</span></h2>
    <p>Alle Einträge sind klickbar und springen direkt zum Produkt.</p>
  </div>
  <div class="toc">${rows}</div>
  <div class="toc-hint"><span class="qr-ico"></span><span>Die QR-Codes in den Flyern sind anklickbar und führen direkt zum Montagevideo.</span></div>
  <div style="flex:1"></div>
  <div class="footer">
    <div class="contact">AmbiVolt Energietechnik GmbH · Oberalmsham 1 · 84140 Gangkofen<br>+49 8722 966 85 77 · anfrage@ambivolt.de · www.ambivolt.de</div>
    <div class="plate"><img src="../../public/ambivolt-logo.svg" alt="AmbiVolt"></div>
  </div>
</section>

</body>
</html>`;
}

// TVZ-Überlauf ausschließen
if (FLYER.length * MM.rowH > MM.pageH - MM.tocTop - MM.footer)
  throw new Error(`TVZ hat ${FLYER.length} Zeilen — passt nicht; Geometrie anpassen.`);

const vorspannHtmlPath = join(__dirname, "vorspann.html");
writeFileSync(vorspannHtmlPath, vorspannHtml(), "utf8");

/* ---------- Schritt 3: Vorspann rendern (frisch erzwingen) ---------- */
const vorspannPdfPath = join(__dirname, "vorspann.pdf");
if (existsSync(vorspannPdfPath)) rmSync(vorspannPdfPath);
execFileSync(EDGE, [
  "--headless", "--disable-gpu", "--force-device-scale-factor=1",
  "--no-pdf-header-footer", `--print-to-pdf=${vorspannPdfPath}`,
  pathToFileURL(vorspannHtmlPath).href,
]);
if (!existsSync(vorspannPdfPath) || statSync(vorspannPdfPath).size < 1000)
  throw new Error("Edge hat vorspann.pdf nicht (neu) geschrieben.");

/* ---------- Schritt 4: Mergen + Flyer auf A4-TrimBox beschneiden ---------- */
const out = await PDFDocument.create();
out.setTitle(`AmbiVolt Produktkatalog ${AUSGABE}`);
out.setAuthor("AmbiVolt Energietechnik GmbH");
out.setSubject("Photovoltaik-Montagesysteme");

const vorspann = await PDFDocument.load(readFileSync(vorspannPdfPath));
if (vorspann.getPageCount() !== VORSPANN_SEITEN)
  throw new Error(`Vorspann hat ${vorspann.getPageCount()} Seiten (erwartet: ${VORSPANN_SEITEN}).`);
for (const p of await out.copyPages(vorspann, vorspann.getPageIndices())) out.addPage(p);

const A4W = 595.276, A4H = 841.890; // DIN A4 in pt
for (const f of flyerDocs) {
  const pages = await out.copyPages(f.doc, f.doc.getPageIndices());
  pages.forEach((p, idx) => {
    out.addPage(p);
    // Auf DIN A4 beschneiden (Bleed entfernen): bevorzugt TrimBox; fehlt sie,
    // A4 zentriert aus der MediaBox schneiden (Bleed-Konvention A4+3mm rundum).
    const tb = p.node.TrimBox && p.node.TrimBox();
    let box;
    if (tb) {
      const [x0, y0, x1, y1] = tb.asArray().map((n) => +n.toString());
      box = [x0, y0, x1 - x0, y1 - y0];
    } else {
      // Keine TrimBox: A4 zentriert aus der MediaBox schneiden — aber nur, wenn
      // die Quellseite tatsächlich A4 + symmetrischer Beschnitt ist. Die Maße
      // müssen in beiden Richtungen im Fenster [A4 .. A4 + 2·maxBleed] liegen;
      // zu kleine (US-Letter) UND zu große Formate (US Legal, A3) → Abbruch,
      // statt Inhalt still zu verschieben/abzuschneiden.
      const mb = p.getMediaBox();
      const eps = 0.5, MAX_BLEED = 20; // pt (~7 mm) großzügige Beschnitt-Obergrenze
      const inRange = (v, a4) => v >= a4 - eps && v <= a4 + 2 * MAX_BLEED + eps;
      if (!inRange(mb.width, A4W) || !inRange(mb.height, A4H))
        throw new Error(`Flyer "${f.file}" hat keine TrimBox und ist kein A4+Beschnitt-Format (MediaBox ${mb.width.toFixed(1)}×${mb.height.toFixed(1)} pt) — bitte TrimBox setzen oder Format prüfen.`);
      box = [mb.x + (mb.width - A4W) / 2, mb.y + (mb.height - A4H) / 2, A4W, A4H];
    }
    p.setMediaBox(box[0], box[1], box[2], box[3]);
    p.setCropBox(box[0], box[1], box[2], box[3]);
    // QR-Overlay-Link nur auf Seite 1 der QR-Flyer
    if (idx === 0 && f.qr) {
      const uri = out.context.obj({
        Type: "Annot", Subtype: "Link", Rect: QR_RECT, Border: [0, 0, 0],
        A: { Type: "Action", S: "URI", URI: PDFString.of(f.qr) },
      });
      let annots = p.node.Annots();
      if (!annots) { annots = out.context.obj([]); p.node.set(PDFName.of("Annots"), annots); }
      annots.push(out.context.register(uri));
    }
  });
}
if (out.getPageCount() !== GESAMT_SEITEN)
  throw new Error(`Katalog hat ${out.getPageCount()} Seiten (erwartet: ${GESAMT_SEITEN}).`);

// Sicherheitsnetz: das A4-Ziel darf nicht unbemerkt scheitern — jede Flyerseite
// muss jetzt DIN A4 sein (±1 pt), sonst hart abbrechen.
out.getPages().forEach((p, i) => {
  if (i < VORSPANN_SEITEN) return;
  const s = p.getSize();
  if (Math.abs(s.width - A4W) > 1 || Math.abs(s.height - A4H) > 1)
    throw new Error(`Seite ${i + 1} ist ${s.width.toFixed(1)}×${s.height.toFixed(1)} pt statt DIN A4 (595.3×841.9) — Flyer ohne TrimBox oder abweichendes Format?`);
});

/* ---------- Schritt 5: Seitenzahlen stempeln (ab Seite 2) ---------- */
const font = await out.embedFont("Helvetica-Bold");
const SLATE = rgb(42 / 255, 41 / 255, 56 / 255);
out.getPages().forEach((page, i) => {
  if (i === 0) return; // Deckblatt bleibt unnummeriert
  const n = String(i + 1);
  const mb = page.getMediaBox(); // {x,y,width,height} — Ursprung ggf. verschoben
  const cx = mb.x + mb.width - mm2pt(10);
  const cy = mb.y + mm2pt(10);
  page.drawCircle({ x: cx, y: cy, size: mm2pt(3.6), color: SLATE });
  const fs = 9;
  const tw = font.widthOfTextAtSize(n, fs);
  page.drawText(n, { x: cx - tw / 2, y: cy - fs * 0.36, size: fs, font, color: rgb(1, 1, 1) });
});

/* ---------- Schritt 6: TVZ-Zeilen verlinken (GoTo Flyer-Startseite) ---------- */
const tocPage = out.getPage(1);
let tocAnnots = tocPage.node.Annots();
if (!tocAnnots) { tocAnnots = out.context.obj([]); tocPage.node.set(PDFName.of("Annots"), tocAnnots); }
flyerDocs.forEach((f, i) => {
  const target = out.getPage(f.start);
  const tmb = target.getMediaBox();
  const topMm = MM.tocTop + i * MM.rowH;
  const rect = [mm2pt(MM.left), mm2pt(MM.pageH - topMm - MM.rowH), mm2pt(MM.right), mm2pt(MM.pageH - topMm)];
  const d = out.context.obj([target.ref, PDFName.of("XYZ"), null, tmb.y + tmb.height, null]);
  const annot = out.context.register(
    out.context.obj({ Type: "Annot", Subtype: "Link", Rect: rect, Border: [0, 0, 0], A: { Type: "Action", S: "GoTo", D: d } })
  );
  tocAnnots.push(annot);
});

const outPath = join(__dirname, "katalog.pdf");
writeFileSync(outPath, await out.save());
const qrCount = flyerDocs.filter((f) => f.qr).length;
console.log(
  `katalog.pdf geschrieben — ${out.getPageCount()} Seiten (Deckblatt + Inhaltsverzeichnis + ` +
  `${FLYER.length} Flyer 1:1 auf DIN A4, nummeriert ab S.2, TVZ verlinkt, ${qrCount} QR-Codes anklickbar).`
);
