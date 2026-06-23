import type { ReactNode } from "react";

// Marker-Highlight wie im Original (gefüllte Box hinter dem Text, weiße Schrift).
// Nachbau des Divi-Effekts `box-shadow: inset 0 -80px <farbe>`.

type Color = "amber" | "green" | "muted";

const bg: Record<Color, string> = {
  amber: "var(--color-amber)",
  green: "var(--color-green)",
  muted: "rgba(255, 255, 255, 0.15)",
};

export function Highlight({
  children,
  color = "amber",
  className = "",
}: {
  children: ReactNode;
  color?: Color;
  className?: string;
}) {
  return (
    <span
      className={`box-decoration-clone px-3 pb-1.5 pt-2 leading-none text-white ${className}`}
      style={{ backgroundColor: bg[color] }}
    >
      {children}
    </span>
  );
}
