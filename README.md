# ambi-relaunch

Neubau und Vereinigung der Websites **ambivolt.de** (Marketing-/Produktseite) und
**angebot.ambivolt.de** (Angebots-Konfigurator) der AmbiVolt Energietechnik GmbH —
weg von WordPress, hin zu einer modernen, gemeinsamen Codebasis.

> Codename des Projekts. Bezug zur Marke AmbiVolt; offizielle Domain bleibt ambivolt.de.

## Tech-Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- `src/`-Layout, Import-Alias `@/*`, Paketmanager npm

## Entwicklung

```bash
npm install      # einmalig
npm run dev      # Dev-Server auf http://localhost:3000
npm run build    # Produktions-Build
npm run lint     # Linting
```

## Status / Roadmap

- [ ] **Phase 1:** Marketing-Seite originalgetreu nachbauen (Landingpage, Produkte, Unternehmen, Solarprojekte, Jobs, Kontakt)
- [ ] **Phase 2:** Angebots-Konfigurator inkl. Lead-Erfassung
- [ ] **Phase 3:** CMS-Anbindung (geplant: Sanity) zur eigenständigen Inhaltspflege

Details und Arbeitsregeln: siehe [`CLAUDE.md`](./CLAUDE.md).
