import type { Metadata } from "next";
import { kontakt, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfo } from "@/components/ui/ContactInfo";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { MapPlaceholder } from "@/components/sections/MapPlaceholder";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: kontakt.metaTitle,
  description: kontakt.metaDescription,
};

function decodeHtml(str: string) {
  return str.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
}

export default function KontaktPage() {
  const intro = section(kontakt, "intro");

  return (
    <>
      <PageHero
        eyebrow={kontakt.heroEyebrow}
        title={<Highlight color="amber">{kontakt.heroTitle}</Highlight>}
        bgImage="/images/hero-bg.jpg"
      />

      {/* Intro */}
      {intro && (
        <section className="bg-surface py-12 md:py-16">
          <Container>
            <div className="mx-auto max-w-2xl text-center flex flex-col gap-4">
              {intro.heading && (
                <h2 className="text-2xl font-bold text-ink md:text-3xl">
                  {decodeHtml(intro.heading)}
                </h2>
              )}
              {intro.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Main: form + contact sidebar */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
            {/* Left: form */}
            <div>
              <h2 className="mb-2 text-2xl font-bold text-ink">Nachricht senden</h2>
              <p className="mb-6 text-sm text-text">Felder mit * sind Pflichtfelder</p>
              <ContactForm />
            </div>

            {/* Right: contact info */}
            <div className="flex flex-col gap-8">
              <ContactInfo heading="Kontakt" />
              <OpeningHours />
              <MapPlaceholder />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
