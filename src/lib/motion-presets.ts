import type { Variants } from "motion/react";

// Sanftes Hoch-Einblenden (Standard-Reveal)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// Reines Einblenden, ohne Versatz
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// Container, der Kinder gestaffelt erscheinen lässt
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// Element für gestaffelte Listen/Grids
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

// Mess-Linie zeichnet sich horizontal auf (scaleX von links)
export const drawX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
