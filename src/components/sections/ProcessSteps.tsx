"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CompletionBurst } from "@/components/ui/CompletionBurst";
import { homeProcess } from "@/content/home";

// Nummern-Box: standardmäßig amber ("lädt"), beim Erreichen der Scroll-Schwelle
// grün ("fertig") + Funken-Burst rund um die Box.
function StepBox({
  n,
  threshold,
  progress,
  reduce,
}: {
  n: string;
  threshold: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const [done, setDone] = useState<boolean>(!!reduce);
  const [burstKey, setBurstKey] = useState(0);
  const prevDone = useRef<boolean>(!!reduce);

  useMotionValueEvent(progress, "change", (v) => {
    if (reduce) return;
    const d = v >= threshold;
    if (d !== prevDone.current) {
      prevDone.current = d;
      setDone(d);
      if (d) setBurstKey((k) => k + 1);
    }
  });

  return (
    <span
      className={`relative z-10 flex h-12 w-12 items-center justify-center border font-mono text-sm font-bold transition-colors duration-500 ${
        done ? "border-green bg-green text-white" : "border-amber bg-amber text-white"
      }`}
    >
      {n}
      {done && burstKey > 0 && <CompletionBurst key={burstKey} />}
    </span>
  );
}

export function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const steps = homeProcess.steps;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.65"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

  const markerTop = useTransform(progress, [0, 1], ["0%", "100%"]);
  const markerOpacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={homeProcess.eyebrow}
            title={homeProcess.title}
            align="center"
            className="mx-auto"
          />
          <p className="mt-5 text-center font-mono text-[0.8rem] uppercase tracking-[0.16em] text-text">
            {homeProcess.subtitle}
          </p>
        </Reveal>

        <div ref={ref} className="relative mx-auto mt-16 max-w-2xl">
          {/* Schiene + grüne Füllung ("fertig") + wanderndes Amber-Modul ("lädt") */}
          <span className="absolute bottom-0 left-6 top-0 w-px bg-line" aria-hidden="true" />
          <motion.span
            className="absolute left-6 top-0 w-px origin-top bg-green"
            style={{ height: "100%", scaleY: reduce ? 1 : progress }}
            aria-hidden="true"
          />
          {!reduce && (
            <motion.span
              className="absolute left-6 z-10 -ml-[5px] h-2.5 w-2.5 bg-amber shadow-[0_0_12px_rgba(239,145,9,0.7)]"
              style={{ top: markerTop, opacity: markerOpacity }}
              aria-hidden="true"
            />
          )}

          <ol className="relative space-y-12">
            {steps.map((step, i) => (
              <li key={step.n} className="grid grid-cols-[3rem_1fr] gap-6">
                <div className="flex justify-center">
                  <StepBox
                    n={step.n}
                    threshold={(i + 0.5) / steps.length}
                    progress={progress}
                    reduce={reduce}
                  />
                </div>
                <Reveal delay={i * 0.05} className="pb-2 pt-2.5">
                  <h3 className="font-display text-xl font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-text">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
