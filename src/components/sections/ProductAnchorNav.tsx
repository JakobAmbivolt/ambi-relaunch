import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function ProductAnchorNav({
  products,
  hasDownloads = false,
}: {
  products: { name: string; anchor: string; image: string | null }[];
  hasDownloads?: boolean;
}) {
  return (
    <div className="border-b bg-white py-8">
      <Container>
        <div className="flex flex-wrap justify-center gap-4">
          {products.map((p) => (
            <a
              key={p.anchor}
              href={`#${p.anchor}`}
              className="flex flex-col items-center gap-2 rounded border border-slate-900/10 px-3 py-2 text-center transition-colors hover:border-amber hover:text-amber"
            >
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  width={120}
                  height={80}
                  className="h-14 w-24 object-contain"
                />
              ) : (
                <div className="h-14 w-24 bg-surface" />
              )}
              <span className="max-w-[120px] text-xs font-medium text-ink leading-tight">
                {p.name}
              </span>
            </a>
          ))}

          {hasDownloads && (
            <a
              href="#downloads"
              className="flex flex-col items-center gap-2 rounded border border-slate-900/10 px-3 py-2 text-center transition-colors hover:border-amber hover:text-amber"
            >
              {/* Info-Icon */}
              <svg
                className="h-14 w-14 text-amber"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span className="max-w-[120px] text-xs font-medium text-ink leading-tight">
                Infos &amp; Downloads
              </span>
            </a>
          )}
        </div>
      </Container>
    </div>
  );
}
