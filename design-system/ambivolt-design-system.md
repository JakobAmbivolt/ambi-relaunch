# AmbiVolt Design-System — "Engineered Blueprint"

Wiederverwendbares, stack-neutrales Design-System für alle Web-Auftritte der AmbiVolt Energietechnik GmbH. Die Stilbasis ist `design-tokens.css` — reines CSS, ohne Tailwind- oder Framework-Abhängigkeit. Übertragbar auf WordPress, plain HTML oder jedes beliebige Framework.

---

## 1. Designidee / Markenhaltung

**"Engineered Blueprint"** — die Anmutung einer technischen Zeichnung. AmbiVolt baut Photovoltaik-Montagesysteme; die Marke spricht die Sprache von Präzision, Ingenieurskunst und Maßhaltigkeit. Das Design übersetzt das in:

- **Hairline-Rahmen** statt Schatten — 1px feine Linien zeichnen das Raster.
- **Blueprint-Raster** (56px-Gitter) als technisches Hintergrund-Motiv.
- **Mono-Font-Labels** (JetBrains Mono, Versalien, weite Sperrung) als „Beschriftungen einer Zeichnung".
- **Maßlinien** (MeasureLine), die sich wie ein Lineal von links aufzeichnen, mit Endpunkt-Tick.
- **Eck-Marken** (CornerTicks) wie Passermarken auf einem technischen Blatt.
- **Amber** (#dc9015) als einziger prägnanter Akzent, **Grün** (#268c45) sparsam für „fertig/Erfolg".
- **Scharfe Kanten** — `border-radius: 0` überall. Kein einziger runder Rahmen.

Haltung: nüchtern, präzise, weiß-dominant, technisch. Nichts Verspieltes, keine weichen Verläufe als Fläche, keine Schlagschatten als Hauptmittel.

---

## 2. Farben

Alle Tokens liegen in `:root` als CSS-Custom-Properties. Hex-/rgba-Werte exakt übernehmen, nichts runden.

| Token | Wert | Verwendung |
|---|---|---|
| `--color-white` | `#ffffff` | Haupt-Hintergrund (flächig dominant), Karten, weiße Schrift auf Amber/Slate |
| `--color-surface` | `#f9f9f9` | Off-White: abgesetzte helle Sektionen, Bildflächen, Hover-Flächen |
| `--color-slate-900` | `#2a2938` | Dunkle Flächen: Footer, CTA-Bänder, Effizienz-Band, Lightbox |
| `--color-slate-800` | `#303341` | Seltene dunkle Sekundärfläche (zweite Abstufung gegen slate-900) |
| `--color-amber` | `#dc9015` | **Primär-Akzent**: Buttons, Marquee-Fläche, Hairline-Ticks, Footer-Akzente, Scroll-Grundspur, Icons, `::selection` |
| `--color-amber-bright` | `#ef9109` | **Nur** Hover-/Text-Akzent von Amber — nie als Grundfläche |
| `--color-green` | `#268c45` | Sparsamer Zweit-Akzent: Check-Bullets, Scroll-Füllung, Fortschritt-Endfarbe, Erfolg/Abschluss |
| `--color-ink` | `#2a2938` | Typo-Rolle: Überschriften/dunkler Text auf hell (hex = slate-900, aber semantisch getrennt) |
| `--color-text` | `#525558` | Standard-Fließtextfarbe (body-Default) |
| `--color-blue` | `#2563eb` | **Reserviert** für Phase-2-Konfigurator-CTA — in Phase 1 NICHT verwenden |
| `--color-line` | `rgba(42,41,56,0.12)` | Hairline auf hell + Blueprint-Rasterlinien (hell) |
| `--color-line-dark` | `rgba(255,255,255,0.14)` | Hairline auf dunkel + Blueprint-Rasterlinien (dunkel) |

**Verbindliche Farb-Anteile (NICHT verändern):**

1. **Weiß** (`#ffffff`) — flächig dominant, der Grundton der Seite.
2. **Off-White** (`#f9f9f9`) — für abgesetzte helle Sektionen, klar untergeordnet.
3. **Slate-Dunkel** (`#2a2938`) — nur für wenige kräftige Blöcke (Hero-Kontrast, Footer, CTA-Bänder, Effizienz-Band).
4. **Amber** (`#dc9015`) — ausschließlich punktuell als Akzent.
5. **Grün** (`#268c45`) — noch sparsamer, nur Erfolg/Abschluss.

Die Palette ist **abgeschlossen** — keine weiteren Farben einführen. Schatten sind Slate-getönt (`rgba(42,41,56,…)`), nie reines Schwarz.

Häufig gebrauchte Alpha-Varianten als rgba: green/40 = `rgba(38,140,69,.40)`, green/10 = `rgba(38,140,69,.10)`, white/75 = `rgba(255,255,255,.75)`, white/45 = `rgba(255,255,255,.45)`, white/20 = `rgba(255,255,255,.20)`, white/10 = `rgba(255,255,255,.10)`, slate-900/25 = `rgba(42,41,56,.25)`, slate-900/30 = `rgba(42,41,56,.30)`.

---

## 3. Typografie

**Drei klar getrennte Rollen — niemals mischen:**

| Rolle | Font | CSS-Variable | Gewichte | Einsatz |
|---|---|---|---|---|
| Display | **Archivo** | `--font-display` | 500 / 600 / 700 / 800 | Headlines (h1/h2/h3), `.font-display` |
| Mono | **JetBrains Mono** | `--font-mono` | 400 / 500 / 700 | Labels, Kicker, Buttons, Nav, Specs, Zahlen |
| Body | **Inter Tight** | `--font-body` | 400 / 500 / 600 | Fließtext, Lead, Captions |

Fallback-Stacks: Display → `system-ui, sans-serif`; Mono → `ui-monospace, "SFMono-Regular", monospace`; Body → `system-ui, sans-serif`. `--font-sans` = Inter Tight (gleich wie Body).

**Gewichte sind strikt limitiert** auf die geladenen — keine anderen `font-weight`-Werte verwenden (sonst rendert der Browser synthetisches Fett/Mager).

**Typo-Skala (Variablen):** `--fs-2xs` 0.64rem · `--fs-xs` 0.75rem · `--fs-sm` 0.875rem · `--fs-base` 1rem · `--fs-lg` 1.125rem · `--fs-label` 0.72rem · `--fs-h3` 1.25rem · `--fs-h2` 1.875rem → `--fs-h2-md` 2.6rem → `--fs-h2-lg` 3rem · `--fs-h1` 2.25rem · `--fs-h1-hero-max` 5.5rem.

**Fluide Root-font-size:** `clamp(106%, 1rem + 0.2vw, 120%)` auf `html`. Skaliert Schrift UND alle rem-Abstände proportional (106% schmal, 120% ab ~1600px). Nicht auf feste px setzen — sonst skaliert das Layout nicht mit. Prozent respektiert die Browser-Schriftgröße des Nutzers (a11y).

**Laufweiten (verbindlich):**
- Display-Headlines: `letter-spacing: -0.02em` (über `.font-display`) — Teil der Marke, nie weglassen.
- Mono-Labels: immer Versalien mit positivem Tracking. Standard `.label-mono` = 0.18em / 0.72rem / Gewicht 500. Kontextabhängig variiert das Tracking bewusst: 0.10em–0.20em, Größe 0.60rem–0.80rem (Klassen `.mono-*`). Werte nicht vereinheitlichen.

Headlines brauchen `hyphens: auto` **und** `<html lang="de">`, sonst werden lange deutsche Komposita nicht getrennt. Body bleibt `antialiased` + `optimizeLegibility` + `overflow-wrap: break-word`.

---

## 4. Layout & Raster

**Container:** `.container` zentriert (`margin-inline: auto`), `max-width: var(--container-max)` = **1600px** (bewusst sehr breit). Horizontaler Innenabstand: **1.25rem** mobil, **2rem ab 768px** (md). Diese beiden Werte für alle Inhalte konsequent verwenden — gleiche linke/rechte Fluchtlinie über die ganze Seite.

**Blueprint-Raster:** `--grid-size` = **56px** (pixelfest, skaliert NICHT mit rem). Helle Variante `.blueprint` (`--color-line`) nur auf hellem Grund; dunkle Variante `.blueprint-dark` (`--color-line-dark`) nur auf `slate-900`. Nie direkt auf Inhaltselemente legen — als absolutes, klickdurchlässiges `.blueprint-layer`-Overlay (`opacity: .5`, `aria-hidden`) **hinter** dem Inhalt. Eltern-Sektion: `.section--blueprint` (`position: relative; overflow: hidden`), Inhalt `z-index: 10`.

**Abstands-Rhythmus (gestuft, keine Zwischenwerte):**
- `.section--lg` große Hauptsektionen: 6rem / md 8rem (py-24/py-32)
- `.section--secondary` Listen/Galerien: 5rem / md 7rem (py-20/py-28)
- `.section--detail` Detail/Innen-Hero: 4rem / md 6rem (py-16/py-24)

**Hairlines:** `--color-line` (hell) bzw. `--color-line-dark` (dunkel), immer 1px. Karten-Raster über `.hairline-grid` (gap 1px, Fugen = line, Kacheln = weiß/surface) statt Einzel-Borders — ergibt das durchgehende technische Raster. Keine dickeren/satteren Standardrahmen, keine vollopaken Trennlinien.

**Schatten:** extrem sparsam — nur `.exhibit` nutzt `--shadow-sm`, das Dropdown `--shadow-dropdown` (beide Slate-getönt). Das System lebt von Hairlines, nicht von Schlagschatten.

**Bildflächen:** standardmäßig `aspect-ratio: 4/3` mit `object-fit: contain` und Padding — Logos/Produktbilder nie beschneiden. Hochformat 3/4 ist die dokumentierte Ausnahme.

---

## 5. Signatur-Motive (die DNA)

| Motiv | Was es ist | Exakte Werte | CSS-Klasse | Braucht JS? |
|---|---|---|---|---|
| **Hairlines & scharfe Kanten** | 1px-Linien, `border-radius: 0` überall | `--color-line` rgba(42,41,56,.12) / dunkel rgba(255,255,255,.14) | `.hairline`, `.hairline-top/-bottom/-y`, `.hairline-dark` | Nein |
| **Blueprint-Raster** | technisches 56px-Gitter aus zwei Gradients | `background-size: 56px 56px` | `.blueprint`, `.blueprint-dark`, `.blueprint-layer` | Nein |
| **Mono-Labels** | technische Eyebrow/Kicker-Beschriftung | Versalien, Tracking 0.18em, 0.72rem, Gewicht 500 | `.label-mono`, `.mono-label`, `.mono-*` | Nein |
| **Maßlinie** | Amber-Linie zeichnet sich von links auf, Endpunkt-Tick blendet +0.7s ein | Linie h-px, Tick h-2.5/w-px, draw-x 0.9s `--ease-expo` | `.measure-line` (+ `__bar`/`__tick`, Breiten `--16/-20/-24/-28`) | Für Scroll-Trigger ja (IntersectionObserver → `.is-visible`); sonst `.measure-line--onload` |
| **Eck-Marken** | vier L-förmige Passermarken | h-4 w-4 (16px), 1px, `border-amber` | `.corner-ticks` (Markup: `<div class="corner-ticks"><i></i></div>`) | Nein |
| **Aurora** | weicher radialer Farb-Schimmer | size 40rem (Praxis 34–46rem), `blur(64px)`, opacity 0.10–0.22 (0.18 default), Kern bei 70% transparent | `.aurora`, `.aurora--amber`, `.aurora--green` | Nein (statisch); Parallax-Variante bräuchte JS |
| **Highlight-Marker** | gefüllte Box hinter Text, weiße Schrift | `box-decoration-clone`, padding 0.5rem 0.75rem 0.375rem, `line-height: 1` | `.highlight`, `.highlight--amber/-green/-muted` | Nein |
| **Scan-Sweep & Glow** | Lichtbalken läuft einmal durch + Amber-Glow-Halo | Sweep h-28 (7rem), via-amber/25, y -40%→140%, 1.7s ease-in-out delay 0.9s; Glow radial 58%58% at 62%42%, alpha .20 | `.scan-sweep`, `.hero-halo`, `.hero-float` | Nein (Mount-/Loop-Animation) |
| **Scroll-Fortschritt (amber→grün)** | fixe Top-Leiste: Amber-Grundspur, grüne Füllung wächst | fixed top, h-0.5 (2px), z-50, Spur amber, Füllung green | `.scroll-progress`, `.scroll-progress__fill` | **Ja** (JS setzt `--progress` 0..1; CSS-Näherung via `animation-timeline: scroll()`) |
| **Marquee-Band** | laufendes Amber-Band, Mono-Versalien, Slate-Schrift | bg-amber, py-3.5, text-slate-900, Tracking 0.18em, 6px-Punkt-Trenner, 28s linear infinite | `.marquee` (+ `__track`/`__item`/`__dot`) | Nein (CSS-@keyframes; Inhalt 2x für nahtlose -50%) |
| **Completion-Burst** | einmaliger „Fertig"-Funkeneffekt | 8 Anker, SPREAD 15px, Funke 3px, ~0.6s, Funken alternierend grün/amber, Umriss border-2, expandierender Glow | `.burst` (+ `__outline`/`__glow`/`__spark`/`__spark--amber`) | Trigger ja (Klasse beim Ereignis), Animation nein |

**Farbgesetz der Motive:** Amber ist die führende Signaturfarbe (MeasureLine, CornerTicks, Scan-Sweep, Halo, Marquee, `::selection`). Grün signalisiert Fortschritt/Abschluss (Scroll-Füllung, Completion-Burst, Check-Bullets).

**Standard-Stack:** MeasureLine kommt fast nie allein. Reihenfolge ist immer Mono-Eyebrow → Display-Headline → MeasureLine darunter. MeasureLine-Breite skaliert mit Wichtigkeit: 4rem Detail, 5rem Standard, 6rem Hero/CTA/Legal, 7rem Haupt-Hero.

---

## 6. Komponenten-Rezepte

### Buttons (3 Varianten)
Mono-Label (`text-xs`, Gewicht 500, uppercase, Tracking 0.16em), scharfe Kanten, führender Amber-Tick (0.375rem) via `::before`, der bei Hover auf `scale(1.5)` wächst.

```html
<a class="btn btn--primary" href="#">Angebot anfordern</a>
<a class="btn btn--secondary" href="#">Mehr erfahren</a>
<a class="btn btn--ghost" href="#">Kontakt</a>     <!-- auf dunklem Grund -->
<a class="btn btn--primary btn--compact" href="#">Kontakt</a>  <!-- Nav -->
```
- `.btn--primary`: Amber-Fläche, weiße Schrift, Hover → `amber-bright`.
- `.btn--secondary`: Slate-Outline (25%), Hover → volle Slate-Fläche + weiße Schrift.
- `.btn--ghost`: weiße Outline (25%), Hover → weiße Fläche + Slate-Schrift.

### Cards / "Plates"
Hairline-Kachel mit Bildbereich (4/3, `object-contain`, p-6), Mono-Tag oben links, Titel/Teaser/Footer. Hover-Signale: Bild `scale(1.06)`, Pfeil `translateX(0.25rem)`, „Mehr erfahren" wird amber, Amber-Messlinie zieht von w-0 auf w-full, Rahmen dunkler.

```html
<a class="card" href="#">
  <div class="card__media">
    <span class="card__tag">Montagesystem</span>
    <img class="card__img" src="…" alt="Flachdachsystem">
  </div>
  <div class="card__body">
    <h3 class="card__title">Flachdachsysteme</h3>
    <p class="card__teaser">Aerodynamische Systeme …</p>
    <div class="card__footer">
      <span class="card__more">Mehr erfahren</span>
      <svg class="card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
    </div>
  </div>
  <span class="card__rule" aria-hidden="true"></span>
</a>
```

### Section-Heading
Eyebrow (Mono-Label, Ton amber) → h2 (Display, responsiv 1.875→2.6→3rem, leading 1.05) → Maßlinie (mt-5, w-20).

```html
<div class="section-heading">
  <div class="section-heading__eyebrow">
    <span class="mono-label mono-label--amber">Produkte</span>
  </div>
  <h2 class="section-heading__title font-display">Montagesysteme für jede Dachform</h2>
  <span class="measure-line section-heading__measure measure-line--onload" aria-hidden="true">
    <span class="measure-line__bar"></span>
    <span class="measure-line__tick"></span>
  </span>
</div>
```
Für Sequenzen den Index-Strich nutzen: `<span class="mono-label__rule"></span>` (nur bei echter Nummerierung).

### Header / Nav
Sticky Glas-Header (`bg white/85` + `backdrop-blur 12px`) mit unterer Hairline; Nav-Links als Mono-Versalien mit Amber-Underline, die von links ausfährt; Dropdown mit Amber-Topborder + Slate-Schatten.

```html
<header class="site-header">
  <div class="container site-header__inner">
    <a href="/"><img src="logo.svg" alt="AmbiVolt" width="172" height="45"></a>
    <nav>
      <a class="nav-link nav-link--active" href="#">Produkte<span class="nav-link__rule"></span></a>
      <a class="nav-link" href="#">Unternehmen<span class="nav-link__rule"></span></a>
    </nav>
  </div>
</header>
```

### Footer / Marquee
Footer: Amber-Topborder + Slate-Fläche, Text in drei Helligkeiten (white/75 → white/45). Spalten-Headings in Amber-Mono. Marquee: Amber-Band, Slate-Schrift, Mono-Versalien, Inhalt 2x für nahtlose Schleife.

```html
<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    <div class="marquee__item"><span>6 Dachformen</span><i class="marquee__dot"></i></div>
    <!-- … Inhalt vollständig zweimal … -->
  </div>
</div>

<footer class="site-footer">
  <div class="container site-footer__grid">
    <div><h3 class="footer-col__heading">Produkte</h3>…</div>
  </div>
  <div class="site-footer__baseline">
    <div class="container">© 2026 AmbiVolt Energietechnik GmbH</div>
  </div>
</footer>
```

---

## 7. Motion

**Signatur-Ease:** `--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)` (Expo-Out) — für **alle** eingehenden Reveal-/Einblend-Animationen. Loops (Marquee, Float, Scan) nutzen bewusst `linear` bzw. `ease-in-out`, NICHT die Signatur-Ease.

| Preset | Werte | Klasse |
|---|---|---|
| **fadeUp** | opacity 0→1, y 24→0, 0.6s, `--ease-expo` | `.js-reveal` / `.anim-fade-up` |
| **fadeIn** | opacity 0→1, 0.7s | `.js-reveal--fade` / `.anim-fade-in` |
| **stagger** | staggerChildren 0.09s, delayChildren 0.05s | `.js-stagger` (nth-child Delays) |
| **staggerItem** | opacity 0→1, y 18→0, 0.55s | `.js-stagger > *` |
| **drawX** | scaleX 0→1, 0.9s, `transform-origin: left` | `.anim-draw-x` / `.measure-line` |

Reveals laufen einmalig (`once`, kein Re-Trigger beim Zurückscrollen), Trigger -80px vor Viewport-Rand (MeasureLine -60px) = `rootMargin` im IntersectionObserver. Y-Versatz bewusst klein (24px / 18px) — keine großen Slides.

**Gefederte Scroll-Motive (exakte Werte):** Der scroll-getriebene Fortschritt nutzt im Original eine Spring-Federung statt linearem Mapping. Wer 1:1 reproduzieren will, federt den Fortschrittswert mit diesen Parametern: **Scroll-Fortschritt** `stiffness 120 / damping 30 / mass 0.3` · **animierte Fortschrittsbalken** `stiffness 90 / damping 26 / mass 0.4` · **Prozess-Schritte** `stiffness 80 / damping 24 / mass 0.4`. Ohne Federung (reines CSS `animation-timeline: scroll()`) läuft es linear — visuell akzeptabel, nur etwas „technischer".

**Reduced-Motion:** Der `@media (prefers-reduced-motion: reduce)`-Block setzt alle Animationen/Transitions auf `0.01ms` (nicht 0 — damit `transitionend`/`animationend` noch feuern) und `scroll-behavior: auto`; Marquee wird statisch zentriert.

**No-JS-Reveal:** Jedes per Scroll eingeblendete Element trägt `.js-reveal`. Der `@media (scripting: none)`-Block macht diese Inhalte ohne JS sofort sichtbar (SEO-relevant).

---

## 8. Barrierefreiheit

- **Fokus:** sichtbarer Indikator über `:focus-visible` (2px Amber-Outline, 2px Offset).
- **prefers-reduced-motion:** globaler Entschärfungs-Block (siehe Motion). Bei eigenen scroll-getriebenen Effekten immer einen statischen Endzustand vorsehen.
- **scripting: none:** `.js-reveal`-Inhalte bleiben ohne JS sichtbar — kein verstecktes Inhalts-/SEO-Risiko.
- **Kontrast:** Body-Text `--color-text` (#525558) auf Weiß; Überschriften `--color-ink`. Auf Amber-Fläche weiße Schrift (Buttons/Highlight) ODER Slate-900 (Marquee) — beides bewusst kontraststark.
- **Alt / Hyphens:** Bilder mit `alt`; `<html lang="de">` aktiviert `hyphens: auto` an Headlines, `overflow-wrap: break-word` schützt vor Überlauf langer Komposita/URLs.
- **Dekoratives** (Aurora, Glow, Scan, Scroll-Progress, Maßlinien, Marquee) mit `aria-hidden="true"` auszeichnen.

---

## 9. Do's & Don'ts

**Do:**
- Weiß flächig dominant halten; Off-White nur für abgesetzte Sektionen; Slate-Dunkel nur für wenige kräftige Blöcke.
- Amber ausschließlich als punktueller Akzent; Grün noch sparsamer (nur Erfolg/Abschluss).
- Mono-Font nur für Labels, Kicker, Buttons, Nav, Specs — nie für Fließtext.
- Scharfe Kanten überall (`border-radius: 0`).
- Hairlines (1px, `--color-line` / `--color-line-dark`) als Standard-Trenner; Karten-Raster über `.hairline-grid`.
- Display-Headlines immer mit `letter-spacing: -0.02em`.
- Schatten Slate-getönt und extrem sparsam.

**Don't:**
- Keine runden Ecken einführen.
- Amber nicht inflationär als Fläche fluten; `amber-bright` nie als Grundfläche (nur Hover).
- Grün nicht als Button oder Großfläche.
- Mono-Font nicht für längere Texte verwenden.
- Keine vollopaken grauen Borders, keine breiten/schwarzen Schlagschatten.
- `--color-blue` in Phase 1 nicht zweckentfremden (für Konfigurator-CTA reserviert).
- Die fluide Root-font-size nicht durch feste px ersetzen.
- Das 56px-Raster nicht in rem umrechnen oder skalieren.

---

## 10. Übernahme-Anleitung (Schritt für Schritt)

1. **`design-tokens.css` global einbinden** — z. B. im Theme-Header oder per `<link rel="stylesheet" href="design-tokens.css">`. Sie enthält `:root`-Tokens, Basis-Regeln und alle Utility-Klassen.
2. **Drei Fonts laden** — Archivo (500/600/700/800), Inter Tight (400/500/600), JetBrains Mono (400/500/700), `display=swap`. Entweder der Google-Fonts-`@import`/`<link>` aus dem CSS-Kopf, oder (DSGVO-konform) lokal per `@font-face` hosten und `--font-archivo`/`--font-jbmono`/`--font-inter-tight` auf die lokalen Familien zeigen lassen.
3. **`<html lang="de">` setzen** — Voraussetzung für die Silbentrennung in Headlines.
4. **Plain HTML beachten:** Es gibt keinen Tailwind-Reset/Preflight. Browser-Default-Margins an `h1`–`h3`/`p` ggf. selbst auf 0 setzen, damit die Abstände stimmen.
5. **Klassen anwenden:** Inhalte in `.container` wickeln; Sektionen mit `.section--lg/-secondary/-detail` rhythmisieren; Buttons `.btn .btn--*`; Karten `.card`; Überschriften-Stack mit `.section-heading`/`.mono-label`/`.measure-line`; Footer/Header/Marquee als globale Templates.
6. **Blueprint-Raster pro Sektion:** ein leeres Element mit `.blueprint` bzw. `.blueprint-dark` + `.blueprint-layer` als erstes Kind einer `.section--blueprint` (relative, overflow:hidden), Inhalt mit `z-index: 10` darüber.
7. **JS-Motive (zusätzlich nötig):**
   - **Reveals** (`.js-reveal`, `.js-stagger`, `.measure-line`): kleines IntersectionObserver-Snippet, das beim Sichtbarwerden `.is-visible` setzt und danach `unobserve` aufruft (`rootMargin: '-80px'`, MeasureLine `'-60px'`). Ohne JS bleiben Inhalte dank `scripting: none`-Block sichtbar; alternativ `.measure-line--onload`/`.anim-*` für Animation beim Laden.
   - **Scroll-Progress:** JS setzt `--progress` (0..1) auf `.scroll-progress__fill`; oder `animation-timeline: scroll()` (verliert die Spring-Federung).
   - **Completion-Burst:** Klasse beim Auslöse-Ereignis hinzufügen; pro Funke `--left/--top/--dx/--dy` setzen, jeder 2. Funke `.burst__spark--amber`.
   - **Marquee/Float/Scan:** kein JS nötig — die `@keyframes` ersetzen den Framer-Loop 1:1 (Marquee-Inhalt 2x rendern).
8. **`backdrop-filter`-Fallback:** Der Header hat bereits eine solide `rgba(255,255,255,.85)`-Grundfarbe für Browser ohne Support.

**Beispiel-Markup einer typischen Sektion:**

```html
<section class="section--lg section--surface section--blueprint">
  <span class="blueprint blueprint-layer" aria-hidden="true"></span>
  <div class="container" style="position:relative; z-index:10">
    <div class="section-heading">
      <div class="section-heading__eyebrow">
        <span class="mono-label mono-label--amber">01</span>
        <span class="mono-label__rule"></span>
        <span class="mono-label mono-label--muted">Systeme</span>
      </div>
      <h2 class="section-heading__title font-display">Montagesysteme für jede Dachform</h2>
      <span class="measure-line section-heading__measure measure-line--onload" aria-hidden="true">
        <span class="measure-line__bar"></span>
        <span class="measure-line__tick"></span>
      </span>
    </div>
    <div class="hairline-grid" style="grid-template-columns:repeat(3,1fr); margin-top:2.5rem">
      <!-- .card-Elemente -->
    </div>
  </div>
</section>
```