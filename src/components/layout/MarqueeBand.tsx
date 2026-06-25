"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function MarqueeBand({
  text = "Jetzt Kontakt aufnehmen",
  href = "/kontakt/",
  className = "",
}: {
  text?: string;
  href?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const items = Array.from({ length: 10 }, (_, i) => i);

  const Row = (
    <div className="flex shrink-0 items-center whitespace-nowrap">
      {items.map((i) => (
        <span key={i} className="flex items-center font-mono text-xs font-medium uppercase tracking-[0.18em]">
          <span className="mx-5">{text}</span>
          <span className="h-1.5 w-1.5 bg-slate-900" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <Link
      href={href}
      aria-label={text}
      className={`block overflow-hidden bg-amber py-3.5 text-slate-900 transition-colors hover:bg-amber-bright ${className}`}
    >
      <div aria-hidden="true">
        {reduce ? (
          <div className="flex justify-center">{Row}</div>
        ) : (
          <motion.div
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {Row}
            {Row}
          </motion.div>
        )}
      </div>
    </Link>
  );
}
