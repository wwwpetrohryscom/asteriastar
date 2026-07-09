import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CeKind, type CeRecord } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/types";
import { classes } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/data/classes";
import { objects } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/data/objects";

/**
 * Deep Sky Objects Encyclopedia catalog (Program CE). It CREATES the deep-sky object *class* taxonomy —
 * open & globular clusters, stellar associations, the emission/reflection/dark nebula subtypes, HII
 * regions, Bok globules, planetary nebulae, and supernova remnants — as `astrophysical_object_class`
 * entities, plus the two genuinely-missing famous objects (the Horsehead and Cone nebulae) as `nebula`
 * entities. It REUSES the graph's 619+ deep-sky objects, the complete galaxy morphologies, the
 * interstellar-medium concepts (molecular cloud, star-forming region, interstellar dust), the
 * stellar-death processes and supernova classes, the Messier/NGC/Sharpless/Barnard catalogues, and the
 * constellations via relatedKeys. No new EntityType is introduced. Only well-established astrophysics is
 * stated; nothing is fabricated.
 */

export const CE_RECORDS: CeRecord[] = [...classes, ...objects];
export const CE_BY_ID = new Map(CE_RECORDS.map((r) => [r.id, r]));
export const CE_BY_SLUG = new Map(CE_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CeRecord, "slug">): string {
  return `/deep-sky-encyclopedia/${r.slug}`;
}

export const entities: GraphEntity[] = CE_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CE_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: CeKind[] = ["dso-class", "object"];

export const CE_STATS = {
  records: CE_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CE_RECORDS.filter((r) => r.kind === k).length])) as Record<CeKind, number>,
} as const;

export function validateDeepSkyEncyclopedia(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CE_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate deep-sky-encyclopedia id: ${r.id}`);
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

export type { CeRecord, CeKind } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/types";
export { classes, objects };
