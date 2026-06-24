"use client";
import { motion } from "motion/react";
import { drawX } from "@/lib/motion-presets";

// Signatur-Element: feine "Mess-/Laserlinie" in Amber, die sich von links aufzeichnet.
// Optional mit Endpunkt-Tick (wie eine Maßlinie in einer technischen Zeichnung).
export function MeasureLine({
  className = "",
  width = "w-16",
  tone = "amber",
  tick = true,
  delay = 0,
}: {
  className?: string;
  width?: string;
  tone?: "amber" | "green" | "line";
  tick?: boolean;
  delay?: number;
}) {
  const color =
    tone === "amber"
      ? "var(--color-amber)"
      : tone === "green"
        ? "var(--color-green)"
        : "var(--color-line)";
  return (
    <span className={`relative inline-flex items-center ${width} ${className}`} aria-hidden="true">
      <motion.span
        className="js-reveal h-px w-full origin-left"
        style={{ backgroundColor: color }}
        variants={drawX}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay }}
      />
      {tick && (
        <motion.span
          className="js-reveal absolute right-0 h-2.5 w-px"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: delay + 0.7, duration: 0.3 }}
        />
      )}
    </span>
  );
}
