import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ErgItem } from "@/content/productDetails";

export function ErgaenzungGrid({ items }: { items: ErgItem[] }) {
  return (
    <section className="bg-surface py-16">
      <Container>
        <SectionHeading
          title="Ergänzungsprodukte"
          align="center"
          className="mb-10"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-3 rounded border border-slate-900/10 bg-white p-4 text-center transition-shadow hover:shadow-md"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="h-32 w-full object-contain"
                />
              ) : (
                <div className="h-32 w-full bg-surface" />
              )}
              <span className="text-sm font-semibold text-ink">{item.name}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
