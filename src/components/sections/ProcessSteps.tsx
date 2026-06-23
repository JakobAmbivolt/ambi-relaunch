import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { homeProcess } from "@/content/home";

export function ProcessSteps() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={homeProcess.eyebrow}
            title={homeProcess.title}
            align="center"
            className="mb-2"
          />
          <p className="mt-3 text-center text-text mb-12">{homeProcess.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {homeProcess.steps.map((step) => (
              <div
                key={step.n}
                className="flex flex-col bg-white p-8 border border-slate-900/10 shadow-sm"
              >
                <span className="mb-4 text-5xl font-bold text-amber leading-none">{step.n}</span>
                <h3 className="mb-3 text-xl font-bold text-ink">{step.title}</h3>
                <p className="text-text">{step.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
