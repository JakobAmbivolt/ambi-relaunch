# Handoff — AmbiVolt Produktkatalog (Stand 07.07.2026)

Kopiere den Abschnitt **„Prompt für die nächste Session"** unten in die neue
Session. Der Rest dokumentiert den genauen Stand.

---

## Prompt für die nächste Session

> Du arbeitest am Projekt **ambi-relaunch** (`c:\Users\ambiv\ambi-relaunch`),
> Branch `feature/redesign-bold`. Aktuelle Aufgabe ist der **AmbiVolt
> Produktkatalog** unter `docs/katalog/`.
>
> **Aktueller Deliverable = Flyer-Fassung.** Der Katalog besteht aus einem
> selbstgebauten **Deckblatt + Inhaltsverzeichnis** und den **9 Original-Flyern
> 1:1** (unverändert eingebettet), vereinheitlicht auf DIN A4, mit Seitenzahlen
> und anklickbaren Montagevideo-QR-Codes. Erzeugt von
> **`docs/katalog/build-flyer-katalog.mjs`** → `docs/katalog/katalog.pdf`.
>
> Bau- und Pflegehinweise stehen in `docs/katalog/README.md` und
> `docs/katalog/HANDOFF.md` (diese Datei). **Vor jeder Änderung dort reinschauen.**
> Es gibt außerdem einen älteren, datengetriebenen HTML-Katalog (siehe unten) —
> der ist **stillgelegt** und darf `katalog.pdf` nicht überschreiben.
>
> Beachte die Projektregeln in `CLAUDE.md`/`AGENTS.md`: auf Deutsch, ehrlich
> gegenrede statt Ja-Sagen, nach jeder Antwort Obsidian-Session-Notiz schreiben,
> nach jeder Coding-Aufgabe einen Review-Loop fahren (Codex-CLI funktioniert
> nicht — siehe unten; Ersatz ist der `/code-review`-Workflow).

---

## Was der Katalog aktuell ist

- **20 Seiten:** Deckblatt (S.1) + Inhaltsverzeichnis (S.2) + 9 Flyer à 2 Seiten
  (S.3–20). Alles **DIN A4** (Flyer sind 216×303 mm = A4 + 3 mm Beschnitt und
  werden auf ihre TrimBox = exakt A4 beschnitten).
- **Kapitel-Reihenfolge** (Kundenvorgabe): AmbiHook V5, AmbiHook V6, AmbiLight
  EcoPlus, AmbiLight Gründach, AmbiLight Eco, AmbiNano+AmbiU, AmbiMicro,
  Stockschraube, AmbiTop.
- **Klickbares Inhaltsverzeichnis** (GoTo-Links zu den Flyer-Startseiten).
- **Anklickbare Montagevideo-QR-Codes** auf V5, EcoPlus, Eco, Gründach
  (URI-Link-Overlay exakt über dem QR). V6 hat keinen QR (dort Wind-Symbol).
  Video-URLs stehen als `VIDEO`-Objekt im Skript (YouTube-Shorts).
- **Seitenzahlen** ab Seite 2 (dunkler Kreis unten rechts).
- **Design von Deckblatt + TVZ** an die Flyer angeglichen: weiß/orange
  (Flyer-Orange `#F39100`), Schrift **Switzer** (siehe Fonts), oranger Keil oben
  (**dick links → dünn rechts**, läuft rechts nicht auf 0 aus), oranges Fußband
  unten mit schräger Oberkante (**dünn links → dick rechts**) — beide Balken
  laufen in **Flyer-Richtung** (an echten Flyern S.1/2 pixelweise vermessen:
  oben Δ≈27 px, Fußband Δ≈39 px, Original ≈44 px). Claim „SCHNELL MONTIERT,
  DAUERHAFT STARK!" direkt unter dem Titel.

## Zwei Ausgabedateien (beide in `C:\Users\ambiv\Downloads`)

