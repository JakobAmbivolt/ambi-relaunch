import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { homeEfficiency } from "@/content/home";

export function EfficiencyCards() {
  return (
    <section className="bg-slate-900 py-16 text-white md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Heading + Karten */}
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber">
              {homeEfficiency.eyebrow}
            </p>
            <span className="mt-2 mb-3 block h-1 w-12 bg-amber" />
            <h2 className="text-3xl font-bold md:text-4xl">{homeEfficiency.title}</h2>
            <p className="mt-3 mb-8 text-white/70">{homeEfficiency.intro}</p>

            <div className="grid gap-6 sm:grid-cols-2">
              {homeEfficiency.cards.map((card) => (
                <div key={card.title} className="border border-white/10 bg-slate-800 p-6">
                  <div className="relative mb-4 h-12 w-12">
                    <Image src={card.icon} alt="" fill className="object-contain" sizes="48px" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{card.title}</h3>
                  <p className="text-sm text-white/70">{card.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: Foto */}
          <Reveal delay={0.1}>
            <Image
              src={homeEfficiency.image}
              alt="AmbiVolt Photovoltaik-Montagesysteme – maximale Effizienz"
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
