import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { homeProducts, homeProductsOutro } from "@/content/home";

export function ProductGrid() {
  return (
    <section id="produktpalette" className="relative overflow-hidden bg-white py-24 md:py-32">
      <ParallaxLayer from={70} to={-70}>
        <Aurora className="-right-40 top-1/3" color="amber" size="40rem" opacity={0.1} />
      </ParallaxLayer>

      <Container className="relative z-10">
        <Reveal>
          <SectionHeading
            eyebrow="Produktpalette · 6 Systeme"
            title="Montagesysteme für jede Dachform"
            className="mb-12 max-w-2xl"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homeProducts.map((product, i) => (
            <Reveal key={product.slug} delay={(i % 3) * 0.08} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-text">{homeProductsOutro}</p>
            <Button href="/produkte/" variant="secondary" className="w-full md:w-auto">
              Zur Produktübersicht
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
