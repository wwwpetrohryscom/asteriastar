import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { OBS_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/observatory-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type ObsKind, type ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";
import { bands } from "@/knowledge-graph/data/observatory-catalog/data/bands";
import { sites, organizations } from "@/knowledge-graph/data/observatory-catalog/data/sites-orgs";
import { observatories } from "@/knowledge-graph/data/observatory-catalog/data/observatories";
import { telescopes } from "@/knowledge-graph/data/observatory-catalog/data/telescopes";
import { spaceTelescopes } from "@/knowledge-graph/data/observatory-catalog/data/spacetelescopes";
import { instruments } from "@/knowledge-graph/data/observatory-catalog/data/instruments";
import { surveys } from "@/knowledge-graph/data/observatory-catalog/data/surveys";

/**
 * Observatories & telescopes catalog. The curated dataset enriches existing
 * entities (observatories, space telescopes, JWST/Hubble instruments) and
 * creates the rest, deriving typed relations (located_at, operated_by,
 * part_of_observatory, observes_band, has_instrument, conducts_survey,
 * observed_object…). Cross-references resolve by slug against the catalog and a
 * small set of existing entities; relations are deduped against every existing
 * edge, and unresolved endpoints are dropped. Real public facts only.
 */
export const OBS_RECORDS: ObsRecord[] = [
  ...bands, ...sites, ...organizations, ...observatories, ...telescopes, ...spaceTelescopes, ...instruments, ...surveys,
];

export const OBS_BY_ID = new Map(OBS_RECORDS.map((r) => [r.id, r]));
export const OBS_BY_SLUG = new Map(OBS_RECORDS.map((r) => [r.slug, r]));

/** Existing graph entities referenced by slug but not (re)defined here. */
const EXTERNAL_SLUG_IDS: Record<string, string> = {
  nasa: "organization:nasa", esa: "organization:esa", jaxa: "organization:jaxa",
  cnsa: "organization:cnsa", csa: "organization:csa",
};

function resolve(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return OBS_BY_SLUG.get(slug)?.id ?? EXTERNAL_SLUG_IDS[slug];
}

/* ----------------------------------------------------------- entities */

const newRecords = OBS_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: `/observatories/${r.slug}`,
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seen = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined, note?: string) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (OBS_LEGACY_RELATION_IDS.has(id) || seen.has(id)) return;
  seen.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", note ? { note } : {}));
}

for (const r of OBS_RECORDS) {
  const op = resolve(r.operatorSlug);
  const site = resolve(r.siteSlug);
  const bandRel = () => { for (const b of r.bandSlugs ?? []) add(r.id, "observes_band", resolve(b)); };
  switch (r.kind) {
    case "observatory":
      add(r.id, "operated_by", op);
      for (const p of r.partnerOperatorSlugs ?? []) add(r.id, "operated_by", resolve(p), "Partner.");
      add(r.id, "built_by", resolve(r.builtBySlug));
      add(r.id, "located_at", site);
      bandRel();
      for (const s of r.surveySlugs ?? []) add(r.id, "conducts_survey", resolve(s));
      break;
    case "telescope":
      add(r.id, "operated_by", op);
      add(r.id, "part_of_observatory", resolve(r.observatorySlug));
      add(r.id, "located_at", site);
      add(resolve(r.predecessorSlug), "predecessor_of", r.id);
      bandRel();
      break;
    case "space-telescope":
      add(r.id, "operated_by", op);
      for (const p of r.partnerOperatorSlugs ?? []) add(r.id, "operated_by", resolve(p), "Partner.");
      bandRel();
      for (const s of r.surveySlugs ?? []) add(r.id, "conducts_survey", resolve(s));
      for (const k of r.relatedKeys ?? []) add(r.id, "observed_object", k);
      break;
    case "instrument":
      if (!r.existing) add(resolve(r.hostSlug), "has_instrument", r.id);
      bandRel();
      break;
    case "survey":
      add(resolve(r.conductedBySlug), "conducts_survey", r.id);
      bandRel();
      break;
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: ObsRecord) => string | undefined) {
  const m = new Map<string, ObsRecord[]>();
  for (const r of OBS_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const OBS_BY_KIND = group((r) => r.kind);

export const OBS_STATS = {
  records: OBS_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...OBS_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  observatories: (OBS_BY_KIND.get("observatory")?.length ?? 0) + (OBS_BY_KIND.get("space-telescope")?.length ?? 0),
} as const;

export function validateObservatories(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as ObsKind[]);
  for (const r of OBS_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate observatory id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate observatory slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad observatory id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (!r.existing && r.id.slice(0, r.id.indexOf(":")) !== KIND_ENTITY_TYPE[r.kind]) {
      issues.push(`${r.id}: id prefix does not match kind ${r.kind}`);
    }
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}
