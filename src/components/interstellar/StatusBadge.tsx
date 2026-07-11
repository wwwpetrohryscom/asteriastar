import type { InterstellarStatus } from "@/knowledge-graph/data/interstellar-catalog/types";
import { STATUS_LABEL } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * The scientific-status pill. Confirmed, candidate/debated, and hyperbolic Solar-System
 * objects each get a distinct colour so the three are never visually confused — the
 * central honesty requirement of this encyclopedia.
 */
const STATUS_STYLE: Record<InterstellarStatus, string> = {
  confirmed_interstellar: "border-success/40 bg-success/10 text-success-strong",
  candidate_interstellar: "border-nasa/40 bg-nasa/10 text-nasa",
  debated_origin: "border-nasa/40 bg-nasa/10 text-nasa",
  hyperbolic_solar_system_object: "border-white/20 bg-white/[0.045] text-muted",
  rejected_or_uncertain: "border-white/20 bg-white/[0.045] text-muted",
};

export function StatusBadge({ status, className = "" }: { status: InterstellarStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${STATUS_STYLE[status]} ${className}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
