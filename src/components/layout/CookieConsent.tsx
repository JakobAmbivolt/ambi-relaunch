"use client";

import Link from "next/link";
import { useConsent } from "./ConsentProvider";

// Eigenes Einwilligungs-Band (kein Drittanbieter). Dezentes Band am unteren
// Rand, blockiert die Seite nicht. „Ablehnen" und „Akzeptieren" sind bewusst
// gleichwertig gestaltet (DSGVO: keine Dark Patterns). Google Analytics lädt
// erst nach „Akzeptieren" — siehe GoogleAnalytics.tsx.
export function CookieConsent() {
  const { isBannerOpen, accept, reject } = useConsent();

  if (!isBannerOpen) return null;

  return (
    <section
      aria-label="Hinweis zu Cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-t-amber border-line bg-white/95 shadow-[0_-12px_40px_-20px_rgba(42,41,56,0.45)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <div className="flex-1 text-sm leading-relaxed text-text">
          <p className="font-display text-base font-bold text-ink">
            Wir nutzen Cookies
          </p>
          <p className="mt-1">
            Technisch notwendige Cookies sind für den Betrieb der Seite immer
            aktiv. Mit „Akzeptieren“ erlauben Sie zusätzlich anonyme
            Reichweitenmessung über Google Analytics. Details und Widerruf in
            unserer{" "}
            <Link
              href="/datenschutzerklaerung/"
              className="text-amber underline-offset-2 hover:underline"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={reject}
            className="flex-1 cursor-pointer border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink/40 hover:bg-surface sm:flex-none"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 cursor-pointer bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-amber-bright sm:flex-none"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </section>
  );
}
