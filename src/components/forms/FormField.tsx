import type { ReactNode } from "react";

export function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs font-medium uppercase tracking-wide text-ink">
        {label}
        {required && (
          <span className="ml-0.5 text-amber" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && <p className="font-mono text-xs text-red-600">{error}</p>}
    </div>
  );
}
