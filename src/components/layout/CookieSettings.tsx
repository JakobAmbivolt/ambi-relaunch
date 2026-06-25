"use client";

import { useConsent } from "./ConsentProvider";

// Footer-Link „Cookie-Einstellungen": blendet das Einwilligungs-Band erneut
// ein, damit Nutzer ihre Entscheidung jederzeit ändern oder widerrufen können
// (DSGVO-Pflicht). Die eigentliche Auswahl trifft der Banner (CookieConsent).
export function CookieSettings() {
  const { reopen } = useConsent();

  return (
    <button
      type="button"
      onClick={reopen}
      className="cursor-pointer text-left transition-colors hover:text-amber"
    >
      Cookie-Einstellungen
    </button>
  );
}
