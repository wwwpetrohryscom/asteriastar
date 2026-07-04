import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/future-missions-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type ConceptKind, type ConceptRecord } from "@/knowledge-graph/data/future-missions-catalog/types";
import { themes } from "@/knowledge-graph/data/future-missions-catalog/data/themes";
import { concepts } from "@/knowledge-graph/data/future-missions-catalog/data/concepts";

/**
 * Future Space Exploration & Mission Concepts catalog (Program AN). It CREATES the exploration
 * themes and the mission concepts not yet in the graph, and links each concept to its theme
 * (member_of_group) and to the REUSED agency and target body (associated_with). The missions
 * already in the graph that are in development or en route (Europa Clipper, MMX, Comet
 * Interceptor, JUICE, Mars Sample Return, Roman) are REUSED — enriched into a theme, never
 * duplicated. Relations that duplicate an existing edge or whose endpoints don't resolve are
 * dropped. Nothing is fabricated; status and uncertainties are stated honestly.
 */

/** Existing in-development / en-route missions REUSED and enriched into a future-exploration theme. */
export const REUSED_CONCEPTS: { id: string; themeSlug: string }[] = [
  { id: "space_mission:europa-clipper", themeSlug: "ocean-worlds" },
  { id: "space_mission:juice", themeSlug: "ocean-worlds" },
  { id: "space_mission:mmx", themeSlug: "mars-exploration" },
  { id: "mission_program:mars-sample-return", themeSlug: "mars-exploration" },
  { id: "space_mission:comet-interceptor", themeSlug: "small-bodies-and-planetary-defense" },
  { id: "space_telescope:nancy-grace-roman", themeSlug: "astrophysics-observatories" },
];

export const CONCEPT_RECORDS: ConceptRecord[] = [...themes, ...concepts];
export const CONCEPT_BY_ID = new Map(CONCEPT_RECORDS.map((r) => [r.id, r]));
export const CONCEPT_BY_SLUG = new Map(CONCEPT_RECORDS.map((r) => [r.slug, r]));
const THEME_BY_SLUG = new Map(themes.map((r) => [r.slug, r]));
const rTheme = (s?: string) => (s ? THEME_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<ConceptRecord, "slug">): string {
  return `/future-exploration/${r.slug}`;
}

export const entities: GraphEntity[] = CONCEPT_RECORDS.map((r) => ({
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

for (const r of CONCEPT_RECORDS) {
  if (r.kind === "theme") continue;
  add(r.id, "member_of_group", rTheme(r.themeSlug));
  add(r.id, "associated_with", r.agencyKey);
  add(r.id, "associated_with", r.targetKey);
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}
// Enrich the reused in-development / en-route missions into their theme (never duplicated).
for (const rc of REUSED_CONCEPTS) add(rc.id, "member_of_group", rTheme(rc.themeSlug));

export const relations: GraphRelation[] = derived;

export const CONCEPT_STATS = {
  records: CONCEPT_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  themes: themes.length,
  concepts: concepts.length,
  reusedConcepts: REUSED_CONCEPTS.length,
} as const;

export function validateFutureMissions(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as ConceptKind[]);
  const STATUSES = new Set(["concept", "proposed", "under-study", "selected", "in-development", "planned", "en-route"]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<ConceptKind, Set<string>>();
  for (const r of CONCEPT_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate future-mission id: ${r.id}`);
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
    if (r.kind === "concept") {
      if (!rTheme(r.themeSlug)) issues.push(`${r.id}: unresolved themeSlug "${r.themeSlug}"`);
      if (!r.status || !STATUSES.has(r.status)) issues.push(`${r.id}: missing or invalid status`);
      if (!r.goals?.length) issues.push(`${r.id}: a mission concept must state its goals`);
      if (r.agencyKey && !r.agencyKey.startsWith("organization:")) issues.push(`${r.id}: agency must be an organization: "${r.agencyKey}"`);
    }
    for (const k of [r.agencyKey, r.targetKey, ...(r.relatedKeys ?? [])].filter(Boolean) as string[]) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const reusedSeen = new Set<string>();
  for (const rc of REUSED_CONCEPTS) {
    if (CONCEPT_BY_ID.has(rc.id)) issues.push(`reused concept ${rc.id} must not also be a new record`);
    if (reusedSeen.has(rc.id)) issues.push(`duplicate reused concept: ${rc.id}`);
    reusedSeen.add(rc.id);
    if (!rTheme(rc.themeSlug)) issues.push(`reused ${rc.id}: unresolved theme "${rc.themeSlug}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { ConceptRecord, ConceptKind, ConceptStatus } from "@/knowledge-graph/data/future-missions-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL, STATUS_LABEL } from "@/knowledge-graph/data/future-missions-catalog/types";
export { themes, concepts };
