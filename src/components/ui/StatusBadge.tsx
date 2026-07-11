import type { ReactNode } from "react";

export type StatusTone =
  | "neutral"
  | "editorial-red"
  | "verified-green"
  | "warning-red"
  | "inactive"
  | "planned"
  | "stale"
  | "unavailable";

const TONES: Record<StatusTone, string> = {
  neutral: "border-white/20 bg-white/[0.045] text-muted",
  "editorial-red": "border-nasa/40 bg-nasa/[0.12] text-white",
  "verified-green": "border-success/40 bg-success/10 text-success-strong",
  "warning-red": "border-nasa-red/50 bg-nasa-red/[0.12] text-white",
  inactive: "border-white/12 bg-white/[0.03] text-faint",
  planned: "border-white/20 bg-white/[0.045] text-muted",
  stale: "border-nasa/40 bg-nasa/10 text-nasa",
  unavailable: "border-nasa-red/50 bg-nasa-red/[0.12] text-white",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] ${TONES[tone]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}
