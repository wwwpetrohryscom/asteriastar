import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/citizen-astronomy-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CitizenKind, type CitizenRecord } from "@/knowledge-graph/data/citizen-astronomy-catalog/types";
import { projects } from "@/knowledge-graph/data/citizen-astronomy-catalog/data/projects";
import { activities } from "@/knowledge-graph/data/citizen-astronomy-catalog/data/activities";
import { equipment } from "@/knowledge-graph/data/citizen-astronomy-catalog/data/equipment";
import { outreach } from "@/knowledge-graph/data/citizen-astronomy-catalog/data/outreach";
import { organizations } from "@/knowledge-graph/data/citizen-astronomy-catalog/data/organizations";

/**
 * Citizen Science, Amateur Astronomy & Public Observing catalog (Program AY). It CREATES the
 * citizen-science projects, the amateur observing activities, the observing equipment, the
 * public-outreach activities, and the amateur organisations (with the existing organization type),
 * and links each to the REUSED aurora, occultation and photometry methods, the meteor showers and
 * constellations, the eruptive-variable-star class, the Stardust mission, the transit method, the
 * galaxy-morphology-classification application, the Rubin Observatory, and the MAST archive it uses
 * (associated_with). It creates and duplicates nothing that already exists. Relations that
 * duplicate an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const AY_RECORDS: CitizenRecord[] = [...projects, ...activities, ...equipment, ...outreach, ...organizations];
export const AY_BY_ID = new Map(AY_RECORDS.map((r) => [r.id, r]));
export const AY_BY_SLUG = new Map(AY_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CitizenRecord, "slug">): string {
  return `/citizen-astronomy/${r.slug}`;
}

export const entities: GraphEntity[] = AY_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of AY_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const AY_STATS = {
  records: AY_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  projects: projects.length,
  activities: activities.length,
  equipment: equipment.length,
  outreach: outreach.length,
  organizations: organizations.length,
} as const;

export function validateCitizenAstronomy(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as CitizenKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<CitizenKind, Set<string>>();
  for (const r of AY_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate citizen-astronomy id: ${r.id}`);
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

export type { CitizenRecord, CitizenKind } from "@/knowledge-graph/data/citizen-astronomy-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/citizen-astronomy-catalog/types";
export { projects, activities, equipment, outreach, organizations };
