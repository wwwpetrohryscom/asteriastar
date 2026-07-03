import { rel, type Domain, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { CONSTELLATIONS } from "@/knowledge-graph/data/star-catalog/constellations";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/constellations-catalog/legacy-relations";
import type { AsterismRecord, ConstellationRecord, FamilyRecord, SeasonRecord } from "@/knowledge-graph/data/constellations-catalog/types";
import { constellations } from "@/knowledge-graph/data/constellations-catalog/data/constellations";
import { families } from "@/knowledge-graph/data/constellations-catalog/data/families";
import { asterisms } from "@/knowledge-graph/data/constellations-catalog/data/asterisms";
import { seasons } from "@/knowledge-graph/data/constellations-catalog/data/seasons";

/**
 * Constellation Encyclopedia catalog (Program W). The 88 constellation entities
 * already exist and are ENRICHED here (their entryPaths are repointed to
 * /constellations/{slug} at their definition sites — this catalog does not
 * recreate them). This catalog CREATES the new family / asterism / seasonal-sky
 * entities and derives typed relations that REUSE existing constellation, star,
 * and mythology entities: belongs_to_family, best_observed_in, neighbor_of, and
 * asterism/mythology associations. Star / deep-sky / exoplanet / meteor
 * connections already exist (belongs_to_constellation / located_in_constellation /
 * associated_with) and are surfaced by the engine — never re-emitted. Nothing is
 * fabricated: rank is derived from the official IAU areas.
 */

// Rank-by-area derived once from the official areas (single source of truth).
{
  const ranked = constellations.filter((c) => c.areaSqDeg != null).sort((a, b) => (b.areaSqDeg ?? 0) - (a.areaSqDeg ?? 0));
  ranked.forEach((c, i) => {
    c.rankByArea = i + 1;
  });
}

export const CONSTELLATION_RECORDS: ConstellationRecord[] = constellations;
export const CONSTELLATION_BY_ID = new Map(constellations.map((c) => [c.id, c]));
export const CONSTELLATION_BY_SLUG = new Map(constellations.map((c) => [c.slug, c]));
export const FAMILY_BY_SLUG = new Map<string, FamilyRecord>(families.map((f) => [f.slug, f]));
export const ASTERISM_BY_SLUG = new Map<string, AsterismRecord>(asterisms.map((a) => [a.slug, a]));
export const SEASON_BY_SLUG = new Map<string, SeasonRecord>(seasons.map((s) => [s.slug, s]));

function group(key: (c: ConstellationRecord) => string | undefined): Map<string, ConstellationRecord[]> {
  const m = new Map<string, ConstellationRecord[]>();
  for (const c of constellations) {
    const k = key(c);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(c);
  }
  return m;
}
export const CONSTELLATIONS_BY_FAMILY = group((c) => c.family);
export const CONSTELLATIONS_BY_HEMISPHERE = group((c) => c.hemisphere);
export const CONSTELLATIONS_BY_SEASON = group((c) => c.season);

/* ----------------------------------------------------------- entities */

const familyEntities: GraphEntity[] = families.map((f) => ({
  id: `constellation_family:${f.slug}`,
  type: "constellation_family" as const,
  name: f.name,
  domain: "science" as const,
  entryPath: `/constellations/family/${f.slug}`,
  description: f.description,
  sources: f.sources,
}));
const asterismEntities: GraphEntity[] = asterisms.map((a) => ({
  id: `asterism:${a.slug}`,
  type: "asterism" as const,
  name: a.name,
  domain: "science" as const,
  entryPath: `/constellations/asterism/${a.slug}`,
  description: a.description,
  sources: a.sources,
}));
const seasonEntities: GraphEntity[] = seasons.map((s) => ({
  id: `seasonal_sky:${s.slug}`,
  type: "seasonal_sky" as const,
  name: s.name,
  domain: "science" as const,
  entryPath: `/constellations/season/${s.slug}`,
  description: s.description,
  sources: s.sources,
}));

export const entities: GraphEntity[] = [...familyEntities, ...asterismEntities, ...seasonEntities];

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string, type: RelationType, to: string | undefined, domain: Domain = "science") {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  // Mythology links cross the science↔culture boundary and are "interpretive".
  derived.push(rel(from, type, to, domain === "culture" ? "interpretive" : "confirmed", domain));
}

