# AmbiVolt Phase 1 — Milestone 1: Fundament + Startseite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Fundament der neuen AmbiVolt-Website (Design-Tokens, Fonts, globales Layout mit Header/Footer/Navigation, wiederverwendbare UI- und Sektions-Komponenten) bauen und damit die **Startseite** originalgetreu rendern — eine lauffähige, testbare, deploybare Seite.

**Architecture:** Next.js 16 App Router, Server Components als Default, interaktive Teile (Mobile-Menü, Animationen) als Client Components. Inhalte als typisierte Daten in `src/content/` getrennt vom Layout (CMS-freundlich). Eine Sektion = eine Komponente. Design-Tokens als CSS-Variablen + Tailwind-4-Theme.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, TypeScript, Tailwind CSS 4, `motion` (Scroll-Animationen), `next/font`.

**Referenz-Spec:** [`docs/superpowers/specs/2026-06-23-ambivolt-marketing-relaunch-design.md`](../specs/2026-06-23-ambivolt-marketing-relaunch-design.md)
**Inhalts-/Textquelle (verbindlich, wörtlich):** [`docs/research/ambivolt-original-sitemap.json`](../../research/ambivolt-original-sitemap.json) — Eintrag mit `resolvedUrl: "https://ambivolt.de/"` enthält alle 12 Startseiten-Sektionen mit Texten, CTAs und Bild-URLs.

---

## Verifikations-Strategie (projektspezifisch — ersetzt strikte TDD)

`~/CLAUDE.md` schreibt einen Codex-Review-Loop als Qualitätssicherung vor; der hat Vorrang vor dem TDD-Default der Skill. Für diesen visuellen Nachbau gilt pro Aufgabe:

1. **Build & Lint:** `npm run build` und `npm run lint` müssen fehlerfrei sein.
2. **Visueller Abgleich:** Mit Playwright die neue Seite (localhost) gegen die Original-Sektion vergleichen (Screenshot/Snapshot), Farben/Reihenfolge/Texte prüfen.
3. **Logik-Tests** nur wo echte Logik existiert (Mobile-Menü-Toggle, Dropdown-Keyboard-A11y) — als kleine Komponententests (siehe Task 14, optional via Vitest).
4. **Codex-Review-Loop** nach jeder abgeschlossenen Aufgabe mit Dateiänderungen: `/codex:review` → `/codex:adversarial-review` → `/codex:rescue`, Findings beurteilen, fixen, wiederholen bis sauber.
5. **Obsidian-Log** nach jeder Antwort.

"Run/Expected" in den Tasks bezieht sich daher auf Build/Lint/visuellen Check, nicht auf rote Unit-Tests.

---

## Datei-Struktur (dieser Milestone)

```
next.config.ts                         # trailingSlash, images (Phase 1: nur lokale Assets)
package.json                           # + motion
scripts/fetch-assets.mjs               # einmaliger Asset-Download (Bilder/Logo)
src/
  app/
    layout.tsx                         # <html>, Fonts, Header, Footer, Metadata-Defaults
    page.tsx                           # Startseite (komponiert Sektionen)
    globals.css                        # Tokens + Tailwind-Theme
    sitemap.ts                         # sitemap.xml (nur indexierbare Routen)
    robots.ts                          # robots.txt
  content/
    company.ts                         # NAP, Öffnungszeiten, Social, Agentur
    navigation.ts                      # Hauptnav + Produkte-Untermenü
    home.ts                            # Startseiten-Inhalte (Sektionsdaten)
    types.ts                           # geteilte Content-Typen
  lib/
    motion-presets.ts                  # Animations-Presets (fade/slide/stagger)
  components/
    ui/
      Container.tsx                    # zentrierter Content-Container
      Button.tsx                       # eckiger Button (primary/secondary), Link/Button
      SectionHeading.tsx               # Kicker (Eyebrow) + Überschrift
      Icon.tsx                         # SVG-Icon-Set (check, chevron, arrow, phone, mail, ...)
      Reveal.tsx                       # 'use client' Scroll-Reveal-Wrapper (motion)
    layout/
      Header.tsx                       # Server: Logo + Desktop-Nav + Mobile-Trigger
      DesktopNav.tsx                   # 'use client': Nav inkl. Produkte-Dropdown
      MobileMenu.tsx                   # 'use client': Burger + Drawer
      Footer.tsx                       # Server: Kontakt, Öffnungszeiten, Links, Social
      MarqueeBand.tsx                  # 'use client': Lauftext-Band
    sections/
      Hero.tsx                         # Startseiten-Hero
      ProductGrid.tsx + ProductCard.tsx# Dachform-Karten (6)
      FeatureList.tsx                  # Check-Bullet-Liste
      SpecialistSection.tsx            # "AmbiVolt – Ihr Spezialist…"
      AdvantagesMarquee.tsx            # Vorteils-Lauftext
      EfficiencyCards.tsx              # "Maximale Effizienz & hohe Qualität" (2 Karten)
      TechSection.tsx                  # "Technik nach neuestem Stand"
      ProcessSteps.tsx                 # "Von der Anfrage bis zur Montage" (3 Schritte)
      SeoTextBlock.tsx                 # langer Fließtext-Block
      CtaSection.tsx                   # "Vereinbaren Sie … Beratungstermin!"
public/
  ambivolt-logo.svg
  images/…                            # heruntergeladene Startseiten-Bilder
  fonts/…                             # (falls MetroPro-Dateien verfügbar)
```

