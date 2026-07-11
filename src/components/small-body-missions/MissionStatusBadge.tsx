import type { MissionStatus } from "@/knowledge-graph/data/small-body-missions-catalog/types";
import { STATUS_LABEL } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/** A coloured pill for a mission's operational status. */
const STATUS_STYLE: Record<MissionStatus, string> = {
  completed: "border-success/40 bg-success/10 text-success-strong",
  extended: "border-success/40 bg-success/10 text-success-strong",
  active: "border-white/20 bg-white/[0.045] text-muted",
  planned: "border-nasa/40 bg-nasa/10 text-nasa",
  concept: "border-white/20 bg-white/[0.045] text-muted",
  cancelled: "border-nasa-red/50 bg-nasa-red/[0.12] text-nasa",
};

export function MissionStatusBadge({ status, className = "" }: { status: MissionStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${STATUS_STYLE[status]} ${className}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
