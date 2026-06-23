import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";
const base = "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors";
const variants: Record<Variant, string> = {
  primary: "bg-amber text-white hover:bg-amber-bright",
  secondary: "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
};

export function Button({ href, children, variant = "primary", className = "", ...rest }:
  { href?: string; children: ReactNode; variant?: Variant; className?: string } & Record<string, unknown>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <Link href={href} className={cls} {...rest}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
