import type { MetadataRoute } from "next";

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
