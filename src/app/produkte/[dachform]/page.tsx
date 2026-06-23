import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductPage, productSlugs, ergGrid } from "@/content/productDetails";
import { Highlight } from "@/components/ui/Highlight";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHero } from "@/components/sections/PageHero";
import { BeratungsCtaBand } from "@/components/sections/BeratungsCtaBand";
import { ProductDetailBlock } from "@/components/sections/ProductDetailBlock";
import { InquiryFormStep1 } from "@/components/sections/InquiryFormStep1";
import { DownloadList } from "@/components/sections/DownloadList";
import { ErgaenzungGrid } from "@/components/sections/ErgaenzungGrid";
import { ProductAnchorNav } from "@/components/sections/ProductAnchorNav";

export function generateStaticParams() {
  return productSlugs.map((dachform) => ({ dachform }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dachform: string }>;
}): Promise<Metadata> {
  const { dachform } = await params;
  const page = getProductPage(dachform);
  if (!page) return {};

  const title =
    page.metaTitle ||
    (page.slug === "ergaenzungsprodukte-photovoltaik"
      ? "Ergänzungsprodukte"
      : page.category);
  const description =
    page.metaDescription ||
    (page.slug === "ergaenzungsprodukte-photovoltaik"
      ? "Profile, Klemmen, Verbinder und Zubehör für AmbiVolt Photovoltaik-Montagesysteme."
      : undefined);

  return { title, description };
}

export default async function DachformPage({
  params,
}: {
  params: Promise<{ dachform: string }>;
}) {
  const { dachform } = await params;
  const page = getProductPage(dachform);
  if (!page) return notFound();

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        bgImage="/images/hero-bg.jpg"
        align="left"
        eyebrow={page.heroEyebrow}
        title={<Highlight color="amber">{page.heroTitle}</Highlight>}
      >
        {page.intro && (
          <p className="mt-6 max-w-2xl text-lg text-white/80">{page.intro}</p>
        )}
        {page.inquiry.length > 0 && (
          <div className="mt-8">
            <Button href="#anfrage" variant="primary">
              Jetzt Anfrage starten
            </Button>
          </div>
        )}
      </PageHero>

      {/* 2. Breadcrumb */}
      <div className="border-b border-slate-900/10 bg-white py-3">
        <Container>
          <Breadcrumb
            items={[
              { label: "Produkte", href: "/produkte/" },
              { label: page.breadcrumb },
            ]}
          />
        </Container>
      </div>

      {/* 3. Anchor Nav */}
      <ProductAnchorNav
        products={page.products.map((p) => ({
          name: p.name,
          anchor: p.anchor,
          image: p.image,
        }))}
        hasDownloads={page.pageDownloads.length > 0}
      />

      {/* 4. Product Detail Blocks */}
      {page.products.map((product, i) => (
        <ProductDetailBlock
          key={product.anchor}
          product={product}
          index={i}
          showInquiryCta={page.inquiry.length > 0}
        />
      ))}

      {/* 5. Inquiry Form Step 1 */}
      {page.inquiry.length > 0 && (
        <InquiryFormStep1 title={page.inquiryTitle} products={page.inquiry} />
      )}

      {/* 6. Downloads */}
      {page.pageDownloads.length > 0 && (
        <div id="downloads" className="scroll-mt-24">
          <DownloadList downloads={page.pageDownloads} />
        </div>
      )}

      {/* 7. Ergänzungs-Grid */}
      {page.hasErgGrid && <ErgaenzungGrid items={ergGrid} />}

      {/* 8. Beratungs-CTA */}
      <BeratungsCtaBand />
    </>
  );
}
