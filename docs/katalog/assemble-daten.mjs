#!/usr/bin/env node
/**
 * Assembler: docs/research/katalog-kapitel-rohdaten.json (Workflow-Ergebnis)
 * → docs/katalog/katalog-daten.json (Eingabe für build-katalog.mjs).
 * Splittet Kombi-Kapitel, ordnet Produkte lesefreundlich (B/A vor C),
 * setzt Kapitelnummern und Katalog-Metadaten.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(
  readFileSync(join(__dirname, "..", "research", "katalog-kapitel-rohdaten.json"), "utf8")
);
const byKind = Object.fromEntries(raw.map((r) => [r.kind, r.data]));

/* Kanonische Firmendaten aus src/content/company.ts (dort ist z. B. die
   Telefonnummer redaktionell korrigiert) — schlägt die Agenten-Extraktion. */
function loadCompany() {
  const ts = readFileSync(join(__dirname, "..", "..", "src", "content", "company.ts"), "utf8");
  // non-greedy: nur bis zum ERSTEN "as const;" (weitere Exporte dürfen folgen)
  const m = ts.match(/export const company\s*=\s*(\{[\s\S]*?\})\s*as const;/);
  if (!m) throw new Error("company.ts: Objektliteral nicht gefunden — Format geändert?");
  return new Function(`return (${m[1]});`)();
}
const company = loadCompany();

/* Patch-Buchhaltung: jeder gezielte Patch muss exakt einmal greifen —
   sonst ist bei einer Re-Extraktion eine id/ein Wortlaut gedriftet und der
   Patch würde still ins Leere laufen (oder Frisches überschreiben). */
const patchHits = new Map();
const hit = (name) => patchHits.set(name, (patchHits.get(name) ?? 0) + 1);
function assertPatches(expected) {
  const errors = [];
  for (const name of expected) {
    const n = patchHits.get(name) ?? 0;
    if (n !== 1) errors.push(`Patch "${name}" griff ${n}× (erwartet: 1×)`);
  }
  if (errors.length) {
    throw new Error(
      "Patch-Drift erkannt — Rohdaten haben sich geändert, Patches prüfen:\n" +
        errors.map((e) => "  - " + e).join("\n")
    );
  }
}

/* Produkt-Reihenfolge innerhalb eines Kapitels festlegen (ids in Wunschfolge;
   nicht gelistete Produkte hängen hinten an, Original-Reihenfolge bleibt) */
function order(products, ids) {
  const rank = new Map(ids.map((id, i) => [id, i]));
  return [...products].sort(
    (a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999)
  );
}
const pick = (products, prefix) => products.filter((p) => p.id.startsWith(prefix));

/* Redaktionelle Patches: Tagline-Dubletten durch produktspezifische
   Untertitel ersetzen (abgeleitet aus den Flyer-Anwendungsbeschreibungen). */
const SUBTITLE_PATCH = {
  "well-stockschraube":
    "Doppelschraubensystem für Wellblech- und Welleternit-Dächer — ideal für hochbelastete Dächer mit extrem hohen Schneelasten.",
  "ambihook-v5":
    "Dreifach verstellbarer Dachhaken für Ziegel- und Steindächer — mit Easy-Click-Klemme und nur einem Werkzeug montiert.",
  "ambihook-v6":
    "Vierfach verstellbarer Dachhaken für Ziegel- und Steindächer — optimiert für höchste Windlasten.",
};
/* Mischquellen ehrlich kennzeichnen: Flyer-Produkte, deren bullets/specs
   teilweise aus Katalog 2025-1 bzw. Website stammen (Verifikations-Befund). */
const MIXED_SOURCE = new Set([
  "ambinano-q",
  "ambimicro-h",
  "ambitop",
  "well-stockschraube",
  "ambihook-v5",
  "ambihook-v6",
  "gd-ambilight-gruendach-ow",
]);

