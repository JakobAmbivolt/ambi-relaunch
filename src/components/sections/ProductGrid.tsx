import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { homeProductsIntro, homeProducts, homeProductsOutro } from "@/content/home";

export function ProductGrid() {
  return (
    <section id="produktpalette" className="py-16 md:py-24 bg-white">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={homeProductsIntro.eyebrow}
            title={homeProductsIntro.title}
            align="center"
            className="mb-10"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {homeProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 text-center space-y-4 max-w-3xl mx-auto">
            {homeProductsOutro.map((para, i) => (
              <p key={i} className="text-text">
                {para}
              </p>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href="/produkte/" variant="secondary">
              Zur Produktübersicht
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
