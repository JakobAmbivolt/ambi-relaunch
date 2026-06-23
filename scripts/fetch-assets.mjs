// scripts/fetch-assets.mjs  — einmaliger Asset-Download
import fs from "node:fs";
import path from "node:path";

const OUT = "public/images";
fs.mkdirSync(OUT, { recursive: true });

const assets = [
  { url: "https://ambivolt.de/wp-content/uploads/ambivolt-Logo.svg", out: "public/ambivolt-logo.svg" },
  { url: "https://ambivolt.de/wp-content/uploads/2023-04-03-Startseite-Headerbilder-produkte-vers02-980x883-1.webp", out: "public/images/hero-produkte.webp" },
  { url: "https://ambivolt.de/wp-content/uploads/AmbiLight-460px.png", out: "public/images/produkt-flachdach.png" },
  { url: "https://ambivolt.de/wp-content/uploads/Ambihook-V5.png", out: "public/images/produkt-ziegel.png" },
  { url: "https://ambivolt.de/wp-content/uploads/ambinano-500p.png", out: "public/images/produkt-trapez.png" },
  { url: "https://ambivolt.de/wp-content/uploads/ambivolt-falzblechklemme-alu.jpg", out: "public/images/produkt-falz.jpg" },
  { url: "https://ambivolt.de/wp-content/uploads/ambivolt-Welldachset.jpg", out: "public/images/produkt-well.png" },
  { url: "https://ambivolt.de/wp-content/uploads/ambinano-500p.png", out: "public/images/produkt-ergaenzung.png" },
  { url: "https://ambivolt.de/wp-content/uploads/solar-panel.png", out: "public/images/icon-solar-panel.png" },
  { url: "https://ambivolt.de/wp-content/uploads/solar-house-white.png", out: "public/images/icon-solar-house.png" },
  { url: "https://ambivolt.de/wp-content/uploads/ambivolt-energietechnik-maximale-effizienz.webp", out: "public/images/effizienz.webp" },
];

for (const a of assets) {
  try {
    const res = await fetch(a.url);
    if (!res.ok) { console.error("FAIL", res.status, a.url); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(a.out), { recursive: true });
    fs.writeFileSync(a.out, buf);
    console.log("OK", a.out, buf.length, "bytes");
  } catch (e) { console.error("ERR", a.url, e.message); }
}
