import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { ErgItem } from "@/content/productDetails";

export function ErgaenzungGrid({ items }: { items: ErgItem[] }) {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Passendes Zubehör"
            title="Ergänzungsprodukte"
            align="center"
            className="mb-12"
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.href} delay={(i % 4) * 0.06} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full flex-col items-center gap-3 bg-white p-5 text-center transition-colors hover:bg-surface"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={200}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-32 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-32 w-full bg-surface" />
                )}
                <span className="font-display text-sm font-semibold text-ink transition-colors group-hover:text-amber">
                  {item.name}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
