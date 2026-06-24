import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { Reveal } from "@/components/ui/Reveal";
import { homeValues } from "@/content/home";

export function ValueSection() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-surface py-24 md:py-32">
      <ParallaxLayer from={70} to={-70}>
        <Aurora className="-left-40 -top-20" color="green" size="40rem" opacity={0.12} />
        <Aurora className="-right-44 bottom-0" color="amber" size="38rem" opacity={0.1} />
      </ParallaxLayer>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow={homeValues.eyebrow} title={homeValues.title} />
            <p className="mt-6 max-w-md text-text md:text-lg">{homeValues.statement}</p>
            <div className="mt-8">
              <Button href={homeValues.cta.href} variant="secondary">
                {homeValues.cta.label}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
              {homeValues.items.map((item) => (
                <div key={item.title} className="bg-surface p-6">
                  <span className="mb-4 block h-1.5 w-1.5 bg-amber" aria-hidden="true" />
                  <h3 className="font-display mb-2 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-text">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
