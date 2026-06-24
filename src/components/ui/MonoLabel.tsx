import type { ReactNode } from "react";

// Technischer Mono-Kicker. Trägt echte Info (Kategorie/Anzahl), keine Deko.
// `index` nur verwenden, wenn der Inhalt wirklich eine Sequenz ist.
export function MonoLabel({
  children,
  index,
  tone = "amber",
  className = "",
}: {
  children: ReactNode;
  index?: string;
  tone?: "amber" | "green" | "muted";
  className?: string;
}) {
  const color =
    tone === "amber" ? "text-amber" : tone === "green" ? "text-green" : "text-text";
  return (
    <span className={`label-mono inline-flex items-center gap-2 ${color} ${className}`}>
      {index && <span aria-hidden="true">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-5 bg-current opacity-50" />}
      <span>{children}</span>
    </span>
  );
}
