import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeasureLine } from "@/components/ui/MeasureLine";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { Reveal } from "@/components/ui/Reveal";
import { homeCta } from "@/content/home";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white md:py-32">
      <div className="blueprint-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <span className="absolute inset-x-0 top-0 h-px bg-amber/70" aria-hidden="true" />
      <ParallaxLayer from={80} to={-80}>
        <Aurora className="-left-32 -top-24" color="amber" size="42rem" opacity={0.16} />
        <Aurora className="-bottom-32 -right-24" color="green" size="42rem" opacity={0.16} />
      </ParallaxLayer>

      <Container className="relative z-10">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <MonoLabel tone="green">Kostenlose Erstberatung</MonoLabel>
          <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
            {homeCta.title}
          </h2>

          <p className="font-display mt-7 flex flex-wrap items-center justify-center gap-x-3 text-2xl font-extrabold md:text-4xl">
            {homeCta.sloganParts.map((part, i) => (
              <span key={i} className={part.color === "amber" ? "text-amber" : "text-green"}>
                {part.text}
              </span>
            ))}
          </p>
          <MeasureLine className="mt-6" width="w-24" />

          <div className="mt-10">
            <Button href={homeCta.button.href} variant="primary">
              {homeCta.button.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
