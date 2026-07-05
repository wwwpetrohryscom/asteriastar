import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/astrobiology-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type AstrobiologyKind, type AstrobiologyRecord } from "@/knowledge-graph/data/astrobiology-catalog/types";
import { topics } from "@/knowledge-graph/data/astrobiology-catalog/data/topics";
import { biosignatures } from "@/knowledge-graph/data/astrobiology-catalog/data/biosignatures";
import { factors } from "@/knowledge-graph/data/astrobiology-catalog/data/factors";
import { protection } from "@/knowledge-graph/data/astrobiology-catalog/data/protection";

/**
 * Astrobiology, Biosignatures & the Search for Life catalog (Program AR). It CREATES the
 * astrobiology disciplines, the biosignatures, the habitability factors, and the planetary-
 * protection measures, and links each to its discipline (member_of_group) and to the REUSED
 * ocean-world moons, Mars, the habitable-zone concept, the SETI Institute, the life-search
 * missions, and spectroscopy it concerns (associated_with). Relations that duplicate an existing
 * edge or whose endpoints don't resolve are dropped. Nothing is fabricated; the search for life
 * is presented as science, with false positives treated seriously.
 */

export const AB_RECORDS: AstrobiologyRecord[] = [...topics, ...biosignatures, ...factors, ...protection];
export const AB_BY_ID = new Map(AB_RECORDS.map((r) => [r.id, r]));
export const AB_BY_SLUG = new Map(AB_RECORDS.map((r) => [r.slug, r]));
const TOPIC_BY_SLUG = new Map(topics.map((r) => [r.slug, r]));
const rTopic = (s?: string) => (s ? TOPIC_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<AstrobiologyRecord, "slug">): string {
  return `/astrobiology/${r.slug}`;
}

export const entities: GraphEntity[] = AB_RECORDS.map((r) => ({
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

for (const r of AB_RECORDS) {
  if (r.kind !== "topic") add(r.id, "member_of_group", rTopic(r.topicSlug));
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const AB_STATS = {
  records: AB_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  topics: topics.length,
  biosignatures: biosignatures.length,
  factors: factors.length,
  protection: protection.length,
} as const;

export function validateAstrobiology(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as AstrobiologyKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<AstrobiologyKind, Set<string>>();
  for (const r of AB_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate astrobiology id: ${r.id}`);
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
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { AstrobiologyRecord, AstrobiologyKind } from "@/knowledge-graph/data/astrobiology-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/astrobiology-catalog/types";
export { topics, biosignatures, factors, protection };
