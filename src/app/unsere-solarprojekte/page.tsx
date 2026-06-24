import type { Metadata } from "next";
import { solarprojekte } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { ReferenceGallery } from "@/components/sections/ReferenceGallery";

export const metadata: Metadata = {
  title: solarprojekte.metaTitle,
  description: solarprojekte.metaDescription,
};

export default function SolarprojektePage() {
  return (
    <>
      <PageHero eyebrow="Referenzen" title="Ambivolt" bgImage="/images/hero-bg.jpg" align="center">
        <p className="mt-4 font-mono text-sm uppercase tracking-wide text-text">
          Erfolgreiche Solarprojekte
        </p>
        <div className="mt-6">
          <Button href="#referenzen" variant="primary">
            Referenzen ansehen
          </Button>
        </div>
      </PageHero>

      {/* Intro */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Projekte"
              title="Erfolgreiche Solarprojekte"
              align="center"
            />
          </Reveal>
        </Container>
      </section>

      {/* Gallery */}
      {solarprojekte.projects && solarprojekte.projects.length > 0 && (
        <ReferenceGallery projects={solarprojekte.projects} />
      )}
    </>
  );
}
