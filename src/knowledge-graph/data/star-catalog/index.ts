import { rel, type GraphEntity, type GraphRelation } from "@/knowledge-graph/schema";
import { CONSTELLATIONS, EXISTING_CONSTELLATION_SLUGS } from "@/knowledge-graph/data/star-catalog/constellations";
import { STAR_CATEGORY_LABELS, type StarRecord } from "@/knowledge-graph/data/star-catalog/types";
import { records as c0 } from "@/knowledge-graph/data/star-catalog/records/chunk-00";
import { records as c1 } from "@/knowledge-graph/data/star-catalog/records/chunk-01";
import { records as c2 } from "@/knowledge-graph/data/star-catalog/records/chunk-02";
import { records as c3 } from "@/knowledge-graph/data/star-catalog/records/chunk-03";
import { records as c4 } from "@/knowledge-graph/data/star-catalog/records/chunk-04";
import { records as c5 } from "@/knowledge-graph/data/star-catalog/records/chunk-05";

/**
 * Drop physically-impossible photometric values that occur in the source HYG
 * database as bad-parallax artifacts, so the platform never presents them:
 *  - luminosity ≤ 0 is an underflow of a very faint star (e.g. red dwarfs);
 *  - luminosity > 5×10⁶ L☉ or absolute magnitude < −12.5 exceeds any real
 *    Milky-Way star (the most luminous known reach ≈ 10⁶ L☉ / M ≈ −12).
 * Nulled values become an honest empty state rather than a false measurement.
 */
function sanitizeStarPhotometry(r: StarRecord): StarRecord {
  const badLum = r.luminositySolar != null && (r.luminositySolar <= 0 || r.luminositySolar > 5_000_000);
  const badAbsMag = r.absoluteMagnitude != null && r.absoluteMagnitude < -12.5;
  if (!badLum && !badAbsMag) return r;
  return { ...r, luminositySolar: badLum ? undefined : r.luminositySolar, absoluteMagnitude: badAbsMag ? undefined : r.absoluteMagnitude };
}

/**
 * Star catalog — the generated dataset becomes first-class graph entities and
 * relations. Stars are NEVER hardcoded; everything here is derived from the
 * typed StarRecord dataset (sourced from the open HYG database, CC BY-SA 4.0).
 */
export const STAR_RECORDS: StarRecord[] = [...c0, ...c1, ...c2, ...c3, ...c4, ...c5].map(sanitizeStarPhotometry);

const CON_NAME = new Map(CONSTELLATIONS.map((c) => [`constellation:${c.slug}`, c.name]));
const CON_DEF = new Map(CONSTELLATIONS.map((c) => [`constellation:${c.slug}`, c]));

export const STAR_BY_ID = new Map(STAR_RECORDS.map((r) => [r.id, r]));
export const STAR_BY_SLUG = new Map(STAR_RECORDS.map((r) => [r.slug, r]));

function groupBy<K>(items: StarRecord[], key: (r: StarRecord) => K | undefined): Map<K, StarRecord[]> {
  const m = new Map<K, StarRecord[]>();
  for (const r of items) {
    const k = key(r);
    if (k === undefined) continue;
    const list = m.get(k);
    if (list) list.push(r);
    else m.set(k, [r]);
  }
  return m;
}

const byMag = (a: StarRecord, b: StarRecord) => (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99);

export const STARS_BY_CONSTELLATION = groupBy(STAR_RECORDS, (r) => r.constellation);
for (const list of STARS_BY_CONSTELLATION.values()) list.sort(byMag);

export const STARS_BY_CATEGORY = groupBy(STAR_RECORDS, (r) => r.category);
for (const list of STARS_BY_CATEGORY.values()) list.sort(byMag);

/* ---------------------------------------------------- entity derivation */

function fmtLy(ly: number): string {
  if (ly >= 1000) return Math.round(ly).toLocaleString();
  if (ly >= 100) return String(Math.round(ly));
  return ly.toFixed(1);
}

