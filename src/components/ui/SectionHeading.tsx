import type { ReactNode } from "react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeasureLine } from "@/components/ui/MeasureLine";

export function SectionHeading({
  eyebrow,
  index,
  title,
  align = "left",
  tone = "dark",
  className = "",
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const centered = align === "center";
  const titleColor = tone === "light" ? "text-white" : "text-ink";
  return (
    <div className={`${centered ? "flex flex-col items-center text-center" : ""} ${className}`}>
      {eyebrow && (
        <div className={`mb-4 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
          <MonoLabel index={index} tone="amber">
            {eyebrow}
          </MonoLabel>
        </div>
      )}
      <h2
        className={`font-display text-3xl font-bold leading-[1.05] md:text-[2.6rem] lg:text-5xl ${titleColor}`}
      >
        {title}
      </h2>
      <MeasureLine className={`mt-5 ${centered ? "" : ""}`} width="w-20" tone="green" />
    </div>
  );
}
