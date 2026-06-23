"use client";
import { motion } from "motion/react";

export function MarqueeBand({ text = "Jetzt Kontakt aufnehmen", className = "" }: { text?: string; className?: string }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className={`overflow-hidden bg-amber py-3 text-white ${className}`} aria-hidden="true">
      <motion.div className="flex whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
        {items.concat(items).map((_, idx) => (
          <span key={idx} className="mx-6 text-sm font-semibold uppercase tracking-widest">{text} •</span>
        ))}
      </motion.div>
    </div>
  );
}
