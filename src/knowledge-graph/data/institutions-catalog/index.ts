import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/institutions-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type InstKind, type InstRecord } from "@/knowledge-graph/data/institutions-catalog/types";
import { institutionTypes } from "@/knowledge-graph/data/institutions-catalog/data/institution-types";
import { institutions } from "@/knowledge-graph/data/institutions-catalog/data/institutions";

/**
 * Space Agencies, Institutions & Laboratories catalog (Program AJ). It CREATES the
 * institution-type entities and the missing field centers and laboratories, and ENRICHES
 * the existing organization entities — the agencies, commercial companies, and observatory
 * operators — by linking each to its institution type, never duplicating them. New field
 * centers are part_of their reused parent agency. Relations that duplicate an existing edge
 * or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

/** Existing organization entities enriched with their institution type (reuse, not create). */
const REUSED_INSTITUTION_TYPE: [string, string][] = [
  // Space agencies
  ["organization:nasa", "space-agency"],
  ["organization:esa", "space-agency"],
  ["organization:jaxa", "space-agency"],
  ["organization:isro", "space-agency"],
  ["organization:cnsa", "space-agency"],
  ["organization:roscosmos", "space-agency"],
  ["organization:csa", "space-agency"],
  ["organization:dlr", "space-agency"],
  ["organization:cnes", "space-agency"],
  ["organization:asi", "space-agency"],
  ["organization:uk-space-agency", "space-agency"],
  ["organization:kari", "space-agency"],
  ["organization:aeb", "space-agency"],
  ["organization:uae-space-agency", "space-agency"],
  ["organization:eumetsat", "space-agency"],
  // Research laboratory
  ["organization:jpl", "research-laboratory"],
  // Commercial space companies
  ["organization:spacex", "commercial-space-company"],
  ["organization:blue-origin", "commercial-space-company"],
  ["organization:rocket-lab", "commercial-space-company"],
  ["organization:ula", "commercial-space-company"],
  ["organization:arianespace", "commercial-space-company"],
  ["organization:relativity-space", "commercial-space-company"],
  ["organization:firefly-aerospace", "commercial-space-company"],
  ["organization:isar-aerospace", "commercial-space-company"],
  ["organization:pld-space", "commercial-space-company"],
  ["organization:virgin-orbit", "commercial-space-company"],
  ["organization:lockheed-martin", "commercial-space-company"],
  ["organization:northrop-grumman", "commercial-space-company"],
  // Science institutes
  ["organization:stsci", "science-institute"],
  ["organization:sao", "science-institute"],
  ["organization:caltech-ipac", "science-institute"],
  // Observatory operators
  ["organization:eso", "observatory-organisation"],
  ["organization:noirlab", "observatory-organisation"],
  ["organization:nrao", "observatory-organisation"],
  ["organization:naoj", "observatory-organisation"],
  ["organization:naoc", "observatory-organisation"],
  ["organization:nso", "observatory-organisation"],
];

/** Existing organizations linked part_of their reused parent (reuse, not create). */
const REUSED_PARENT: [string, string][] = [
  ["organization:jpl", "organization:nasa"], // JPL is a NASA federally-funded R&D center
];

export const INST_RECORDS: InstRecord[] = [...institutionTypes, ...institutions];
export const INST_BY_ID = new Map(INST_RECORDS.map((r) => [r.id, r]));
export const INST_BY_SLUG = new Map(INST_RECORDS.map((r) => [r.slug, r]));
const TYPE_BY_SLUG = new Map(institutionTypes.map((r) => [r.slug, r]));
const rType = (s?: string) => (s ? TYPE_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<InstRecord, "slug">): string {
  return `/institutions/${r.slug}`;
}

export const entities: GraphEntity[] = INST_RECORDS.map((r) => ({
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

for (const r of INST_RECORDS) {
  if (r.kind === "org") {
    add(r.id, "member_of_group", rType(r.typeSlug));
    add(r.id, "part_of", r.parentKey);
    for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
  }
}
for (const [orgId, typeSlug] of REUSED_INSTITUTION_TYPE) add(orgId, "member_of_group", rType(typeSlug));
for (const [orgId, parentId] of REUSED_PARENT) add(orgId, "part_of", parentId);

export const relations: GraphRelation[] = derived;

/** New field centers/labs of a set of types, plus the reused (existing) org ids of those types. */
export function membersOfTypes(typeSlugs: string[]): { records: InstRecord[]; reusedIds: string[] } {
  const set = new Set(typeSlugs);
  const records = institutions.filter((o) => set.has(o.typeSlug ?? "")).sort((a, b) => a.name.localeCompare(b.name));
  const reusedIds = REUSED_INSTITUTION_TYPE.filter(([, t]) => set.has(t)).map(([id]) => id);
  return { records, reusedIds };
}

export const INST_STATS = {
  records: INST_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  types: institutionTypes.length,
  newOrgs: institutions.length,
  reusedOrgs: REUSED_INSTITUTION_TYPE.length,
} as const;

export function validateInstitutions(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as InstKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<InstKind, Set<string>>();
  for (const r of INST_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate institution id: ${r.id}`);
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
    if (r.kind === "org") {
      if (!rType(r.typeSlug)) issues.push(`${r.id}: unresolved typeSlug "${r.typeSlug}"`);
      if (r.parentKey && !r.parentKey.startsWith("organization:")) issues.push(`${r.id}: parent must be an organization: "${r.parentKey}"`);
      if (r.parentKey === r.id) issues.push(`${r.id}: cannot be part_of itself`);
    }
    for (const k of [r.parentKey, ...(r.relatedKeys ?? [])].filter(Boolean) as string[]) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const reusedSeen = new Set<string>();
  for (const [orgId, typeSlug] of REUSED_INSTITUTION_TYPE) {
    if (!orgId.startsWith("organization:")) issues.push(`reused enrichment must be an organization id: "${orgId}"`);
    if (reusedSeen.has(orgId)) issues.push(`duplicate reused enrichment: ${orgId}`);
    reusedSeen.add(orgId);
    if (INST_BY_ID.has(orgId)) issues.push(`reused org ${orgId} must not also be a new record`);
    if (!rType(typeSlug)) issues.push(`reused ${orgId}: unresolved type "${typeSlug}"`);
  }
  const parentSeen = new Set<string>();
  for (const [orgId, parentId] of REUSED_PARENT) {
    if (parentSeen.has(orgId)) issues.push(`duplicate reused parent: ${orgId}`);
    parentSeen.add(orgId);
    if (!orgId.startsWith("organization:") || !parentId.startsWith("organization:")) issues.push(`reused parent must link organizations: "${orgId}" -> "${parentId}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { InstRecord, InstKind, InstCategory } from "@/knowledge-graph/data/institutions-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/institutions-catalog/types";
export { institutionTypes, institutions };