---

## Task 0: Next.js-16-Docs lesen (Pflicht laut AGENTS.md)

**Files:** keine Änderung — nur lesen.

- [ ] **Step 1: Relevante Docs lesen**

Lies (Read-Tool) vor dem Coden:
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`

Achte auf Breaking Changes / Deprecations ggü. älteren Next-Versionen (Metadata-API, `next/font`, `async`-APIs, Image-Konfiguration). Notiere Abweichungen, bevor du Code schreibst.

- [ ] **Step 2: Kein Commit** (reiner Lese-Schritt).

---

## Task 1: Dependencies + Next-Config + TS-Aliase

**Files:**
- Modify: `package.json` (Dependency `motion`)
- Modify: `next.config.ts`
- Verify: `tsconfig.json` (Alias `@/*` ist bereits gesetzt — nur prüfen)

- [ ] **Step 1: `motion` installieren**

Run: `npm install motion`
Expected: `motion` erscheint in `package.json` dependencies, `npm` exit 0.

- [ ] **Step 2: `next.config.ts` setzen**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URL-Gleichheit mit dem Original (SEO): Trailing-Slashes
  trailingSlash: true,
  // Phase 1 nutzt nur lokale Assets in /public — keine Remote-Patterns nötig.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Build prüfen**

Run: `npm run build`
Expected: Build erfolgreich (noch Default-Startseite).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json next.config.ts
git commit -m "chore: motion-Dependency + Next-Config (trailingSlash, image-Formate)"
```

---

## Task 2: Asset-Download-Skript + Logo + Startseiten-Bilder

**Files:**
- Create: `scripts/fetch-assets.mjs`
- Create: `public/ambivolt-logo.svg`, `public/images/…`

**Bildquellen** (aus der Kartierung, Startseite): Logo `https://ambivolt.de/wp-content/uploads/ambivolt-Logo.svg`; Hero `…/2023-04-03-Startseite-Headerbilder-produkte-vers02-980x883-1.webp`; Produktbilder `AmbiLight-460px.png`, `Ambihook-V5.png`, `ambinano-500p.png`, `AmbiVolt-easyclick-400px-transparent.png`, `ambivolt-falzblechklemme-alu.jpg`, `ambivolt-Welldachset.jpg`; Effizienz `solar-panel.png`, `solar-house-white.png`, `ambivolt-energietechnik-maximale-effizienz.webp`. Vollständige Liste je Sektion im JSON unter `resolvedUrl: "https://ambivolt.de/"`.

- [ ] **Step 1: Download-Skript schreiben**

```js
// scripts/fetch-assets.mjs  — einmaliger Asset-Download
import fs from "node:fs";
import path from "node:path";

const OUT = "public/images";
fs.mkdirSync(OUT, { recursive: true });

// Liste aus docs/research/ambivolt-original-sitemap.json (Startseite) gepflegt:
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
```

- [ ] **Step 2: Skript ausführen**

Run: `node scripts/fetch-assets.mjs`
Expected: "OK …" je Datei; Dateien liegen unter `public/`. Bei FAIL/404: echte URL aus dem JSON bzw. via Browser-Tool nachziehen (manche Original-Assets sind lazy-geladen).

- [ ] **Step 3: Logo prüfen**

Öffne `public/ambivolt-logo.svg` (Read) — valides SVG? Falls nur ein Platzhalter/HTML zurückkam, Logo per Browser-Tool von der Live-Seite ziehen.

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-assets.mjs public/
git commit -m "chore: Asset-Download-Skript + Startseiten-Bilder/Logo"
```

---

## Task 3: Design-Tokens (globals.css + Tailwind-Theme)

**Files:**
- Modify: `src/app/globals.css` (Default-Inhalt ersetzen)

- [ ] **Step 1: Tokens definieren**

```css
@import "tailwindcss";

@theme {
  /* Farben — exakt aus dem Original extrahiert */
  --color-white: #ffffff;
  --color-surface: #f9f9f9;
  --color-slate-900: #2a2938;
  --color-slate-800: #303341;
  --color-amber: #dc9015;
  --color-amber-bright: #ef9109;
  --color-green: #268c45;
  --color-ink: #2a2938;
  --color-text: #525558;
  --color-blue: #2563eb;

  /* Schrift (Variablen werden in layout.tsx via next/font gesetzt) */
  --font-sans: var(--font-metro), system-ui, sans-serif;

  /* Layout */
  --container-max: 1200px;
}

