import {
  EVIDENCE_LABELS,
  EVIDENCE_ACCENT,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_ACCENT,
  COVERAGE_LABELS,
  COVERAGE_ACCENT,
  type EvidenceLevel,
  type ReviewStatus,
  type CoverageLevel,
} from "@/platform";

/**
 * Subtle trust badges — evidence, review, coverage, source, and version
 * indicators. Quiet and scientific, never alarmist; they communicate
 * transparency rather than bureaucracy.
 */

const ACCENT: Record<string, string> = {
  halo: "border-halo/30 text-halo",
  comet: "border-comet/30 text-comet",
  gold: "border-gold/30 text-gold",
  plasma: "border-plasma/30 text-plasma",
  ember: "border-ember/30 text-ember",
  stone: "border-stone/30 text-stone",
  nebula: "border-nebula/30 text-nebula",
  aurora: "border-aurora/30 text-aurora",
};

export function TrustBadge({
  accent = "stone",
  children,
  title,
}: {
  accent?: string;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full border bg-white/[0.02] px-2.5 py-0.5 text-xs font-medium ${ACCENT[accent] ?? ACCENT.stone}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  return <TrustBadge accent={EVIDENCE_ACCENT[level]} title="Evidence level">{EVIDENCE_LABELS[level]}</TrustBadge>;
}

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  return <TrustBadge accent={REVIEW_STATUS_ACCENT[status]} title="Review status">{REVIEW_STATUS_LABELS[status]}</TrustBadge>;
}

export function CoverageBadge({ level, label }: { level: CoverageLevel; label?: string }) {
  return <TrustBadge accent={COVERAGE_ACCENT[level]} title="Coverage">{label ?? COVERAGE_LABELS[level]}</TrustBadge>;
}

export function SourceIndicator({ count }: { count: number }) {
  return (
    <TrustBadge accent={count > 0 ? "halo" : "stone"} title="Sources connected">
      {count} {count === 1 ? "source" : "sources"}
    </TrustBadge>
  );
}

export function VersionLabel({ version }: { version: string }) {
  return <TrustBadge accent="nebula" title="Version">v{version}</TrustBadge>;
}
