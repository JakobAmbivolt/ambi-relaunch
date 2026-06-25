import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "gradient" | "green" | "darkAccent";

// Engineered-Buttons: scharfe Kanten, Mono-Label, führender Amber-Tick.
const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-white hover:bg-amber-bright",
  secondary:
    "border border-slate-900/25 text-ink hover:border-slate-900 hover:bg-slate-900 hover:text-white",
  ghost:
    "border border-white/25 text-white hover:border-white hover:bg-white hover:text-slate-900",
  // Gefüllt dunkel: gleich prominent wie primary, aber farblich abgesetzt.
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  // Amber→Grün-Verlauf (Logo-Duo) für den Projektanfrage-CTA.
  gradient:
    "text-white [background-image:linear-gradient(90deg,var(--color-amber),var(--color-green))] hover:[background-image:linear-gradient(90deg,var(--color-amber-bright),var(--color-green))]",
  // Grün gefüllt — Tick wird per tickClassName orange gesetzt (Logo-Duo grün/orange).
  green: "bg-green text-white hover:bg-[#1f7a3c]",
  // Dunkel mit Akzenten: oranger Tick (via tickClassName) + grüner Hover.
  darkAccent: "bg-slate-900 text-white hover:bg-green",
};

type CommonProps = { children: ReactNode; variant?: Variant; className?: string; tickClassName?: string };
type LinkProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;
type ButtonProps = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

function Inner({ children, tickClassName }: { children: ReactNode; tickClassName?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 transition-transform duration-200 group-hover/btn:scale-150 ${
          tickClassName ?? "bg-current opacity-70"
        }`}
      />
      {children}
    </>
  );
}

export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = "primary", className = "", tickClassName } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  if (props.href) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, variant: _, className: _2, children: _3, tickClassName: _t, ...rest } = props;
    // Externe Links (andere Domain) als natives <a> rendern, nicht via next/link.
    if (/^https?:\/\//.test(href)) {
      return (
        <a href={href} className={cls} {...(rest as ComponentPropsWithoutRef<"a">)}>
          <Inner tickClassName={tickClassName}>{children}</Inner>
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        <Inner tickClassName={tickClassName}>{children}</Inner>
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _, className: _2, children: _3, href: _4, tickClassName: _t, ...rest } = props as ButtonProps;
  return (
    <button className={cls} {...rest}>
      <Inner tickClassName={tickClassName}>{children}</Inner>
    </button>
  );
}
