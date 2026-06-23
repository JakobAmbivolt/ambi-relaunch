import type { Metadata } from "next";
import { danke, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
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
        title={
          <Highlight color="amber">
            {danke.heroTitle ?? "Vielen Dank für Ihre Anfrage"}
          </Highlight>
        }
        align="center"
      />

      {/* Weitere Fragen */}
      {weitereFragen && (
        <section className="bg-white py-16 md:py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center flex flex-col gap-4">
              {weitereFragen.heading && (
                <h2 className="text-2xl font-bold text-ink md:text-3xl">
                  {weitereFragen.heading}
                </h2>
              )}
              {weitereFragen.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Kontakt & Öffnungszeiten */}
      <section className="bg-surface py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:max-w-2xl lg:mx-auto">
            <ContactInfo heading="Kontakt" />
            <OpeningHours />
          </div>
        </Container>
      </section>
    </>
  );
}
