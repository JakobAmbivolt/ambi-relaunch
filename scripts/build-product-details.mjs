// Lädt alle Produkt-Assets (Bilder + PDFs) von ambivolt.de herunter und erzeugt
// src/content/product-details.json mit lokalen Pfaden. Einmalig auszuführen.
import fs from "node:fs";

const ROOT = "C:/Users/ambiv/ambi-relaunch";
const pdp = JSON.parse(fs.readFileSync(ROOT + "/docs/research/ambivolt-pdp.json", "utf8"));
// Slug aus der URL ableiten (Journal speichert kein slug-Feld)
const pslug = (p) => p.slug || p.url.replace(/\/+$/, "").split("/").pop();
for (const p of pdp) p.slug = pslug(p);

const IMG_DIR = ROOT + "/public/images/products";
const DOC_DIR = ROOT + "/public/dokumente";
fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(DOC_DIR, { recursive: true });

const basename = (u) => decodeURIComponent(u.split("?")[0].split("/").pop());
const isImg = (u) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(u.split("?")[0]);
const isDoc = (u) => /\.(pdf|xlsx?|docx?)$/i.test(u.split("?")[0]);
const slug = (s) =>
  s.toLowerCase().replace(/ß/g, "ss").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const dlMap = {}; // remote url -> local path
async function download(url) {
  if (!url || url.startsWith("data:") || !url.startsWith("http")) return null;
  if (dlMap[url]) return dlMap[url];
  const img = isImg(url), doc = isDoc(url);
  if (!img && !doc) return null;
  const dir = img ? IMG_DIR : DOC_DIR;
  const localFs = dir + "/" + basename(url);
  const localUrl = (img ? "/images/products/" : "/dokumente/") + basename(url);
  try {
    if (!fs.existsSync(localFs)) {
      const res = await fetch(url);
      if (!res.ok) { console.error("FAIL", res.status, url); return null; }
      fs.writeFileSync(localFs, Buffer.from(await res.arrayBuffer()));
      console.log("OK", localUrl);
    }
    dlMap[url] = localUrl;
    return localUrl;
  } catch (e) { console.error("ERR", url, e.message); return null; }
}

const CATEGORY = {
  flachdachsysteme: "Flachdachsysteme",
  "ziegel-und-steindachsysteme": "Ziegel- und Steindachsysteme",
  trapezblechsysteme: "Trapezblechsysteme",
  falzblechsysteme: "Falzblechsysteme",
  welldachsysteme: "Welldachsysteme",
  "ergaenzungsprodukte-photovoltaik": "Ergänzungsprodukte",
};
const BREADCRUMB = {
  flachdachsysteme: "Flachdachsysteme",
  "ziegel-und-steindachsysteme": "Ziegel- & Steindachsysteme",
  trapezblechsysteme: "Trapezblechsysteme",
  falzblechsysteme: "Falzblechsysteme",
  welldachsysteme: "Welldachsysteme",
  "ergaenzungsprodukte-photovoltaik": "Ergänzungsprodukte",
};

// Ergänzungsprodukte-Querraster (kanonisch aus der Ergänzungsprodukte-Seite)
const ergPage = pdp.find((p) => p.slug === "ergaenzungsprodukte-photovoltaik");
const ergGrid = [];
for (const prod of ergPage.products) {
  const image = await download(prod.image);
  ergGrid.push({
    name: prod.name,
    image,
    href: "/produkte/ergaenzungsprodukte-photovoltaik/#" + slug(prod.name),
  });
}

const out = [];
for (const p of pdp) {
  const products = [];
  for (const prod of p.products) {
    const image = await download(prod.image);
    const gallery = [];
    for (const g of prod.gallery || []) { const l = await download(g); if (l) gallery.push(l); }
    const downloads = [];
    for (const d of prod.downloads || []) {
      const url = d.url ? await download(d.url) : null;
      downloads.push({ label: d.label, url });
    }
    products.push({
      name: prod.name,
      anchor: slug(prod.name),
      subtitle: prod.subtitle || "",
      image,
      gallery,
      features: prod.features || [],
      description: prod.description || "",
      downloads,
    });
  }
  // seitenweite Downloads (dedupe nach Label)
  const seen = new Set();
  const pageDownloads = [];
  for (const prod of products) for (const d of prod.downloads) {
    if (d.url && !seen.has(d.label)) { seen.add(d.label); pageDownloads.push(d); }
  }
  const inquiry = [];
  for (const q of p.inquiryProducts || []) {
    const image = await download(q.image);
    inquiry.push({ name: q.name, image });
  }
  out.push({
    slug: p.slug,
    category: CATEGORY[p.slug],
    breadcrumb: BREADCRUMB[p.slug],
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    heroEyebrow: p.heroEyebrow || "Ambivolt Produkte",
    heroTitle: p.heroTitle,
    intro: typeof p.intro === "string" && !p.intro.startsWith("AmbiLight —") ? p.intro : "",
    products,
    pageDownloads,
    inquiry,
    inquiryTitle: inquiry.length ? "Anfrage für " + CATEGORY[p.slug] : "",
    hasErgGrid: (p.ergaenzungProducts || []).length > 0,
  });
}

fs.writeFileSync(ROOT + "/src/content/product-details.json", JSON.stringify({ pages: out, ergGrid }, null, 2));
console.log("\nWritten src/content/product-details.json — pages:", out.length, "ergGrid:", ergGrid.length);
