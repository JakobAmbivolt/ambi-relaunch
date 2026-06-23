import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

// Wiederverwendbarer Innenseiten-Hero: dunkle Slate-Fläche, schräger Amber-Balken oben,
// optionales Hintergrundbild (Dach/Module) und optional zentrierter Text.
export function PageHero({
  eyebrow,
  title,
  bgImage,
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
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/55" />
        </>
      )}

      <svg
        className="absolute inset-x-0 top-0 z-10 h-6 w-full md:h-8"
        viewBox="0 0 1280 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="var(--color-amber)" d="M0 0 H1280 L0 140 Z" />
      </svg>

      <Container className={`relative z-10 py-16 md:py-24 ${centered ? "text-center" : ""}`}>
        {eyebrow && (
          <>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber">{eyebrow}</p>
            <span className={`mt-2 mb-3 block h-1 w-12 bg-amber ${centered ? "mx-auto" : ""}`} />
          </>
        )}
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
        {children}
      </Container>
    </section>
  );
}
