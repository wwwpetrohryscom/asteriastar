import type { ReactNode } from "react";

/** A small pill label. `tone="accent"` uses the inherited --accent CSS var. */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "tradition";
  className?: string;
}) {
  const tones = {
    neutral: "border-white/15 bg-white/[0.045] text-muted",
    accent:
      "border-[color-mix(in_oklab,var(--accent,#ff2a1a)_48%,transparent)] bg-[color-mix(in_oklab,var(--accent,#ff2a1a)_14%,transparent)] text-fg",
    tradition: "border-white/20 bg-white/[0.045] text-fg",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
