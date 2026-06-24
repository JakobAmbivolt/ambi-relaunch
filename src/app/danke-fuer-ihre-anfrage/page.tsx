import type { Metadata } from "next";
import { danke, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfo } from "@/components/ui/ContactInfo";
import { OpeningHours } from "@/components/ui/OpeningHours";

export const metadata: Metadata = {
  title: "Vielen Dank für Ihre Anfrage",
  robots: { index: false, follow: true },
};

export default function DankePage() {
  const weitereFragen = section(danke, "weitere-fragen");

  return (
    <>
      <PageHero
        eyebrow={danke.heroEyebrow ?? "Wir freuen uns!"}
        title={danke.heroTitle ?? "Vielen Dank für Ihre Anfrage"}
        align="center"
      />

      {/* Weitere Fragen */}
      {weitereFragen && (
        <section className="bg-white py-20 md:py-28">
          <Container>
            <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              {weitereFragen.heading && (
                <SectionHeading title={weitereFragen.heading} align="center" />
              )}
              {weitereFragen.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
            </Reveal>
          </Container>
        </section>
      )}

      {/* Kontakt & Öffnungszeiten */}
      <section className="bg-surface py-20 md:py-28">
        <Container>
          <Reveal className="mx-auto grid grid-cols-1 gap-12 sm:grid-cols-2 lg:max-w-2xl">
            <ContactInfo heading="Kontakt" />
            <OpeningHours />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
