import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeasureLine } from "@/components/ui/MeasureLine";
import { CornerTicks } from "@/components/ui/CornerTicks";
import { descriptionParagraphs } from "@/content/productDetails";
import type { PdProduct } from "@/content/productDetails";

export function ProductDetailBlock({
  product,
  index,
  showInquiryCta,
}: {
  product: PdProduct;
  index: number;
  showInquiryCta: boolean;
}) {
  const isEven = index % 2 === 0;

  return (
    <section
      id={product.anchor}
      className={`scroll-mt-24 py-16 md:py-24 ${isEven ? "bg-white" : "bg-surface"}`}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Image column */}
          <div className={isEven ? "order-first" : "order-last lg:order-first"}>
            {product.image ? (
              <div className="relative border border-line bg-white p-4">
                <CornerTicks className="border-amber" />
                <Image
                  src={product.image}
                  alt={product.name}
                  width={1000}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            ) : null}
          </div>

          {/* Content column */}
          <div className={isEven ? "order-last" : "order-first lg:order-last"}>
            <Reveal>
              <div className="mb-4">
                <MonoLabel tone="amber" index={String(index + 1).padStart(2, "0")}>
                  System
                </MonoLabel>
              </div>

              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
                {product.name}
              </h2>
              <MeasureLine className="mt-4" width="w-16" />

              {product.subtitle && (
                <p className="mt-4 font-medium text-text">{product.subtitle}</p>
              )}

              {product.features.length > 0 && (
                <ul className="mt-5 mb-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {product.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-green/40 bg-green/10"
                        aria-hidden="true"
                      >
                        <Icon name="check" className="h-3.5 w-3.5 text-green" />
                      </span>
                      <span className="text-sm text-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="space-y-3">
                {descriptionParagraphs(product.description).map((para, i) => (
                  <p key={i} className="text-text">
                    {para}
                  </p>
                ))}
              </div>

              {showInquiryCta && (
                <div className="mt-7">
                  <Button href="#anfrage" variant="primary">
                    Jetzt Anfrage starten
                  </Button>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
