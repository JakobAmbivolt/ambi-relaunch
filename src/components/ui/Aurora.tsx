// Weicher, unscharfer Farb-Schimmer (Aurora) für moderne Hintergründe.
export function Aurora({
  className = "",
  color = "amber",
  size = "40rem",
  opacity = 0.18,
}: {
  className?: string;
  color?: "amber" | "green";
  size?: string;
  opacity?: number;
}) {
  const rgb = color === "green" ? "38,140,69" : "220,144,21";
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(${rgb},${opacity}), rgba(${rgb},0) 70%)`,
      }}
    />
  );
}
