import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <div className={centered ? "flex flex-col items-center" : ""}>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber">{eyebrow}</p>
          <span className="mt-2 mb-3 block h-1 w-12 bg-amber" />
        </div>
      )}
      <h2 className="text-3xl font-bold leading-tight text-ink md:text-4xl">{title}</h2>
    </div>
  );
}
