import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/planetary-defense-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type DefenseKind, type DefenseRecord } from "@/knowledge-graph/data/planetary-defense-catalog/types";
import { stages } from "@/knowledge-graph/data/planetary-defense-catalog/data/stages";
import { scales } from "@/knowledge-graph/data/planetary-defense-catalog/data/scales";
import { methods } from "@/knowledge-graph/data/planetary-defense-catalog/data/methods";

/**
 * Planetary Defense & NEO Operations catalog (Program AS). It CREATES the NEO-operations pipeline
 * stages, the impact-risk scales, and the deflection methods, and links each to the REUSED
 * surveys, organisations, missions, and objects it uses (associated_with); the pipeline stages
 * are chained followed_by. It creates and duplicates nothing that already exists. Relations that
 * duplicate an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated;
 * deflection-method maturity is stated honestly.
 */

export const PD_RECORDS: DefenseRecord[] = [...stages, ...scales, ...methods];
export const PD_BY_ID = new Map(PD_RECORDS.map((r) => [r.id, r]));
export const PD_BY_SLUG = new Map(PD_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<DefenseRecord, "slug">): string {
  return `/planetary-defense/${r.slug}`;
}

export const entities: GraphEntity[] = PD_RECORDS.map((r) => ({
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

for (const r of PD_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
  if (r.kind === "stage" && r.nextStageSlug) add(r.id, "followed_by", `defense_stage:${r.nextStageSlug}`);
}

export const relations: GraphRelation[] = derived;

export const PD_STATS = {
  records: PD_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  stages: stages.length,
  scales: scales.length,
  methods: methods.length,
} as const;

export function validatePlanetaryDefense(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as DefenseKind[]);
  const MATURITIES = new Set(["demonstrated", "in-development", "concept", "theoretical"]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<DefenseKind, Set<string>>();
  const stageSlugs = new Set(stages.map((s) => s.slug));
  for (const r of PD_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate planetary-defense id: ${r.id}`);
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
    if (r.kind === "method" && (!r.maturity || !MATURITIES.has(r.maturity))) issues.push(`${r.id}: missing or invalid maturity`);
    if (r.kind !== "method" && r.maturity) issues.push(`${r.id}: maturity only valid on a deflection method`);
    if (r.kind === "stage" && r.nextStageSlug && !stageSlugs.has(r.nextStageSlug)) issues.push(`${r.id}: unresolved nextStageSlug "${r.nextStageSlug}"`);
    if (r.kind !== "stage" && (r.nextStageSlug || r.order !== undefined)) issues.push(`${r.id}: order/nextStageSlug only valid on a stage`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { DefenseRecord, DefenseKind, DefenseMaturity } from "@/knowledge-graph/data/planetary-defense-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL, MATURITY_LABEL } from "@/knowledge-graph/data/planetary-defense-catalog/types";
export { stages, scales, methods };