for (const r of raw) {
  if (!r.data.products) continue;
  for (const p of r.data.products) {
    if (SUBTITLE_PATCH[p.id]) {
      p.subtitle = SUBTITLE_PATCH[p.id];
      hit(`subtitle:${p.id}`);
    }
    if (MIXED_SOURCE.has(p.id) && !p.gapNote)
      p.gapNote = "Flyer 2026, ergänzt um Katalog 2025-1/Website";
    // EasyClick-Inhalte stammen aus Katalog UND Website — Quellenangabe präzisieren
    if (r.kind === "easyclick" && p.gapNote)
      p.gapNote = "Quelle: Katalog 2025-1 + Website — kein aktueller Flyer";
    // Überlange Kennwert-Einheiten kürzen (Layout B, 3 Kacheln à ~19 mm)
    for (const ks of p.keySpecs || []) {
      if (ks.unit === "% der Modulfläche") ks.unit = "% Modulfläche";
      // Interpretierende Zusätze entfernen (stehen so in keiner Quelle)
      ks.v = ks.v.replace(/\s*\(als GD OW\)/, "");
      // Zu lange Mono-Labels brechen mitten im Wort — kürzen
      const SHORT_LABEL = {
        Verstellbarkeit: "Verstellung",
        Profilbefestigung: "Befestigung",
      };
      if (SHORT_LABEL[ks.k]) ks.k = SHORT_LABEL[ks.k];
      // Weiche Trennstellen für lange Komposita in den schmalen Kacheln
      // (­ = &shy;: unsichtbar, außer das Wort muss brechen)
      const SHY = [
        ["Quermontage", "Quer­montage"],
        ["Hochkantmontage", "Hochkant­montage"],
        ["Hochkant", "Hoch­kant"],
        ["Eckklemmung", "Eck­klemmung"],
        ["Ballastierung", "Ballas­tierung"],
        ["Dünnblechschrauben", "Dünnblech­schrauben"],
        ["Schienenlänge", "Schienen­länge"],
        ["Welleternit", "Well­eternit"],
      ];
      for (const [from, to] of SHY) {
        ks.v = ks.v.split(from).join(to);
        ks.k = ks.k.split(from).join(to);
      }
    }
    // V5: Detailfotos ohne Original-Bildunterschrift entfernen — die Seite ist
    // das inhaltsreichste Layout A (5 Sektionen + Video) und braucht den Platz
    // für die größere Schrift.
    if (p.id === "ambihook-v5") {
      p.photos = [];
      hit("v5-fotos");
    }
    // V5: zwei identische Farboptionen-Spec-Zeilen zu einer zusammenlegen
    // (Platz für die größere Schrift; Wortlaut bleibt)
    if (p.id === "ambihook-v5" && p.specs) {
      const farbRows = p.specs.filter((s) => /^Farboptionen/.test(s.label));
      if (farbRows.length === 2 && farbRows[0].value === farbRows[1].value) {
        // An der Position der ERSTEN Farboptionen-Zeile einsortieren —
        // ans Ende gepusht würde die Zeile bei langen Listen leicht übersehen
        const at = p.specs.findIndex((s) => /^Farboptionen/.test(s.label));
        p.specs = p.specs.filter((s) => !/^Farboptionen/.test(s.label));
        p.specs.splice(at, 0, { label: "Farboptionen (Haken, Klemmen & Profil)", value: farbRows[0].value });
        hit("v5-farboptionen");
      }
    }
    // Stockschraube: 5 featureSections sprengen die Seite (der Flyer-Extractor
    // bat selbst ums Kürzen) — Ein-Bullet-Sektion "Montage leicht gemacht"
    // in "Zusätzliche Features" aufgehen lassen, Bullet-Wortlaut unverändert.
    if (p.id === "well-stockschraube" && p.featureSections?.length > 4) {
      const montage = p.featureSections.find((s) => /^MONTAGE/i.test(s.heading));
      const rest = p.featureSections.find((s) => /^ZUSÄTZLICHE/i.test(s.heading));
      if (montage && rest && montage.bullets.length === 1) {
        rest.bullets.unshift(...montage.bullets);
        p.featureSections = p.featureSections.filter((s) => s !== montage);
        hit("stockschraube-merge");
      }
    }
    // Eco-Fotoleiste: echtes Baustellenfoto aus der Flyer-Bilder-Lieferung —
    // die Original-Flyercaption "Vormontiert mit Bautenschutz" passt jetzt.
    if (p.id === "ambilight-eco" && p.photos) {
      p.photos = [
        { src: "/images/products/flyer/eco-baustelle-2024.jpg", caption: "Vormontiert mit Bautenschutz" },
      ];
      hit("eco-fotos-flyer");
    }

    // Bilder aus der Flyer-Bilder-Lieferung (06.07.2026) zuordnen
    const FLYER_IMG = {
      "ambihook-v6": "/images/products/flyer/dachhaken-v6-r8.jpg",
      "sparrenueberspannungsprofil-v4-v5-v6": "/images/products/flyer/sparrenueberspannungsschiene.jpg",
      "vertikal-adapter-v5-v6": "/images/products/flyer/v5-vertikal-adapter.png",
      "modulprofil-amb-p-85": "/images/products/flyer/profil-p85.png",
      "endkappen": "/images/products/flyer/endkappe-tragprofil.png",
      "gd-ambilight-gd-sued": "/images/products/flyer/gd-sued.png",
      "ambilight-eco-plus-sued": "/images/products/flyer/ecoplus-sued-re2.png",
    };
    if (FLYER_IMG[p.id]) {
      p.image = FLYER_IMG[p.id];
      hit(`bild:${p.id}`);
    }

    // 3.1: Montagevideo-URLs lt. Kunde (Shorts-Links)
    const VIDEO = {
      "ambilight-eco": "https://youtube.com/shorts/IWcKyLY68Wo?feature=share",
      "ambilight-eco-plus": "https://youtube.com/shorts/IWcKyLY68Wo?feature=share",
      "gd-ambilight-gruendach-ow": "https://youtube.com/shorts/4k-6rLaxiV8?feature=share",
      "ambihook-v5": "https://youtube.com/shorts/gKhsxOPFNvU?feature=share",
    };
    if (VIDEO[p.id]) {
      p.video = VIDEO[p.id];
      hit(`video:${p.id}`);
    }

    // 2.10: Power-Klemmen sind bereits verfügbar — "DEMNÄCHST" entfernen
    if (/-power$/.test(p.id) && p.badges?.includes("DEMNÄCHST")) {
      p.badges = p.badges.filter((b) => b !== "DEMNÄCHST");
      hit(`power-verfuegbar:${p.id}`);
    }

    // 2.1: Klemmbereich — Flyer-Wert 28–45 mm ist der aktuellste (für beide
    // Klemmen); alte Katalog-Bereiche + Spezialausführungen bleiben markiert.
    if (p.id === "easyclick-mittelklemme" || p.id === "easyclick-endklemme") {
      // hit() erst, wenn wirklich ein Feld ersetzt wurde — sonst würde bei
      // umbenannten Labels der Patch als "gegriffen" gezählt, ohne zu wirken
      let replaced = 0;
      for (const ks of p.keySpecs || []) {
        if (ks.k === "Modulhöhen") { ks.k = "Klemmbereich"; ks.v = "28 – 45"; ks.unit = "mm"; replaced++; }
      }
      for (const s of p.specs || []) {
        if (s.label === "Modulhöhen") { s.label = "Klemmbereich"; s.value = "28 – 45 mm"; replaced++; }
      }
      if (replaced > 0) {
        p.bullets = (p.bullets || []).map((b) =>
          b.replace(/Für Modulhöhen von [\d\s–-]+mm \(Spezialausführungen bis \d+ mm\)/, "Klemmbereich 28 – 45 mm – für gängige Modultypen optimiert")
        );
        p.gapNote = (p.gapNote || "") + " · Klemmbereich lt. Flyer 2026; Spezialausführungen bitte prüfen";
        hit(`klemmbereich:${p.id}`);
      }
    }

    // 2.2: Nano = 6 Löcher / 2 Schrauben (beide Varianten lt. Kunde)
    if (p.id === "ambinano-q" || p.id === "ambinano-h") {
      const montage = (p.keySpecs || []).find((k) => k.k === "Montage");
      p.keySpecs = [
        montage ?? { k: "Montage", v: p.id.endsWith("q") ? "Quer­montage" : "Hoch­kant", unit: "" },
        { k: "Löcher", v: "6", unit: "Stück" },
        { k: "Schrauben", v: "2", unit: "Stück" },
      ];
      if (p.id === "ambinano-h")
        p.gapNote = (p.gapNote || "") + " · Löcher-Anzahl H-Variante lt. Kunde 6 (Website nannte 8) — bitte final prüfen";
      hit(`loecher:${p.id}`);
    }
    // 2.2: Micro = 16 Löcher / 4 Schrauben
    if (p.id === "ambimicro-h") {
      for (const s of p.featureSections || []) {
        s.bullets = s.bullets.map((b) =>
          b.replace(/Vier (?:Bohrungen|Löcher) mit EPDM-Streifen an der Unterseite/, "16 Löcher, 4 Schrauben – EPDM-Streifen an der Unterseite")
        );
      }
      p.keySpecs = [
        { k: "Löcher", v: "16", unit: "Stück" },
        { k: "Schrauben", v: "4", unit: "Stück" },
        { k: "Sickenabstände", v: "207 – 333", unit: "mm" },
      ];
      hit("loecher:ambimicro-h");
    }
  }
}

