import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-nasa-red text-white shadow-[0_14px_42px_rgba(225,6,0,0.28)] hover:bg-nasa",
  secondary:
    "border border-white/20 bg-surface/90 text-fg hover:border-nasa/70 hover:bg-black",
  ghost: "text-muted underline decoration-nasa/60 underline-offset-4 hover:text-nasa",
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
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${VARIANTS[variant]} ${className}`;

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