export function starCatalogNumbers(r: StarRecord): string[] {
  const out: string[] = [];
  if (r.ids.bayer) out.push(r.ids.bayer);
  if (r.ids.flamsteed) out.push(r.ids.flamsteed);
  if (r.ids.hr) out.push(`HR ${r.ids.hr}`);
  if (r.ids.hd) out.push(`HD ${r.ids.hd}`);
  if (r.ids.hip) out.push(`HIP ${r.ids.hip}`);
  if (r.ids.gliese) out.push(r.ids.gliese); // already carries its catalogue prefix (Gl/GJ/NN/Wo)
  return out;
}

function describe(r: StarRecord): string {
  const cat = r.category ? STAR_CATEGORY_LABELS[r.category] : "Star";
  const con = CON_NAME.get(r.constellation) ?? "the night sky";
  const dist = r.distanceLy != null ? `, about ${fmtLy(r.distanceLy)} light-years from Earth` : "";
  return `${cat} in ${con}${dist}.`;
}

const starEntities: GraphEntity[] = STAR_RECORDS.map((r) => ({
  id: r.id,
  type: "star",
  name: r.name,
  domain: "science",
  entryPath: `/stars/${r.slug}`,
  description: describe(r),
  aliases: [r.scientificName, ...starCatalogNumbers(r)].filter((x): x is string => Boolean(x)),
  sources: r.sources,
  ...(r.scientificName ? { scientificName: r.scientificName } : {}),
  catalogNumbers: starCatalogNumbers(r),
}));

const usedConIds = new Set(STAR_RECORDS.map((r) => r.constellation));
const constellationEntities: GraphEntity[] = CONSTELLATIONS.filter(
  (c) => !EXISTING_CONSTELLATION_SLUGS.has(c.slug) && usedConIds.has(`constellation:${c.slug}`),
).map((c) => ({
  id: `constellation:${c.slug}`,
  type: "constellation",
  name: c.name,
  domain: "science",
  entryPath: `/constellations/${c.slug}`,
  description: `The constellation ${c.name} (${c.genitive}) — ${STARS_BY_CONSTELLATION.get(`constellation:${c.slug}`)?.length ?? 0} catalogued stars in this encyclopedia.`,
  sources: ["iau"],
}));

export const entities: GraphEntity[] = [...constellationEntities, ...starEntities];

/* -------------------------------------------------- relation derivation */

const derivedRelations: GraphRelation[] = [];
for (const r of STAR_RECORDS) {
  derivedRelations.push(rel(r.id, "belongs_to_constellation", r.constellation, "confirmed", "science", { sources: r.sources }));
}
// Small catalogued star systems (components sharing one system base).
const byBase = groupBy(STAR_RECORDS, (r) => r.systemBase);
for (const group of byBase.values()) {
  if (group.length < 2 || group.length > 4) continue;
  const [head, ...rest] = group.sort(byMag);
  for (const r of rest) {
    derivedRelations.push(rel(r.id, "part_of_star_system", head.id, "confirmed", "science", { sources: r.sources }));
  }
}
export const relations: GraphRelation[] = derivedRelations;

export const STAR_STATS = {
  stars: STAR_RECORDS.length,
  constellationsCreated: constellationEntities.length,
  relations: relations.length,
} as const;

export function validateStarCatalog(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  const ID = /^star:[a-z0-9-]+$/;
  for (const r of STAR_RECORDS) {
    if (seen.has(r.id)) issues.push(`duplicate star id: ${r.id}`);
    seen.add(r.id);
    if (!ID.test(r.id)) issues.push(`bad star id: ${r.id}`);
    if (!CON_DEF.has(r.constellation)) issues.push(`${r.id}: unknown constellation ${r.constellation}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (r.slug !== r.id.replace("star:", "")) issues.push(`${r.id}: slug/id mismatch`);
  }
  return issues;
}

export { CON_DEF, CON_NAME };
