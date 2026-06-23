import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, align = "left", className = "" }:
  { eyebrow?: string; title: ReactNode; align?: "left" | "center"; className?: string }) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber">{eyebrow}</p>}
      <h2 className="text-3xl font-bold leading-tight text-ink md:text-4xl">{title}</h2>
    </div>
  );
}
