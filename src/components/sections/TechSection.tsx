import Image from "next/image";
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
          <SectionHeading eyebrow={homeTech.eyebrow} title={homeTech.title} className="mb-10 max-w-3xl" />
        </Reveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Punkte + Text + CTA */}
          <Reveal delay={0.1}>
            <div className="mb-8 space-y-6">
              {homeTech.points.map((point) => (
                <div key={point.title}>
                  <h3 className="mb-2 text-lg font-bold text-ink">{point.title}</h3>
                  <p className="text-text">{point.body}</p>
                </div>
              ))}
            </div>
            <p className="mb-8 text-text">{homeTech.body}</p>
            <Button href={homeTech.cta.href} variant="primary">
              {homeTech.cta.label}
            </Button>
          </Reveal>

          {/* Right: Foto Monteur */}
          <Reveal delay={0.2}>
            <Image
              src={homeTech.image}
              alt="AmbiVolt – Technik nach neuestem Stand"
              width={620}
              height={465}
              className="h-auto w-full object-cover"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
