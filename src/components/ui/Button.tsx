import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary";
const base = "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors";
const variants: Record<Variant, string> = {
  primary: "bg-amber text-white hover:bg-amber-bright",
  secondary: "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
};

type CommonProps = { children: ReactNode; variant?: Variant; className?: string };
type LinkProps = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type ButtonProps = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  if (props.href) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, variant: _, className: _2, children: _3, ...rest } = props;
    return <Link href={href} className={cls} {...rest}>{children}</Link>;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _, className: _2, children: _3, href: _4, ...rest } = props as ButtonProps;
  return <button className={cls} {...rest}>{children}</button>;
}
