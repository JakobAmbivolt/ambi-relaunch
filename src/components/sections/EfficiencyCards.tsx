import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { homeEfficiency } from "@/content/home";

export function EfficiencyCards() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={homeEfficiency.eyebrow}
            title={homeEfficiency.title}
            align="center"
            className="mb-4"
          />
          <p className="text-center text-text mt-2 mb-10">{homeEfficiency.intro}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {homeEfficiency.cards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-4 bg-white p-8 border border-slate-900/10 shadow-sm"
              >
                <div className="relative h-14 w-14">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                </div>
                <h3 className="text-xl font-bold text-ink">{card.title}</h3>
                <p className="text-text">{card.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
