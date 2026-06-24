"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

// Hintergrund-Ebene, die sich scroll-getrieben bewegt — Inhalt läuft darüber.
export function ParallaxLayer({
  children,
  axis = "y",
  from = 80,
  to = -80,
  className = "",
}: {
  children: ReactNode;
  axis?: "x" | "y";
  from?: number;
  to?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const value = useTransform(scrollYProgress, [0, 1], [from, to]);
  const style = reduce ? undefined : axis === "x" ? { x: value } : { y: value };

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0" style={style}>
        {children}
      </motion.div>
    </div>
  );
}
