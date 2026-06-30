import { rel, type GraphEntity, type GraphRelation } from "@/knowledge-graph/schema";
import { CONSTELLATIONS } from "@/knowledge-graph/data/star-catalog/constellations";
import {
  DEEP_SKY_TYPE_LABELS,
  GALAXY_TYPE_LABELS,
  type DeepSkyRecord,
} from "@/knowledge-graph/data/deep-sky-catalog/types";
import { records as c0 } from "@/knowledge-graph/data/deep-sky-catalog/records/chunk-00";
import { records as c1 } from "@/knowledge-graph/data/deep-sky-catalog/records/chunk-01";
import { records as c2 } from "@/knowledge-graph/data/deep-sky-catalog/records/chunk-02";

/**
 * Deep-sky catalog. The typed dataset (OpenNGC, CC BY-SA 4.0) enriches existing
 * graph entities and creates entities + relations for new objects. Nothing is
 * hardcoded into the graph; everything derives from the dataset. Real data only.
 */
export const DEEP_SKY_RECORDS: DeepSkyRecord[] = [...c0, ...c1, ...c2];

const CON_NAME = new Map(CONSTELLATIONS.map((c) => [`constellation:${c.slug}`, c.name]));

export const DEEP_SKY_BY_ID = new Map(DEEP_SKY_RECORDS.map((r) => [r.id, r]));
export const DEEP_SKY_BY_SLUG = new Map(DEEP_SKY_RECORDS.map((r) => [r.slug, r]));

function group<K>(items: DeepSkyRecord[], key: (r: DeepSkyRecord) => K | undefined): Map<K, DeepSkyRecord[]> {
  const m = new Map<K, DeepSkyRecord[]>();
  for (const r of items) {
    const k = key(r);
    if (k === undefined) continue;
    const list = m.get(k);
    if (list) list.push(r);
    else m.set(k, [r]);
  }
  return m;
}

const byMag = (a: DeepSkyRecord, b: DeepSkyRecord) => (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99);

export const DEEP_SKY_BY_TYPE = group(DEEP_SKY_RECORDS, (r) => r.type);
for (const l of DEEP_SKY_BY_TYPE.values()) l.sort(byMag);
export const DEEP_SKY_BY_CONSTELLATION = group(DEEP_SKY_RECORDS, (r) => r.constellation);
for (const l of DEEP_SKY_BY_CONSTELLATION.values()) l.sort(byMag);

export function deepSkyCatalogNumbers(r: DeepSkyRecord): string[] {
  const out: string[] = [];
  if (r.ids.messier) out.push(r.ids.messier);
  if (r.ids.caldwell) out.push(r.ids.caldwell);
  if (r.ids.ngc) out.push(r.ids.ngc);
  if (r.ids.ic) out.push(r.ids.ic);
  if (r.ids.ugc) out.push(r.ids.ugc);
  if (r.ids.pgc) out.push(r.ids.pgc);
  return out;
}

export function deepSkyClassLabel(r: DeepSkyRecord): string {
  return r.galaxyType ? GALAXY_TYPE_LABELS[r.galaxyType] : DEEP_SKY_TYPE_LABELS[r.type];
}

function describe(r: DeepSkyRecord): string {
  const base = deepSkyClassLabel(r);
  const con = CON_NAME.get(r.constellation) ?? "the sky";
  const mag = r.apparentMagnitude != null ? `, magnitude ${r.apparentMagnitude}` : "";
  return `${base} in ${con}${mag}.`;
}

const newRecords = DEEP_SKY_RECORDS.filter((r) => !r.existing);

const derivedEntities: GraphEntity[] = newRecords.map((r) => ({
  id: r.id,
  type: r.entityType,
  name: r.name,
  domain: "science" as const,
  entryPath: `/deep-sky/${r.slug}`,
  description: describe(r),
  aliases: [r.ids.common, ...deepSkyCatalogNumbers(r)].filter((x): x is string => Boolean(x)),
  sources: r.sources,
  catalogNumbers: deepSkyCatalogNumbers(r),
}));
export const entities: GraphEntity[] = derivedEntities;

const derivedRelations: GraphRelation[] = newRecords.map((r) =>
  rel(r.id, "located_in_constellation", r.constellation, "confirmed", "science", { sources: r.sources }),
);
export const relations: GraphRelation[] = derivedRelations;

export const DEEP_SKY_STATS = {
  objects: DEEP_SKY_RECORDS.length,
  newEntities: derivedEntities.length,
  relations: relations.length,
  messier: DEEP_SKY_RECORDS.filter((r) => r.ids.messier).length,
  caldwell: DEEP_SKY_RECORDS.filter((r) => r.ids.caldwell).length,
  byType: Object.fromEntries([...DEEP_SKY_BY_TYPE.entries()].map(([k, v]) => [k, v.length])),
} as const;

export function validateDeepSky(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  // A catalogue designation maps to exactly one object: two records sharing one
  // (e.g. both claiming "NGC 5139") means the same physical object was ingested
  // twice — the duplication class the enrich-vs-create matcher must prevent.
  const seenDesignation = new Map<string, string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  for (const r of DEEP_SKY_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate deep-sky id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate deep-sky slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad deep-sky id: ${r.id}`);
    if (!CON_NAME.has(r.constellation)) issues.push(`${r.id}: unknown constellation ${r.constellation}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    for (const desig of [r.ids.messier, r.ids.ngc, r.ids.ic, r.ids.caldwell]) {
      if (!desig) continue;
      const prev = seenDesignation.get(desig);
      if (prev && prev !== r.id) issues.push(`designation ${desig} maps to two objects: ${prev} and ${r.id}`);
      seenDesignation.set(desig, r.id);
    }
  }
  return issues;
}
