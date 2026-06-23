# Design-Spec: AmbiVolt Marketing-Website (Phase 1)

**Datum:** 2026-06-23
**Status:** Entwurf zur Freigabe
**Umfang:** Phase 1 — die Marketing-/Produktseite von ambivolt.de originalgetreu als Next.js-16-Anwendung nachbauen. Der Angebots-Konfigurator (Lead-Funnel + E-Mail) ist Phase 2, das CMS Phase 3.

Quelle der Inhaltsstruktur: vollständige Kartierung aller 16 Originalseiten unter
[`docs/research/ambivolt-original-sitemap.json`](../../research/ambivolt-original-sitemap.json).

---

## 1. Ziele und Erfolgskriterien

1. **Optisch treu, Code modern.** Gleiche Inhalte, gleiche Sektions-Reihenfolge, sehr ähnliche Optik — aber als sauberer, komponentenbasierter Code statt 1:1-Kopie des alten WordPress-/Elementor-Markups.
2. **Farben verbindlich.** Exakte Farbwerte des Originals und ähnliche Farb-Anteile (Weiß dominant, dunkles Slate für Sektionen/Footer, Amber als prägnanter Akzent). Wiederkehrende Motive — voller oranger Querbalken, Lauftext-Band, eckige Buttons — werden übernommen.
3. **SEO erhalten.** Originaltexte möglichst wörtlich, pro Route eigene Meta-Tags, saubere URLs (Trailing-Slash wie Original), `sitemap.xml`/`robots`. Offensichtliche SEO-Fehler des Originals werden korrigiert (siehe §10).
4. **Moderne UX.** Gute, dezente Scroll-Animationen; einwandfreie Mobile-Darstellung; Barrierefreiheit-Grundlagen (Fokus, Alt-Texte, `prefers-reduced-motion`).
5. **Migrationsfreundlich.** Inhalte als typisierte Daten getrennt vom Layout, damit der spätere Umzug auf ein CMS (Sanity, Phase 3) leicht fällt.

**Definition of Done (Phase 1):** Alle Phase-1-Seiten existieren als Routen, rendern die Originalinhalte, sehen dem Original sehr ähnlich, sind responsiv, `npm run build` und `npm run lint` laufen fehlerfrei, Lighthouse-SEO/Best-Practices grün. Formulare sind vollständig dargestellt und client-seitig validiert, der Versand ist als Phase-2-Stub gekennzeichnet (siehe §9).

---

## 2. Umfang

### In Phase 1 enthalten (Routen)

Trailing-Slash-Strategie wie Original (`trailingSlash: true`).

| Route | Seite | Indexierung |
|---|---|---|
| `/` | Startseite | index |
| `/produkte/` | Produktübersicht | index |
| `/produkte/flachdachsysteme/` | Flachdach | index |
| `/produkte/ziegel-und-steindachsysteme/` | Ziegel- & Steindach | index |
| `/produkte/trapezblechsysteme/` | Trapezblech | index |
| `/produkte/falzblechsysteme/` | Falzblech | index |
| `/produkte/welldachsysteme/` | Welldach | index |
| `/produkte/ergaenzungsprodukte-photovoltaik/` | Ergänzungsprodukte | index |
| `/unternehmen/` | Unternehmen | index |
| `/unsere-solarprojekte/` | Referenzen/Solarprojekte | index |
| `/jobs-und-stellenangebote/` | Karriere | index |
| `/jetzt-bewerben/` | Bewerbungsformular | index |
| `/kontakt/` | Kontakt | index |
| `/danke-fuer-ihre-anfrage/` | Danke-Seite | noindex |
| `/impressum/` | Impressum | noindex |
| `/datenschutzerklaerung/` | Datenschutz | noindex |

**Redirects:** `/datenschutz/` → `/datenschutzerklaerung/` (kanonische URL des Originals).
**AGB & Widerrufsbelehrung:** sind im Original **PDFs**, keine Seiten — als Datei unter `public/dokumente/` ablegen und im Footer verlinken.

