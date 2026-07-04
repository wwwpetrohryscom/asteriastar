import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/astronomy-methods-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type MethodKind, type MethodRecord } from "@/knowledge-graph/data/astronomy-methods-catalog/types";
import { categories } from "@/knowledge-graph/data/astronomy-methods-catalog/data/categories";
import { methods } from "@/knowledge-graph/data/astronomy-methods-catalog/data/methods";

/**
 * Astronomy Methods, Measurements & Scientific Techniques catalog (Program AO). It CREATES the
 * method categories and the measurement/observation techniques not yet in the graph, and
 * links each method to its category (member_of_group) and to the REUSED concepts, bands,
 * telescopes, and catalogues it builds on (associated_with). The exoplanet-detection methods
 * already in the graph are REUSED — enriched into a category, never duplicated. Relations that
 * duplicate an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

/** Existing exoplanet_detection_method entities REUSED and enriched into a method category. */
export const REUSED_METHODS: { id: string; categorySlug: string }[] = [
  { id: "exoplanet_detection_method:astrometry", categorySlug: "astrometry-and-motion" },
  { id: "exoplanet_detection_method:transit", categorySlug: "exoplanet-detection" },
  { id: "exoplanet_detection_method:radial-velocity", categorySlug: "exoplanet-detection" },
  { id: "exoplanet_detection_method:direct-imaging", categorySlug: "exoplanet-detection" },
  { id: "exoplanet_detection_method:microlensing", categorySlug: "exoplanet-detection" },
  { id: "exoplanet_detection_method:transit-timing-variations", categorySlug: "exoplanet-detection" },
  { id: "exoplanet_detection_method:eclipse-timing-variations", categorySlug: "exoplanet-detection" },
  { id: "exoplanet_detection_method:pulsar-timing", categorySlug: "exoplanet-detection" },
];

export const METHOD_RECORDS: MethodRecord[] = [...categories, ...methods];
export const METHOD_BY_ID = new Map(METHOD_RECORDS.map((r) => [r.id, r]));
export const METHOD_BY_SLUG = new Map(METHOD_RECORDS.map((r) => [r.slug, r]));
const CATEGORY_BY_SLUG = new Map(categories.map((r) => [r.slug, r]));
const rCategory = (s?: string) => (s ? CATEGORY_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<MethodRecord, "slug">): string {
  return `/methods/${r.slug}`;
}

export const entities: GraphEntity[] = METHOD_RECORDS.map((r) => ({
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

for (const r of METHOD_RECORDS) {
  if (r.kind === "category") continue;
  add(r.id, "member_of_group", rCategory(r.categorySlug));
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}
// Enrich the reused exoplanet-detection methods into their category (never duplicated).
for (const rm of REUSED_METHODS) add(rm.id, "member_of_group", rCategory(rm.categorySlug));

export const relations: GraphRelation[] = derived;

export const METHOD_STATS = {
  records: METHOD_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  categories: categories.length,
  methods: methods.length,
  reusedMethods: REUSED_METHODS.length,
} as const;

export function validateAstronomyMethods(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as MethodKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<MethodKind, Set<string>>();
  for (const r of METHOD_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate method id: ${r.id}`);
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
    if (r.kind === "method" && !rCategory(r.categorySlug)) issues.push(`${r.id}: unresolved categorySlug "${r.categorySlug}"`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const reusedSeen = new Set<string>();
  for (const rm of REUSED_METHODS) {
    if (METHOD_BY_ID.has(rm.id)) issues.push(`reused method ${rm.id} must not also be a new record`);
    if (reusedSeen.has(rm.id)) issues.push(`duplicate reused method: ${rm.id}`);
    reusedSeen.add(rm.id);
    if (!rCategory(rm.categorySlug)) issues.push(`reused ${rm.id}: unresolved category "${rm.categorySlug}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { MethodRecord, MethodKind } from "@/knowledge-graph/data/astronomy-methods-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/astronomy-methods-catalog/types";
export { categories, methods };
