import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/observing-suite-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type ObservingKind, type ObservingRecord } from "@/knowledge-graph/data/observing-suite-catalog/types";
import { planners } from "@/knowledge-graph/data/observing-suite-catalog/data/planners";
import { integrations } from "@/knowledge-graph/data/observing-suite-catalog/data/integrations";

/**
 * Professional Observatory Planning Suite catalog (Program BQ). It CREATES the observing planners and
 * the architecture-ready data integrations, and links each to the REUSED live-sky computations,
 * observing equipment, sites and techniques, the Moon, Sun, planets, meteor showers and deep-sky
 * objects (associated_with). It re-implements no ephemeris and fabricates no observing conditions;
 * the integrations await connected providers. Relations that duplicate an existing edge or whose
 * endpoints don't resolve are dropped.
 */

export const BQ_RECORDS: ObservingRecord[] = [...planners, ...integrations];
export const BQ_BY_ID = new Map(BQ_RECORDS.map((r) => [r.id, r]));
export const BQ_BY_SLUG = new Map(BQ_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<ObservingRecord, "slug">): string {
  return `/observing/${r.slug}`;
}

export const entities: GraphEntity[] = BQ_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BQ_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const BQ_STATS = {
  records: BQ_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  planners: planners.length,
  integrations: integrations.length,
} as const;

export function validateObservingSuite(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as ObservingKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<ObservingKind, Set<string>>();
  for (const r of BQ_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate observing-suite id: ${r.id}`);
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
    if (r.kind === "integration" && r.computeStatus !== "architecture") issues.push(`${r.id}: integration must be architecture-status`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { ObservingRecord, ObservingKind } from "@/knowledge-graph/data/observing-suite-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/observing-suite-catalog/types";
export { planners, integrations };
