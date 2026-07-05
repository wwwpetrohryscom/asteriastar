import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/galaxies-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type ExtragalacticKind, type ExtragalacticRecord } from "@/knowledge-graph/data/galaxies-catalog/types";
import { morphologies } from "@/knowledge-graph/data/galaxies-catalog/data/morphologies";
import { agnTypes, agnModels } from "@/knowledge-graph/data/galaxies-catalog/data/agn";
import { processes } from "@/knowledge-graph/data/galaxies-catalog/data/processes";
import { structures } from "@/knowledge-graph/data/galaxies-catalog/data/structures";

/**
 * Galaxies, Active Galactic Nuclei & the Extragalactic Universe catalog (Program AQ). It
 * CREATES the galaxy morphologies, AGN types, galactic processes, and named cosmic structures,
 * and links each to the REUSED galaxies, astrophysical object classes, and cosmology concepts
 * it concerns (associated_with). The AGN/quasar/blazar/cluster/void object classes and the
 * cosmic-web concepts that already exist are reused, never duplicated. Relations that duplicate
 * an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const EXG_RECORDS: ExtragalacticRecord[] = [...morphologies, ...agnTypes, ...agnModels, ...processes, ...structures];
export const EXG_BY_ID = new Map(EXG_RECORDS.map((r) => [r.id, r]));
export const EXG_BY_SLUG = new Map(EXG_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<ExtragalacticRecord, "slug">): string {
  return `/galaxies/${r.slug}`;
}

export const entities: GraphEntity[] = EXG_RECORDS.map((r) => ({
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

for (const r of EXG_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const EXG_STATS = {
  records: EXG_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  morphologies: morphologies.length,
  agnTypes: agnTypes.length,
  agnModels: agnModels.length,
  processes: processes.length,
  structures: structures.length,
} as const;

export function validateGalaxies(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as ExtragalacticKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<ExtragalacticKind, Set<string>>();
  for (const r of EXG_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate galaxies id: ${r.id}`);
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
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { ExtragalacticRecord, ExtragalacticKind } from "@/knowledge-graph/data/galaxies-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/galaxies-catalog/types";
export { morphologies, agnTypes, agnModels, processes, structures };
