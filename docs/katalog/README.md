# AmbiVolt Produktkatalog — Build-Pipeline

## AKTUELLE FASSUNG: Flyer-Katalog (Kundenwunsch 06.07.2026)

Der Katalog besteht aus Deckblatt + klickbarem Inhaltsverzeichnis (im Flyer-
Design) + den **9 Original-Flyern 1:1**, vereinheitlicht auf DIN A4:

```bash
node docs/katalog/build-flyer-katalog.mjs   # → katalog.pdf (20 Seiten, ~74 MB Originalqualität)
```

Das Skript leistet:
- **Reihenfolge & Metadaten** stehen in der `FLYER`-Liste (Reihenfolge frei
  änderbar; `qr` = Montagevideo-URL für die anklickbaren QR-Codes).
- **DIN-A4-Vereinheitlichung:** Flyer sind 216×303 mm (A4 + 3 mm Beschnitt);
  jede Flyerseite wird auf ihre `TrimBox` (= exakt A4) beschnitten, damit
  Deckblatt/TVZ (echtes A4) und Flyer gleich groß sind.
- **Anklickbare QR-Codes:** Auf den QR-Flyer-Titelseiten (V5, EcoPlus, Gründach,
  Eco) liegt ein URI-Link-Overlay über dem QR (`QR_RECT`, per Pixel-Analyse
  ermittelt) → führt direkt zum YouTube-Montagevideo.
- **TVZ-Links & Seitenzahlen:** GoTo-Links (feste Zeilengeometrie), Seitenzahl-
  Stempel ab Seite 2 (berücksichtigt den A4-MediaBox-Ursprung nach dem Crop).
- Vorspann (Deckblatt + TVZ) aus `vorspann.html` (weiß/orange Flyer-Design,
  Orange `#F39100`) via Edge gerendert. Schrift: **Switzer** (`fonts/switzer/`,
  ITF Free Font License) — eine der beiden Original-Flyer-Schriften; die
  Flyer-Hauptschrift Neutronic ist kommerziell (Adobe Fonts) und liegt nicht vor.
  Orange-Elemente sind schräg (Eck-Dreieck + schräges Fußband via `clip-path`).
- Neue/geänderte Flyer: Datei in `flyer-pdfs/` tauschen + `FLYER`-Eintrag pflegen.

**E-Mail-Version:** Master ist druckfein (~74 MB). Für E-Mail mit Ghostscript
auf ~13 MB bei 220 dpi (scharf, nicht pixelig):

```powershell
# WICHTIG (PowerShell 5.1): Argumente als Array + FORWARD-Slashes im Ausgabepfad.
# Der Stil `-sOutputFile="…\…pdf"` (Backslashes) wird von PS 5.1 verhackt →
# GS meldet dann "pdfwrite requires an output file but no file was specified".
$gs = "C:\Users\ambiv\ghostscript\bin\gswin64c.exe"
$gsArgs = @(
  '-sDEVICE=pdfwrite','-dCompatibilityLevel=1.7','-dPDFSETTINGS=/printer',
  '-dNOPAUSE','-dQUIET','-dBATCH','-dDetectDuplicateImages=true','-dDownsampleColorImages=true',
  '-dColorImageResolution=220','-dGrayImageResolution=220','-dMonoImageResolution=600','-dJPEGQ=90',
  '-sOutputFile=docs/katalog/katalog-email.pdf','docs/katalog/katalog.pdf'
)
& $gs @gsArgs   # vom Repo-Root ausführen
```
Richtwerte: 150 dpi ≈ 6 MB (etwas weich), **220 dpi ≈ 13 MB (empfohlen)**,
300 dpi ≈ 17 MB. Links (TVZ + QR) bleiben in allen Stufen erhalten (geprüft: 9
TVZ-GoTo + 4 QR = 13 Annots).

---

## Alternative (auf Eis): datengetriebener HTML-Katalog

Der frühere Ansatz (34 Seiten, Inhalte aus JSON, eigenes Layout) bleibt
funktionsfähig erhalten — falls später wieder ein redaktioneller Katalog
gewünscht ist. Er erzeugt ebenfalls `katalog.pdf` (überschreibt also die
Flyer-Fassung!).

## Dateien

