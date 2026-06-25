"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/consent";
import { useConsent } from "./ConsentProvider";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// In der lokalen Entwicklung kein echtes Tracking — sonst verfälschen
// Test-Aufrufe die Statistik. Lädt nur im Production-Build.
const isProduction = process.env.NODE_ENV === "production";

// Lädt Google Analytics 4 ausschließlich nach erteilter Einwilligung („Hard
// Block"): ohne „Akzeptieren" wird kein gtag-Skript eingebunden und kein
// Cookie gesetzt. Seitenaufrufe werden auch bei clientseitigen Routenwechseln
// gemeldet (App Router lädt die Seite nicht neu).
export function GoogleAnalytics() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const enabled =
    consent === "granted" && isProduction && Boolean(GA_MEASUREMENT_ID);

  // Offizielles GA-Opt-out-Flag. Greift sofort — auch wenn gtag in dieser
  // Sitzung bereits geladen wurde und der Nutzer später widerruft.
  useEffect(() => {
    const key = `ga-disable-${GA_MEASUREMENT_ID}`;
    (window as unknown as Record<string, boolean>)[key] = consent !== "granted";
  }, [consent]);

  // Den ersten page_view sendet das config-Tag selbst; dieser Effekt meldet
  // nur die nachfolgenden Routenwechsel, um Doppelzählungen zu vermeiden.
  const skipFirst = useRef(true);
  useEffect(() => {
    if (!enabled) {
      skipFirst.current = true;
      return;
    }
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    // gtag ist nach dem Init-Script vorhanden. Im seltenen Fall, dass gtag.js
    // beim ersten Routenwechsel noch lädt, wird dieser eine Seitenaufruf nicht
    // gemeldet — bewusst in Kauf genommen (kein Datenschutz-, nur ein minimaler
    // Tracking-Genauigkeitsaspekt).
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* GA4 anonymisiert IP-Adressen standardmäßig — kein Zusatzparameter nötig. */}
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
