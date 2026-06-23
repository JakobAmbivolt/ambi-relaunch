import type { ProductCardData } from "./types";

// Startseiten-Inhalte (Originaltexte 1:1 von ambivolt.de, korrekte Umlaute).
// Quelle: docs/research/ambivolt-original-sitemap.json (Eintrag "https://ambivolt.de/").

export type CtaLink = { label: string; href: string };

export const homeHero = {
  titleLine1: "Photovoltaik-",
  titleLine2: "Montagesysteme",
  subtitle: "nach neuestem Stand der Technik",
  bullets: ["schnelle Montage", "Flexibilität am Dach", "exzellenter Service"],
  image: "/images/hero-produkte.webp",
  bgImage: "/images/hero-bg.jpg",
};

export const homeProductsIntro = {
  eyebrow: "AmbiVolt Produkte",
  title: "Photovoltaik-Montagesysteme",
};

// 6 Karten — inkl. Ergänzungsprodukte (im Original als Karte fehlend, hier ergänzt).
// Alle Links korrekt auf die jeweilige Produkt-Unterseite (Original hatte Platzhalter).
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

export const homeProductsOutro = [
  "Unsere Produkte werden nach höchsten Standards und neuesten technischen Innovationen gefertigt.",
  "Bei AmbiVolt finden Sie eine große Auswahl an Montagesystemen für Solaranlagen, die für ihre Effizienz, Langlebigkeit und Qualität bekannt sind. Wir bieten maßgeschneiderte Lösungen für Ihre Bedürfnisse und unterstützen Sie bei jedem Schritt Ihrer Solarprojekte.",
];

export const homeSpecialist = {
  eyebrow: "AmbiVolt Energietechnik GmbH",
  title: "AmbiVolt – Ihr Spezialist für Photovoltaik-Montagesysteme",
  body: "Wir bieten Ihnen eine breite und innovative Palette an Montagesystemen für Photovoltaik-Anlagen auf neuestem Stand der Technik. Unser Ziel ist es, Ihnen die bestmögliche Lösung für Ihre Solaranlagen-Montage zu bieten. Unsere Montagesysteme sind nicht nur robust und langlebig, sondern auch einfach zu installieren. Wir verwenden nur hochwertige Materialien und stellen sicher, dass unsere Systeme den höchsten Standards entsprechen. Unser erfahrenes Team steht Ihnen jederzeit zur Verfügung, um Sie bei der Auswahl des richtigen Solar-Montagesystems zu unterstützen.",
  bullets: [
    "schnelle Montage",
    "Flexibilität am Dach",
    "neuester Stand der Technik",
    "den Normen entsprechend",
  ],
  primaryCta: { label: "Hier mehr erfahren", href: "#produktpalette" } as CtaLink,
  secondaryCta: { label: "Beratungstermin vereinbaren", href: "/kontakt/" } as CtaLink,
};

export const homeAdvantages = [
  "Einfache & schnelle Montage",
  "Leichtigkeit & Stabilität",
  "Flexibilität am Dach",
  "Erfahrene Berater",
];

export const homeEfficiency = {
  eyebrow: "Garantiert mit AmbiVolt",
  title: "Maximale Effizienz & hohe Qualität",
  intro: "Die Zukunft der Solarenergie beginnt mit den richtigen Montagesystemen.",
  image: "/images/effizienz.webp",
  cards: [
    {
      title: "Maximale Effizienz",
      body: "Mit den Montagesystemen von AmbiVolt können Ihre Solaranlagen höhere Leistungen erzielen. Unsere Systeme sind darauf ausgelegt, die Energieausbeute der Solaranlage zu maximieren.",
      icon: "/images/icon-solar-panel.png",
    },
    {
      title: "Flexibilität & Stabilität",
      body: "Mit unseren Montagesystemen für Solaranlagen bieten wir flexible und stabile Lösungen. AmbiVolt setzt auf hochwertige Materialien und eine präzise Verarbeitung.",
      icon: "/images/icon-solar-house.png",
    },
  ],
};

