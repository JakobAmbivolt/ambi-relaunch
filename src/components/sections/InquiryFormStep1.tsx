"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { PdInquiry } from "@/content/productDetails";

export function InquiryFormStep1({
  title,
  products,
}: {
  title: string;
  products: PdInquiry[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <section id="anfrage" className="bg-[#f1f1f4] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-5 md:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">{title}</h2>
          <p className="mt-3 text-text">
            Für welche Produkte möchten Sie ein Angebot erhalten? (Mehrfachauswahl möglich)
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => {
            const isSelected = selected.has(product.name);
            return (
              <button
                key={product.name}
                type="button"
                onClick={() => toggle(product.name)}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded border-2 bg-white p-4 text-center transition-all ${
                  isSelected
                    ? "border-amber ring-2 ring-amber"
                    : "border-slate-900/10 hover:border-amber/50"
                }`}
                aria-pressed={isSelected}
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={240}
                    height={160}
                    sizes="(max-width: 640px) 45vw, 240px"
                    className="h-28 w-full object-contain"
                  />
                ) : (
                  <div className="h-28 w-full bg-surface" />
                )}
                <span className="text-sm font-semibold text-ink">
                  {product.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Honeypot — verstecktes Anti-Spam-Feld */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hp-field">
            Falls Sie menschlich sind, lassen sie dieses Feld leer.
          </label>
          <input
            id="hp-field"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button href="/kontakt/" variant="primary">
            Weiter
          </Button>
          <p className="text-sm text-text/70">
            Der mehrstufige Konfigurator folgt in Kürze – oder nehmen Sie direkt Kontakt auf.
          </p>
        </div>
      </div>
    </section>
  );
}
