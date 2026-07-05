import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/distance-ladder-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type DistanceKind, type DistanceRecord } from "@/knowledge-graph/data/distance-ladder-catalog/types";
import { indicators } from "@/knowledge-graph/data/distance-ladder-catalog/data/indicators";
import { parameters } from "@/knowledge-graph/data/distance-ladder-catalog/data/parameters";
import { programs } from "@/knowledge-graph/data/distance-ladder-catalog/data/programs";
import { concepts } from "@/knowledge-graph/data/distance-ladder-catalog/data/concepts";

/**
 * Cosmic Distance Ladder & Cosmological Tensions catalog (Program AV). It CREATES the distance
 * indicators still missing from the graph, the cosmological parameters, the SH0ES programme (with
 * the existing observational-programme type), and early dark energy (with the existing
 * cosmology-concept type), and links each to the REUSED rungs, methods, facilities, and concepts it
 * uses (associated_with). It creates and duplicates nothing that already exists. Relations that
 * duplicate an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const AV_RECORDS: DistanceRecord[] = [...indicators, ...parameters, ...programs, ...concepts];
export const AV_BY_ID = new Map(AV_RECORDS.map((r) => [r.id, r]));
export const AV_BY_SLUG = new Map(AV_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<DistanceRecord, "slug">): string {
  return `/distance-ladder/${r.slug}`;
}

export const entities: GraphEntity[] = AV_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of AV_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const AV_STATS = {
  records: AV_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  indicators: indicators.length,
  parameters: parameters.length,
  programs: programs.length,
  concepts: concepts.length,
} as const;

export function validateDistanceLadder(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as DistanceKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<DistanceKind, Set<string>>();
  for (const r of AV_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate distance-ladder id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (seenSlug.has(r.slug)) issues.push(`duplicate slug across kinds: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    if (r.kind !== "parameter" && r.symbol) issues.push(`${r.id}: symbol only valid on a parameter`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { DistanceRecord, DistanceKind } from "@/knowledge-graph/data/distance-ladder-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/distance-ladder-catalog/types";
export { indicators, parameters, programs, concepts };
