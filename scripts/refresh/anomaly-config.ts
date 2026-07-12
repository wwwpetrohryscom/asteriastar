/**
 * Documented, transparent thresholds that decide when a refresh diff is safe to
 * auto-merge versus when it needs human review. No arbitrary "trust score" — only
 * explicit counts and per-domain numeric thresholds.
 */

export type ChangeClass =
  | "added"
  | "source_metadata_only"
  | "uncertainty_update"
  | "precision_improvement"
  | "value_change"
  | "classification_change"
  | "status_change"
  | "identifier_change"
  | "source_removed"
  | "conflict_detected"
  | "anomaly";

/** Change classes that always require human review before merge. */
export const REVIEW_REQUIRED_CLASSES: ChangeClass[] = [
  "classification_change", "status_change", "identifier_change", "source_removed", "conflict_detected", "anomaly",
];

/** Relative change in a numeric value above which it is flagged as an anomaly, per snapshot. */
export const VALUE_ANOMALY_REL_THRESHOLD: Record<string, number> = {
  default: 0.5, // a >50% swing in a value is anomalous
  "sbdb-small-bodies": 0.1, // orbits are tightly constrained — a >10% element change is anomalous
  "gaia-stars": 0.2,
  "simbad-stars": 0.3,
};

/** A change smaller than this relative amount counts as a precision_improvement, not a value_change. */
export const PRECISION_IMPROVEMENT_REL = 0.02;

/** If more than this fraction of a snapshot's rows change, the whole refresh needs review. */
export const MAX_CHANGED_FRACTION = 0.25;

export function anomalyThresholdFor(snapshotId: string): number {
  return VALUE_ANOMALY_REL_THRESHOLD[snapshotId] ?? VALUE_ANOMALY_REL_THRESHOLD.default;
}
