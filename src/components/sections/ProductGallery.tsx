"use client";

import { useState } from "react";
import Image from "next/image";
import { CornerTicks } from "@/components/ui/CornerTicks";
import { Icon } from "@/components/ui/Icon";

// Durchklickbare Produkt-Galerie (Hauptbild + Pfeile + Thumbnails + Zähler),
// im Engineered-Stil. Bei nur einem Bild ohne Bedienelemente.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  const count = images.length;
  const current = Math.min(active, count - 1);
  const go = (dir: number) => setActive((a) => (a + dir + count) % count);

  return (
    <div>
      {/* Hauptbild */}
      <div className="relative border border-line bg-white p-4">
        <CornerTicks className="border-amber" />
        <div className="relative aspect-[5/3] w-full">
          <Image
            key={images[current]}
            src={images[current]}
            alt={count > 1 ? `${alt} — Bild ${current + 1} von ${count}` : alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Vorheriges Bild"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-white/90 text-ink transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Nächstes Bild"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-white/90 text-ink transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              <Icon name="arrow" className="h-4 w-4" />
            </button>
            <span className="absolute bottom-2 right-2 bg-slate-900/85 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white">
              {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Bild ${i + 1} anzeigen`}
              aria-current={i === current}
              className={`relative h-16 w-16 shrink-0 border bg-white transition-colors ${
                i === current ? "border-amber" : "border-line hover:border-slate-900/40"
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