### Nicht in Phase 1 (bewusst ausgeklammert — YAGNI)

- Funktionierender mehrstufiger **Angebots-Konfigurator / Lead-Funnel** und dessen E-Mail/DB-Anbindung → **Phase 2**. In Phase 1 wird der eingebettete Anfrage-Block auf Produktseiten nur als **Schritt-1-UI** dargestellt (siehe §9).
- Echter **Formularversand** (Kontakt, Bewerbung) → Backend in Phase 2.
- **CMS** (Sanity) → Phase 3.
- **Cookie-Consent-Tool, Matomo-Analytics, eingebettete Google Maps** als aktive Drittdienste → erst kurz vor Go-Live mit bewusster DSGVO-Entscheidung (siehe §12). In Phase 1: Maps als statischer, klickbarer Platzhalter; kein Tracking.

---

## 3. Design-System (Tokens)

Aus den berechneten Styles des Originals extrahiert (nicht geschätzt). Definiert als CSS-Variablen in `globals.css` und als Tailwind-4-Theme (`@theme`).

### Farben

| Token | Hex | Verwendung |
|---|---|---|
| `--color-white` | `#FFFFFF` | Haupt-Hintergrund (dominant) |
| `--color-surface` | `#F9F9F9` | Off-White-Sektionshintergründe |
| `--color-slate-900` | `#2A2938` | dunkle Sektionen, Footer, Hero-Flächen |
| `--color-slate-800` | `#303341` | dunkle Sekundärflächen |
| `--color-amber` | `#DC9015` | **Primär-Akzent**: Buttons, oranger Querbalken |
| `--color-amber-bright` | `#EF9109` | Text-/Link-Akzent (etwas heller) |
| `--color-green` | `#268C45` | Logo, sparsamer Akzent |
| `--color-ink` | `#2A2938` | Überschriften auf hell |
| `--color-text` | `#525558` | Fließtext |
| `--color-blue` | `#2563EB` | CTA-Verweis zum Angebots-Konfigurator (Phase 2) |

**Farb-Anteile** (verbindlich): Weiß flächig dominant → Off-White für abgesetzte Sektionen → Slate-Dunkel für wenige kräftige Blöcke (Hero/Footer/Effizienz-Band) → Amber nur als Akzent (Buttons, Balken, Icons). Diese Verteilung beibehalten — keine zusätzlichen Farben einführen.

### Typografie

- Original-Font: **MetroPro** (Regular/Bold), kommerzieller geometrisch-humanistischer Sans.
- **Plan:** Die tatsächlichen Webfont-Dateien des Originals self-hosten (`public/fonts/`, via `next/font/local`) für exakten Look. Lizenzlage prüfen — die Firma setzt die Schrift bereits ein; im Zweifel mit dem Kunden klären.
- **Fallback**, falls die Dateien nicht sauber/lizenzkonform verfügbar sind: nahe geometrische Google-Sans (z. B. **Jost** oder **Outfit**) via `next/font`.
- Headline-Größe Hero im Original ~60px; responsive Skala definieren (clamp).

### Form & Motive

- **Buttons:** rechteckig (`border-radius: 0`), Primär = Amber-Fläche/weiße Schrift, Sekundär = Outline. Klare Hover-States.
- **Oranger Querbalken** (`AmberBand`): volle Breite, als Sektionstrenner/Akzentfläche — wiederkehrendes Schlüsselmotiv.
- **Lauftext-Band** (`MarqueeBand`): „Jetzt Kontakt aufnehmen •" als laufende Schrift (im Footer/zwischen Sektionen).
- **Check-Bullets:** Feature-Listen mit Häkchen-Icon (im Original ein Icon-Font-Zeichen) → sauberes SVG-Icon.
- **Spacing/Container:** zentrierter Content-Container (~max-w 1200px), großzügige vertikale Sektionsabstände.

