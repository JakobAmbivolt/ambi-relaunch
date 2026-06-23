import type { Metadata } from "next";
import { bewerben, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfo } from "@/components/ui/ContactInfo";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = {
  title: "Jetzt bewerben",
  description: "Bewirb dich bei AmbiVolt – Praktikum oder Ausbildung.",
};

export default function JetztBewerbenPage() {
  const hero = section(bewerben, "hero");

  return (
    <>
      <PageHero
        title={<Highlight color="amber">Willkommen bei AmbiVolt!</Highlight>}
        align="center"
      >
        {hero?.subheading && (
          <p className="mt-4 text-lg text-white/90">{hero.subheading}</p>
        )}
        {hero?.paragraphs?.[0] && (
          <p className="mt-2 text-base text-white/75">{hero.paragraphs[0]}</p>
        )}
      </PageHero>

      {/* Main: form + contact sidebar */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
            {/* Left: form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-ink">Sende uns deine Bewerbung</h2>
              <ApplicationForm />
            </div>

            {/* Right: contact info */}
            <div className="flex flex-col gap-8">
              <ContactInfo heading="Kontakt" />
              <OpeningHours />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
