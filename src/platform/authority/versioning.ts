/**
 * Object-level version + change-log architecture (no persistence).
 *
 * Where src/knowledge-graph/version.ts versions the graph as a whole, this
 * models the version history of individual objects — entities, relationships,
 * datasets, articles, learning paths, timeline entries, images. The registry
 * ships empty; this is the typed contract for a future public history.
 */

export type ObjectKind =
  | "entity"
  | "relationship"
  | "dataset"
  | "article"
  | "learning-path"
  | "timeline"
  | "image";

export type ChangeType = "created" | "updated" | "reviewed" | "verified" | "deprecated" | "replaced";

export const OBJECT_KINDS: ObjectKind[] = [
  "entity",
  "relationship",
  "dataset",
  "article",
  "learning-path",
  "timeline",
  "image",
];

export const CHANGE_TYPES: ChangeType[] = [
  "created",
  "updated",
  "reviewed",
  "verified",
  "deprecated",
  "replaced",
];

export const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  created: "Created",
  updated: "Updated",
  reviewed: "Reviewed",
  verified: "Verified",
  deprecated: "Deprecated",
  replaced: "Replaced",
};

export interface ChangeLogEntry {
  type: ChangeType;
  date: string;
  reason?: string;
  reviewer?: string;
  /** Replacement object id, for "replaced" changes. */
  replacedBy?: string;
}

export interface VersionRecord {
  objectId: string;
  objectKind: ObjectKind;
  /** Current semantic version. */
  current: string;
  /** Earlier versions, oldest → newest, excluding `current`. */
  previous?: string[];
  changeSummary?: string;
  changeDate?: string;
  reason?: string;
  compatibility?: "compatible" | "breaking";
  migrationNotes?: string;
  history?: ChangeLogEntry[];
}

/** Architecture only — no per-object version history is persisted yet. */
export const VERSIONS: VersionRecord[] = [];

export function validateVersions(records: VersionRecord[] = VERSIONS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  const objectIds = new Set(records.map((v) => v.objectId));
  for (const v of records) {
    const key = `${v.objectKind}:${v.objectId}`;
    if (seen.has(key)) issues.push(`duplicate version record: ${key}`);
    seen.add(key);
    if (!OBJECT_KINDS.includes(v.objectKind)) issues.push(`${key}: invalid object kind`);
    if (!v.current?.trim()) issues.push(`${key}: missing current version`);
    // Broken version chain: current must not appear in previous; no duplicate previous.
    if (v.previous) {
      if (v.previous.includes(v.current)) issues.push(`${key}: current version also listed as previous`);
      if (new Set(v.previous).size !== v.previous.length) issues.push(`${key}: duplicate previous versions`);
    }
    for (const h of v.history ?? []) {
      if (!CHANGE_TYPES.includes(h.type)) issues.push(`${key}: invalid change type "${h.type}"`);
      // A "replaced" change must name a replacement; a named replacement must resolve.
      if (h.type === "replaced" && !h.replacedBy) issues.push(`${key}: "replaced" change missing replacedBy`);
      if (h.replacedBy && !objectIds.has(h.replacedBy)) issues.push(`${key}: broken replacedBy reference "${h.replacedBy}"`);
    }
  }
  return issues;
}

export const VERSION_STATS = {
  records: VERSIONS.length,
} as const;
