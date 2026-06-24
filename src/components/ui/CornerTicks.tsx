// Vier L-förmige Eck-Marken wie in einer technischen Zeichnung.
export function CornerTicks({ className = "border-amber" }: { className?: string }) {
  const common = `absolute h-4 w-4 ${className}`;
  return (
    <>
      <span className={`${common} left-0 top-0 border-l border-t`} aria-hidden="true" />
      <span className={`${common} right-0 top-0 border-r border-t`} aria-hidden="true" />
      <span className={`${common} bottom-0 left-0 border-b border-l`} aria-hidden="true" />
      <span className={`${common} bottom-0 right-0 border-b border-r`} aria-hidden="true" />
    </>
  );
}
