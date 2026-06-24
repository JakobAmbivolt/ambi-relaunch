import type { Metadata } from "next";
import { kontakt, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfo } from "@/components/ui/ContactInfo";
import { OpeningHours } from "@/components/ui/OpeningHours";
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
        title={kontakt.heroTitle}
        bgImage="/images/hero-bg.jpg"
      />

      {/* Formular + Kontakt-Sidebar — direkt nach dem Seitenkopf */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
            {/* Left: form */}
            <Reveal>
              <span className="mb-5 block h-10 w-0.5 bg-amber" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold text-ink">Nachricht senden</h2>
              <p className="mt-2 text-text">Wir setzen uns umgehend mit Ihnen in Verbindung.</p>
              <p className="mb-6 mt-6 font-mono text-xs uppercase tracking-[0.12em] text-text">
                Felder mit <span className="text-amber">*</span> sind Pflichtfelder
              </p>
              <ContactForm />
            </Reveal>

            {/* Right: contact info */}
            <Reveal delay={0.1}>
              <span className="mb-5 block h-10 w-0.5 bg-amber" aria-hidden="true" />
              <div className="flex flex-col gap-9">
                <ContactInfo heading="Kontakt" />
                <OpeningHours />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Intro-Text — jetzt unter dem Formular */}
      {intro && (
        <section className="bg-surface py-20 md:py-28">
          <Container>
            <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              {intro.heading && (
                <SectionHeading title={decodeHtml(intro.heading)} align="center" />
              )}
              {intro.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}
