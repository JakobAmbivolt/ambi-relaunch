"use client";
import { motion, useScroll, useSpring } from "motion/react";

// Fixe Fortschrittslinie ganz oben: orange Grundspur (permanent),
// darüber wächst die grüne Füllung von links mit dem Scroll-Fortschritt
// (oben komplett orange → ganz unten komplett grün).
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-0.5 w-full"
      style={{ background: "var(--color-amber)" }}
    >
      <motion.div
        className="h-full w-full origin-left"
        style={{ scaleX, background: "var(--color-green)" }}
      />
    </div>
  );
}
