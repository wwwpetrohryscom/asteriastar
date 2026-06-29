import { getEntityById } from "@/knowledge-graph";
import { getEntryByPath } from "@/content/entries";
import type { Collection } from "@/lib/community/collections";
import type { Observation } from "@/lib/community/observations";
import type { Astrophoto } from "@/lib/community/astrophotography";
import type { Profile } from "@/lib/community/profiles";

/**
 * Community architecture aggregate + reference-integrity validator.
 *
 * No persistence, no users, no seed data. `validateCommunity` is the gate that
 * guarantees the core invariant when real data eventually exists: every
 * community object references EXISTING graph entities / content entries and
 * never duplicates graph data. With no data, it is a no-op that proves the gate.
 */

export * from "@/lib/community/identity";
export * from "@/lib/community/ids";
export * from "@/lib/community/profiles";
export * from "@/lib/community/collections";
export * from "@/lib/community/observations";
export * from "@/lib/community/astrophotography";
export * from "@/lib/community/contributions";
export * from "@/lib/community/reputation";

export interface CommunityData {
  profiles?: Profile[];
  collections?: Collection[];
  observations?: Observation[];
  photos?: Astrophoto[];
}

function entityExists(ref: string): boolean {
  return Boolean(getEntityById(ref));
}
function entryExists(path: string): boolean {
  return Boolean(getEntryByPath(path));
}

/** Validate that all community references resolve to existing graph entities/entries. */
export function validateCommunity(data: CommunityData = {}): string[] {
  const issues: string[] = [];

  for (const c of data.collections ?? []) {
    for (const ref of c.entityRefs) {
      if (!entityExists(ref)) issues.push(`collection ${c.id}: entityRef not found → ${ref}`);
    }
    for (const ref of c.entryRefs) {
      if (!entryExists(ref)) issues.push(`collection ${c.id}: entryRef not found → ${ref}`);
    }
  }
  for (const o of data.observations ?? []) {
    if (!entityExists(o.objectEntity)) {
      issues.push(`observation ${o.id}: objectEntity not found → ${o.objectEntity}`);
    }
    for (const ref of o.equipmentEntities ?? []) {
      if (!entityExists(ref)) issues.push(`observation ${o.id}: equipment not found → ${ref}`);
    }
  }
  for (const p of data.photos ?? []) {
    if (!entityExists(p.objectEntity)) {
      issues.push(`astrophoto ${p.id}: objectEntity not found → ${p.objectEntity}`);
    }
  }
  for (const pr of data.profiles ?? []) {
    for (const ref of [...pr.interests, ...pr.favoriteEntities]) {
      if (!entityExists(ref)) issues.push(`profile ${pr.id}: reference not found → ${ref}`);
    }
  }

  return issues;
}

/** No seed community data exists in this phase (no fake users). */
export const COMMUNITY_DATA: CommunityData = {};
