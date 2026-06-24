"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
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
    <section id="anfrage" className="bg-surface py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Angebot anfordern"
            title={title}
            align="center"
          />
          <p className="mx-auto mt-6 max-w-2xl text-center text-text">
            Für welche Produkte möchten Sie ein Angebot erhalten? (Mehrfachauswahl möglich)
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => {
              const isSelected = selected.has(product.name);
              return (
                <button
                  key={product.name}
                  type="button"
                  onClick={() => toggle(product.name)}
                  className={`relative flex cursor-pointer flex-col items-center gap-3 bg-white p-4 text-center transition-colors ${
                    isSelected ? "bg-amber/5" : "hover:bg-surface"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 border transition-colors ${
                      isSelected ? "border-amber" : "border-transparent"
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center border border-green/40 bg-green/10">
                      <Icon name="check" className="h-3.5 w-3.5 text-green" />
                    </span>
                  )}
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
                  <span className="font-display text-sm font-bold text-ink">
                    {product.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

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

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Button href="/kontakt/" variant="primary">
              Weiter
            </Button>
            <p className="font-mono text-xs uppercase tracking-wide text-text/70">
              Der mehrstufige Konfigurator folgt in Kürze – oder nehmen Sie direkt Kontakt auf.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
