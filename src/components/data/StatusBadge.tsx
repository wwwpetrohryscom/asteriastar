import type { PortalStatus } from "@/platform/open-data/portal";

/**
 * Status pill for the open-data & developer portals. One honest vocabulary for
 * "what actually exists": implemented/stable/available (real & live), prepared
 * (registry real, integration pending), planned (designed, not built), and
 * architecture (a methodology, not a dataset). The vocabulary itself lives in
 * the platform layer (open-data/portal); components depend on it, never inversely.
 */
export type { PortalStatus };

const STYLES: Record<PortalStatus, string> = {
  implemented: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  stable: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  available: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  prepared: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  planned: "text-sky-300 border-sky-400/30 bg-sky-400/10",
  architecture: "text-violet-300 border-violet-400/30 bg-violet-400/10",
  deprecated: "text-rose-300 border-rose-400/30 bg-rose-400/10",
};

const LABELS: Record<PortalStatus, string> = {
  implemented: "Implemented",
  stable: "Stable",
  available: "Available",
  prepared: "Prepared",
  planned: "Planned",
  architecture: "Architecture",
  deprecated: "Deprecated",
};

export function StatusBadge({ status, className = "" }: { status: PortalStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {LABELS[status]}
    </span>
  );
}
