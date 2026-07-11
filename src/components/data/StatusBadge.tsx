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
  implemented: "text-success-strong border-success/40 bg-success/10",
  stable: "text-success-strong border-success/40 bg-success/10",
  available: "text-success-strong border-success/40 bg-success/10",
  prepared: "text-nasa border-nasa/40 bg-nasa/10",
  planned: "text-muted border-white/20 bg-white/[0.045]",
  architecture: "text-muted border-white/20 bg-white/[0.045]",
  deprecated: "text-nasa border-nasa/40 bg-nasa/[0.12]",
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