export const homeTech = {
  eyebrow: "Zukunftssicher mit AmbiVolt",
  title: "Technik nach neuestem Stand mit Technologie, die den Unterschied macht!",
  points: [
    {
      title: "Einsatz neuester Technologien",
      body: "AmbiVolt setzt auf innovative Technologien, um eine maximale Energieeffizienz und eine hohe Leistungsfähigkeit der Photovoltaikanlagen zu gewährleisten.",
    },
    {
      title: "Fachkundige Beratung von unseren Experten",
      body: "Unser Team von Installations-Experten hilft Ihnen bei der Auswahl des passenden Montagesystems und der Planung für die Umsetzung Ihrer Photovoltaikprojekte.",
    },
  ],
  body: "Unsere Leidenschaft für Technik und Innovation zeichnet uns aus. Wir arbeiten kontinuierlich daran, unsere Produkte zu verbessern und neue Lösungen zu entwickeln, die den steigenden Anforderungen an die Solarenergie gerecht werden. Bei AmbiVolt können Sie sicher sein, dass Sie Montagesysteme auf dem neuesten technischen Stand erhalten, da wir uns immer um die Integration neuer Technologien kümmern.",
  cta: { label: "Mehr über AmbiVolt erfahren", href: "/unternehmen/" } as CtaLink,
};

export const homeProcess = {
  eyebrow: "Einfach & unkompliziert",
  title: "Von der Anfrage bis zur Montage bei AmbiVolt",
  subtitle: "In 3 Schritten zum schnellen Ergebnis",
  steps: [
    {
      n: "01",
      title: "Kontaktaufnahme",
      body: "Nehmen Sie mit uns Kontakt auf, um Informationen über unsere Montagesysteme zu erhalten. Dies kann per E-Mail, Telefon oder über das Kontaktformular auf unserer Website erfolgen.",
    },
    {
      n: "02",
      title: "Bedarfsermittlung",
      body: "Unsere erfahrenen Berater ermitteln gezielt Ihren Bedarf, welche Montagesysteme am besten zu Ihren Anforderungen passen. Wir beraten Sie zu verschiedenen Optionen und geben Tipps zur optimalen Nutzung.",
    },
    {
      n: "03",
      title: "Schnelle Montage",
      body: "Dank der einfachen Handhabung unserer Produkte können Sie die Montagezeit auf ein Minimum reduzieren. Dadurch ist sichergestellt, dass Photovoltaik-Anlagen effizient installiert werden und Sie oder Ihre Kunden mit der Energieerzeugung so schnell wie möglich beginnen können.",
    },
  ],
};

export type SeoBlock = { heading: string; paragraphs?: string[]; bullets?: string[] };

