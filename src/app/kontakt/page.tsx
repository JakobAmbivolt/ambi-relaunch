import type { Metadata } from "next";
import Image from "next/image";
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
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative w-[120px] shrink-0 border border-line bg-white p-1.5">
                  <Image
                    src="/images/franz-stangl.jpg"
                    alt="Franz Stangl – Vertriebsingenieur"
                    width={257}
                    height={327}
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold leading-tight text-ink">
                    Jetzt Anfrage stellen. Wir kümmern uns um den Rest.
                  </h2>
                  <p className="mt-3 text-text">
                    Unser Vertriebsteam meldet sich zeitnah bei Ihnen, um alle Details zu besprechen und
                    ein individuelles Angebot zu erstellen.
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-amber">
                    Franz Stangl — Vertriebsingenieur
                  </p>
                </div>
              </div>
              <p className="mb-6 mt-8 font-mono text-xs uppercase tracking-[0.12em] text-text">
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
