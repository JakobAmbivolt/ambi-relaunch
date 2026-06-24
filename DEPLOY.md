# Deployment — AmbiVolt Website (Strato)

Die Seite ist ein **Next.js-Projekt, das als statische Website exportiert** und auf
das **Strato-Webhosting** hochgeladen wird. Das Kontaktformular verschickt per
`kontakt.php` (PHP `mail()`) — läuft nur auf dem Strato-Server, nicht lokal.

## 1. Statische Seite bauen

Im Projektordner ausführen:

```bash
npm install        # nur beim ersten Mal / nach Updates nötig
npm run build
```

Danach liegt die fertige Website im Ordner **`out/`**.

## 2. Auf Strato hochladen

Den **gesamten Inhalt** des Ordners `out/` in das Web-Verzeichnis der Domain laden
(per FTP, z. B. FileZilla, oder über den Strato-Dateimanager).

> **Wichtig:**
> - Im FTP-Programm **„versteckte Dateien anzeigen"** aktivieren, damit die Datei
>   **`.htaccess`** mit hochgeladen wird (sie enthält die Weiterleitung von
>   `/datenschutz` und die 404-Seite).
> - Die Datei **`kontakt.php`** muss ebenfalls mit hoch (steuert den Mailversand).
> - Vorhandene alte Dateien im Zielverzeichnis ggf. vorher sichern/entfernen.

## 3. Kontaktformular

- Empfänger der Anfragen: **anfrage@ambivolt.de** (in `kontakt.php` und im
  Formular hinterlegt).
- PHP muss für die Domain aktiv sein (bei Strato Standard).
- Nach dem Upload **einmal testen**: Formular ausfüllen, absenden, Postfach prüfen
  (beim ersten Mal auch den **Spam-Ordner** checken).
- Falls keine Mail ankommt: Strato-PHP-Mail-Einstellungen prüfen bzw. ob das
  Postfach `anfrage@ambivolt.de` auf dem Strato-Konto existiert.

## 4. Inhalte ändern & neu deployen

Inhalte/Code anpassen → erneut `npm run build` → `out/` wieder hochladen.

Wichtige Inhalts-Dateien liegen unter `src/content/` (Texte, Navigation,
Firmendaten). Dokumente/PDFs unter `public/dokumente/`.

## Lokale Vorschau

```bash
npm run dev
```

→ http://localhost:3000 (bzw. 3001, falls 3000 belegt). PHP läuft hier **nicht**;
das Kontaktformular zeigt lokal eine „Versand nicht möglich"-Meldung — das ist
normal und funktioniert erst live auf Strato.
