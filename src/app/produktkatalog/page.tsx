import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { BeratungsCtaBand } from "@/components/sections/BeratungsCtaBand";

// Statisches Asset in public/ — 13-MB-E-Mail-Version (Links im PDF bleiben erhalten).
const KATALOG_PDF = "/dokumente/AmbiVolt-Produktkatalog-2026.pdf";

export const metadata: Metadata = {
  title: "Produktkatalog",
  description:
    "Der AmbiVolt-Produktkatalog 2026 als PDF: neun Photovoltaik-Montagesysteme für jede Dachform — Ziegel-, Trapezblech-, Falzblech-, Flach-, Well- und Gründach. Zum Herunterladen oder direkt online durchblättern.",
};

export default function ProduktkatalogPage() {
  return (
    <>
      <PageHero
        align="center"
        eyebrow="Produktkatalog 2026"
        title={
          <>
            Alle Montage&shy;systeme
            <br />
            in einem Katalog
          </>
        }
      />

      {/* Intro: Cover-Vorschau + Kurztext + Download */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <Image
                src="/images/produktkatalog-cover.jpg"
                alt="Titelseite des AmbiVolt Produktkatalogs 2026"
                width={1240}
                height={1754}
                className="mx-auto h-auto w-full max-w-sm border border-line shadow-[0_24px_60px_-24px_rgba(42,41,56,0.35)]"
              />
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
                Neun Montagesysteme, ein Dokument
              </h2>
              <p className="mt-5 text-text leading-relaxed">
                Der komplette AmbiVolt-Produktkatalog bündelt alle neun Montagesysteme für
                Ziegel-, Blech-, Flach-, Well- und Gründächer — mit Technik, Vorteilen und
                anklickbaren Montagevideos. Als PDF zum Herunterladen oder direkt hier online
                zum Durchblättern.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button href={KATALOG_PDF} download>
                  Katalog herunterladen · PDF, 13 MB
                </Button>
                <a
                  href={KATALOG_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.12em] text-text underline-offset-4 transition-colors hover:text-amber hover:underline"
                >
                  Im neuen Tab öffnen
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Online blättern: browser-nativer PDF-Viewer */}
      <section className="border-t border-line bg-surface py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Online blättern" title="Katalog durchblättern" className="mb-10" />
          </Reveal>
          <Reveal delay={0.1}>
            <iframe
              src={KATALOG_PDF}
              title="AmbiVolt Produktkatalog 2026 — Vorschau"
              className="h-[78vh] min-h-[520px] w-full border border-line bg-white"
            />
            <p className="mt-4 text-sm text-text">
              Wird die Vorschau nicht angezeigt (z. B. auf manchen Smartphones), laden Sie den
              Katalog über den Button oben herunter oder öffnen ihn in einem neuen Tab.
            </p>
          </Reveal>
        </Container>
      </section>

      <BeratungsCtaBand />
    </>
  );
}
