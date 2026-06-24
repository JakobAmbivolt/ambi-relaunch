import type { ProductCardData } from "./types";

// Startseiten-Inhalte (verdichtet: knappe Marketing-Texte, Kernaussagen erhalten).
// Originaltexte 1:1 weiterhin auf den jeweiligen Unterseiten / im git-Tag phase1-v1.

export type CtaLink = { label: string; href: string };

export const homeHero = {
  titleLine1: "Photovoltaik-",
  titleLine2: "Montagesysteme",
  subtitle: "nach neuestem Stand der Technik",
  lead: "Robuste Aluminium-Montagesysteme für jede Dachform – schnell montiert, normgerecht und langlebig. Hergestellt in Bayern.",
  bullets: ["schnelle Montage", "Flexibilität am Dach", "exzellenter Service"],
  image: "/images/hero-produkte.webp",
  bgImage: "/images/hero-bg.jpg",
};

// 6 Karten — alle Dachformen + Ergänzungsprodukte.
export const homeProducts: ProductCardData[] = [
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

export const homeProductsOutro =
  "Maßgeschneiderte Montagesysteme für jede Dachform – effizient, langlebig und geprüft.";

export const homeAdvantages = [
  "Einfache & schnelle Montage",
  "Leichtigkeit & Stabilität",
  "Flexibilität am Dach",
  "Erfahrene Berater",
];

// Effizienz-/Lade-Sektion (steht jetzt weit oben).
export const homeEfficiency = {
  eyebrow: "Effizienz & Qualität",
  title: "Mehr Ertrag aus jedem Dach",
  intro:
    "Unsere Montagesysteme holen das Maximum aus Ihrer Solaranlage – stabil, präzise und langlebig.",
  cards: [
    { title: "Maximale Effizienz", body: "Optimale Ausrichtung für höchste Energieausbeute." },
    {
      title: "Flexibel & stabil",
      body: "Hochwertige Materialien, präzise verarbeitet – für jede Dachlast.",
    },
  ],
};

// Zusammengefasste "Warum AmbiVolt"-Sektion (ersetzt Spezialist + Technik).
export const homeValues = {
  eyebrow: "Warum AmbiVolt",
  title: "Durchdachte Technik. Aus einer Hand.",
  statement:
    "AmbiVolt ist Hersteller von Photovoltaik-Montagesystemen aus Bayern – von der Beratung bis zur schnellen Montage.",
  items: [
    { title: "Schnelle Montage", body: "Durchdachte Systeme verkürzen die Montagezeit aufs Minimum." },
    { title: "Flexibel am Dach", body: "Lösungen für Flach-, Ziegel-, Trapez-, Falz- und Welldach." },
    { title: "Stand der Technik", body: "Innovative, normgerechte Systeme aus hochwertigem Aluminium." },
    { title: "Erfahrene Beratung", body: "Unsere Experten begleiten Ihr Projekt von A bis Z." },
  ],
  cta: { label: "Mehr über AmbiVolt", href: "/unternehmen/" } as CtaLink,
};

export const homeProcess = {
  eyebrow: "So einfach geht's",
  title: "Von der Anfrage bis zur Montage",
  subtitle: "In 3 Schritten zum Ergebnis",
  steps: [
    { n: "01", title: "Kontaktaufnahme", body: "Per Telefon, E-Mail oder Formular – wir melden uns schnell." },
    { n: "02", title: "Bedarfsermittlung", body: "Wir ermitteln das passende System für Ihr Dach." },
    { n: "03", title: "Schnelle Montage", body: "Einfache Handhabung, kurze Montagezeit, schneller Ertrag." },
  ],
};

export type SeoBlock = { heading: string; body: string };

export const homeSeo: { title: string; intro: string; blocks: SeoBlock[] } = {
  title: "PV-Montagesysteme für jede Dachform",
  intro:
    "Das richtige Montagesystem entscheidet über Effizienz, Sicherheit und Lebensdauer Ihrer Solaranlage. AmbiVolt liefert für jede Dachform die passende Lösung.",
  blocks: [
    {
      heading: "Für jede Dachform",
      body: "Flachdach, Ziegel- & Steindach, Trapezblech, Falzblech oder Welldach – jedes System ist exakt auf den Untergrund abgestimmt.",
    },
    {
      heading: "Hochwertige Materialien",
      body: "Aluminium und Edelstahl sorgen für Korrosionsbeständigkeit und Stabilität – auch bei Wind und Schnee.",
    },
    {
      heading: "Schnelle Installation",
      body: "Klick- und Klemmsysteme verkürzen die Montagezeit und senken Kosten – ohne Kompromisse bei der Sicherheit.",
    },
    {
      heading: "Hersteller aus Bayern",
      body: "Entwicklung, Beratung und Qualitätssicherung aus einer Hand – maßgeschneidert für Ihr Projekt.",
    },
  ],
};

export const homeCta = {
  title: "Vereinbaren Sie noch heute einen Beratungstermin!",
  slogan: "Make Your Installers HAPPY!",
  sloganParts: [
    { text: "Make Your", color: "green" },
    { text: "Installers", color: "green" },
    { text: "HAPPY!", color: "amber" },
  ] as { text: string; color: "amber" | "green" }[],
  button: { label: "Hier Termin vereinbaren", href: "/kontakt/" } as CtaLink,
};
