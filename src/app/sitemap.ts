import type { MetadataRoute } from "next";

// Statisch generieren (nötig für output: "export")
export const dynamic = "force-static";

const base = "https://ambivolt.de";
const routes = [
  "/",
  "/produkte/",
  "/produkte/flachdachsysteme/",
  "/produkte/ziegel-und-steindachsysteme/",
  "/produkte/trapezblechsysteme/",
  "/produkte/falzblechsysteme/",
  "/produkte/welldachsysteme/",
  "/produkte/ergaenzungsprodukte-photovoltaik/",
  "/produktkatalog/",
  "/unternehmen/",
  "/unsere-solarprojekte/",
  "/jobs-und-stellenangebote/",
  "/jetzt-bewerben/",
  "/kontakt/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: base + r,
    changeFrequency: "monthly",
    priority: r === "/" ? 1 : 0.7,
  }));
}
