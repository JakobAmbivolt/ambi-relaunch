"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

// Klickbarer Cookie-Einstellungen-Dialog. Phase 1: nur technisch notwendige
// Cookies, daher nichts zu konfigurieren — der Dialog erklärt das ehrlich.
// Hier landen später die echten Consent-Optionen, falls Tracking dazukommt.
export function CookieSettings() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-left transition-colors hover:text-amber"
      >
        Cookie-Einstellungen
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
          >
            <div
              className="absolute inset-0 bg-slate-900/70"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-md border border-line border-t-2 border-t-amber bg-white p-7 text-text shadow-[0_24px_60px_-20px_rgba(42,41,56,0.5)]">
              <h2
                id="cookie-dialog-title"
                className="font-display text-xl font-bold text-ink"
              >
                Cookie-Einstellungen
              </h2>
              <p className="mt-4 text-sm leading-relaxed">
                Diese Website verwendet ausschließlich technisch notwendige
                Cookies, die für den Betrieb der Seite erforderlich sind. Es
                werden keine Tracking- oder Marketing-Cookies gesetzt — daher
                gibt es derzeit nichts zu konfigurieren.
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                Mehr dazu in unserer{" "}
                <Link
                  href="/datenschutzerklaerung/"
                  className="text-amber underline-offset-2 hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Datenschutzerklärung
                </Link>
                .
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-amber-bright"
              >
                Verstanden
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
