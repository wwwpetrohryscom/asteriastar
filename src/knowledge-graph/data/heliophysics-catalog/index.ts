import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/heliophysics-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type HelioKind, type HelioRecord } from "@/knowledge-graph/data/heliophysics-catalog/types";
import { phenomena } from "@/knowledge-graph/data/heliophysics-catalog/data/phenomena";
import { impacts } from "@/knowledge-graph/data/heliophysics-catalog/data/impacts";
import { services } from "@/knowledge-graph/data/heliophysics-catalog/data/services";

/**
 * Heliophysics & Space Weather Operations catalog (Program AW). It CREATES the solar-source
 * phenomena still missing from the graph (with the existing space-weather-phenomenon type), the
 * operational impacts (a new type), and ESA's space-weather service (with the existing
 * organization type, matching NOAA SWPC), and links each to the REUSED phenomena, radiation environments,
 * NOAA scales, missions, and organisations it relates to (associated_with). It creates and
 * duplicates nothing that already exists. Relations that duplicate an existing edge or whose
 * endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const AW_RECORDS: HelioRecord[] = [...phenomena, ...impacts, ...services];
export const AW_BY_ID = new Map(AW_RECORDS.map((r) => [r.id, r]));
export const AW_BY_SLUG = new Map(AW_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<HelioRecord, "slug">): string {
  return `/heliophysics/${r.slug}`;
}

export const entities: GraphEntity[] = AW_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of AW_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const AW_STATS = {
  records: AW_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  phenomena: phenomena.length,
  impacts: impacts.length,
  services: services.length,
} as const;

export function validateHeliophysics(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as HelioKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<HelioKind, Set<string>>();
  for (const r of AW_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate heliophysics id: ${r.id}`);
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

export type { HelioRecord, HelioKind } from "@/knowledge-graph/data/heliophysics-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/heliophysics-catalog/types";
export { phenomena, impacts, services };