---

## 4. Architektur

**Gewählter Ansatz: Content-as-Data + wiederverwendbare Sektions-Komponenten** (vom User freigegeben).

```
src/
  app/
    layout.tsx                 # <html>, Fonts, Header, Footer, Metadata-Defaults
    page.tsx                   # Startseite
    produkte/
      page.tsx                 # Übersicht
      [dachform]/page.tsx      # Produktdetail-Seiten (datengetrieben) ODER je eigene page.tsx
    unternehmen/page.tsx
    unsere-solarprojekte/page.tsx
    jobs-und-stellenangebote/page.tsx
    jetzt-bewerben/page.tsx
    kontakt/page.tsx
    danke-fuer-ihre-anfrage/page.tsx
    impressum/page.tsx
    datenschutzerklaerung/page.tsx
    sitemap.ts                 # generiert sitemap.xml
    robots.ts                  # robots
  components/
    layout/      (Header, Nav, MobileMenu, Footer, MarqueeBand)
    sections/    (Hero, ProductGrid, FeatureList, ProcessSteps, CTASection,
                  BeratungsCTABand, AmberBand, SeoTextBlock, ReferenceGallery,
                  JobAccordion, ProgressBars, BenefitGrid, ...)
    ui/          (Button, Container, SectionHeading, Card, Breadcrumb,
                  Lightbox, DownloadList, Reveal, Icon)
    forms/       (ContactForm, ApplicationForm, InquiryFormStep1)
  content/       (company, navigation, products, projects, jobs, benefits,
                  processSteps, legal/impressum, legal/datenschutz, seo)
  lib/           (utils, motion-presets, types)
```

**Prinzipien:**
- App Router, **Server Components als Default**; nur interaktive Teile (Mobile-Menü, Akkordeon, Lightbox, Formulare, Animationen) sind Client Components.
- **Inhalte leben in `src/content/`** als typisierte TS-Module — nie hartkodiert in JSX verstreut. Das ist die Brücke zum späteren CMS.
- **Kleine, fokussierte Dateien.** Eine Sektion = eine Komponente. Wird eine Datei groß, aufteilen.
- **Produktdetail-Seiten:** datengetrieben aus `content/products.ts`. Entweder dynamische Route `produkte/[dachform]/page.tsx` mit `generateStaticParams`, oder — falls die Seiten strukturell zu unterschiedlich sind — je eine schlanke `page.tsx`, die dieselben Sektions-Komponenten mit unterschiedlichen Daten füttert. Entscheidung im Implementierungsplan nach Sichtung der Detailstruktur; Tendenz: dynamische Route, weil alle Produktseiten dem gleichen Muster folgen (Hero → Breadcrumb → Produktdetails → Anfrage → Ergänzungsprodukte → CTA).

> **Pflicht vor dem Coden:** Next.js 16 hat Breaking Changes (siehe `AGENTS.md`). Vor dem Schreiben von Next-Code die relevanten Docs unter `node_modules/next/dist/docs/` lesen (Metadata-API, `next/font`, App-Router-Konventionen, `next/image`, Server Actions). Nicht aus dem Gedächtnis coden.

---

## 5. Komponenten-Inventar

### Layout (global)
- **Header** — Logo (SVG, Link auf `/`), Desktop-Navigation mit **Produkte-Dropdown** (6 Einträge), `Kontakt`-Button (Amber). Sticky.
- **MobileMenu** — Drawer/Burger für kleine Viewports.
- **Footer** — Logo + Claim, Kontaktblock (Adresse/Telefon/E-Mail), Öffnungszeiten, Service-Links (Kontakt, Impressum, Datenschutzerklärung, AGB-PDF, Cookie-Einstellungen), Social (Facebook, LinkedIn), Agentur-Credit, Copyright. **Telefon-/Mail-Links korrekt** setzen (Original hat fehlerhaften tel-Link).
- **MarqueeBand** — Lauftext „Jetzt Kontakt aufnehmen •".

