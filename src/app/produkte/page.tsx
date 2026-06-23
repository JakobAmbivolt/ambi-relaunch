import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
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

      <section className="bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productCategories.map((product) => (
                <ProductCard key={product.slug} product={product} variant="tagged" />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <BeratungsCtaBand />
    </>
  );
}
