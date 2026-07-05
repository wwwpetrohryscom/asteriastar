import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/astro-ml-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type MlKind, type MlRecord } from "@/knowledge-graph/data/astro-ml-catalog/types";
import { methods } from "@/knowledge-graph/data/astro-ml-catalog/data/methods";
import { applications } from "@/knowledge-graph/data/astro-ml-catalog/data/applications";
import { workflows } from "@/knowledge-graph/data/astro-ml-catalog/data/workflows";
import { brokers } from "@/knowledge-graph/data/astro-ml-catalog/data/brokers";

/**
 * Data Science, AI & Machine Learning in Astronomy catalog (Program AX). It CREATES the
 * machine-learning methods, the astronomical applications, and the data-engineering workflows, and
 * the community alert brokers (with the existing alert-system type), and links each to the REUSED
 * Rubin Observatory and alert stream, the alert systems, the photometry/lensing methods, the galaxy
 * morphologies, the transit method, the Type Ia supernova class, the redshift concept, and the
 * open-science practices it uses (associated_with). It creates and duplicates nothing that already
 * exists. Relations that duplicate an existing edge or whose endpoints don't resolve are dropped.
 * Nothing is fabricated.
 */

export const AX_RECORDS: MlRecord[] = [...methods, ...applications, ...workflows, ...brokers];
export const AX_BY_ID = new Map(AX_RECORDS.map((r) => [r.id, r]));
export const AX_BY_SLUG = new Map(AX_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<MlRecord, "slug">): string {
  return `/astro-ml/${r.slug}`;
}

export const entities: GraphEntity[] = AX_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of AX_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const AX_STATS = {
  records: AX_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  methods: methods.length,
  applications: applications.length,
  workflows: workflows.length,
  brokers: brokers.length,
} as const;

export function validateAstroMl(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as MlKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<MlKind, Set<string>>();
  for (const r of AX_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate astro-ml id: ${r.id}`);
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

export type { MlRecord, MlKind } from "@/knowledge-graph/data/astro-ml-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/astro-ml-catalog/types";
export { methods, applications, workflows, brokers };