### UI-Primitive
`Button`, `Container`, `SectionHeading` (Kicker/Eyebrow + H2), `Card`, `Breadcrumb`, `Icon` (SVG-Set inkl. Check), `Reveal` (Scroll-Animation-Wrapper), `Lightbox`/`Gallery`, `DownloadList` (PDF-Kacheln).

### Sektionen
`Hero` (Kicker + H1 + Bild + optionale CTAs), `ProductGrid` + `ProductCard`, `FeatureList` (Check-Bullets), `FeatureCard` (Icon + Titel + Text), `ProcessSteps` (nummerierte Schritte), `SeoTextBlock` (langer Fließtext-Block), `CTASection` (Beratungstermin), `BeratungsCTABand` („Fragen Sie Ihr Beratungsgespräch …"-Balken), `AmberBand`, `ReferenceGallery` + `ReferenceCard` (Projekt + kWp + Lightbox), `JobAccordion` + `JobCard`, `BenefitGrid` + `BenefitCard`, `ProgressBars` (animierte Fortschrittsbalken, Unternehmen), `ProductDetailSection` (Galerie + Feature-Liste + Text + CTA).

### Formulare (Phase-1-Umfang siehe §9)
- **ContactForm** — Felder: Profil (Radio: *Eigenanlagen-Betreiber* / *PV-Profi*), Name, Firma/Institution, E-Mail, Telefon, Nachricht (optional), Datenschutz-Checkbox (Pflicht), Rechen-Captcha. Lead-Segment (Profil) für Phase-2-Verarbeitung vorsehen.
- **ApplicationForm** (`/jetzt-bewerben`) — Vorname, Nachname, Geburtsdatum, Telefon, E-Mail, Praktikum/Ausbildung (Select, Pflicht), Nachricht, Datei-Upload (Lebenslauf/Zeugnisse, max. 1 MB), Datenschutz-Checkbox, Rechen-Captcha.
- **InquiryFormStep1** (Produktseiten, `#anfrage`) — Produkt-Mehrfachauswahl als Bild-Kacheln (je Dachform die dort gelisteten Produkte), Honeypot, „Weiter". **Nur Schritt 1 / visuell** in Phase 1.

### Hinweise zu Konsistenz
- `Header`, `Footer`, `MarqueeBand`, `BeratungsCTABand`, `CTASection`, `AmberBand` und der Cookie-/Consent-Platzhalter erscheinen auf praktisch allen Seiten → strikt als geteilte Komponenten, im `layout.tsx` bzw. als wiederverwendbare Sektion.

---

## 6. Content-Datenmodell (`src/content/`)

Typisierte Module (TypeScript), je ein Themenbereich:

- **`company.ts`** — Firmierung, Adresse (Oberalmsham 1, 84140 Gangkofen), Telefon `08722 – 966 85 77`, E-Mail `anfrage@ambivolt.de`, Öffnungszeiten (Mo–Fr 08:00–12:00 / 12:30–16:30, Termine nach Vereinbarung), Social-URLs, Agentur-Credit.
- **`navigation.ts`** — Hauptnavigation + Produkte-Untermenü (Label, Slug).
- **`products.ts`** — pro Dachform: Kategorie (Slug, Titel, Hero-Text, SEO-Meta) + Produktliste (Name, Bild, Feature-Liste, Beschreibung, Downloads[]). Produkte je Seite:
  - Flachdach: AmbiLight Eco, Eco Plus, Eco Plus Süd, Gründach OW
  - Ziegel/Stein: AmbiHook V5, AmbiHook V4
  - Trapezblech: Ambi Nano Q, Ambi Top, Ambi Nano H, Ambi U Q, Ambi Micro H, Dünnblechschraube
  - Falzblech: Falzblechklemme Alu
  - Welldach: Stockschrauben-Set, Welldach-Set
  - Ergänzungsprodukte: Profil AMB P 40, EasyClick Mittel-/End-/Kreuzklemme, Profilverbinder, Endkappe
- **`projects.ts`** — 17 Referenzprojekte (Bild, Name, kWp).
- **`jobs.ts`** — 4 Stellen (Titel, Inhalt): Handwerks-Fachkraft, Vertriebsmitarbeiter, Bürokraft, Ausbildung Maschinen-/Anlagenführer.
- **`benefits.ts`, `processSteps.ts`** — Karriere-Benefits, Prozess-Schritte (Start- und Karriereseite).
- **`legal/impressum.ts`, `legal/datenschutz.ts`** — Rechtstexte als strukturierte Abschnittslisten (`{ heading, body }[]`), gerendert von `LegalPageLayout`. Datenschutz hat 6 nummerierte Hauptabschnitte + viele Unterabschnitte (Original-Wortlaut, inkl. GROSSBUCHSTABEN-Hervorhebung beim Widerspruchsrecht).
- **`seo.ts`** — pro Route Title/Description (korrigierte Werte, siehe §10).

---

## 7. Seiten — Sektions-Aufbau (aus der Kartierung)

Reihenfolge je Seite (oben→unten), ohne globalen Header/Footer/Consent:

- **`/`** — Hero · Produktraster (Dachformen, **6 Karten** inkl. Ergänzungsprodukte) · „AmbiVolt – Ihr Spezialist" (Feature-Liste + 2 CTAs) · Vorteils-Marquee · „Maximale Effizienz & hohe Qualität" (2 Karten) · „Technik nach neuestem Stand" · Prozess (3 Schritte) · SEO-Textblock · CTA „Beratungstermin".
- **`/produkte/`** — Hero · Produktraster (6 Karten) · Beratungs-CTA-Band.
- **Produktdetailseiten** (alle nach gleichem Muster) — Hero · Breadcrumb · Produkt-Schnellnavigation (Anker-Kacheln) · Produktdetail-Blöcke (Galerie + Features + Text + Downloads) · **Anfrage-Block `#anfrage` (Schritt-1-UI)** · Ergänzungsprodukte-Querraster · Beratungs-CTA-Band.
- **`/unternehmen/`** — Hero · „Erfahrung & Innovation" (Feature-Liste) · „Nachhaltigkeit & Qualität" · „Verantwortung / Nachhaltige Zukunft" (Aussage + Punkte + **animierte Fortschrittsbalken**) · CTAs zu `/kontakt`. *(Original-Tippfehler „Aussderm", „Nachhaltige Enerige" für SEO 1:1 übernehmen.)*
- **`/unsere-solarprojekte/`** — Hero · Referenzgalerie (17 Projekte, Lightbox).
- **`/jobs-und-stellenangebote/`** — Hero · Intro · „Gemeinsam mehr erreichen" (Bildcollage) · Benefits (3 Spalten) · Aktuelle Stellenangebote (4 Akkordeon-Karten, Anker `#offene-stellenangebote`) · Bewerbungsprozess (3 Schritte) · CTA „Bewirb dich jetzt".
- **`/jetzt-bewerben/`** — Hero/Intro · **Bewerbungsformular** · Kontakt-Box.
- **`/kontakt/`** — Hero · Beratungs-Hinweis · **Kontaktformular** · Kontaktdaten · Öffnungszeiten · Google-Maps (Platzhalter).
- **`/danke-fuer-ihre-anfrage/`** — Dankes-Hero · „Weitere Fragen?" · Kontaktdaten · Öffnungszeiten.
- **`/impressum/`** — `LegalPageLayout` (Rechtstext, externer ODR-Link).
- **`/datenschutzerklaerung/`** — `LegalPageLayout` (26 Abschnitte, Original-Wortlaut).

Vollständige Texte/CTAs/Bild-URLs je Sektion: siehe `docs/research/ambivolt-original-sitemap.json`.

---

## 8. Animationen

- **Bibliothek:** `motion` (vormals Framer Motion), React-19-kompatibel.
- **Muster:** gemeinsamer `<Reveal>`-Wrapper mit `whileInView` (Fade/Slide-up beim Einscrollen); `stagger` für Karten-Raster; **Count-up/Wachstum** für die Fortschrittsbalken auf `/unternehmen`; CSS/Motion-**Marquee** für die Lauftext-Bänder; dezenter Parallax/Reveal am orangen Balken und im Hero.
- **Zurückhaltung:** Animationen unterstützen, dominieren nicht. Konsistente Timing-Presets in `lib/motion-presets.ts`.
- **Barrierefreiheit:** `prefers-reduced-motion` respektieren — Animationen reduzieren/abschalten.

---

## 9. Formulare — Phase 1 vs. Phase 2

Phase 1 hat **kein Backend** (gemäß CLAUDE.md: Lead-Erfassung + E-Mail = Phase 2). Deshalb:

- **Phase 1:** Alle Formulare werden **vollständig und originalgetreu dargestellt** und **client-seitig validiert** (Pflichtfelder, E-Mail-Format, Datei-Größe/-Typ, Rechen-Captcha-Prüfung, Honeypot). Der **Absende-Vorgang ist ein klar gekennzeichneter Stub** (Server Action existiert, gibt eine freundliche Meldung zurück bzw. ist deaktiviert) — kein echter Versand, keine Datenspeicherung.
- **Phase 2:** Echte Server Actions, Validierung serverseitig, E-Mail-Versand (z. B. Resend, EU-Region), ggf. DB; der mehrstufige **Anfrage-Funnel** auf den Produktseiten wird voll ausgebaut (Folgeschritte nach „Weiter": Mengen/Adresse/Kontaktdaten), inkl. Lead-Segmentierung (Profil-Feld, Privatkunde→Partnervermittlung laut Datenschutz).

So bleibt Phase 1 ehrlich abgegrenzt und trotzdem optisch komplett.

---

## 10. SEO & Metadaten

- **Pro Route eigene `metadata`** (Title/Description) über die Next-Metadata-API; Werte aus `content/seo.ts`.
- **Originalfehler korrigieren:**
  - `/produkte/ergaenzungsprodukte-photovoltaik/` hat im Original fälschlich die Welldach-Meta → eigene, passende Meta schreiben.
  - `/jetzt-bewerben/` hat im Original die Kontakt-Meta → eigene Bewerbungs-Meta.
- **Originaltexte** der Inhaltsseiten möglichst wörtlich übernehmen (Rankings halten), inkl. der bewussten Tippfehler auf `/unternehmen` (reines SEO-Argument).
- **`sitemap.ts`** (nur indexierbare Seiten) und **`robots.ts`**; Danke-/Impressum-/Datenschutz-Seiten auf `noindex`.
- **Trailing-Slash** = `true` (URL-Gleichheit mit Original → keine Ranking-Verluste/Redirect-Ketten).
- **Strukturierte Daten** (Organization/LocalBusiness JSON-LD) als sinnvolle Ergänzung (NAP-Daten der Firma).
- **OpenGraph/Twitter** pro Seite analog Original.

---

## 11. Assets-Pipeline

- **Bilder:** alle in der Kartierung referenzierten Bild-URLs nach `public/images/…` herunterladen, sprechend benennen, in `content/*` lokal referenzieren. `next/image` mit korrekten `width/height`/`alt`. Logo als SVG (`public/ambivolt-logo.svg`).
- **PDFs:** Datenblätter, Montageanleitungen, AGB, Muster-Widerrufsformular nach `public/dokumente/`. **Achtung:** echte PDF-/Datenblatt-URLs sind im Original teils lazy-geladen und im statischen Scrape nicht aufgelöst → beim Umsetzen pro Produktseite die echten Datei-URLs nachziehen (Scrape mit Browser-Tool oder direkt aus `wp-content/uploads`).
- **Skript:** ein einmaliges Node-Skript (`scripts/fetch-assets.mjs`) lädt die Bild-/PDF-Liste herunter; Quelle = `docs/research/ambivolt-original-sitemap.json`.

---

## 12. Recht / DSGVO (Notiz für Go-Live)

Nicht Teil der Phase-1-Funktion, aber bewusst zu entscheiden, bevor live gegangen wird:

- **Hosting/Datenstandort:** EU-Region wählen (DSGVO). Noch offen.
- **Cookie-Consent:** Original nutzt Borlabs. Im Neubau erst nötig, sobald Tracking/eingebettete Drittdienste aktiv sind. Phase 1: keine nicht-essentiellen Cookies, daher Consent optional/Platzhalter.
- **Analytics:** Original = Matomo (selbst gehostet). Optionale Wiedereinführung später, datensparsam.
- **Google Maps:** im Original USA-Datentransfer (DPF). Phase 1: statischer Platzhalter mit Link zum Routenplaner statt aktivem Embed; aktives Embed erst mit Consent.
- **Formulardaten:** Verarbeitung/Speicherung erst in Phase 2, dann mit Auftragsverarbeitung & Datenschutzhinweis.

---

## 13. Build-Reihenfolge

1. **Fundament:** Design-Tokens (`globals.css` + Tailwind-Theme), Fonts, `layout.tsx`, `Header`/`Nav`/`MobileMenu`, `Footer`, `MarqueeBand`, UI-Primitive (`Button`, `Container`, `SectionHeading`, `Reveal`), Next-Config (Trailing-Slash, Image-Domains), `sitemap`/`robots`. Default-Scaffold (Demo-`page.tsx`/`globals.css`) ersetzen.
2. **Startseite** — alle Sektions-Komponenten entstehen hier zuerst und werden wiederverwendet.
3. **Produktseiten** — Übersicht + Detailmuster (datengetrieben), Assets, Anfrage-Step-1-UI.
4. **Restliche Seiten** — Unternehmen, Solarprojekte, Jobs, Bewerben, Kontakt, Danke, Impressum, Datenschutz.
5. **Politur** — Animationen, Mobile-Feinschliff, A11y, SEO/Meta, Lighthouse.

Pro abgeschlossener Coding-Aufgabe: **Codex-Review-Loop** (Standard- + Adversarial-Review) gemäß `~/CLAUDE.md`, und Obsidian-Session-Log.

---

## 14. Verifikation

- `npm run build` (Next.js 16, fehlerfrei) und `npm run lint` grün.
- Visueller Abgleich gegen das Original je Seite (Side-by-side-Screenshots, Playwright).
- Responsiver Check (Mobile/Tablet/Desktop).
- Lighthouse: SEO + Best Practices grün; sinnvolle Performance.
- A11y-Stichproben: Tastatur-Navigation, Fokus-Sichtbarkeit, Alt-Texte, `prefers-reduced-motion`.

---

## 15. Offene Punkte / später entscheiden

1. **MetroPro-Lizenz** — echte Font-Dateien nutzbar? Sonst Fallback Jost/Outfit. (Mit Kunde klären; blockiert Phase 1 nicht.)
2. **Produktdetail-Route** — dynamisch (`[dachform]`) vs. je eigene `page.tsx`. Entscheidung im Implementierungsplan nach Detailsichtung (Tendenz: dynamisch).
3. **Echte PDF-/Datenblatt-URLs** — pro Produkt beim Umsetzen nachziehen.
4. **Hosting/Datenstandort & Consent/Analytics/Maps** — vor Go-Live (Phase 2/3).
5. **Telefonnummer** — angezeigte Gangkofen-Nummer `08722 – 966 85 77` ist führend; fehlerhafter München-tel-Link des Originals wird korrigiert.
