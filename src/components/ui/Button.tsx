import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-white text-bg hover:bg-white/90 shadow-[0_0_34px_-8px_rgba(79,143,240,0.65)]",
  secondary:
    "border border-white/15 bg-white/[0.03] text-fg hover:border-nasa/50 hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-fg",
};

/** A link styled as a button. (No client-side handlers needed in this phase.) */
export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const external = href.startsWith("http");
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${VARIANTS[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
