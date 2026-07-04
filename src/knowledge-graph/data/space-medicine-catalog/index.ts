import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/space-medicine-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type MedKind, type MedRecord } from "@/knowledge-graph/data/space-medicine-catalog/types";
import { topics } from "@/knowledge-graph/data/space-medicine-catalog/data/topics";
import { effects } from "@/knowledge-graph/data/space-medicine-catalog/data/effects";
import { technologies } from "@/knowledge-graph/data/space-medicine-catalog/data/technologies";
import { countermeasures } from "@/knowledge-graph/data/space-medicine-catalog/data/countermeasures";

/**
 * Life Support, Space Biology & Space Medicine catalog (Program AL). It CREATES the
 * space-biology disciplines, the physiological effects of spaceflight, the life-support
 * technologies, and the countermeasures, and links them: technologies are part_of the REUSED
 * ECLSS system, countermeasures mitigate the effects they target, and everything is
 * member_of_group its discipline and associated_with the reused radiation environments,
 * stations, and astronauts. Relations that duplicate an existing edge or whose endpoints
 * don't resolve are dropped. Nothing is fabricated.
 */
const ECLSS_ID = "life_support_system:eclss";

export const MED_RECORDS: MedRecord[] = [...topics, ...effects, ...technologies, ...countermeasures];
export const MED_BY_ID = new Map(MED_RECORDS.map((r) => [r.id, r]));
export const MED_BY_SLUG = new Map(MED_RECORDS.map((r) => [r.slug, r]));
const TOPIC_BY_SLUG = new Map(topics.map((r) => [r.slug, r]));
const EFFECT_BY_SLUG = new Map(effects.map((r) => [r.slug, r]));
const rTopic = (s?: string) => (s ? TOPIC_BY_SLUG.get(s)?.id : undefined);

/**
 * Existing `space_medicine_topic` entities (from the human-spaceflight catalog) that describe
 * physiological effects already in the graph. Program AL REUSES them — enriching each into a
 * discipline and letting countermeasures mitigate them — rather than minting a duplicate
 * `physiological_effect` node. They keep their canonical /human-spaceflight pages.
 */
export const REUSED_EFFECTS: { id: string; topicSlug: string; relatedKeys?: string[] }[] = [
  { id: "space_medicine_topic:bone-density-loss", topicSlug: "space-medicine", relatedKeys: ["satellite:international-space-station", "space_station:mir"] },
  { id: "space_medicine_topic:muscle-atrophy", topicSlug: "space-medicine", relatedKeys: ["satellite:international-space-station"] },
  { id: "space_medicine_topic:fluid-shift", topicSlug: "space-medicine", relatedKeys: ["satellite:international-space-station"] },
  { id: "space_medicine_topic:space-radiation", topicSlug: "space-radiation-biology", relatedKeys: ["radiation_environment:galactic-cosmic-rays", "radiation_environment:solar-energetic-particles", "radiation_environment:cosmic-rays"] },
];
const REUSED_EFFECT_ID = new Map(REUSED_EFFECTS.map((r) => [r.id.slice(r.id.indexOf(":") + 1), r.id]));

/** Resolve an effect slug to its graph id — a new physiological_effect, or a reused space_medicine_topic. */
export function effectIdForSlug(slug?: string): string | undefined {
  if (!slug) return undefined;
  if (EFFECT_BY_SLUG.has(slug)) return `physiological_effect:${slug}`;
  return REUSED_EFFECT_ID.get(slug);
}
const rEffect = effectIdForSlug;

export function entryPathFor(r: Pick<MedRecord, "slug">): string {
  return `/space-medicine/${r.slug}`;
}

export const entities: GraphEntity[] = MED_RECORDS.map((r) => ({
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

for (const r of MED_RECORDS) {
  if (r.kind === "topic") {
    for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
    continue;
  }
  add(r.id, "member_of_group", rTopic(r.topicSlug));
  if (r.kind === "technology" && r.partOfEclss) add(r.id, "part_of", ECLSS_ID);
  if (r.kind === "countermeasure") for (const s of r.mitigatesSlugs ?? []) add(r.id, "mitigates", rEffect(s));
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}
// Enrich the reused space_medicine_topic effects into their discipline (never duplicated).
for (const re of REUSED_EFFECTS) {
  add(re.id, "member_of_group", rTopic(re.topicSlug));
  for (const k of re.relatedKeys ?? []) add(re.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const MED_STATS = {
  records: MED_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  topics: topics.length,
  effects: effects.length,
  reusedEffects: REUSED_EFFECTS.length,
  technologies: technologies.length,
  countermeasures: countermeasures.length,
} as const;

export function validateSpaceMedicine(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as MedKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<MedKind, Set<string>>();
  for (const r of MED_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate space-medicine id: ${r.id}`);
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
    if (r.kind !== "topic" && !rTopic(r.topicSlug)) issues.push(`${r.id}: unresolved topicSlug "${r.topicSlug}"`);
    if (r.kind === "countermeasure") for (const s of r.mitigatesSlugs ?? []) if (!rEffect(s)) issues.push(`${r.id}: mitigates unresolved effect "${s}"`);
    if (r.kind !== "countermeasure" && r.mitigatesSlugs?.length) issues.push(`${r.id}: mitigatesSlugs only valid on a countermeasure`);
    if (r.kind !== "technology" && r.partOfEclss) issues.push(`${r.id}: partOfEclss only valid on a technology`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const reusedSeen = new Set<string>();
  for (const re of REUSED_EFFECTS) {
    if (!re.id.startsWith("space_medicine_topic:")) issues.push(`reused effect must be a space_medicine_topic id: "${re.id}"`);
    if (MED_BY_ID.has(re.id)) issues.push(`reused effect ${re.id} must not also be a new record`);
    if (reusedSeen.has(re.id)) issues.push(`duplicate reused effect: ${re.id}`);
    reusedSeen.add(re.id);
    if (!rTopic(re.topicSlug)) issues.push(`reused ${re.id}: unresolved discipline "${re.topicSlug}"`);
    for (const k of re.relatedKeys ?? []) if (!ID.test(k)) issues.push(`reused ${re.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { MedRecord, MedKind, MedCategory } from "@/knowledge-graph/data/space-medicine-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/space-medicine-catalog/types";
export { topics, effects, technologies, countermeasures };