export const homeSeo: { title: string; intro: string; blocks: SeoBlock[] } = {
  title: "PV Montagesysteme: Die optimale Lösung für jede Dachform mit AmbiVolt",
  intro:
    "Photovoltaik-Montagesysteme spielen eine Schlüsselrolle für die Leistungsfähigkeit und Lebensdauer von Solaranlagen. Egal, ob auf Flachdächern, Ziegel- oder Steindächern, Trapezdächern, Falzblech- oder Welldächern – die Wahl des richtigen Montagesystems entscheidet über die Effizienz und Rentabilität Ihrer PV-Anlage. AmbiVolt ist Ihr verlässlicher Partner, wenn es um innovative, maßgeschneiderte Montagesysteme geht.",
  blocks: [
    {
      heading: "Was ist ein PV Montagesystem?",
      paragraphs: [
        "Ein PV Montagesystem dient der sicheren Befestigung von Solarmodulen auf unterschiedlichsten Dachformen. Es besteht aus hochwertigen Materialien wie Aluminium und Edelstahl, die Korrosionsbeständigkeit und Langlebigkeit garantieren.",
      ],
    },
    {
      heading: "Wesentliche Komponenten eines PV Montagesystems",
      bullets: [
        "Modulschienen – halten die Solarmodule sicher",
        "Klemmen – fixieren die Module ohne Beschädigung",
        "Verbindungselemente – sorgen für Stabilität, auch bei starkem Wind oder Schnee",
      ],
      paragraphs: [
        "Die richtige Auswahl des Systems ermöglicht maximale Sonnenausbeute, reduzierte Installationszeit und langfristige Kosteneffizienz.",
      ],
    },
    {
      heading: "Die Vorteile eines maßgeschneiderten PV Montagesystems",
      bullets: [
        "Effizienzsteigerung – optimale Ausrichtung und Neigung für maximale Stromerzeugung",
        "Langlebigkeit – robuste Materialien trotzen extremen Wetterbedingungen",
        "Ästhetik – perfekte Integration in das Gebäudedesign",
      ],
      paragraphs: [
        "AmbiVolt hebt sich mit innovativen, auf jede Dachform angepassten Lösungen ab, die sowohl funktional als auch optisch überzeugen.",
      ],
    },
    {
      heading: "AmbiVolt: Der Experte für PV Montagesysteme",
      paragraphs: [
        "AmbiVolt kombiniert jahrelange Erfahrung mit modernster Technologie, um seinen Kunden das Beste zu bieten.",
      ],
      bullets: [
        "Innovationsführerschaft – AmbiVolt setzt auf intelligente Designs und nachhaltige Produktion",
        "Qualitätssicherung – jedes System wird sorgfältig getestet",
        "Kundenzentrierung – maßgeschneiderte Beratung und Betreuung vor, während und nach der Installation",
      ],
    },
    {
      heading: "PV Montagesystem für Flachdächer",
      paragraphs: [
        "Flachdächer stellen eine einzigartige Herausforderung dar, da sie keine natürliche Neigung bieten. Die Montagesysteme von AmbiVolt sind speziell entwickelt, um eine optimale Neigung für maximale Energieerzeugung zu ermöglichen und Belastungen durch Wind und Schnee standzuhalten.",
      ],
      bullets: [
        "Ballastsysteme ohne Dachdurchdringung",
        "Aerodynamische Systeme für minimalen Windwiderstand",
      ],
    },
    {
      heading: "PV Montagesystem für Ziegel- und Steindächer",
      paragraphs: [
        "Traditionelle Ziegel- und Steindächer erfordern eine schonende Installation, um Schäden zu vermeiden. AmbiVolt bietet:",
      ],
      bullets: [
        "Dachhaken-Lösungen für eine sichere Befestigung",
        "Systeme, die flexibel und anpassbar an unterschiedliche Ziegelformate sind",
      ],
    },
    {
      heading: "PV Montagesystem für Trapezdächer",
      paragraphs: ["Leicht, stabil und kosteneffizient: AmbiVolts Trapezdachlösungen nutzen:"],
      bullets: [
        "Direkte Verschraubungen für schnelle Installation",
        "Korrosionsbeständige Materialien für langfristige Nutzung",
      ],
    },
    {
      heading: "PV Montagesystem für Falzblechdächer",
      paragraphs: [
        "Falzblechdächer benötigen spezielle Klemmen, die ohne Bohren auskommen. Die Systeme von AmbiVolt garantieren:",
      ],
      bullets: [
        "Schnelle Montage durch Klick-Mechanismen",
        "Minimaler Eingriff in die Dachstruktur für maximalen Schutz",
      ],
    },
    {
      heading: "PV Montagesystem für Welldächer",
      paragraphs: [
        "AmbiVolt entwickelt Lösungen, die perfekt auf die unregelmäßige Oberfläche von Welldächern abgestimmt sind. Vorteile:",
      ],
      bullets: [
        "Maximale Stabilität durch flexible Befestigungen",
        "Effiziente Nutzung der Dachfläche",
      ],
    },
    {
      heading: "Qualitätsversprechen von AmbiVolt",
      paragraphs: ["AmbiVolt steht für:"],
      bullets: [
        "Nachhaltige Materialien – umweltfreundlich und langlebig",
        "Kundenzufriedenheit – persönliche Beratung und umfassender Service",
        "Garantie – langfristige Absicherung Ihrer Investition",
      ],
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
