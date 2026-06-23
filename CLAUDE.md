@AGENTS.md

# ambi-relaunch — Projektanweisungen für Claude

Diese Datei gilt **immer** und hat Vorrang vor Standardverhalten. Bei jeder Aufgabe in diesem Projekt zuerst hier reinschauen.

## Worum es geht

Wir bauen die bestehende WordPress-Website von **AmbiVolt Energietechnik GmbH** komplett neu und **vereinen zwei Seiten in einer**:

1. **ambivolt.de** — Marketing-/Produktseite (B2B, Photovoltaik-Montagesysteme). Stark SEO-getrieben.
2. **angebot.ambivolt.de** — interaktiver **Angebots-Konfigurator** ("In 2 Minuten zum Angebot"), mehrstufiger Funnel mit Lead-Erfassung.

AmbiVolt ist Hersteller von PV-Montagesystemen für verschiedene Dachformen (Flachdach, Ziegel-/Steindach, Trapezblech, Falzblech, Welldach) plus Ergänzungsprodukte.

## Reihenfolge / Umfang

1. **Phase 1 (aktuell):** Marketing-Seite **originalgetreu nachbauen** — Landingpage, Produkt-/Infoseiten, Unternehmen, Solarprojekte, Jobs/Bewerbung, Kontakt, rechtliche Seiten. Inhalte vorerst direkt im Code (noch kein CMS).
2. **Phase 2:** Angebots-Konfigurator (der wichtige interaktive Teil) nachbauen, inkl. Lead-Erfassung + E-Mail.
3. **Phase 3:** Einfaches CMS (Empfehlung: Sanity) anbinden, damit der Kunde Inhalte selbst pflegen kann.

YAGNI: Keine Features bauen, die nicht gebraucht werden. Erst 1:1 nachbauen, dann verbessern.

## Wie ich (Claude) hier arbeiten soll — WICHTIG

- **Kein Ja-Sager.** Nicht zu allem "ja, gute Idee" sagen. Wenn ein Vorschlag des Users technisch/fachlich fragwürdig ist, ehrlich widersprechen und begründen. Lieber sachlich Kontra geben als blind zustimmen.
- **Immer eine klare Empfehlung geben**, keine neutrale Auflistung ohne Standpunkt. Die empfohlene Option zuerst nennen und begründen.
- **Auf Deutsch kommunizieren**, in verständlicher Sprache. Fachbegriffe erklären, nicht mit Jargon überfahren — der User ist nicht tief technisch.
- **Selbst entscheiden und umsetzen** statt unnötig nachzufragen. Nur bei echten, nicht-umkehrbaren Weichen (z. B. öffentlicher Repo-Name, Datenschutz/Hosting) kurz rückfragen.
- Ehrlich über Ergebnisse berichten: Wenn etwas nicht funktioniert, das klar sagen.

## Tech-Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** fürs Styling
- `src/`-Verzeichnis, Import-Alias `@/*`
- Paketmanager: **npm**
- Konfigurator-Backend später: Next.js Server Actions + DB + E-Mail-Dienst (z. B. Resend)
- Hosting: noch offen — **DSGVO/Datenstandort bewusst entscheiden** (EU-Region), bevor live gegangen wird.

## ACHTUNG: Next.js 16 / React 19

Das ist eine sehr neue Next.js-Version mit Änderungen gegenüber älteren Konventionen (siehe `AGENTS.md`). **Vor dem Schreiben von Next.js-Code** die relevanten Docs unter `node_modules/next/dist/docs/` lesen — nicht blind aus dem Gedächtnis coden. Deprecation-Hinweise beachten.

## Konventionen

- Komponenten in `src/components/`, Seiten als Routen unter `src/app/`.
- Wiederverwendbare Inhalte (Produktdaten, Texte) strukturiert ablegen, damit der spätere CMS-Umzug leicht ist.
- Bestehende Patterns im Code befolgen; Stil des umgebenden Codes übernehmen.
- Kleine, fokussierte Dateien. Wenn eine Datei zu groß wird, ist das ein Signal zum Aufteilen.
- Originaltexte/SEO-Inhalte der alten Seite möglichst übernehmen (Suchmaschinen-Rankings nicht verlieren).

## Quellen (Original-Website)

Alte Seiten als Referenz für den Nachbau:

- `https://ambivolt.de` — Startseite
- `https://ambivolt.de/produkte` (+ Unterseiten: flachdachsysteme, ziegel-und-steindachsysteme, trapezblechsysteme, falzblechsysteme, welldachsysteme, ergaenzungsprodukte-photovoltaik)
- `https://ambivolt.de/unternehmen`
- `https://ambivolt.de/unsere-solarprojekte`
- `https://ambivolt.de/jobs-und-stellenangebote` + `/jetzt-bewerben`
- `https://ambivolt.de/kontakt` (+ `/danke-fuer-ihre-anfrage`)
- `https://angebot.ambivolt.de` — Angebots-Konfigurator (Phase 2)

Firma: AmbiVolt Energietechnik GmbH, Oberalmsham 1, 84140 Gangkofen · Tel. 08722 – 966 85 77 · anfrage@ambivolt.de
