import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
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
      className={`scroll-mt-24 py-14 md:py-20 ${isEven ? "bg-white" : "bg-surface"}`}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Image column */}
          <div className={isEven ? "order-first" : "order-last lg:order-first"}>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={1000}
                height={600}
                className="h-auto w-full object-contain"
              />
            ) : null}
          </div>

          {/* Content column */}
          <div className={isEven ? "order-last" : "order-first lg:order-last"}>
            <Reveal>
              <h2 className="text-2xl font-bold text-ink md:text-3xl">
                {product.name}
              </h2>
              <span className="mt-2 mb-3 block h-1 w-12 bg-amber" />

              {product.subtitle && (
                <p className="mb-4 font-medium text-text">{product.subtitle}</p>
              )}

              {product.features.length > 0 && (
                <ul className="mb-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {product.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Icon
                        name="check"
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-green"
                      />
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
                <div className="mt-6">
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