:root {
  color-scheme: light;
}

body {
  background: var(--color-white);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Reduced motion: Animationen entschärfen */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> Hinweis: Tailwind 4 liest Farben aus `@theme` → Utilities wie `bg-amber`, `text-slate-900`, `bg-surface` stehen automatisch zur Verfügung. Kein Dark-Mode (Original ist hell).

- [ ] **Step 2: Build prüfen**

Run: `npm run build`
Expected: erfolgreich.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: Design-Tokens (Farben/Spacing) als Tailwind-Theme"
```

---

## Task 4: Fonts (next/font)

**Files:**
- Modify: `src/app/layout.tsx`
- ggf. Create: `public/fonts/…`

- [ ] **Step 1: Font einrichten**

Bevorzugt MetroPro self-hosten (falls Dateien vorhanden) via `next/font/local`; sonst Fallback **Jost** via `next/font/google`. Setze die CSS-Variable `--font-metro` (passt zu Task 3).

Fallback-Variante (Jost):
```tsx
import { Jost } from "next/font/google";

const sans = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-metro",
  display: "swap",
});
```

Local-Variante (wenn `public/fonts/MetroPro-Regular.woff2` etc. vorhanden):
```tsx
import localFont from "next/font/local";

const sans = localFont({
  src: [
    { path: "../../public/fonts/MetroPro-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/MetroPro-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-metro",
  display: "swap",
});
```

Die `sans.variable`-Klasse kommt in Task 9 an `<html>`.

- [ ] **Step 2: Build prüfen** — Run: `npm run build` → erfolgreich (volle Verdrahtung in Task 9).
- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx public/fonts 2>/dev/null; git commit -m "feat: Schriftart via next/font (MetroPro/Jost-Fallback)"
```

---

## Task 5: Content-Typen + company + navigation

**Files:**
- Create: `src/content/types.ts`, `src/content/company.ts`, `src/content/navigation.ts`

- [ ] **Step 1: Typen**

```ts
// src/content/types.ts
export type NavItem = { label: string; href: string; children?: NavItem[] };
export type ProductCardData = {
  slug: string; title: string; teaser: string; image: string; href: string;
};
```

- [ ] **Step 2: company.ts** (Daten aus der Spec/Original; korrekte Telefonnummer)

```ts
// src/content/company.ts
export const company = {
  legalName: "AmbiVolt Energietechnik GmbH",
  shortName: "AmbiVolt",
  street: "Oberalmsham 1",
  zip: "84140",
  city: "Gangkofen",
  phoneDisplay: "08722 – 966 85 77",
  phoneHref: "tel:+4987229668577", // korrigiert (Original-tel-Link war fehlerhaft)
  email: "anfrage@ambivolt.de",
  claim:
    "Hersteller für Montagesysteme für Solar- & Photovoltaik-Anlagen, die nach neuestem Stand der Technik entwickelt und hergestellt werden. Mit unserer langjährigen Erfahrung bieten wir Ihnen die besten Lösungen für Ihre Solarprojekte.",
  hours: [
    { days: "Montag – Freitag", time: "08:00 – 12:00 Uhr · 12:30 – 16:30 Uhr" },
    { days: "", time: "Besuche nach Terminvereinbarung" },
  ],
  social: {
    facebook: "https://de-de.facebook.com/people/AmbiVolt-Energietechnik-GmbH/100066468475063/",
    linkedin: "https://www.linkedin.com/company/ambivolt-energietechnik-gmbh/about/",
  },
  agency: { name: "Wallner Marketing", url: "https://wallner-marketing.de/" },
} as const;
```

- [ ] **Step 3: navigation.ts** (Trailing-Slash-Hrefs)

```ts
// src/content/navigation.ts
import type { NavItem } from "./types";

export const productSubmenu: NavItem[] = [
  { label: "Flachdach-Systeme", href: "/produkte/flachdachsysteme/" },
  { label: "Ziegel- & Steindach-Systeme", href: "/produkte/ziegel-und-steindachsysteme/" },
  { label: "Trapezblechsysteme", href: "/produkte/trapezblechsysteme/" },
  { label: "Falzblechsysteme", href: "/produkte/falzblechsysteme/" },
  { label: "Welldach-Systeme", href: "/produkte/welldachsysteme/" },
  { label: "Ergänzungsprodukte", href: "/produkte/ergaenzungsprodukte-photovoltaik/" },
];

export const mainNav: NavItem[] = [
  { label: "Produkte", href: "/produkte/", children: productSubmenu },
  { label: "Unternehmen", href: "/unternehmen/" },
  { label: "Referenzen", href: "/unsere-solarprojekte/" },
  { label: "Karriere", href: "/jobs-und-stellenangebote/" },
  { label: "Kontakt", href: "/kontakt/" },
];
```

- [ ] **Step 4: Typecheck** — Run: `npx tsc --noEmit` → keine Fehler.
- [ ] **Step 5: Commit**

```bash
git add src/content/types.ts src/content/company.ts src/content/navigation.ts
git commit -m "feat: Content-Daten (Typen, Firmendaten, Navigation)"
```

---

## Task 6: motion-Presets + UI-Primitive (Container, Button, SectionHeading, Icon)

**Files:**
- Create: `src/lib/motion-presets.ts`
- Create: `src/components/ui/Container.tsx`, `Button.tsx`, `SectionHeading.tsx`, `Icon.tsx`

- [ ] **Step 1: motion-Presets**

```ts
// src/lib/motion-presets.ts
import type { Variants } from "motion/react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
```

- [ ] **Step 2: Container**

```tsx
// src/components/ui/Container.tsx
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--container-max)] px-5 md:px-8 ${className}`}>{children}</div>;
}
```

- [ ] **Step 3: Button** (eckig; Link oder Button; primary/secondary)

```tsx
// src/components/ui/Button.tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";
const base = "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors";
const variants: Record<Variant, string> = {
  primary: "bg-amber text-white hover:bg-amber-bright",
  secondary: "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
};

