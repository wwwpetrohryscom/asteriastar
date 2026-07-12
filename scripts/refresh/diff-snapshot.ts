import { readFileSync } from "node:fs";
import type { RefreshSnapshot } from "./snapshots";
import { type ChangeClass, REVIEW_REQUIRED_CLASSES, anomalyThresholdFor, PRECISION_IMPROVEMENT_REL, MAX_CHANGED_FRACTION } from "./anomaly-config";

/**
 * Semantic snapshot diff (Program: automated refresh). Compares a committed snapshot to
 * a candidate row-by-row (by key) and classifies every change into the honest taxonomy,
 * producing a machine- and human-readable report and a review decision. It never
 * invents a change — the classification is derived only from the two real row sets.
 */

export interface FieldChange { field: string; from: unknown; to: unknown; class: ChangeClass; rel?: number }
export interface RowChange { key: string; kind: "added" | "removed" | "modified"; class: ChangeClass; fields: FieldChange[] }
export interface SnapshotDiff {
  snapshotId: string;
  oldCount: number;
  newCount: number;
  changed: RowChange[];
  byClass: Record<string, number>;
  hasMeaningfulChanges: boolean;
  requiresReview: boolean;
  reviewReasons: string[];
}

/** Read the committed snapshot's row array by extracting the `= [...]` literal (no import cache). */
export function readSnapshotRows(file: string): Record<string, unknown>[] {
  const txt = readFileSync(file, "utf8");
  const s = txt.indexOf("= ["), e = txt.lastIndexOf("]");
  if (s < 0 || e < 0) throw new Error(`no data array found in ${file}`);
  return JSON.parse(txt.slice(s + 2, e + 1));
}

const CLASS_SEVERITY: ChangeClass[] = [
  "source_metadata_only", "uncertainty_update", "precision_improvement", "value_change",
  "classification_change", "status_change", "identifier_change", "conflict_detected", "anomaly",
];
const moreSevere = (a: ChangeClass, b: ChangeClass) => (CLASS_SEVERITY.indexOf(a) >= CLASS_SEVERITY.indexOf(b) ? a : b);

function classifyField(snap: RefreshSnapshot, field: string, from: unknown, to: unknown): { class: ChangeClass; rel?: number } {
  if (snap.idFields.includes(field)) return { class: "identifier_change" };
  if (snap.statusFields.includes(field)) return { class: "status_change" };
  if (snap.classificationFields.includes(field)) return { class: "classification_change" };
  if (snap.uncertaintyMarkers.some((m) => field.includes(m))) return { class: "uncertainty_update" };
  if (snap.metadataFields.includes(field)) return { class: "source_metadata_only" };
  // A numeric value: precision_improvement / value_change / anomaly by relative magnitude.
  // A numeric value, either a bare number OR a nested measurement like {value, sigma, unit}
  // (SBDB orbit elements are stored this way) — compare the numeric magnitude so a large
  // orbit/parameter swing is correctly flagged as an anomaly, not a plain value_change.
  const fn = numericOf(from), tn = numericOf(to);
  if (fn != null && tn != null) {
    const rel = Math.abs(tn - fn) / Math.max(1e-12, Math.abs(fn));
    if (rel >= anomalyThresholdFor(snap.id)) return { class: "anomaly", rel };
    if (rel <= PRECISION_IMPROVEMENT_REL) return { class: "precision_improvement", rel };
    return { class: "value_change", rel };
  }
  // A boolean/status-ish flip on an unclassified field, or a nested-object change with no
  // comparable numeric magnitude, is a value change (never silently ignored).
  return { class: "value_change" };
}

/** Numeric magnitude of a field: a bare number, or the `.value` of a nested measurement object. */
function numericOf(x: unknown): number | null {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (x && typeof x === "object" && "value" in x && typeof (x as { value: unknown }).value === "number") return (x as { value: number }).value;
  return null;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export function diffSnapshots(snap: RefreshSnapshot, oldRows: Record<string, unknown>[], newRows: Record<string, unknown>[]): SnapshotDiff {
  const oldByKey = new Map(oldRows.map((r) => [String(r[snap.keyField]), r]));
  const newByKey = new Map(newRows.map((r) => [String(r[snap.keyField]), r]));
  const changed: RowChange[] = [];

  for (const [key, nr] of newByKey) {
    const or = oldByKey.get(key);
    if (!or) { changed.push({ key, kind: "added", class: "added", fields: [] }); continue; }
    const fields: FieldChange[] = [];
    for (const field of new Set([...Object.keys(or), ...Object.keys(nr)])) {
      // Never compare the retrieval-date metadata itself as a scientific change.
      if (/retrievedAt/i.test(field)) continue;
      if (!eq(or[field], nr[field])) {
        const c = classifyField(snap, field, or[field], nr[field]);
        fields.push({ field, from: or[field] ?? null, to: nr[field] ?? null, class: c.class, rel: c.rel });
      }
    }
    if (fields.length) changed.push({ key, kind: "modified", class: fields.map((f) => f.class).reduce(moreSevere), fields });
  }
  for (const [key] of oldByKey) if (!newByKey.has(key)) changed.push({ key, kind: "removed", class: "source_removed", fields: [] });

  const byClass: Record<string, number> = {};
  for (const c of changed) byClass[c.class] = (byClass[c.class] ?? 0) + 1;

  const reviewReasons: string[] = [];
  for (const cls of REVIEW_REQUIRED_CLASSES) if (byClass[cls]) reviewReasons.push(`${byClass[cls]} ${cls}`);
  // Blast-radius gate: count EVERY changed row — added, removed and modified — against the
  // larger of the two datasets, so a large influx of new, unvetted rows (a superset source
  // or a duplicating ingest bug) also requires review, not just modifications/removals.
  const changedFraction = changed.length / Math.max(oldRows.length, newRows.length, 1);
  if (changedFraction > MAX_CHANGED_FRACTION) reviewReasons.push(`${(changedFraction * 100).toFixed(0)}% of rows changed (> ${MAX_CHANGED_FRACTION * 100}%)`);

  return {
    snapshotId: snap.id, oldCount: oldRows.length, newCount: newRows.length, changed, byClass,
    hasMeaningfulChanges: changed.length > 0,
    requiresReview: reviewReasons.length > 0,
    reviewReasons,
  };
}

/** Human-readable diff summary for a PR body / workflow log. */
export function renderDiffMarkdown(d: SnapshotDiff): string {
  const lines = [
    `### Refresh diff — \`${d.snapshotId}\``,
    `Rows: ${d.oldCount} → ${d.newCount}. Changed rows: ${d.changed.length}.`,
    "",
    ...Object.entries(d.byClass).sort().map(([k, v]) => `- **${k}**: ${v}`),
    "",
    d.requiresReview ? `⚠️ **Requires human review**: ${d.reviewReasons.join("; ")}.` : "✅ Within safe auto-merge thresholds.",
  ];
  const samples = d.changed.filter((c) => c.kind === "modified").slice(0, 8);
  if (samples.length) {
    lines.push("", "<details><summary>Sample field changes</summary>", "");
    for (const c of samples) for (const f of c.fields.slice(0, 4)) lines.push(`- \`${c.key}\`.${f.field} (${f.class}): ${JSON.stringify(f.from)} → ${JSON.stringify(f.to)}`);
    lines.push("</details>");
  }
  return lines.join("\n");
}