/* Legierungsliste dedupen: die Agenten liefern je System dieselben
   Angaben mehrfach — für die Unternehmensseite kompakt zusammenfassen. */
if (byKind.meta) {
  byKind.meta.legierungen = [
    "EasyClick-Klemmsystem: **EN AW6063 T66** (Rm ≥ 245 N/mm²; Rp0,2 ≥ 200 N/mm²) · **EN AW6005-A T6** (Rm ≥ 255 N/mm²; Rp0,2 ≥ 215 N/mm²)",
    "AmbiHook V5/V6: **EN AW6063 T66** (Rm ≥ 245 N/mm²; Rp0,2 ≥ 200 N/mm²) · **EN AW6082 T6** (Rm ≥ 290 N/mm²; Rp0,2 ≥ 250 N/mm²)",
    "Schrauben: **Edelstahl A2**, galvanisiert — Fressen unmöglich",
    "AmbiHook V4/V5/V6: Aluminium, mit Bügel 40 oder 55 mm für höhere Lasten",
    "EasyClick-Klemmen: FEM-optimiert, Haltekraft bis zu 6 kN",
  ];
}

const easyclick = byKind.easyclick;
const trapez = byKind.trapez;

// EasyClick-Opener: die 2-Schritt-Montage steht bereits im Steps-Band der
// Opener-Seite — den wortgleichen ersten Intro-Satz nicht doppelt ausspielen.
{
  const dupSentence = /^Das Easy Click System von AmbiVolt: 1\) Schräg ansetzen, 2\) Einfach Reindrehen\.\s*/;
  if (dupSentence.test(easyclick.intro || "")) {
    easyclick.intro = easyclick.intro.replace(dupSentence, "");
    hit("easyclick-intro-dedupe");
  }
}

