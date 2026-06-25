"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { mainNav, productSubmenu } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === pathname || (href !== "/" && pathname.startsWith(href));

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
      <button
        onClick={() => setOpen(true)}
        aria-label="Menü öffnen"
        className="p-2 text-ink transition-colors hover:text-amber"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
          className="fixed inset-0 z-50 flex flex-col bg-white"
          onKeyDown={handleOverlayKeyDown}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-text">Menü</span>
            <button
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              aria-label="Menü schließen"
              className="p-2 text-ink transition-colors hover:text-amber"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-1 flex-col overflow-y-auto px-5">
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.href} className="border-b border-line">
                  <button
                    onClick={() => setProdOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-3 py-4 font-mono text-sm uppercase tracking-[0.12em] text-ink"
                    aria-expanded={prodOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 ${isActive(item.href) ? "bg-amber" : "bg-line"}`}
                      />
                      {item.label}
                    </span>
                    <Icon
                      name="chevron"
                      className={`h-5 w-5 text-text transition-transform ${prodOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {prodOpen && (
                    <ul className="border-l border-line pb-3 pl-[1.45rem]">
                      {productSubmenu.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={() => setOpen(false)}
                            aria-current={pathname === c.href ? "page" : undefined}
                            className={`block py-2.5 text-sm transition-colors ${
                              pathname === c.href ? "text-amber" : "text-text hover:text-ink"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center gap-3 py-4 font-mono text-sm uppercase tracking-[0.12em] transition-colors ${
                      isActive(item.href) ? "text-amber" : "text-ink hover:text-amber"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 ${isActive(item.href) ? "bg-amber" : "bg-line"}`}
                    />
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="border-t border-line px-5 py-6 font-mono text-xs uppercase tracking-[0.1em] text-text">
            <a href={company.phoneHref} className="block py-1 transition-colors hover:text-amber">
              {company.phoneDisplay}
            </a>
            <a href={`mailto:${company.email}`} className="block py-1 transition-colors hover:text-amber">
              {company.email}
            </a>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