| Datei | Größe | Zweck |
|---|---|---|
| `AmbiVolt-Katalog-2026-02-DRUCK-74MB.pdf` | ~74 MB | Druck/USB/Cloud, Flyer 1:1 volle Auflösung |
| `AmbiVolt-Katalog-2026-02-EMAIL-13MB.pdf` | ~13 MB | E-Mail, Bilder auf 220 dpi (scharf), Links erhalten |

Die Master-Datei im Repo ist `docs/katalog/katalog.pdf`; die E-Mail-Version wird
per Ghostscript daraus erzeugt (`katalog-email.pdf`).

## Bauen

```powershell
# 1. Katalog bauen (Master, ~74 MB) → docs/katalog/katalog.pdf
node docs/katalog/build-flyer-katalog.mjs

# 2. E-Mail-Version (~13 MB) via Ghostscript — Array + FORWARD-Slashes (Pflicht!)
$gs = "C:\Users\ambiv\ghostscript\bin\gswin64c.exe"
$gsArgs = @(
  '-sDEVICE=pdfwrite','-dCompatibilityLevel=1.7','-dPDFSETTINGS=/printer',
  '-dNOPAUSE','-dQUIET','-dBATCH','-dDetectDuplicateImages=true','-dDownsampleColorImages=true',
  '-dColorImageResolution=220','-dGrayImageResolution=220','-dMonoImageResolution=600','-dJPEGQ=90',
  '-sOutputFile=docs/katalog/katalog-email.pdf','docs/katalog/katalog.pdf'
)
& $gs @gsArgs

# 3. Liefer-Dateien nach Downloads spiegeln
Copy-Item docs/katalog/katalog.pdf       "$env:USERPROFILE\Downloads\AmbiVolt-Katalog-2026-02-DRUCK-74MB.pdf" -Force
Copy-Item docs/katalog/katalog-email.pdf "$env:USERPROFILE\Downloads\AmbiVolt-Katalog-2026-02-EMAIL-13MB.pdf"   -Force
```
**PowerShell 5.1:** GS-Argumente als **Array mit Forward-Slashes** übergeben.
`-sOutputFile="…\…pdf"` (Backslashes) wird verhackt → „pdfwrite requires an
output file but no file was specified" (hier 3× reproduziert). Git-Bash scheidet
ebenfalls aus (verhackt `/printer`). Visuelle Kontrolle einzelner Seiten: GS
`-sDEVICE=png16m -r110 -dFirstPage=N -dLastPage=N -o "pfad\seite-%d.png"` → PNG
mit Read anschauen (`-o` funktioniert, `-sOutputFile=` nur als Array/Forward-Slash).

## Installierte Werkzeuge / Abhängigkeiten

