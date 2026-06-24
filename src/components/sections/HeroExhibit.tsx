"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { CornerTicks } from "@/components/ui/CornerTicks";
import { homeHero } from "@/content/home";

// Produkt als technisches Exponat: Einblend-Sequenz + Scroll-Parallax + Scan-Sweep + sanftes Schweben.
export function HeroExhibit() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <div ref={ref} className="relative">
      {/* Amber-Glow-Halo hinter dem Exponat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 z-0"
        style={{
          background:
            "radial-gradient(58% 58% at 62% 42%, rgba(220,144,21,0.20), rgba(220,144,21,0) 70%)",
        }}
      />

      {/* Äußere Ebene: nur Scroll-Parallax */}
      <motion.div className="relative z-10" style={reduce ? undefined : { y: parallaxY }}>
        {/* Innere Ebene: Einblend-Sequenz beim Laden */}
        <motion.figure
          className="relative overflow-hidden border border-line bg-white p-5 shadow-sm sm:p-8"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <CornerTicks />

          <motion.div
            animate={reduce ? undefined : { y: [0, -9, 0] }}
            transition={reduce ? undefined : { duration: 6, ease: "easeInOut", repeat: Infinity }}
          >
            <Image
              src={homeHero.image}
              alt="AmbiVolt Photovoltaik-Montagesysteme"
              width={980}
              height={883}
              priority
              className="mx-auto w-full max-w-md object-contain lg:max-w-full"
            />
          </motion.div>

          {/* Scan-Sweep einmalig beim Laden */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-amber/25 to-transparent"
              initial={{ y: "-40%", opacity: 0 }}
              animate={{ y: ["-40%", "140%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.7, ease: "easeInOut", delay: 0.9, times: [0, 0.12, 0.88, 1] }}
            />
          )}

          <figcaption className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text">
            <span>Abb. — Montagesystem-Familie</span>
            <span className="text-amber">6 Dachformen</span>
          </figcaption>
        </motion.figure>
      </motion.div>
    </div>
  );
}
