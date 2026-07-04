import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/planetary-geology-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type GeoKind, type GeoRecord } from "@/knowledge-graph/data/planetary-geology-catalog/types";
import { featureTypes } from "@/knowledge-graph/data/planetary-geology-catalog/data/feature-types";
import { features } from "@/knowledge-graph/data/planetary-geology-catalog/data/features";

/**
 * Planetary Geology & Surface Features catalog (Program AI). It CREATES the feature-type
 * entities and the new named features, and ENRICHES the existing surface_feature entities by
 * linking each to its feature type — never duplicating them. New features are located_on
 * their reused body and member_of_group their type. Relations that duplicate an existing
 * edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

/** Existing surface_feature entities enriched with their feature type (reuse, not create). */
const REUSED_FEATURE_TYPE: [string, string][] = [
  ["surface_feature:olympus-mons", "shield-volcano"],
  ["surface_feature:valles-marineris", "canyon"],
  ["surface_feature:tycho-crater", "impact-crater"],
  ["surface_feature:mare-tranquillitatis", "lava-plain"],
  ["surface_feature:south-pole-aitken-basin", "impact-basin"],
];

export const GEO_RECORDS: GeoRecord[] = [...featureTypes, ...features];
export const GEO_BY_ID = new Map(GEO_RECORDS.map((r) => [r.id, r]));
export const GEO_BY_SLUG = new Map(GEO_RECORDS.map((r) => [r.slug, r]));
const TYPE_BY_SLUG = new Map(featureTypes.map((r) => [r.slug, r]));
const rType = (s?: string) => (s ? TYPE_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<GeoRecord, "slug">): string {
  return `/planetary-geology/${r.slug}`;
}

export const entities: GraphEntity[] = GEO_RECORDS.map((r) => ({
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

for (const r of GEO_RECORDS) {
  if (r.kind === "feature") {
    add(r.id, "member_of_group", rType(r.typeSlug));
    add(r.id, "located_on", r.bodyKey);
    for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
  }
}
for (const [featId, typeSlug] of REUSED_FEATURE_TYPE) add(featId, "member_of_group", rType(typeSlug));

export const relations: GraphRelation[] = derived;

export const GEO_STATS = {
  records: GEO_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  featureTypes: featureTypes.length,
  newFeatures: features.length,
  reusedFeatures: REUSED_FEATURE_TYPE.length,
} as const;

export function validatePlanetaryGeology(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as GeoKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<GeoKind, Set<string>>();
  const BODY_PREFIXES = ["planet:", "moon:", "dwarf_planet:", "asteroid:"];
  for (const r of GEO_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate geology id: ${r.id}`);
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
    if (r.kind === "feature") {
      if (!rType(r.typeSlug)) issues.push(`${r.id}: unresolved typeSlug "${r.typeSlug}"`);
      if (!r.bodyKey) issues.push(`${r.id}: feature has no body`);
      else if (!BODY_PREFIXES.some((p) => r.bodyKey!.startsWith(p))) issues.push(`${r.id}: body must be a planet/moon/dwarf_planet/asteroid: "${r.bodyKey}"`);
    }
    for (const k of [r.bodyKey, ...(r.relatedKeys ?? [])].filter(Boolean) as string[]) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const reusedSeen = new Set<string>();
  for (const [featId, typeSlug] of REUSED_FEATURE_TYPE) {
    if (!featId.startsWith("surface_feature:")) issues.push(`reused enrichment must be a surface_feature id: "${featId}"`);
    if (reusedSeen.has(featId)) issues.push(`duplicate reused enrichment: ${featId}`);
    reusedSeen.add(featId);
    if (!rType(typeSlug)) issues.push(`reused ${featId}: unresolved type "${typeSlug}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { GeoRecord, GeoKind, GeoCategory } from "@/knowledge-graph/data/planetary-geology-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/planetary-geology-catalog/types";
export { featureTypes, features };