- **Ghostscript 10.04.0** lokal unter `C:\Users\ambiv\ghostscript\` (kein Admin;
  per Artifex-Installer /S installiert). Für PDF-Kompression.
- **pdf-lib** und **qrcode** als devDependencies in `package.json`.
- **Switzer**-Schrift (Fontshare, ITF Free Font License) in
  `docs/katalog/fonts/switzer/` (6 woff2 + FFL.txt + switzer.css).
- **Edge headless** rendert den Vorspann (`vorspann.html` → `vorspann.pdf`).

## Wichtige Dateien in `docs/katalog/`

- `build-flyer-katalog.mjs` — **der aktive Generator** (Flyer-Fassung).
- `flyer-pdfs/01-…09-*.pdf` — die 9 Original-Flyer (Dateinamen ≠ Reihenfolge!
  Die Reihenfolge steckt in der `FLYER`-Liste im Skript).
- `fonts/switzer/` — Switzer-Schrift + Lizenz.
- `README.md` — Bau-Doku (Flyer-Fassung + Kompressionsbefehl).
- `material-bedarf.md` — **veraltet** (bezog sich auf den alten Katalog).
- `katalog.pdf`, `katalog-email.pdf`, `vorspann.html/.pdf` — generiert.

### Was im Git-Repo liegt (und was nicht)

**Versioniert** (auf GitHub): die Bau-Skripte (`*.mjs`, `katalog.css`), die Doku
(`*.md`) und die Schrift (`fonts/`). Damit ist der Bau reproduzierbar — bis auf
die Input-Flyer (s. u.).

**Nur lokal** (per `.gitignore` ausgeschlossen, zu groß/generiert, separat
sichern!): die **Original-Flyer `flyer-pdfs/`** (~75 MB, Input des Generators —
ohne sie lässt sich der Katalog NICHT neu bauen), die fertigen `*.pdf`
(`katalog.pdf` ~75 MB, `katalog-email.pdf` ~13 MB, `vorspann.pdf`), die
generierten `*.html`, `previews/` und `katalog-daten.json`. Die für die Website
ausgelieferte Katalog-PDF liegt separat unter `public/dokumente/` (die ist im Repo).

## Offene Punkte / mögliche nächste Wünsche

1. **Schriftart:** Die Flyer-Hauptschrift ist **Neutronic** (kommerziell,
   Hypertype/Adobe Fonts) — nicht legal einbettbar und nicht auf dem System.
   Ersatzweise **Switzer** (frei, ebenfalls eine Flyer-Schrift, optisch nah).
   Falls exakter Neutronic-Look gewünscht: Kunde hat Adobe-Fonts-Lizenz →
   Neutronic-Dateien liefern lassen, dann in `switzer.css`/Skript tauschen.
2. **Design Deckblatt/TVZ:** zuletzt mehrfach nach Flyer-Vorbild justiert
   (Schrift, schräge Orange-Balken, unterer Bereich aufgeräumt). Nächste
   Rückmeldung des Kunden abwarten und ggf. Feinjustage (Winkel/Größe der
   Orange-Elemente sind Parameter im `.topwedge`/`.footer`-clip-path).
3. **E-Mail-Größe:** 13 MB passt in die meisten Postfächer; bei strengeren
   Limits kleinere Stufe möglich (150 dpi ≈ 6 MB, aber weicher).
4. **Cover-Hero-Bild:** aktuell Gründach-Render (`gd-ow.png`). Wunschmotiv?
5. **Druck:** falls Druckerei statt digital → CMYK/Beschnitt-Vorgaben klären.

## Stillgelegt: der alte, datengetriebene HTML-Katalog

Früher gebaut, jetzt **überholt** durch die Flyer-Fassung. Dateien noch da:
`build-katalog.mjs`, `assemble-daten.mjs`, `katalog.css`, `check-layout.mjs`,
`katalog-daten.json` (+ Rohdaten in `docs/research/`). **Achtung:** dieser
Generator schreibt ebenfalls `katalog.pdf` — also NICHT versehentlich laufen
lassen, sonst wird die Flyer-Fassung überschrieben. Nur reaktivieren, wenn der
Kunde ausdrücklich wieder einen redaktionell gesetzten Katalog will.

## Prozess-Notizen

- **Obsidian-Log** ist Pflicht nach jeder Antwort:
  `C:\Users\ambiv\Documents\Obsidian Vault\Claude Sessions\YYYY-MM-DD.md`
  (anhängen). Die Historie dieses Katalogs steht in den `2026-07-06.md`- und
  `2026-07-07.md`-Notizen — dort ist jede Iteration dokumentiert.
- **Review-Loop:** Der in `CLAUDE.md` geforderte `/codex:*`-Loop ist NICHT
  nutzbar (Codex-CLI vorhanden, aber das ChatGPT-Konto hat keinen Modellzugriff
  → jedes Modell liefert 400 „not supported"). Ersatz: der `/code-review`-Skill
  bzw. eigene Review-Workflows (Finder-Winkel → Verify → Sweep). Zuletzt liefen
  mehrere Runden über `build-flyer-katalog.mjs` sauber (0 Findings); die letzte
  kleine CSS-Änderung (Claim nach oben, Fußband kleiner) ist visuell geprüft,
  aber noch nicht formal reviewt.
- **Firmendaten** kanonisch aus `src/content/company.ts` (Kontakt/Telefon).
