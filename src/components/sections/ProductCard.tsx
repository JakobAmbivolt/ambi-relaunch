import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { ProductCardData } from "@/content/types";

// variant "plain"  = schlichte Karte (Startseite)
// variant "tagged" = oranger Titel-Tag + grüne Teaser-Box (wie Original /produkte)
export function ProductCard({
  product,
  variant = "plain",
}: {
  product: ProductCardData;
  variant?: "plain" | "tagged";
}) {
  const tagged = variant === "tagged";
  return (
    <Link
      href={product.href}
      className="group flex flex-col border border-slate-900/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={`relative h-44 w-full overflow-hidden ${tagged ? "bg-white" : "bg-surface"}`}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {tagged ? (
        <div className="flex flex-1 flex-col p-5">
          <h3 className="self-start bg-amber px-3 py-1.5 text-base font-semibold leading-tight text-white">
            {product.title}
          </h3>
          <p className="mt-3 flex-1 bg-green p-3 text-sm leading-snug text-white">{product.teaser}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink transition-all group-hover:gap-2">
            Mehr erfahren
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-ink">{product.title}</h3>
          <p className="mt-2 flex-1 text-sm text-text">{product.teaser}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber transition-all group-hover:gap-2">
            Mehr erfahren
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      )}
    </Link>
  );
}
