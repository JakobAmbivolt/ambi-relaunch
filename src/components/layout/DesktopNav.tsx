"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mainNav } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

const linkBase =
  "group relative py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors";

// Amber-Messlinie unter dem Reiter: aktiv = ausgefahren, sonst beim Hover.
function MeasureUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left bg-amber transition-transform duration-300 ease-out ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const isActive = (href: string) =>
    href === pathname || (href !== "/" && pathname.startsWith(href));

  return (
    <nav className="hidden items-center gap-8 lg:flex" aria-label="Hauptnavigation">
      {mainNav.map((item) => {
        const active = isActive(item.href);

        if (item.children) {
          const open = openKey === item.href;
          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenKey(item.href)}
              onMouseLeave={() => setOpenKey(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenKey(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpenKey(null);
              }}
            >
              <button
                className={`inline-flex items-center gap-1.5 ${linkBase} ${
                  active || open ? "text-amber" : "text-ink hover:text-amber"
                }`}
                aria-expanded={open}
                aria-haspopup="true"
                onFocus={() => setOpenKey(item.href)}
              >
                {item.label}
                <Icon
                  name="chevron"
                  className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
                <MeasureUnderline active={active || open} />
              </button>

              {open && (
                <ul className="absolute left-0 top-full z-40 min-w-[17rem] border border-line border-t-2 border-t-amber bg-white py-2 shadow-[0_16px_44px_-16px_rgba(42,41,56,0.22)]">
                  <li className="px-5 pb-2 pt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-amber">
                    Montagesysteme
                  </li>
                  {item.children.map((c) => {
                    const subActive = pathname === c.href;
                    return (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          aria-current={subActive ? "page" : undefined}
                          className={`group/i flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors ${
                            subActive ? "text-amber" : "text-text hover:bg-surface hover:text-ink"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`h-1 w-1 shrink-0 transition-colors ${
                              subActive ? "bg-amber" : "bg-line group-hover/i:bg-amber"
                            }`}
                          />
                          {c.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        }

        if (item.label === "Kontakt") {
          return (
            <Button key={item.href} href={item.href} className="px-5 py-3">
              {item.label}
            </Button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center ${linkBase} ${
              active ? "text-amber" : "text-ink hover:text-amber"
            }`}
          >
            {item.label}
            <MeasureUnderline active={active} />
          </Link>
        );
      })}
    </nav>
  );
}
