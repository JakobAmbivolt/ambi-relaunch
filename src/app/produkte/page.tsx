import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { PageHero } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/sections/ProductCard";
import { BeratungsCtaBand } from "@/components/sections/BeratungsCtaBand";
import { productCategories, produkteOverview } from "@/content/products";

export const metadata: Metadata = {
  title: "Produkte",
  description:
    "Photovoltaik-Montagesysteme von AmbiVolt für jede Dachform: Flachdach, Ziegel- & Steindach, Trapezblech, Falzblech, Welldach sowie Ergänzungsprodukte.",
};

export default function ProduktePage() {
  return (
    <>
      <PageHero
        bgImage="/images/hero-bg.jpg"
        align="center"
        eyebrow={produkteOverview.eyebrow}
        title={
          <>
            {produkteOverview.titleLine1}
            <br />
            {produkteOverview.titleLine2}
          </>
        }
      />

      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <ParallaxLayer from={70} to={-70}>
          <Aurora className="-right-40 top-1/4" color="amber" size="40rem" opacity={0.1} />
        </ParallaxLayer>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productCategories.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 0.08} className="h-full">
                <ProductCard product={product} variant="tagged" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <BeratungsCtaBand />
    </>
  );
}
