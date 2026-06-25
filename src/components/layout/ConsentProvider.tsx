"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  clearGaCookies,
  getConsentSnapshot,
  notifyConsentChange,
  subscribeConsent,
  writeConsent,
  type ConsentDecision,
} from "@/lib/consent";

type ConsentContextValue = {
  // Aktuelle Entscheidung des Nutzers — null = noch nicht entschieden.
  consent: ConsentDecision | null;
  // Soll das Einwilligungs-Band sichtbar sein?
  isBannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  // Band erneut einblenden (Footer-Link „Cookie-Einstellungen") — erlaubt
  // jederzeitigen Widerruf bzw. Änderung der Einwilligung (DSGVO).
  reopen: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

// Erkennt, ob die Hydration abgeschlossen ist — ohne setState im Effekt.
// Server liefert false, Client nach dem ersten Render true. So blitzt das
// Band bei wiederkehrenden Besuchern nicht kurz auf.
const noopSubscribe = () => () => {};

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    () => null,
  );
  const isHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [manuallyOpen, setManuallyOpen] = useState(false);

  const accept = useCallback(() => {
    writeConsent("granted");
    notifyConsentChange();
    setManuallyOpen(false);
  }, []);

  const reject = useCallback(() => {
    writeConsent("denied");
    clearGaCookies();
    notifyConsentChange();
    setManuallyOpen(false);
  }, []);

  const reopen = useCallback(() => setManuallyOpen(true), []);

  const isBannerOpen = isHydrated && (manuallyOpen || consent === null);

  const value = useMemo<ConsentContextValue>(
    () => ({ consent, isBannerOpen, accept, reject, reopen }),
    [consent, isBannerOpen, accept, reject, reopen],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error(
      "useConsent muss innerhalb von <ConsentProvider> genutzt werden.",
    );
  }
  return ctx;
}
