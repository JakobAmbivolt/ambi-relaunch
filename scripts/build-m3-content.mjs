// Parst das M3-Extraktions-Journal, lädt alle Inhaltsbilder herunter, fügt die
// Datenschutz-Sektionen aus der Sitemap-Kartierung hinzu und schreibt
// src/content/m3-content.json mit lokalen Bildpfaden. Einmalig auszuführen.
import fs from "node:fs";

const ROOT = "C:/Users/ambiv/ambi-relaunch";
const WF = "C:/Users/ambiv/.claude/projects/c--Users-ambiv-ambi-relaunch/39f3ccb6-79ac-4398-9cd6-01bf5c6adf72/subagents/workflows/wf_9bd32cf7-124";
const IMG = ROOT + "/public/images/content";
fs.mkdirSync(IMG, { recursive: true });

const basename = (u) => decodeURIComponent(u.split("?")[0].split("/").pop());
const dl = {};
async function download(url) {
  if (!url || !url.startsWith("http") || url.startsWith("data:")) return url || null;
  if (dl[url]) return dl[url];
  const local = "/images/content/" + basename(url);
  const fsPath = IMG + "/" + basename(url);
  try {
    if (!fs.existsSync(fsPath)) {
      const r = await fetch(url);
      if (!r.ok) { console.error("FAIL", r.status, url); return null; }
      fs.writeFileSync(fsPath, Buffer.from(await r.arrayBuffer()));
      console.log("OK", local);
    }
    dl[url] = local; return local;
  } catch (e) { console.error("ERR", url, e.message); return null; }
}

// 1) M3-Journal lesen
const lines = fs.readFileSync(WF + "/journal.jsonl", "utf8").split(/\r?\n/).filter(Boolean);
const results = [];
for (const l of lines) { let o; try { o = JSON.parse(l); } catch { continue; } if (o.type === "result" && o.result && o.result.url) results.push(o.result); }
const slugOf = (u) => u.replace(/\/+$/, "").split("/").pop();
const byLabel = {};
for (const p of results) byLabel[slugOf(p.url)] = p;

// 2) Bilder in allen Seiten lokalisieren
for (const p of results) {
  for (const s of p.sections || []) {
    if (s.images) { const out = []; for (const im of s.images) { const l = await download(im); if (l) out.push(l); } s.images = out; }
  }
  if (p.projects) for (const pr of p.projects) pr.image = await download(pr.image);
  if (p.benefits) for (const b of p.benefits) if (b.icon) b.icon = await download(b.icon);
}

// 3) Datenschutz aus der Sitemap-Kartierung
const sitemap = JSON.parse(fs.readFileSync(ROOT + "/docs/research/ambivolt-original-sitemap.json", "utf8"));
const ds = sitemap.find((x) => (x.resolvedUrl || x.url || "").includes("datenschutz"));
const skip = /^(Header|Footer|Seitentitel|Cookie|Navigation)/i;
const dsSections = (ds?.sections || [])
  .filter((s) => s.bodyText && s.bodyText.length > 30 && !skip.test(s.name))
  .map((s) => ({ heading: s.heading || s.name, body: s.bodyText }));

const out = {
  unternehmen: byLabel["unternehmen"],
  "unsere-solarprojekte": byLabel["unsere-solarprojekte"],
  "jobs-und-stellenangebote": byLabel["jobs-und-stellenangebote"],
  "jetzt-bewerben": byLabel["jetzt-bewerben"],
  kontakt: byLabel["kontakt"],
  "danke-fuer-ihre-anfrage": byLabel["danke-fuer-ihre-anfrage"],
  impressum: byLabel["impressum"],
  datenschutzerklaerung: {
    metaTitle: "Datenschutzerklärung",
    metaDescription: ds?.metaDescription || "",
    heroTitle: "Datenschutzerklärung",
    sections: dsSections,
  },
};

fs.writeFileSync(ROOT + "/src/content/m3-content.json", JSON.stringify(out, null, 2));
console.log("\nWritten src/content/m3-content.json. datenschutz sections:", dsSections.length);
