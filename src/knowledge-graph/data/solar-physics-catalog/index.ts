import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/solar-physics-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type SolarKind, type SolarRecord } from "@/knowledge-graph/data/solar-physics-catalog/types";
import { structure } from "@/knowledge-graph/data/solar-physics-catalog/data/structure";
import { features } from "@/knowledge-graph/data/solar-physics-catalog/data/features";
import { dynamics } from "@/knowledge-graph/data/solar-physics-catalog/data/dynamics";
import { heliosphere } from "@/knowledge-graph/data/solar-physics-catalog/data/heliosphere";

/**
 * Solar Physics, Heliosphere & Solar Observatory catalog (Program BY). It CREATES the concentric solar
 * regions, the solar features, the solar-physics/cycle/wind concepts, and the heliosphere structures,
 * and links each to the REUSED Sun, space-weather phenomena, helioseismology, solar observatories and
 * organisations already in the graph. It duplicates nothing and fabricates nothing; only well-established
 * solar physics is stated, and relations that duplicate an existing edge or whose endpoints don't
 * resolve are dropped.
 */

export const BY_RECORDS: SolarRecord[] = [...structure, ...features, ...dynamics, ...heliosphere];
export const BY_BY_ID = new Map(BY_RECORDS.map((r) => [r.id, r]));
export const BY_BY_SLUG = new Map(BY_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<SolarRecord, "slug">): string {
  return `/solar-physics/${r.slug}`;
}

export const entities: GraphEntity[] = BY_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BY_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: SolarKind[] = ["interior", "atmosphere", "feature", "physics", "cycle", "wind", "heliosphere"];

export const BY_STATS = {
  records: BY_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, BY_RECORDS.filter((r) => r.kind === k).length])) as Record<SolarKind, number>,
} as const;

export function validateSolarPhysics(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of BY_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate solar-physics id: ${r.id}`);
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

export type { SolarRecord, SolarKind } from "@/knowledge-graph/data/solar-physics-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/solar-physics-catalog/types";
export { structure, features, dynamics, heliosphere };
