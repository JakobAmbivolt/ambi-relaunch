import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureList } from "@/components/sections/FeatureList";
import { homeSpecialist } from "@/content/home";

export function SpecialistSection() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          {/* Left: Überschrift + Text */}
          <Reveal>
            <SectionHeading
              eyebrow={homeSpecialist.eyebrow}
              title={homeSpecialist.title}
              className="mb-6"
            />
            <p className="text-text">{homeSpecialist.body}</p>
          </Reveal>

          {/* Right: Vorteile + CTAs */}
          <Reveal delay={0.1}>
            <FeatureList items={homeSpecialist.bullets} className="mb-8 sm:grid sm:grid-cols-2 sm:gap-x-6" />
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={homeSpecialist.primaryCta.href} variant="primary">
                {homeSpecialist.primaryCta.label}
              </Button>
              <Button href={homeSpecialist.secondaryCta.href} variant="secondary">
                {homeSpecialist.secondaryCta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
