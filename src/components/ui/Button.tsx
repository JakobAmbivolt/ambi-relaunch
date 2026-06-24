import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

// Engineered-Buttons: scharfe Kanten, Mono-Label, führender Amber-Tick.
const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-white hover:bg-amber-bright",
  secondary:
    "border border-slate-900/25 text-ink hover:border-slate-900 hover:bg-slate-900 hover:text-white",
  ghost:
    "border border-white/25 text-white hover:border-white hover:bg-white hover:text-slate-900",
};

type CommonProps = { children: ReactNode; variant?: Variant; className?: string };
type LinkProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;
type ButtonProps = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 bg-current opacity-70 transition-transform duration-200 group-hover/btn:scale-150"
      />
      {children}
    </>
  );
}

export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  if (props.href) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, variant: _, className: _2, children: _3, ...rest } = props;
    return (
      <Link href={href} className={cls} {...rest}>
        <Inner>{children}</Inner>
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _, className: _2, children: _3, href: _4, ...rest } = props as ButtonProps;
  return (
    <button className={cls} {...rest}>
      <Inner>{children}</Inner>
    </button>
  );
}
