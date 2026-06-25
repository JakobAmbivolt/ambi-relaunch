// Reine Consent-Logik (ohne React). Verwaltet die Einwilligung des Nutzers
// in Google Analytics: Lesen/Schreiben in localStorage, Versionierung (damit
// man bei geaenderter Datenschutz-Lage erneut fragen kann) und das Aufraeumen
// der GA-Cookies bei Widerruf.

export type ConsentDecision = "granted" | "denied";

// Oeffentliche GA4 Mess-ID. Steht ohnehin im ausgelieferten HTML, ist also
// kein Geheimnis. Per Umgebungsvariable ueberschreibbar (z. B. eigene ID je
// Umgebung), faellt sonst auf die feste Projekt-ID zurueck.
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID ?? "G-7X55K1M2J1";

export const CONSENT_STORAGE_KEY = "ambivolt-consent";

// Bei jeder relevanten Aenderung der Cookie-Kategorien erhoehen — alte
// Einwilligungen gelten dann als ungueltig und werden neu abgefragt.
export const CONSENT_VERSION = 1;

type StoredConsent = {
  v: number;
  decision: ConsentDecision;
  ts: number;
};

// Liefert die gespeicherte Entscheidung, oder null wenn keine (gueltige)
// vorliegt — dann soll der Banner erscheinen. Veraltete Version oder kaputte
// Daten werden bewusst als "keine Entscheidung" behandelt.
export function readConsent(): ConsentDecision | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (parsed.decision === "granted" || parsed.decision === "denied") {
      return parsed.decision;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeConsent(decision: ConsentDecision): void {
  if (typeof localStorage === "undefined") return;
  const record: StoredConsent = {
    v: CONSENT_VERSION,
    decision,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage kann blockiert sein (Privatmodus o. Ae.) — dann eben nicht
    // persistieren; der Banner erscheint beim naechsten Mal erneut.
  }
}

// Loescht die von Google Analytics gesetzten Cookies (_ga, _ga_*, _gid, _gat).
// Best effort: deckt aktuelle Seite (path=/) und die registrierbare Domain ab.
// Wirksamster Schutz nach Widerruf bleibt das ga-disable-Flag im GA-Loader.
export function clearGaCookies(): void {
  if (typeof document === "undefined") return;

  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim() ?? "")
    .filter(
      (name) => name === "_gid" || name === "_gat" || name.startsWith("_ga"),
    );

  const host = typeof location !== "undefined" ? location.hostname : "";
  // Nur bei echten Domains eine domain=-Variante setzen; auf "localhost"
  // (kein Punkt) sind Domain-Cookies ohnehin nicht moeglich.
  const baseDomain = host.includes(".") ? host.replace(/^www\./, "") : "";

  for (const name of names) {
    document.cookie = `${name}=; max-age=0; path=/`;
    if (baseDomain) {
      document.cookie = `${name}=; max-age=0; path=/; domain=.${baseDomain}`;
    }
  }
}

// --- Store-Anbindung für useSyncExternalStore -------------------------------
// Erlaubt React, den Consent-Status direkt aus localStorage zu lesen (ohne
// Hydration-Flackern) und auf Änderungen zu reagieren — auch tabübergreifend.

const listeners = new Set<() => void>();

export function subscribeConsent(callback: () => void): () => void {
  listeners.add(callback);
  // Änderungen in anderen Tabs spiegeln (storage-Event feuert nur dort).
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getConsentSnapshot(): ConsentDecision | null {
  return readConsent();
}

// Nach einer Entscheidung im aktuellen Tab aufrufen, damit React neu rendert.
export function notifyConsentChange(): void {
  for (const callback of listeners) callback();
}
