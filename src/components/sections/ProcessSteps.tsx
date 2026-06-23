import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { homeProcess } from "@/content/home";

export function ProcessSteps() {
  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24">
      {/* dezentes Hintergrundbild (wie Original) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/process-bg.png')] bg-[length:520px] bg-right-bottom bg-no-repeat opacity-[0.06]"
        aria-hidden="true"
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow={homeProcess.eyebrow}
            title={homeProcess.title}
            align="center"
            className="mb-2"
          />
          <p className="mb-12 mt-3 text-center text-text">{homeProcess.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {homeProcess.steps.map((step) => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image src={step.icon} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
                  <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber text-sm font-bold text-white">
                    {step.n}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-ink">{step.title}</h3>
                <p className="text-text">{step.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
