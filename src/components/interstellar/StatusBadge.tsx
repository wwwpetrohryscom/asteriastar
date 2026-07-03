import type { InterstellarStatus } from "@/knowledge-graph/data/interstellar-catalog/types";
import { STATUS_LABEL } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * The scientific-status pill. Confirmed, candidate/debated, and hyperbolic Solar-System
 * objects each get a distinct colour so the three are never visually confused — the
 * central honesty requirement of this encyclopedia.
 */
const STATUS_STYLE: Record<InterstellarStatus, string> = {
  confirmed_interstellar: "border-emerald-400/40 bg-emerald-400/[0.10] text-emerald-300",
  candidate_interstellar: "border-amber-400/40 bg-amber-400/[0.10] text-amber-300",
  debated_origin: "border-amber-500/40 bg-amber-500/[0.10] text-amber-300",
  hyperbolic_solar_system_object: "border-sky-400/40 bg-sky-400/[0.10] text-sky-300",
  rejected_or_uncertain: "border-zinc-400/40 bg-zinc-400/[0.10] text-zinc-300",
};

export function StatusBadge({ status, className = "" }: { status: InterstellarStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${STATUS_STYLE[status]} ${className}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
