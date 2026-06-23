"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { mainNav, productSubmenu } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape and autofocus close button
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus trap handler
  function handleOverlayKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>("a[href], button")
    ).filter((el) => !el.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} aria-label="Menü öffnen" className="p-2 text-ink">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
          className="fixed inset-0 z-50 bg-white"
          onKeyDown={handleOverlayKeyDown}
        >
          <div className="flex items-center justify-between border-b p-5">
            <span className="font-bold text-ink">Menü</span>
            <button
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              aria-label="Menü schließen"
              className="p-2 text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <ul className="flex flex-col p-5">
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.href}>
                  <button onClick={() => setProdOpen((v) => !v)} className="flex w-full items-center justify-between py-3 text-lg text-ink" aria-expanded={prodOpen}>
                    {item.label}<Icon name="chevron" className={`h-5 w-5 transition-transform ${prodOpen ? "rotate-180" : ""}`} />
                  </button>
                  {prodOpen && (
                    <ul className="ml-4 border-l border-surface pl-4">
                      {productSubmenu.map((c) => (
                        <li key={c.href}><Link href={c.href} onClick={() => setOpen(false)} className="block py-2 text-text">{c.label}</Link></li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-ink">{item.label}</Link></li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
