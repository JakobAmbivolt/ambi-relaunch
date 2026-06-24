import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { ProductCardData } from "@/content/types";

// Engineered-"Plate": Hairline-Rahmen, Mono-Tag, Amber-Linie zieht beim Hover auf.
export function ProductCard({
  product,
}: {
  product: ProductCardData;
  variant?: "plain" | "tagged";
}) {
  return (
    <Link
      href={product.href}
      className="group relative flex h-full flex-col border border-line bg-white transition-colors duration-300 hover:border-slate-900/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-surface">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text">
          Montagesystem
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold leading-tight text-ink">{product.title}</h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-text">{product.teaser}</p>
        <div className="mt-6 flex items-center justify-between">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-amber">
            Mehr erfahren
          </span>
          <Icon
            name="arrow"
            className="h-4 w-4 text-ink transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber"
          />
        </div>
      </div>

      {/* Amber-Messlinie zieht beim Hover über die volle Breite */}
      <span
        className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber transition-[width] duration-300 ease-out group-hover:w-full"
        aria-hidden="true"
      />
    </Link>
  );
}