export function Button({ href, children, variant = "primary", className = "", ...rest }:
  { href?: string; children: ReactNode; variant?: Variant; className?: string } & Record<string, unknown>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <Link href={href} className={cls} {...rest}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
```

- [ ] **Step 4: SectionHeading** (Eyebrow/Kicker + Überschrift)

```tsx
// src/components/ui/SectionHeading.tsx
import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, align = "left", className = "" }:
  { eyebrow?: string; title: ReactNode; align?: "left" | "center"; className?: string }) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber">{eyebrow}</p>}
      <h2 className="text-3xl font-bold leading-tight text-ink md:text-4xl">{title}</h2>
    </div>
  );
}
```

- [ ] **Step 5: Icon** (SVG-Set: check, chevron-down, arrow-right, phone, mail, map-pin, facebook, linkedin)

```tsx
// src/components/ui/Icon.tsx
type Name = "check" | "chevron" | "arrow" | "phone" | "mail" | "pin" | "facebook" | "linkedin";
const paths: Record<Name, string> = {
  check: "M20 6L9 17l-5-5",
  chevron: "M6 9l6 6 6-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16v16H4zM22 6l-10 7L2 6",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a3 3 0 1 0 0-.01",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  linkedin: "M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
};
export function Icon({ name, className = "h-5 w-5" }: { name: Name; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
```

- [ ] **Step 6: Typecheck** — Run: `npx tsc --noEmit` → keine Fehler.
- [ ] **Step 7: Commit**

```bash
git add src/lib/motion-presets.ts src/components/ui/
git commit -m "feat: motion-Presets + UI-Primitive (Container/Button/SectionHeading/Icon)"
```

---

## Task 7: Reveal-Wrapper (Scroll-Animation)

**Files:**
- Create: `src/components/ui/Reveal.tsx`

- [ ] **Step 1: Reveal**

```tsx
// src/components/ui/Reveal.tsx
"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion-presets";

export function Reveal({ children, className = "", delay = 0 }:
  { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Build** — Run: `npm run build` → erfolgreich.
- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Reveal.tsx
git commit -m "feat: Reveal-Wrapper für Scroll-Animationen (motion)"
```

---

## Task 8: Header + DesktopNav + MobileMenu

**Files:**
- Create: `src/components/layout/Header.tsx`, `DesktopNav.tsx`, `MobileMenu.tsx`

Verhalten: sticky Header, Logo links (Link `/`), Desktop-Nav mittig/rechts mit **Produkte-Dropdown** (Hover + Keyboard/Focus zugänglich, `aria-expanded`), `Kontakt` als Amber-Button. Unter `lg` Burger → Drawer mit aufklappbarem Produkte-Untermenü.

- [ ] **Step 1: DesktopNav** (Client — Dropdown-State + A11y)

```tsx
// src/components/layout/DesktopNav.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { mainNav } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function DesktopNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="hidden items-center gap-8 lg:flex" aria-label="Hauptnavigation">
      {mainNav.map((item) =>
        item.children ? (
          <div key={item.href} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button className="flex items-center gap-1 py-2 text-sm font-medium text-ink hover:text-amber"
              aria-expanded={open} aria-haspopup="true" onFocus={() => setOpen(true)}>
              {item.label}<Icon name="chevron" className="h-4 w-4" />
            </button>
            {open && (
              <ul className="absolute left-0 top-full z-40 min-w-64 border-t-2 border-amber bg-white py-2 shadow-lg">
                {item.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="block px-5 py-2 text-sm text-text hover:bg-surface hover:text-amber">{c.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : item.label === "Kontakt" ? (
          <Button key={item.href} href={item.href} className="px-5 py-2">{item.label}</Button>
        ) : (
          <Link key={item.href} href={item.href} className="py-2 text-sm font-medium text-ink hover:text-amber">{item.label}</Link>
        )
      )}
    </nav>
  );
}
```

- [ ] **Step 2: MobileMenu** (Client — Drawer)

```tsx
// src/components/layout/MobileMenu.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { mainNav, productSubmenu } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} aria-label="Menü öffnen" className="p-2 text-ink">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between border-b p-5">
            <span className="font-bold text-ink">Menü</span>
            <button onClick={() => setOpen(false)} aria-label="Menü schließen" className="p-2 text-ink">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <ul className="flex flex-col p-5">
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.href}>
                  <button onClick={() => setProdOpen((v) => !v)} className="flex w-full items-center justify-between py-3 text-lg text-ink" aria-expanded={prodOpen}>
                    {item.label}<Icon name="chevron" className={`h-5 w-5 transition-transform ${prodOpen ? "rotate-180" : ""}`} />
                  </button>
                  {prodOpen && (
                    <ul className="ml-4 border-l border-surface pl-4">
                      {productSubmenu.map((c) => (
                        <li key={c.href}><Link href={c.href} onClick={() => setOpen(false)} className="block py-2 text-text">{c.label}</Link></li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-ink">{item.label}</Link></li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Header** (Server — komponiert)

```tsx
// src/components/layout/Header.tsx
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { company } from "@/content/company";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" aria-label={`${company.shortName} Startseite`}>
          <Image src="/ambivolt-logo.svg" alt={company.legalName} width={160} height={40} priority />
        </Link>
        <DesktopNav />
        <MobileMenu />
      </Container>
    </header>
  );
}
```

- [ ] **Step 4: Build** — Run: `npm run build` → erfolgreich.
- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/DesktopNav.tsx src/components/layout/MobileMenu.tsx
git commit -m "feat: Header mit Desktop-Dropdown-Nav und Mobile-Menü"
```

---

## Task 9: Footer + MarqueeBand + layout.tsx-Verdrahtung + Basis-Metadata

**Files:**
- Create: `src/components/layout/Footer.tsx`, `MarqueeBand.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: MarqueeBand** (Client — Lauftext)

```tsx
// src/components/layout/MarqueeBand.tsx
"use client";
import { motion } from "motion/react";

export function MarqueeBand({ text = "Jetzt Kontakt aufnehmen", className = "" }: { text?: string; className?: string }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className={`overflow-hidden bg-amber py-3 text-white ${className}`} aria-hidden="true">
      <motion.div className="flex whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
        {items.concat(items).map((i) => (
          <span key={i} className="mx-6 text-sm font-semibold uppercase tracking-widest">{text} •</span>
        ))}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Footer** (Server)

Struktur: 4 Spalten — (1) Logo + Claim, (2) Kontakt (Adresse/Telefon/Mail mit Icons, korrekte `phoneHref`), (3) Öffnungszeiten, (4) Service-Links (Kontakt, Impressum, Datenschutzerklärung, „AGB & Widerrufsbelehrung" → `/dokumente/agb.pdf`, „Cookie-Einstellungen" → Phase-1-Platzhalter `#`). Darunter: Social (Facebook/LinkedIn via `Icon`), Copyright „© 2026 …", Agentur-Credit. Dunkler Slate-Hintergrund (`bg-slate-900 text-white/80`), oben eine Amber-Trennlinie (`border-t-4 border-amber`). Daten aus `company`. `MarqueeBand` direkt über dem Footer.

```tsx
// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";

const serviceLinks = [
  { label: "Kontakt", href: "/kontakt/" },
  { label: "Impressum", href: "/impressum/" },
  { label: "Datenschutzerklärung", href: "/datenschutzerklaerung/" },
  { label: "AGB & Widerrufsbelehrung", href: "/dokumente/agb.pdf" },
  { label: "Cookie-Einstellungen", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t-4 border-amber bg-slate-900 text-white/80">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/ambivolt-logo.svg" alt={company.legalName} width={160} height={40} className="mb-4 brightness-0 invert" />
          <p className="text-sm leading-relaxed">{company.claim}</p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Kontakt</h3>
          <address className="space-y-2 text-sm not-italic">
            <p>{company.legalName}</p>
            <p>{company.street}, {company.zip} {company.city}</p>
            <p className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4" /><a href={company.phoneHref} className="hover:text-amber">{company.phoneDisplay}</a></p>
            <p className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4" /><a href={`mailto:${company.email}`} className="hover:text-amber">{company.email}</a></p>
          </address>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Öffnungszeiten</h3>
          <ul className="space-y-2 text-sm">
            {company.hours.map((h, i) => (<li key={i}>{h.days && <span className="block font-medium text-white">{h.days}</span>}{h.time}</li>))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Service</h3>
          <ul className="space-y-2 text-sm">
            {serviceLinks.map((l) => (<li key={l.label}><Link href={l.href} className="hover:text-amber">{l.label}</Link></li>))}
          </ul>
          <div className="mt-4 flex gap-3">
            <a href={company.social.facebook} aria-label="Facebook" className="hover:text-amber"><Icon name="facebook" /></a>
            <a href={company.social.linkedin} aria-label="LinkedIn" className="hover:text-amber"><Icon name="linkedin" /></a>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        Copyright © 2026 {company.legalName} · Made with ♥ by{" "}
        <a href={company.agency.url} className="hover:text-amber">{company.agency.name}</a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: layout.tsx verdrahten** (Font-Variable, Header, Footer, MarqueeBand, Basis-Metadata)

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Jost } from "next/font/google"; // bzw. localFont aus Task 4
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarqueeBand } from "@/components/layout/MarqueeBand";

const sans = Jost({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-metro", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ambivolt.de"),
  title: { default: "Photovoltaik-Montagesysteme - AmbiVolt Energietechnik", template: "%s | AmbiVolt" },
  description: "Entdecken Sie unsere hochwertigen Photovoltaik-Montagesysteme. Unsere Systeme gewährleisten eine schnelle Montage & Flexibilität am Dach!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <MarqueeBand />
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Build** — Run: `npm run build` → erfolgreich.
- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/MarqueeBand.tsx src/app/layout.tsx
git commit -m "feat: Footer + Marquee-Band + Layout-Verdrahtung + Basis-Metadata"
```

---

## Task 10: Startseiten-Inhalte (home.ts) + Produktkarten-Daten

**Files:**
- Create: `src/content/home.ts`

Inhalte **wörtlich** aus dem JSON-Eintrag `resolvedUrl: "https://ambivolt.de/"` übernehmen (Hero-Bullets, Spezialist-Text, Effizienz-Karten, Technik, Prozess-Schritte, SEO-Textblock, CTA). Produktkarten = 6 (inkl. Ergänzungsprodukte, der im Original fehlenden Karte), jede mit korrektem `href` auf die Produkt-Unterseite (Platzhalter-Links des Originals korrigieren).

- [ ] **Step 1: home.ts mit typisierten Sektionsdaten anlegen**

Struktur (Felder): `hero { title, subtitle, bullets[], image }`, `products: ProductCardData[]` (6), `specialist { eyebrow, title, body, bullets[], ctas[] }`, `advantages: string[]`, `efficiency { eyebrow, intro, cards[{title, body, icon}] }`, `tech { eyebrow, title, points[] }`, `process { title, subtitle, steps[{n, title, body}] }`, `seoText { title, paragraphs[] }`, `cta { title, button{label, href} }`. Texte exakt aus dem JSON.

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` → keine Fehler.
- [ ] **Step 3: Commit**

```bash
git add src/content/home.ts
git commit -m "feat: Startseiten-Inhalte als typisierte Daten (Originaltexte)"
```

---

## Task 11: Startseiten-Sektions-Komponenten (Teil 1) — Hero, ProductGrid/ProductCard, FeatureList

**Files:**
- Create: `src/components/sections/Hero.tsx`, `ProductGrid.tsx`, `ProductCard.tsx`, `FeatureList.tsx`

Jede Komponente nimmt ihre Daten als Props (aus `home.ts`), nutzt `Container`, `SectionHeading`, `Reveal`, `next/image`. Farben strikt aus Tokens. **Hero** = dunkle Slate-Fläche mit hellem Text + Produktbild + Check-Bullets. **ProductGrid** = responsives Raster (1/2/3 Spalten) aus `ProductCard` (Bild, Titel, Teaser, „Mehr erfahren" → `href`). **FeatureList** = Check-Bullet-Liste (Icon `check` in Amber).

- [ ] **Step 1: Komponenten implementieren** (Props-getrieben; JSX-Struktur gemäß obiger Beschreibung, Tailwind-Klassen mit Tokens; `Reveal` um Kartengruppen).
- [ ] **Step 2: Build** — Run: `npm run build` → erfolgreich.
- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/ProductGrid.tsx src/components/sections/ProductCard.tsx src/components/sections/FeatureList.tsx
git commit -m "feat: Startseiten-Sektionen Teil 1 (Hero, Produktraster, FeatureList)"
```

---

## Task 12: Startseiten-Sektions-Komponenten (Teil 2) — Spezialist, AdvantagesMarquee, EfficiencyCards, TechSection, ProcessSteps, SeoTextBlock, CtaSection

**Files:**
- Create: `src/components/sections/SpecialistSection.tsx`, `AdvantagesMarquee.tsx`, `EfficiencyCards.tsx`, `TechSection.tsx`, `ProcessSteps.tsx`, `SeoTextBlock.tsx`, `CtaSection.tsx`

Direktiven: **SpecialistSection** = zweispaltig (Text + `FeatureList`) mit zwei CTAs (`Button` primary/secondary). **AdvantagesMarquee** = `MarqueeBand`-Variante mit den 4 Vorteils-Stichworten (oder statisches Band auf Desktop). **EfficiencyCards** = Eyebrow + Intro + 2 Karten (Icon `icon-solar-*`, Titel, Body) auf hellem/Slate-Hintergrund. **TechSection** = Überschrift + 2 Unterpunkte. **ProcessSteps** = 3 nummerierte Karten (große Ziffer in Amber). **SeoTextBlock** = `prose`-artiger Fließtext (mehrere Absätze, H2/H3). **CtaSection** = voller Amber-Balken/Slate mit Titel + Button (Beratungstermin). Alle Props-getrieben, `Reveal`-umhüllt, Tokens-Farben.

- [ ] **Step 1: Komponenten implementieren.**
- [ ] **Step 2: Build** — Run: `npm run build` → erfolgreich.
- [ ] **Step 3: Commit**

```bash
git add src/components/sections/
git commit -m "feat: Startseiten-Sektionen Teil 2 (Spezialist, Effizienz, Technik, Prozess, SEO, CTA)"
```

---

## Task 13: Startseite zusammensetzen (page.tsx) + sitemap/robots

**Files:**
- Modify: `src/app/page.tsx` (Default-Demo ersetzen)
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] **Step 1: page.tsx komponieren** — Sektionen in Original-Reihenfolge (siehe Spec §7) mit Daten aus `home.ts`:
Hero → ProductGrid → SpecialistSection → AdvantagesMarquee → EfficiencyCards → TechSection → ProcessSteps → SeoTextBlock → CtaSection.

- [ ] **Step 2: sitemap.ts**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
const base = "https://ambivolt.de";
const routes = ["/","/produkte/","/produkte/flachdachsysteme/","/produkte/ziegel-und-steindachsysteme/","/produkte/trapezblechsysteme/","/produkte/falzblechsysteme/","/produkte/welldachsysteme/","/produkte/ergaenzungsprodukte-photovoltaik/","/unternehmen/","/unsere-solarprojekte/","/jobs-und-stellenangebote/","/jetzt-bewerben/","/kontakt/"];
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: base + r, changeFrequency: "monthly", priority: r === "/" ? 1 : 0.7 }));
}
```

- [ ] **Step 3: robots.ts**

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/danke-fuer-ihre-anfrage/", "/impressum/", "/datenschutzerklaerung/"] },
    sitemap: "https://ambivolt.de/sitemap.xml",
  };
}
```

- [ ] **Step 4: Build + Lint** — Run: `npm run build && npm run lint` → beides erfolgreich.
- [ ] **Step 5: Dev-Server + visueller Abgleich** — Run: `npm run dev`, dann mit Playwright `http://localhost:3000/` öffnen und Sektion für Sektion gegen `https://ambivolt.de` vergleichen (Reihenfolge, Texte, Farben, Mobile). Abweichungen bei Spacing/Klassen jetzt feinjustieren.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: Startseite zusammengesetzt + sitemap/robots"
```

---

## Task 14: (Optional) Logik-Tests Mobile-Menü & Dropdown

**Files:**
- Create: `vitest.config.ts`, `src/components/layout/MobileMenu.test.tsx`

Nur ausführen, wenn schnelle Regressionssicherung für die interaktive Navigation gewünscht ist. Setup: `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom`.

- [ ] **Step 1: Test — Menü öffnet/schließt**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileMenu } from "./MobileMenu";

test("öffnet und schließt das Mobile-Menü", () => {
  render(<MobileMenu />);
  fireEvent.click(screen.getByLabelText("Menü öffnen"));
  expect(screen.getByText("Menü")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Menü schließen"));
  expect(screen.queryByText("Menü")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run** — `npx vitest run` → PASS.
- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts package.json src/components/layout/MobileMenu.test.tsx
git commit -m "test: Mobile-Menü Open/Close"
```

---

## Task 15: Abschluss — Codex-Review-Loop + Verifikation

- [ ] **Step 1: Codex-Review-Loop** (gemäß `~/CLAUDE.md`)
`/codex:review` → `/codex:adversarial-review` → `/codex:rescue`. Findings beurteilen, fixen, Loop wiederholen bis `/codex:review` und `/codex:adversarial-review` sauber sind.

- [ ] **Step 2: Finale Verifikation**
`npm run build` + `npm run lint` grün; Lighthouse (SEO/Best-Practices) auf der Startseite grün; Mobile/Desktop visuell ok; `prefers-reduced-motion` getestet.

- [ ] **Step 3: Obsidian-Log** aktualisieren (was gebaut, Ergebnisse, betroffene Dateien).

- [ ] **Step 4: Abschluss-Commit** (falls Fixes offen)

```bash
git add -A && git commit -m "chore: Milestone-1 Review-Fixes + Verifikation"
```

---

## Self-Review (gegen die Spec)

- **Spec-Abdeckung:** Tokens/Farben (T3), Fonts (T4), Layout/Header/Footer/Nav/Marquee (T8–T9), UI-Primitive + Reveal/Animationen (T6–T7), Content-as-Data (T5,T10), alle 12 Startseiten-Sektionen (T11–T13), SEO/Metadata + sitemap/robots + Trailing-Slash (T1,T9,T13), Asset-Pipeline (T2), Verifikation + Codex-Loop (T13–T15). Produktseiten/restliche Seiten/Politur sind **bewusst Folge-Milestones** (eigene Pläne) — diese Spec-Teile deckt M1 nicht ab, das ist gewollt.
- **Platzhalter:** Foundation/Logik vollständig als Code; präsentationale Sektionen mit konkreter Struktur + verbindlicher Textquelle (JSON) statt erfundenem Text — kein „TODO/TBD".
- **Typ-Konsistenz:** `ProductCardData`/`NavItem` (T5) werden in Nav (T8) und ProductGrid (T11/T10) konsistent verwendet; `--font-metro` konsistent in T3/T4/T9; `company`/`mainNav`/`productSubmenu` einheitlich benannt.

---

## Nächste Milestones (eigene Pläne nach M1)

- **M2 — Produktseiten:** `produkte/` Übersicht + datengetriebene Detailseiten (`products.ts`), Breadcrumb, ProductDetailSection/Galerie/Lightbox, DownloadList, Anfrage-Step-1-UI, Ergänzungsprodukte-Raster, echte PDF-/Bild-URLs nachziehen.
- **M3 — Restliche Seiten:** Unternehmen (Fortschrittsbalken), Solarprojekte (Referenzgalerie+Lightbox), Jobs (Akkordeon), Bewerben (Formular), Kontakt (Formular+Maps-Platzhalter), Danke, Impressum, Datenschutzerklärung + Redirect `/datenschutz`.
- **M4 — Politur:** Animationsfeinschliff, A11y, Lighthouse-Performance, SEO-JSON-LD, finaler Original-Abgleich.
