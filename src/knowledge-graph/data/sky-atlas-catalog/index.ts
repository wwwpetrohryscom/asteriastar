import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/sky-atlas-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type AtlasKind, type AtlasRecord } from "@/knowledge-graph/data/sky-atlas-catalog/types";
import { views } from "@/knowledge-graph/data/sky-atlas-catalog/data/views";
import { overlays } from "@/knowledge-graph/data/sky-atlas-catalog/data/overlays";

/**
 * Interactive Sky Atlas catalog (Program BO). It CREATES the atlas views and overlays — the visual
 * layer over the graph — and links each to the REUSED real stars, deep-sky objects, planets, moons,
 * galaxies, exoplanets, constellations, telescopes and surveys whose measured data it renders
 * (associated_with). It creates and duplicates nothing that already exists; positions are drawn from
 * the real coordinates already in the graph and never fabricated. Relations that duplicate an
 * existing edge or whose endpoints don't resolve are dropped.
 */

export const BO_RECORDS: AtlasRecord[] = [...views, ...overlays];
export const BO_BY_ID = new Map(BO_RECORDS.map((r) => [r.id, r]));
export const BO_BY_SLUG = new Map(BO_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<AtlasRecord, "slug">): string {
  return `/sky-atlas/${r.slug}`;
}

export const entities: GraphEntity[] = BO_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BO_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const BO_STATS = {
  records: BO_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  views: views.length,
  overlays: overlays.length,
} as const;

export function validateSkyAtlas(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as AtlasKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<AtlasKind, Set<string>>();
  for (const r of BO_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate sky-atlas id: ${r.id}`);
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
    if (r.kind === "view" && !r.renderMode) issues.push(`${r.id}: view missing renderMode`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { AtlasRecord, AtlasKind } from "@/knowledge-graph/data/sky-atlas-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/sky-atlas-catalog/types";
export { views, overlays };
