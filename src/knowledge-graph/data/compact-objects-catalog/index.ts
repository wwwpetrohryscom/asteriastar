import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/compact-objects-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CompactKind, type CompactRecord } from "@/knowledge-graph/data/compact-objects-catalog/types";
import { blackHoles } from "@/knowledge-graph/data/compact-objects-catalog/data/black-holes";
import { neutronStars } from "@/knowledge-graph/data/compact-objects-catalog/data/neutron-stars";
import { objects } from "@/knowledge-graph/data/compact-objects-catalog/data/objects";

/**
 * Black Holes, Neutron Stars & Compact Objects catalog (Program BZ). It CREATES the black-hole and
 * general-relativity physics concepts (alongside the existing event horizon, using the cosmology_concept
 * type), the neutron-star physics concepts (stellar_physics_concept), the pulsar sub-type classes
 * (astrophysical_object_class), and the specific objects — the black holes Cygnus X-1 and V404 Cygni
 * (black_hole) and the neutron stars (a new neutron_star type). It links each to the REUSED black-hole
 * and neutron-star/magnetar classes, Sgr A* and M87*, the event horizon / Hawking radiation / accretion
 * disk / Schwarzschild radius, the merger/kilonova/tidal-disruption transients, the Event Horizon
 * Telescope, the gravitational-wave and mass methods, and the Crab Nebula. It duplicates nothing and
 * fabricates nothing; only well-established astrophysics is stated.
 */

export const BZ_RECORDS: CompactRecord[] = [...blackHoles, ...neutronStars, ...objects];
export const BZ_BY_ID = new Map(BZ_RECORDS.map((r) => [r.id, r]));
export const BZ_BY_SLUG = new Map(BZ_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CompactRecord, "slug">): string {
  return `/compact-objects/${r.slug}`;
}

export const entities: GraphEntity[] = BZ_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: entryPathFor(r),
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science"));
}

for (const r of BZ_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: CompactKind[] = ["bh-physics", "bh-process", "ns-physics", "ns-class", "bh-object", "ns-object"];

export const BZ_STATS = {
  records: BZ_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, BZ_RECORDS.filter((r) => r.kind === k).length])) as Record<CompactKind, number>,
} as const;

export function validateCompactObjects(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of BZ_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate compact-object id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate slug across kinds: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { CompactRecord, CompactKind } from "@/knowledge-graph/data/compact-objects-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/compact-objects-catalog/types";
export { blackHoles, neutronStars, objects };
