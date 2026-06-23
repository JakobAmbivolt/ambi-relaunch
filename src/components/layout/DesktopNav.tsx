"use client";
import Link from "next/link";
import { useState } from "react";
import { mainNav } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function DesktopNav() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  return (
    <nav className="hidden items-center gap-8 lg:flex" aria-label="Hauptnavigation">
      {mainNav.map((item) =>
        item.children ? (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => setOpenKey(item.href)}
            onMouseLeave={() => setOpenKey(null)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenKey(null); }}
            onKeyDown={(e) => { if (e.key === "Escape") setOpenKey(null); }}
          >
            <button
              className="flex items-center gap-1 py-2 text-sm font-medium text-ink hover:text-amber"
              aria-expanded={openKey === item.href}
              aria-haspopup="true"
              onFocus={() => setOpenKey(item.href)}
            >
              {item.label}<Icon name="chevron" className="h-4 w-4" />
            </button>
            {openKey === item.href && (
              <ul className="absolute left-0 top-full z-40 min-w-64 border-t-2 border-amber bg-white py-2 shadow-lg">
                {item.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="block px-5 py-2 text-sm text-text hover:bg-surface hover:text-amber">{c.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : item.label === "Kontakt" ? (
          <Button key={item.href} href={item.href} className="px-5 py-2">{item.label}</Button>
        ) : (
          <Link key={item.href} href={item.href} className="py-2 text-sm font-medium text-ink hover:text-amber">{item.label}</Link>
        )
      )}
    </nav>
  );
}
