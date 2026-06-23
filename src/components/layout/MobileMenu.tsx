"use client";
import Link from "next/link";
import { useState } from "react";
import { mainNav, productSubmenu } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} aria-label="Menü öffnen" className="p-2 text-ink">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between border-b p-5">
            <span className="font-bold text-ink">Menü</span>
            <button onClick={() => setOpen(false)} aria-label="Menü schließen" className="p-2 text-ink">
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
