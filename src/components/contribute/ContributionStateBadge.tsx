import { STATE_LABELS, STATE_ACCENT, type ContributionState } from "@/platform/contributions";

/**
 * A review-state pill for the contribution workflow. Colors come from the
 * platform accent vocabulary via STATE_ACCENT — one honest badge per state.
 */
const ACCENT_CLASS: Record<string, string> = {
  stone: "text-slate-300 border-slate-400/30 bg-slate-400/10",
  halo: "text-sky-300 border-sky-400/30 bg-sky-400/10",
  comet: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  ember: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  gold: "text-yellow-300 border-yellow-400/30 bg-yellow-400/10",
  plasma: "text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10",
};

export function ContributionStateBadge({ state, className = "" }: { state: ContributionState; className?: string }) {
  const cls = ACCENT_CLASS[STATE_ACCENT[state]] ?? ACCENT_CLASS.stone;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs ${cls} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {STATE_LABELS[state]}
    </span>
  );
}
