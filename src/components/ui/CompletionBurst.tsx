"use client";
import { motion } from "motion/react";

const GREEN = "#268c45";
const AMBER = "#dc9015";

// Funken an Ecken + Kantenmitten (Prozent-Positionen → skalieren mit der Boxgröße),
// jeweils nach außen sprühend.
const ANCHORS: [number, number, number, number][] = [
  [0, 0, -1, -1],
  [50, 0, 0, -1],
  [100, 0, 1, -1],
  [100, 50, 1, 0],
  [100, 100, 1, 1],
  [50, 100, 0, 1],
  [0, 100, -1, 1],
  [0, 50, -1, 0],
];
const SPREAD = 15;

// Einmaliger "Fertig"-Funkeneffekt RUND UM eine Box: aufblitzender Umriss,
// expandierender Glow und nach außen sprühende Funken. Animiert einmal beim Mount.
// Größenkonsistent (Glow px-basiert, Funken an Prozent-Ankern) → für kleine Boxen
// wie für große Panels gleichermaßen einsetzbar.
export function CompletionBurst({ color = GREEN }: { color?: string }) {
  return (
    <span className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {/* aufblitzender Umriss */}
      <motion.span
        className="absolute inset-0 border-2"
        style={{ borderColor: color }}
        initial={{ opacity: 0.95 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* expandierender Glow rund um die Box */}
      <motion.span
        className="absolute inset-0"
        initial={{ boxShadow: `0 0 0px 0px ${color}99` }}
        animate={{ boxShadow: `0 0 24px 5px ${color}00` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {/* Funken rund um die Box nach außen */}
      {ANCHORS.map(([lx, ty, dx, dy], k) => {
        const c = k % 2 ? AMBER : color;
        return (
          <motion.span
            key={k}
            className="absolute h-[3px] w-[3px] rounded-full"
            style={{ left: `${lx}%`, top: `${ty}%`, background: c, boxShadow: `0 0 4px ${c}` }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: dx * SPREAD, y: dy * SPREAD, scale: 0.3 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}
