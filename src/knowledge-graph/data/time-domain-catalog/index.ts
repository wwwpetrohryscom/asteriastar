import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/time-domain-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type TimeDomainKind, type TimeDomainRecord } from "@/knowledge-graph/data/time-domain-catalog/types";
import { transients } from "@/knowledge-graph/data/time-domain-catalog/data/transients";
import { alertSystems } from "@/knowledge-graph/data/time-domain-catalog/data/alerts";
import { stages } from "@/knowledge-graph/data/time-domain-catalog/data/stages";

/**
 * Multi-Wavelength & Time-Domain Astronomy catalog (Program AP). It CREATES the transient
 * classes, the alert-infrastructure systems, and the observation-workflow stages, and links
 * each to the REUSED wavelength/messenger bands, multi-messenger methods, surveys, and
 * observatories it involves (associated_with); the workflow stages are chained followed_by.
 * The multi-wavelength axis is the existing set of bands, enriched, never duplicated. Relations
 * that duplicate an existing edge or whose endpoints don't resolve are dropped. Nothing is
 * fabricated.
 */

export const TD_RECORDS: TimeDomainRecord[] = [...transients, ...alertSystems, ...stages];
export const TD_BY_ID = new Map(TD_RECORDS.map((r) => [r.id, r]));
export const TD_BY_SLUG = new Map(TD_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<TimeDomainRecord, "slug">): string {
  return `/time-domain/${r.slug}`;
}

export const entities: GraphEntity[] = TD_RECORDS.map((r) => ({
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

for (const r of TD_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
  if (r.kind === "stage" && r.nextStageSlug) add(r.id, "followed_by", `observation_stage:${r.nextStageSlug}`);
}

export const relations: GraphRelation[] = derived;

export const TD_STATS = {
  records: TD_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  transients: transients.length,
  alerts: alertSystems.length,
  stages: stages.length,
} as const;

export function validateTimeDomain(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as TimeDomainKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<TimeDomainKind, Set<string>>();
  const stageSlugs = new Set(stages.map((s) => s.slug));
  for (const r of TD_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate time-domain id: ${r.id}`);
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
    if (r.kind === "stage" && r.nextStageSlug && !stageSlugs.has(r.nextStageSlug)) issues.push(`${r.id}: unresolved nextStageSlug "${r.nextStageSlug}"`);
    if (r.kind !== "stage" && (r.nextStageSlug || r.order !== undefined)) issues.push(`${r.id}: order/nextStageSlug only valid on a stage`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { TimeDomainRecord, TimeDomainKind, TransientCategory } from "@/knowledge-graph/data/time-domain-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/time-domain-catalog/types";
export { transients, alertSystems, stages };
