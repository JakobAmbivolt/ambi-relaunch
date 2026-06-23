import type { ProductCardData } from "./types";

// Kanonische Produktkategorien (Dachformen) für die Produktseiten.
export const productCategories: ProductCardData[] = [
  {
    slug: "flachdach",
    title: "Flachdächer",
    teaser: "minimaler Ballast & Linienlast, integrierter Wartungsgang",
    image: "/images/produkt-flachdach.png",
    href: "/produkte/flachdachsysteme/",
  },
  {
    slug: "ziegel",
    title: "Ziegel- & Steindächer",
    teaser: "mehrfach verstellbar sowie extrem tragfähig",
    image: "/images/produkt-ziegel.png",
    href: "/produkte/ziegel-und-steindachsysteme/",
  },
  {
    slug: "trapez",
    title: "Trapezblechdächer",
    teaser: "schnell & günstig, mit Easy-Click-Klemme",
    image: "/images/produkt-trapez.png",
    href: "/produkte/trapezblechsysteme/",
  },
  {
    slug: "falz",
    title: "Falzblechdächer",
    teaser: "schnelle Installation und hohe Stabilität",
    image: "/images/produkt-falz.jpg",
    href: "/produkte/falzblechsysteme/",
  },
  {
    slug: "well",
    title: "Welldächer",
    teaser: "schnell zu montieren mit Ausgleich von Montagetoleranzen",
    image: "/images/produkt-well.png",
    href: "/produkte/welldachsysteme/",
  },
  {
    slug: "ergaenzung",
    title: "Ergänzungsprodukte",
    teaser: "Profile, Klemmen, Verbinder und Zubehör für jede Montage",
    image: "/images/produkt-ergaenzung.png",
    href: "/produkte/ergaenzungsprodukte-photovoltaik/",
  },
];

// Produktübersicht (/produkte/) — Hero-Texte (Original: zweizeilige H1).
export const produkteOverview = {
  eyebrow: "Unsere Produktpalette",
  titleLine1: "AmbiVolt",
  titleLine2: "Photovoltaik Montage-Systeme",
};
