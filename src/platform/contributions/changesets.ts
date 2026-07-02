import type { ContributionState } from "@/platform/contributions/states";
import type { TargetKind } from "@/platform/contributions/schema";

/**
 * Changeset model — the proposed change expressed as data.
 *
 * A changeset is a BEFORE snapshot and an AFTER proposal. It is never applied:
 * there are no live writes, no mutations, and no graph updates in this program.
 * Applying an accepted changeset (as a versioned graph update) is future work.
 */

export type ChangeKind =
  | "entity_field_change"
  | "relationship_addition"
  | "relationship_removal"
  | "relationship_metadata_update"
  | "source_addition"
  | "citation_addition"
  | "image_metadata_update"
  | "dataset_correction"
  | "timeline_correction"
  | "learning_path_correction";

export const CHANGE_KINDS: ChangeKind[] = [
  "entity_field_change",
  "relationship_addition",
  "relationship_removal",
  "relationship_metadata_update",
  "source_addition",
  "citation_addition",
  "image_metadata_update",
  "dataset_correction",
  "timeline_correction",
  "learning_path_correction",
];

export const CHANGE_KIND_TARGET: Record<ChangeKind, TargetKind> = {
  entity_field_change: "entity",
  relationship_addition: "relationship",
  relationship_removal: "relationship",
  relationship_metadata_update: "relationship",
  source_addition: "source",
  citation_addition: "citation",
  image_metadata_update: "image",
  dataset_correction: "dataset",
  timeline_correction: "timeline",
  learning_path_correction: "learning_path",
};

/** Semantic version impact of an accepted change (never a live write). */
export type VersionImpact = "none" | "patch" | "minor" | "major";
export const VERSION_IMPACTS: VersionImpact[] = ["none", "patch", "minor", "major"];

export const VERSION_IMPACT_DESCRIPTIONS: Record<VersionImpact, string> = {
  none: "No versioned change (e.g. a review note).",
  patch: "A correction that does not change shape (e.g. a fixed value or added source).",
  minor: "Additive change (e.g. a new relationship or entity) — backward compatible.",
  major: "A breaking change to entity/relation shape or a removal.",
};

/** The default version impact for each change kind. */
export const CHANGE_KIND_IMPACT: Record<ChangeKind, VersionImpact> = {
  entity_field_change: "patch",
  relationship_addition: "minor",
  relationship_removal: "major",
  relationship_metadata_update: "patch",
  source_addition: "patch",
  citation_addition: "patch",
  image_metadata_update: "patch",
  dataset_correction: "patch",
  timeline_correction: "patch",
  learning_path_correction: "patch",
};

/** A single field-level edit within a changeset (before → after). */
export interface FieldChange {
  field: string;
  before: string | number | boolean | null;
  after: string | number | boolean | null;
}

export interface Changeset {
  /** Stable id, conventionally `changeset:<slug>`. */
  id: string;
  proposalId: string;
  changeKind: ChangeKind;
  /** The real object this changeset targets (entity id, relationship id, etc.). */
  targetId: string;
  targetKind: TargetKind;
  /** BEFORE snapshot — the current values (empty for additions of new objects). */
  before: FieldChange["before"] | Record<string, unknown> | null;
  /** AFTER proposal — the proposed values. */
  after: FieldChange["after"] | Record<string, unknown> | null;
  /** Field-level edits, where applicable. */
  fields?: FieldChange[];
  reason: string;
  /** Evidence backing the change (source keys or descriptions). */
  evidence?: string[];
  sourceRefs?: string[];
  /** The changeset's review status mirrors its proposal's state. */
  reviewStatus: ContributionState;
  versionImpact: VersionImpact;
  /** How the change would be rolled back if later invalidated. */
  rollbackNotes: string;
}

/** Live changeset registry — intentionally EMPTY. No fabricated changes. */
export const CHANGESETS: Changeset[] = [];

/** Validate a changeset's internal consistency (pure; no writes). */
export function validateChangeset(cs: Changeset): string[] {
  const issues: string[] = [];
  if (!CHANGE_KINDS.includes(cs.changeKind)) issues.push(`${cs.id}: unknown change kind ${cs.changeKind}`);
  if (!VERSION_IMPACTS.includes(cs.versionImpact)) issues.push(`${cs.id}: unknown version impact ${cs.versionImpact}`);
  if (CHANGE_KIND_TARGET[cs.changeKind] && cs.targetKind !== CHANGE_KIND_TARGET[cs.changeKind]) {
    issues.push(`${cs.id}: change kind ${cs.changeKind} expects target kind ${CHANGE_KIND_TARGET[cs.changeKind]}, got ${cs.targetKind}`);
  }
  if (!cs.reason?.trim()) issues.push(`${cs.id}: a changeset must record a reason`);
  if (!cs.rollbackNotes?.trim()) issues.push(`${cs.id}: a changeset must record rollback notes`);
  if (cs.changeKind === "relationship_removal" && cs.versionImpact !== "major") {
    issues.push(`${cs.id}: a relationship removal is a major (breaking) change`);
  }
  for (const f of cs.fields ?? []) {
    if (!f.field?.trim()) issues.push(`${cs.id}: a field change is missing a field name`);
    if (f.before === f.after) issues.push(`${cs.id}: field '${f.field}' has an identical before/after`);
  }
  return issues;
}

export function validateChangesets(changesets: Changeset[] = CHANGESETS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const cs of changesets) {
    if (seen.has(cs.id)) issues.push(`duplicate changeset id: ${cs.id}`);
    seen.add(cs.id);
    issues.push(...validateChangeset(cs));
  }
  return issues;
}
