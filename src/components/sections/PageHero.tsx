import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeasureLine } from "@/components/ui/MeasureLine";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { Reveal } from "@/components/ui/Reveal";

// Innenseiten-Hero im Engineered-Look: helles Blueprint-Raster, Mono-Kicker,
// Archivo-Headline, Amber-Messlinie. (bgImage-Prop bleibt aus Kompatibilität, wird nicht gerendert.)
export function PageHero({
  eyebrow,
  title,
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  bgImage?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <ParallaxLayer from={50} to={-50}>
        <Aurora className="-right-32 -top-28" color="amber" size="42rem" opacity={0.16} />
        <Aurora className="-bottom-40 -left-32" color="green" size="36rem" opacity={0.1} />
      </ParallaxLayer>

      <Container className={`relative z-10 py-16 md:py-24 ${centered ? "text-center" : ""}`}>
        <Reveal className={centered ? "flex flex-col items-center" : ""}>
          {eyebrow && <MonoLabel tone="amber">{eyebrow}</MonoLabel>}
          <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.02] text-ink md:text-6xl">
            {title}
          </h1>
          <MeasureLine className="mt-6" width="w-24" />
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
