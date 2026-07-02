import type { Changeset } from "@/platform/contributions/changesets";
import type { Contribution } from "@/platform/contributions/schema";

/**
 * Conflict and duplicate detection — pure and deterministic.
 *
 * When two open proposals touch the same object in incompatible ways, or two
 * proposals target the same thing with the same change, a reviewer needs to know
 * before either is accepted. This detects those overlaps from proposal/changeset
 * data alone; it never resolves them automatically.
 */

export type ConflictKind = "duplicate_target" | "field_conflict" | "add_remove_conflict";

export interface Conflict {
  kind: ConflictKind;
  targetId: string;
  changesetIds: string[];
  detail: string;
}

/** The states in which a proposal is still "open" and can conflict. */
const OPEN_STATES = new Set([
  "draft", "submitted", "triaged", "needs_sources", "needs_changes",
  "under_editorial_review", "under_scientific_review",
]);

/** Detect conflicts among a set of changesets targeting the same objects. */
export function detectChangesetConflicts(changesets: Changeset[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const byTarget = new Map<string, Changeset[]>();
  for (const cs of changesets) {
    const list = byTarget.get(cs.targetId) ?? [];
    list.push(cs);
    byTarget.set(cs.targetId, list);
  }

  for (const [targetId, group] of byTarget) {
    if (group.length < 2) continue;

    // Two changesets editing the same field to different values.
    const fieldEdits = new Map<string, Set<string>>();
    for (const cs of group) {
      for (const f of cs.fields ?? []) {
        const set = fieldEdits.get(f.field) ?? new Set<string>();
        set.add(String(f.after));
        fieldEdits.set(f.field, set);
      }
    }
    for (const [field, values] of fieldEdits) {
      if (values.size > 1) {
        conflicts.push({
          kind: "field_conflict",
          targetId,
          changesetIds: group.filter((c) => (c.fields ?? []).some((f) => f.field === field)).map((c) => c.id),
          detail: `field '${field}' is edited to ${values.size} different values`,
        });
      }
    }

    // An addition and a removal of the same relationship.
    const hasAdd = group.some((c) => c.changeKind === "relationship_addition");
    const hasRemove = group.some((c) => c.changeKind === "relationship_removal");
    if (hasAdd && hasRemove) {
      conflicts.push({ kind: "add_remove_conflict", targetId, changesetIds: group.map((c) => c.id), detail: "the same relationship is both added and removed" });
    }
  }
  return conflicts;
}

/**
 * Detect duplicate proposals — open proposals of the same type targeting exactly
 * the same objects. Reviewers should merge or supersede rather than double-apply.
 */
export function detectDuplicateProposals(proposals: Contribution[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const open = proposals.filter((p) => OPEN_STATES.has(p.state));
  const byKey = new Map<string, Contribution[]>();
  for (const p of open) {
    const key = `${p.type}::${p.targets.map((t) => `${t.kind}:${t.id}`).sort().join(",")}`;
    const list = byKey.get(key) ?? [];
    list.push(p);
    byKey.set(key, list);
  }
  for (const [, group] of byKey) {
    if (group.length > 1) {
      conflicts.push({
        kind: "duplicate_target",
        targetId: group[0].targets.map((t) => t.id).join(","),
        changesetIds: group.map((p) => p.id),
        detail: `${group.length} open ${group[0].type} proposals target the same object(s)`,
      });
    }
  }
  return conflicts;
}