| Datei | Zweck |
|---|---|
| `../research/katalog-kapitel-rohdaten.json` | **Quelldaten** (Agenten-Extraktion aus Flyern/Katalog/Broschüre/Website). |
| `assemble-daten.mjs` | Assembler: Rohdaten → `katalog-daten.json`. Enthält redaktionelle Patches (mit Drift-Assertions) und zieht Firmendaten kanonisch aus `src/content/company.ts`. |
| `katalog-daten.json` | **Generiert** — nicht von Hand editieren (wird vom Assembler überschrieben!). Inhalte ändern: Rohdaten bzw. Patches in `assemble-daten.mjs`. |
| `build-katalog.mjs` | Generator: `katalog-daten.json` → `katalog.html` (A4-Seiten, klickbares TVZ, QR-Codes als Inline-SVG). Flag `--final` blendet die Review-Marker aus. |
| `katalog.css` | Stylesheet (Markentokens aus `src/app/globals.css` gespiegelt). |
| `fonts/` | Lokal eingebettete Schriften (Archivo, Inter Tight, JetBrains Mono) — kein CDN beim Rendern. |
| `check-layout.mjs` | Deterministischer Layout-Check (Überläufe/Kollisionen) via Edge CDP. |
| `katalog.html` / `katalog.pdf` | **Generiert** — nicht von Hand editieren. |
| `material-bedarf.md` | Versandfertige Liste des noch fehlenden Materials. |

## Bauen

```bash
# 0. Einmalig: Abhängigkeiten (qrcode ist devDependency)
npm install

# 1. Daten assemblieren (überschreibt katalog-daten.json!)
node docs/katalog/assemble-daten.mjs

# 2. HTML erzeugen — Review-Fassung (mit gelben Quellen-Markern)
node docs/katalog/build-katalog.mjs
#    Kunden-Fassung ohne Marker:
node docs/katalog/build-katalog.mjs --final

# 3. Lokalen Static-Server starten (Repo-Root, Port 8321)
node -e "require('http').createServer((q,s)=>{const p=require('path').join('C:/Users/ambiv/ambi-relaunch',decodeURIComponent(q.url.split('?')[0]));require('fs').readFile(p,(e,d)=>{s.writeHead(e?404:200);s.end(d||'')})}).listen(8321)" &

# 4. Layout-Check (Pflicht-Gate): findet Überläufe & Kollisionen auf allen Seiten
node docs/katalog/check-layout.mjs   # Exit 0 = sauber; listet sonst Seite/Element/px

# 5. PDF rendern (Edge headless)
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu \
  --force-device-scale-factor=1 --no-pdf-header-footer \
  --print-to-pdf="C:\Users\ambiv\ambi-relaunch\docs\katalog\katalog.pdf" \
  "http://localhost:8321/docs/katalog/katalog.html"
```

Einzelseiten-Screenshot für Review: `katalog.html?only=N` (zeigt nur Seite N randlos).

## Layout-System

- **Layout A** (ganze Seite): Hauptsysteme mit Flyer-Inhalten — Hero-Bild, Badges,
  Feature-Sektionen, Technik-Tabelle, QR→Montagevideo, Foto-Leiste.
- **Layout B** (halbe Seite, 2/Seite): Systeme mit weniger Stoff — Bild + Kennwert-Kacheln,
  Bullets zweispaltig, Chips.
- **Layout C** (Viertelseite, 4/Seite): Komponenten/Kleinteile — Bild, Kurztext, Bullets.
- **Kapitel-Opener**: automatisch für jedes Kapitel mit Intro-Text (`opener`-Flag erzwingt ihn).

Die Zuordnung steht pro Produkt in `katalog-daten.json` (`layout: "A" | "B" | "C"`).

## Review-Marker

Produkte ohne aktuellen Flyer tragen `gapNote` (Quelle: alter Katalog/Broschüre/Website)
und werden sichtbar markiert. **Kundenfassung:** mit `--final` bauen — die Marker
verschwinden aus dem Rendering, die Daten bleiben unverändert.

## Quellen der Inhalte

- `docs/research/flyer-inhalte.json` — 9 Produkt-Flyer 2026 (wortgetreu extrahiert)
- `docs/research/katalog-2026-1-volltext.txt` — alter Gesamtkatalog („2025-1", 21 S.)
- `docs/research/broschuere-volltext.txt` — AmbiLight-Broschüre (Opti/Opti Plus, Vergleiche)
- `src/content/product-details.json` — Website-Produktdaten (Bilder, Videos)
- `src/content/company.ts` — kanonische Firmendaten (Kontakt)