// V6: doppelte Farbvarianten-Zeilen mergen (analog V5)
{
  const v6 = byKind.ambihook.products.find((p) => p.id === "ambihook-v6");
  if (v6?.specs) {
    const farb = v6.specs.filter((s) => /^Farbvarianten/.test(s.label));
    if (farb.length === 2 && farb[0].value === farb[1].value) {
      const at = v6.specs.findIndex((s) => /^Farbvarianten/.test(s.label));
      v6.specs = v6.specs.filter((s) => !/^Farbvarianten/.test(s.label));
      v6.specs.splice(at, 0, { label: "Farbvarianten (Haken & Profil)", value: farb[0].value });
      hit("v6-farbvarianten");
    }
  }
}
const falzWell = byKind["falz-well"];
const ambihook = byKind.ambihook;
const flachdach = byKind.flachdach;
const gruenFrei = byKind["gruen-frei"];

/* ==========================================================================
   KUNDENENTSCHEIDUNGEN vom 06.07.2026 (Rückmeldung auf material-bedarf.md)
   ========================================================================== */

// 2.6 + 2.9: Opti/Opti Plus und Freilandanlagen sind nicht mehr im Sortiment
if (flachdach.products.some((p) => /^ambilight-opti/.test(p.id))) {
  flachdach.products = flachdach.products.filter((p) => !/^ambilight-opti/.test(p.id));
  hit("opti-entfernt");
}

