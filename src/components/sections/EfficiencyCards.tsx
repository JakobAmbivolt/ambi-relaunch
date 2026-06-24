import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { Reveal } from "@/components/ui/Reveal";
import { SolarChargePanel } from "@/components/sections/SolarChargePanel";
import { homeEfficiency } from "@/content/home";

export function EfficiencyCards() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white md:py-32">
      <div className="blueprint-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <ParallaxLayer from={90} to={-90}>
        <Aurora className="-left-40 top-10" color="amber" size="44rem" opacity={0.16} />
        <Aurora className="-right-44 bottom-0" color="green" size="46rem" opacity={0.18} />
      </ParallaxLayer>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Links: Überschrift + verdichtete Stat-Karten */}
          <div>
            <Reveal>
              <SectionHeading
                eyebrow={homeEfficiency.eyebrow}
                title={homeEfficiency.title}
                tone="light"
              />
              <p className="mt-6 max-w-md text-lg text-white/70">{homeEfficiency.intro}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {homeEfficiency.cards.map((card) => (
                  <div key={card.title} className="bg-slate-900 p-6">
                    <span className="mb-4 block h-1.5 w-1.5 bg-amber" aria-hidden="true" />
                    <h3 className="font-display mb-2 text-lg font-bold text-white">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-white/65">{card.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Rechts: Solar-Lade-Dashboard (scroll-gekoppelt) */}
          <Reveal delay={0.1}>
            <SolarChargePanel />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
