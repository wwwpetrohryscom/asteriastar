import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/deep-space-exploration-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type DeepExplorationKind, type DeepExplorationRecord } from "@/knowledge-graph/data/deep-space-exploration-catalog/types";
import { architecture } from "@/knowledge-graph/data/deep-space-exploration-catalog/data/architecture";
import { challenges } from "@/knowledge-graph/data/deep-space-exploration-catalog/data/challenges";

/**
 * Deep-Space Human Exploration & Habitation catalog (Program BI). It CREATES the deep-space
 * mission/habitation architectures and the integrative human challenges, and links each to the
 * REUSED Artemis program, the Lunar Gateway, in-situ resource utilisation, the habitats, the
 * countermeasures, the ECLSS and closed-loop life support, the construction processes, nuclear-
 * thermal propulsion, planetary protection, the Deep Space Network, and the space-medicine and
 * human-factors topics (associated_with). It creates and duplicates nothing that already exists.
 * Relations that duplicate an existing edge or whose endpoints don't resolve are dropped. Nothing is
 * fabricated.
 */

export const BI_RECORDS: DeepExplorationRecord[] = [...architecture, ...challenges];
export const BI_BY_ID = new Map(BI_RECORDS.map((r) => [r.id, r]));
export const BI_BY_SLUG = new Map(BI_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<DeepExplorationRecord, "slug">): string {
  return `/deep-space-exploration/${r.slug}`;
}

export const entities: GraphEntity[] = BI_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BI_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const BI_STATS = {
  records: BI_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  architecture: architecture.length,
  challenges: challenges.length,
} as const;

export function validateDeepSpaceExploration(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as DeepExplorationKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<DeepExplorationKind, Set<string>>();
  for (const r of BI_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate deep-space-exploration id: ${r.id}`);
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

export type { DeepExplorationRecord, DeepExplorationKind } from "@/knowledge-graph/data/deep-space-exploration-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/deep-space-exploration-catalog/types";
export { architecture, challenges };