// 2.6: Systemvergleich auf Eco + Eco Plus reduzieren
{
  const v = byKind.vergleich.systemvergleich;
  const keep = v.columns
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => !/Opti/i.test(c));
  if (keep.length !== v.columns.length) {
    v.columns = keep.map(({ c }) => c);
    for (const row of v.rows) {
      if (row.values.length > keep.length) row.values = keep.map(({ i }) => row.values[i]);
    }
    hit("vergleich-ohne-opti");
  }
}

// 2.6: Familien-Features — Opti-spezifische Abschnitte raus, Erwähnungen bereinigen
{
  const f = byKind.vergleich;
  f.familienFeatures = (f.familienFeatures || []).filter(
    (s) => !/^(Preis\s*\/\s*Leistung|Selbstreinigung)$/i.test(s.heading.trim())
  );
  const deOpti = (t) =>
    t
      .replace(/AmbiLight Opti Plus,?\s*/g, "")
      .replace(/AmbiLight Opti,?\s*/g, "")
      .replace(/Opti Plus,?\s*/g, "")
      .replace(/Opti,\s*/g, "")
      .replace(/Systemen\s+Eco/g, "Systemen AmbiLight Eco")
      .replace(/\s{2,}/g, " ");
  for (const s of f.familienFeatures) s.bullets = s.bullets.map(deOpti);
  // 2.3: Firstspalt — Flyer-Wert gilt (18–32 cm statt Broschüren-Wert 25–32 cm)
  for (const s of f.familienFeatures) {
    s.bullets = s.bullets.map((b) => {
      if (b.includes("25 – 32 cm")) {
        hit("firstspalt-flyer");
        return b.replace("25 – 32 cm", "18 – 32 cm");
      }
      return b;
    });
  }
  // 3.2: Mengenermittlung nicht übernehmen
  f.mengenermittlung = null;
}

// Wortwahl (2.2): "Löcher" statt "Bohrungen" in allen Produkttexten
for (const r of raw) {
  if (!r.data.products) continue;
  for (const p of r.data.products) {
    const swap = (t) => t.replace(/Bohrungen/g, "Löcher").replace(/Bohrung/g, "Loch");
    p.bullets = (p.bullets || []).map(swap);
    for (const s of p.featureSections || []) s.bullets = s.bullets.map(swap);
    for (const ks of p.keySpecs || []) { ks.k = swap(ks.k); ks.v = swap(ks.v); }
    for (const s of p.specs || []) { s.label = swap(s.label); s.value = swap(s.value); }
  }
}

/* Kombi-Kapitel: jede Produkt-id MUSS einem bekannten Präfix zugeordnet sein —
   sonst verliert der pick()-Split Produkte stumm (z. B. nach Re-Extraktion). */
