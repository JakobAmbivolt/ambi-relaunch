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
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-0.5 text-amber" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
