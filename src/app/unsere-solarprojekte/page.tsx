import type { Metadata } from "next";
import { solarprojekte } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { ReferenceGallery } from "@/components/sections/ReferenceGallery";

export const metadata: Metadata = {
  title: solarprojekte.metaTitle,
  description: solarprojekte.metaDescription,
};

export default function SolarprojektePage() {
  return (
    <>
      <PageHero
        eyebrow="Referenzen"
        title={
          <>
            <Highlight color="amber">Ambivolt</Highlight>
          </>
        }
        bgImage="/images/hero-bg.jpg"
        align="center"
      >
        <p className="mt-4 text-lg font-medium text-white/90">Erfolgreiche Solarprojekte</p>
        <div className="mt-6">
          <Button href="#referenzen" variant="primary">
            Referenzen ansehen
          </Button>
        </div>
      </PageHero>

      {/* Intro */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <SectionHeading
            title="Erfolgreiche Solarprojekte"
            align="center"
          />
        </Container>
      </section>

      {/* Gallery */}
      {solarprojekte.projects && solarprojekte.projects.length > 0 && (
        <ReferenceGallery projects={solarprojekte.projects} />
      )}
    </>
  );
}