function assertPartition(chapter, name, prefixes) {
  const stray = chapter.products.filter((p) => !prefixes.some((x) => p.id.startsWith(x)));
  if (stray.length)
    throw new Error(`${name}: Produkte ohne bekanntes Präfix (${prefixes.join("/")}): ${stray.map((p) => p.id).join(", ")}`);
}
assertPartition(falzWell, "falz-well", ["falz-", "well-"]);
assertPartition(gruenFrei, "gruen-frei", ["gd-", "frei-"]); // frei-* wird bewusst verworfen (2.9)

/* Kombi-Intro des falz-well-Kapitels satzweise auf die zwei Ziel-Kapitel
   verteilen (Well-Sätze → Welldach, Rest → Falzblech) statt es zu verwerfen. */
const fwSentences = (falzWell.intro || "").split(/(?<=\.)\s+/).filter(Boolean);
const wellIntro = fwSentences.filter((s) => /well/i.test(s)).join(" ");
const falzIntro = fwSentences.filter((s) => !/well/i.test(s)).join(" ");

/* Flachdach-Intro NICHT doppelt ausspielen: derselbe Broschüren-Text steckt
   bereits in vergleich.familienFeatures (eigene Familien-Seite) — sonst
   erschiene er zweimal im Katalog. */
flachdach.intro = "";

const chapters = [
  {
    id: "easyclick",
    num: "04",
    title: "EasyClick-Klemmsystem",
    intro: easyclick.intro,
    opener: true, // Opener-Seite mit 2-Schritt-Band
    openerImage: "/images/products/ambivolt-easyclick-mittelklemme-01.jpg",
    products: order(easyclick.products, [
      "easyclick-mittelklemme",
      "easyclick-endklemme",
      "easyclick-mittelklemme-power",
      "easyclick-endklemme-power",
      "easyclick-kreuzverbinder",
      "modulprofil-amb-p-40",
      "profilverbinder",
      "verbinderschrauben",
      "endkappen",
    ]),
  },
  {
    id: "trapez",
    num: "05",
    title: "Trapezblech- & Sandwichsysteme",
    intro: trapez.intro,
    openerImage: "/images/products/ambivolt-ambinano-q-01-02-web.jpg",
    products: order(trapez.products, [
      "ambinano-q",
      "ambinano-h",
      "ambimicro-h",
      "ambitop",
    ]),
  },
  {
    id: "falz",
    num: "06",
    title: "Falzblechsysteme",
    intro: falzIntro,
    openerImage: "/images/products/ambivolt-falzblechklemme-alu.jpg",
    products: pick(falzWell.products, "falz-"),
  },
  {
    id: "well",
    num: "07",
    title: "Welldachsysteme",
    intro: wellIntro,
    openerImage: "/images/products/ambivolt-Welldachset.jpg",
    products: order(pick(falzWell.products, "well-"), [
      "well-stockschraube",
      "well-welldach-set",
    ]),
  },
  {
    id: "ambihook",
    num: "08",
    title: "Ziegel- & Steindach — AmbiHook",
    intro: ambihook.intro,
    openerImage: "/images/products/ambivolt-schnellmontagesystem-photovoltaik-ambihook-V5-01.jpg",
    products: order(ambihook.products, [
      "ambihook-v5",
      "ambihook-v6",
      "ambihook-v4",
    ]),
  },
  {
    id: "flachdach",
    num: "09",
    title: "Flachdach — AmbiLight",
    intro: flachdach.intro,
    products: order(flachdach.products, [
      "ambilight-eco",
      "ambilight-ecoplus",
      "ambilight-eco-plus",
      "ambilight-ecoplus-sued",
      "ambilight-eco-plus-sued",
      "ambilight-opti",
      "ambilight-opti-plus",
    ]),
  },
  {
    id: "gruendach",
    num: "10",
    title: "Gründach — AmbiLight GD",
    intro: "",
    products: pick(gruenFrei.products, "gd-"),
  },
  // Freilandanlagen: lt. Kundenentscheidung 2.9 (06.07.2026) nicht mehr im
  // Sortiment — Kapitel entfällt.
];

