import type { MissionStatus } from "@/knowledge-graph/data/small-body-missions-catalog/types";
import { STATUS_LABEL } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/** A coloured pill for a mission's operational status. */
const STATUS_STYLE: Record<MissionStatus, string> = {
  completed: "border-emerald-400/40 bg-emerald-400/[0.10] text-emerald-300",
  extended: "border-teal-400/40 bg-teal-400/[0.10] text-teal-300",
  active: "border-sky-400/40 bg-sky-400/[0.10] text-sky-300",
  planned: "border-amber-400/40 bg-amber-400/[0.10] text-amber-300",
  concept: "border-zinc-400/40 bg-zinc-400/[0.10] text-zinc-300",
  cancelled: "border-rose-400/40 bg-rose-400/[0.10] text-rose-300",
};

export function MissionStatusBadge({ status, className = "" }: { status: MissionStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${STATUS_STYLE[status]} ${className}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
