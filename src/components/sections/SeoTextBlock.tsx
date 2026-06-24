import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { homeSeo } from "@/content/home";

const pad = (n: number) => String(n + 1).padStart(2, "0");

export function SeoTextBlock() {
  return (
    <section className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Wissen" title={homeSeo.title} className="max-w-2xl" />
          <p className="mt-6 max-w-2xl text-text md:text-lg">{homeSeo.intro}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {homeSeo.blocks.map((block, i) => (
              <article key={block.heading} className="bg-surface p-7 md:p-8">
                <span className="font-mono text-xs font-bold text-amber">{pad(i)}</span>
                <h3 className="font-display mt-3 text-lg font-bold text-ink">{block.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text">{block.body}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