const data = {
  meta: {
    ...byKind.meta,
    // Redaktionelle Felder NACH dem Spread — dürfen von einer Re-Extraktion
    // niemals überschrieben werden
    ausgabe: "2026-02", // Kundenentscheidung 2.8
    coverChips: [
      "Flachdach",
      "Ziegel & Stein",
      "Trapezblech",
      "Sandwich",
      "Falzblech",
      "Welldach",
      "Gründach",
    ],
    // Kanonische Firmendaten aus src/content/company.ts (überschreibt die
    // Agenten-Extraktion — dort war z. B. die Telefonnummer unkorrigiert)
    kontakt: {
      firma: company.legalName,
      strasse: company.street,
      ort: `${company.zip} ${company.city}`,
      tel: company.phoneDisplay,
      mail: company.email,
      web: "www.ambivolt.de",
    },
  },
  vergleich: byKind.vergleich,
  chapters,
  assemblerNotes: raw
    .filter((r) => r.data.notes)
    .map((r) => `${r.kind}: ${r.data.notes}`),
};

// Gezielt gesetzte Patches müssen exakt einmal gegriffen haben
assertPatches([
  "subtitle:well-stockschraube",
  "subtitle:ambihook-v5",
  "subtitle:ambihook-v6",
  "v5-fotos",
  "v5-farboptionen",
  "v6-farbvarianten",
  "easyclick-intro-dedupe",
  "stockschraube-merge",
  "eco-fotos-flyer",
  // Kundenentscheidungen 06.07.2026
  "opti-entfernt",
  "vergleich-ohne-opti",
  "firstspalt-flyer",
  "bild:ambihook-v6",
  "bild:sparrenueberspannungsprofil-v4-v5-v6",
  "bild:vertikal-adapter-v5-v6",
  "bild:modulprofil-amb-p-85",
  "bild:endkappen",
  "bild:gd-ambilight-gd-sued",
  "bild:ambilight-eco-plus-sued",
  "power-verfuegbar:easyclick-mittelklemme-power",
  "power-verfuegbar:easyclick-endklemme-power",
  "klemmbereich:easyclick-mittelklemme",
  "klemmbereich:easyclick-endklemme",
  "loecher:ambinano-q",
  "loecher:ambinano-h",
  "loecher:ambimicro-h",
  "video:ambilight-eco",
  "video:ambilight-eco-plus",
  "video:gd-ambilight-gruendach-ow",
  "video:ambihook-v5",
]);

// Kein "Opti" mehr in den ausgespielten Inhalten (Kundenentscheidung 2.6)
{
  // notes sind interne Agenten-Hinweise und werden nie gerendert
  const rendered = JSON.stringify({ chapters, vergleich: data.vergleich }, (k, v) =>
    k === "notes" ? undefined : v
  );
  const optiRe = /\bOpti\b/g; // ganzes Wort — "Optional"/"Optimale" sind ok
  const windows = [];
  let m;
  while ((m = optiRe.exec(rendered)) && windows.length < 10) {
    windows.push(rendered.slice(Math.max(0, m.index - 60), m.index + 60));
  }
  if (windows.length) {
    throw new Error("Opti-Erwähnungen übrig:\n" + windows.join("\n---\n"));
  }
}

writeFileSync(join(__dirname, "katalog-daten.json"), JSON.stringify(data, null, 2) + "\n", "utf8");
const nProd = chapters.reduce((s, c) => s + c.products.length, 0);
console.log(`katalog-daten.json geschrieben — ${chapters.length} Kapitel, ${nProd} Produkte.`);
console.log("Notes der Agenten:\n" + data.assemblerNotes.join("\n---\n"));