// neighbour_of — one edge per unordered constellation pair (curated IAU adjacency).
for (const c of constellations) {
  for (const n of c.neighborSlugs ?? []) {
    if (!CONSTELLATION_BY_SLUG.has(n)) continue;
    const [a, b] = [c.slug, n].sort();
    add(`constellation:${a}`, "neighbor_of", `constellation:${b}`);
  }
}
// belongs_to_family + best_observed_in + mythology (dedupe against existing edges).
for (const c of constellations) {
  if (c.family && FAMILY_BY_SLUG.has(c.family)) add(c.id, "belongs_to_family", `constellation_family:${c.family}`);
  if (c.season && SEASON_BY_SLUG.has(c.season)) add(c.id, "best_observed_in", `seasonal_sky:${c.season}`);
  if (c.mythologyFigureId) add(c.id, "mythologically_linked_to", c.mythologyFigureId, "culture");
}
// asterism associations (constellations + catalogued vertex stars, reused).
for (const a of asterisms) {
  for (const cs of a.constellationSlugs) if (CONSTELLATION_BY_SLUG.has(cs)) add(`asterism:${a.slug}`, "associated_with", `constellation:${cs}`);
  for (const s of a.starIds ?? []) add(`asterism:${a.slug}`, "associated_with", s);
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- stats + validation */

export const CONSTELLATIONS_STATS = {
  constellations: constellations.length,
  families: families.length,
  asterisms: asterisms.length,
  seasons: seasons.length,
  newEntities: entities.length,
  relations: relations.length,
  withArea: constellations.filter((c) => c.areaSqDeg != null).length,
  zodiac: constellations.filter((c) => c.zodiac).length,
} as const;

export function validateConstellations(): string[] {
  const issues: string[] = [];
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const canon = new Set(CONSTELLATIONS.map((c) => c.slug));
  const seenId = new Set<string>();

  if (constellations.length !== 88) issues.push(`expected 88 constellations, found ${constellations.length}`);
  for (const c of constellations) {
    if (seenId.has(c.id)) issues.push(`duplicate constellation id: ${c.id}`);
    seenId.add(c.id);
    if (!ID.test(c.id)) issues.push(`bad id: ${c.id}`);
    if (c.id !== `constellation:${c.slug}`) issues.push(`${c.id}: id/slug mismatch`);
    if (!canon.has(c.slug)) issues.push(`${c.id}: slug not in the 88 IAU set`);
    if (!c.sources?.length) issues.push(`${c.id}: missing sources`);
    if (!c.description) issues.push(`${c.id}: missing description`);
    if (!c.abbr || !c.genitive) issues.push(`${c.id}: missing abbr/genitive`);
    // Numeric sanity — never fabricate; a present value must be plausible.
    if (c.areaSqDeg != null && !(c.areaSqDeg > 0 && c.areaSqDeg < 1400)) issues.push(`${c.id}: implausible area ${c.areaSqDeg}`);
    if (c.decDeg != null && (c.decDeg < -90 || c.decDeg > 90)) issues.push(`${c.id}: dec out of range ${c.decDeg}`);
    if (c.raHours != null && (c.raHours < 0 || c.raHours >= 24)) issues.push(`${c.id}: RA out of range ${c.raHours}`);
    if (c.rankByArea != null && (c.rankByArea < 1 || c.rankByArea > 88)) issues.push(`${c.id}: rank out of range ${c.rankByArea}`);
    // Cross-references resolve.
    if (c.family && !FAMILY_BY_SLUG.has(c.family)) issues.push(`${c.id}: unknown family ${c.family}`);
    if (c.season && !SEASON_BY_SLUG.has(c.season)) issues.push(`${c.id}: unknown season ${c.season}`);
    for (const n of c.neighborSlugs ?? []) if (!canon.has(n)) issues.push(`${c.id}: unknown neighbour ${n}`);
    if (c.brightestStarId && !/^star:[a-z0-9-]+$/.test(c.brightestStarId)) issues.push(`${c.id}: bad brightestStarId ${c.brightestStarId}`);
  }
  // Zodiac must be exactly 12.
  const zc = constellations.filter((c) => c.zodiac).length;
  if (zc !== 12) issues.push(`expected 12 zodiac constellations, found ${zc}`);
  // Ranks (derived) must be a 1..88 permutation.
  const ranks = constellations.map((c) => c.rankByArea).filter((r): r is number => r != null).sort((a, b) => a - b);
  if (ranks.length === 88 && ranks.some((r, i) => r !== i + 1)) issues.push(`derived rankByArea is not a 1..88 permutation`);
  // Families/asterisms/seasons unique slugs.
  for (const [label, arr] of [["family", families], ["asterism", asterisms], ["season", seasons]] as [string, { slug: string }[]][]) {
    const seen = new Set<string>();
    for (const r of arr) {
      if (seen.has(r.slug)) issues.push(`duplicate ${label} slug: ${r.slug}`);
      seen.add(r.slug);
    }
  }
  // Every NEW entity must appear in ≥1 relation (no isolated nodes).
  const connected = new Set<string>();
  for (const r of relations) {
    connected.add(r.from);
    connected.add(r.to);
  }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

// Re-export record types for the engine.
export type { AsterismRecord, ConstellationRecord, FamilyRecord, SeasonRecord, Hemisphere, Season } from "@/knowledge-graph/data/constellations-catalog/types";
export { constellations, families, asterisms, seasons };
