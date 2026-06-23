import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { homeTech } from "@/content/home";

export function TechSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={homeTech.eyebrow}
            title={homeTech.title}
            className="mb-10 max-w-3xl"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-10">
            {homeTech.points.map((point) => (
              <div key={point.title}>
                <h3 className="mb-3 text-lg font-bold text-ink">{point.title}</h3>
                <p className="text-text">{point.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mb-8 text-text max-w-3xl">{homeTech.body}</p>
          <Button href={homeTech.cta.href} variant="primary">
            {homeTech.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
