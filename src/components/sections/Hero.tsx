import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeasureLine } from "@/components/ui/MeasureLine";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { Reveal } from "@/components/ui/Reveal";
import { HeroExhibit } from "@/components/sections/HeroExhibit";
import { homeHero } from "@/content/home";
import { company } from "@/content/company";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-72px)] flex-col overflow-hidden bg-surface">
      {/* Hintergrund-Ebenen */}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <ParallaxLayer from={60} to={-60}>
        <Aurora className="-right-40 -top-40" color="amber" size="46rem" opacity={0.22} />
        <Aurora className="-bottom-52 -left-40" color="green" size="42rem" opacity={0.14} />
      </ParallaxLayer>

      <Container className="relative z-10 flex flex-1 flex-col py-8 md:py-10">
        {/* Instrument-/Meta-Zeile */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="label-mono text-text">{company.legalName}</span>
          <span className="label-mono hidden text-text sm:inline">
            {company.zip} {company.city} · Bayern
          </span>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Linke Spalte */}
          <div>
            <Reveal>
              <MonoLabel tone="amber">Hersteller · PV-Montagesysteme</MonoLabel>
              <h1 className="font-display mt-5 text-[clamp(1.5rem,9vw,2.7rem)] font-extrabold leading-[1] text-ink sm:text-6xl sm:leading-[0.95] lg:text-7xl xl:text-[5.5rem]">
                {homeHero.titleLine1}
                <br />
                {homeHero.titleLine2}
              </h1>
              <MeasureLine className="mt-6" width="w-28" />
              <p className="mt-6 max-w-lg text-base text-text md:text-lg">{homeHero.lead}</p>
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
                {homeHero.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5">
                    <Icon name="check" className="h-4 w-4 flex-shrink-0 text-green" />
                    <span className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-ink">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/kontakt/" variant="primary">
                  Beratung anfragen
                </Button>
                <Button href="/produkte/" variant="secondary">
                  Produkte ansehen
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Rechte Spalte: animiertes Exponat */}
          <HeroExhibit />
        </div>
      </Container>
    </section>
  );
}
