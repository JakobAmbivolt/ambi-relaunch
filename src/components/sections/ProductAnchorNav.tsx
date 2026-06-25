import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Reveal } from "@/components/ui/Reveal";

export function ProductAnchorNav({
  products,
  hasDownloads = false,
}: {
  products: { name: string; anchor: string; image: string | null }[];
  hasDownloads?: boolean;
}) {
  return (
    <div className="border-b border-line bg-white py-8">
      <Container>
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <MonoLabel tone="muted" index="00">
              Im Überblick
            </MonoLabel>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {products.map((p) => (
              <a
                key={p.anchor}
                href={`#${p.anchor}`}
                className="group flex flex-col items-center gap-2 border border-line bg-white px-3 py-3 text-center transition-colors hover:border-amber"
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={120}
                    height={80}
                    sizes="120px"
                    className="h-14 w-24 object-contain"
                  />
                ) : (
                  <div className="h-14 w-24 bg-surface" />
                )}
                <span className="max-w-[120px] font-mono text-[0.7rem] uppercase tracking-[0.12em] leading-tight text-ink transition-colors group-hover:text-amber">
                  {p.name}
                </span>
              </a>
            ))}

            {hasDownloads && (
              <a
                href="#downloads"
                className="group flex flex-col items-center gap-2 border border-line bg-white px-3 py-3 text-center transition-colors hover:border-amber"
              >
                {/* Info-Icon */}
                <svg
                  className="h-14 w-14 text-amber"
                  viewBox="0 0 24 24"
                  width="56"
                  height="56"
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
                <span className="max-w-[120px] font-mono text-[0.7rem] uppercase tracking-[0.12em] leading-tight text-ink transition-colors group-hover:text-amber">
                  Infos &amp; Downloads
                </span>
              </a>
            )}
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
