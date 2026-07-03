import {
  CONSTELLATION_RECORDS,
  CONSTELLATION_BY_ID,
  CONSTELLATION_BY_SLUG,
  CONSTELLATIONS_BY_FAMILY,
  CONSTELLATIONS_BY_HEMISPHERE,
  CONSTELLATIONS_BY_SEASON,
  FAMILY_BY_SLUG,
  ASTERISM_BY_SLUG,
  SEASON_BY_SLUG,
  families,
  asterisms,
  seasons,
  type AsterismRecord,
  type ConstellationRecord,
  type FamilyRecord,
  type Hemisphere,
  type SeasonRecord,
} from "@/knowledge-graph/data/constellations-catalog";
import { STARS_BY_CONSTELLATION } from "@/knowledge-graph/data/star-catalog";
import type { StarRecord } from "@/knowledge-graph/data/star-catalog/types";
import { DEEP_SKY_BY_CONSTELLATION } from "@/knowledge-graph/data/deep-sky-catalog";
import type { DeepSkyRecord } from "@/knowledge-graph/data/deep-sky-catalog/types";
import { meteorShowers } from "@/platform/live-sky/meteorShowers";
import type { MeteorShower } from "@/platform/live-sky/models";
import { getConnectionsByDomain, getEntityById, getRelationsForEntity } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Constellation Engine — resolver and query surface for the Constellation
 * Encyclopedia (engine.constellations). Pure, deterministic, framework-free. It
 * ENRICHES the 88 existing constellation entities and REUSES the platform's star,
 * deep-sky, exoplanet, meteor-shower, and mythology entities via prebuilt maps and
 * the existing graph relations — it creates and fabricates nothing.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: e.entryPath };
}

/** Deep-sky records for a constellation that carry a Messier designation. */
function hasMessier(r: DeepSkyRecord): boolean {
  return Boolean(r.ids?.messier);
}

/** Exoplanets hosted by catalogued stars in a constellation (host-resolvable only). */
function exoplanetsOf(conId: string): Ref[] {
  const out: Ref[] = [];
  const seen = new Set<string>();
  const stars = STARS_BY_CONSTELLATION.get(conId) ?? [];
  for (const s of stars) {
    for (const rel of getRelationsForEntity(s.id)) {
      if (rel.type === "hosts_exoplanet" && rel.from === s.id && !seen.has(rel.to)) {
        seen.add(rel.to);
        const ref = refFromId(rel.to);
        if (ref) out.push(ref);
      }
    }
  }
  return out;
}

/** Neighbouring constellations via the symmetric neighbor_of edges. */
function neighborsOf(conId: string): Ref[] {
  const out: Ref[] = [];
  const seen = new Set<string>();
  for (const rel of getRelationsForEntity(conId)) {
    if (rel.type !== "neighbor_of") continue;
    const other = rel.from === conId ? rel.to : rel.from;
    if (other.startsWith("constellation:") && !seen.has(other)) {
      seen.add(other);
      const ref = refFromId(other);
      if (ref) out.push(ref);
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export interface ResolvedConstellation {
  record: ConstellationRecord;
  /** The constellation's brightest star (curated id resolved against the full
   *  graph, so hand-curated bright stars like Rigel resolve correctly). */
  brightestStar?: Ref;
  stars: StarRecord[];
  deepSky: DeepSkyRecord[];
  exoplanets: Ref[];
  meteorShowers: MeteorShower[];
  neighbors: Ref[];
  family?: Ref;
  season?: Ref;
  mythology: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedConstellation | null {
  const record = CONSTELLATION_BY_SLUG.get(slugOrId) ?? CONSTELLATION_BY_ID.get(slugOrId);
  if (!record) return null;
  const entity = getEntityById(record.id);
  const stars = STARS_BY_CONSTELLATION.get(record.id) ?? [];
  // Prefer the curated brightest star (resolved against the full graph); fall back
  // to the brightest catalogued star for this constellation.
  const brightestStar =
    (record.brightestStarId ? refFromId(record.brightestStarId) : undefined) ??
    (stars[0] ? { id: stars[0].id, name: stars[0].name, href: `/stars/${stars[0].slug}` } : undefined);
  return {
    record,
    brightestStar,
    stars,
    deepSky: DEEP_SKY_BY_CONSTELLATION.get(record.id) ?? [],
    exoplanets: exoplanetsOf(record.id),
    meteorShowers: meteorShowers.all().filter((s) => s.radiantConstellationId === record.id),
    neighbors: neighborsOf(record.id),
    family: record.family ? refFromId(`constellation_family:${record.family}`) : undefined,
    season: record.season ? refFromId(`seasonal_sky:${record.season}`) : undefined,
    mythology: getConnectionsByDomain(record.id).culture.map((c) => ({ id: c.other.id, name: c.other.name, href: c.other.entryPath })),
    connections: getConnectionsByDomain(record.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(record.id),
  };
}

const byName = (a: ConstellationRecord, b: ConstellationRecord) => a.name.localeCompare(b.name);
const byRank = (a: ConstellationRecord, b: ConstellationRecord) => (a.rankByArea ?? 99) - (b.rankByArea ?? 99);

/** Per-constellation summary counts (reuse the prebuilt maps — no recompute). */
export interface ConstellationSummary {
  record: ConstellationRecord;
  starCount: number;
  deepSkyCount: number;
}
function summaries(): ConstellationSummary[] {
  return CONSTELLATION_RECORDS.map((record) => ({
    record,
    starCount: STARS_BY_CONSTELLATION.get(record.id)?.length ?? 0,
    deepSkyCount: DEEP_SKY_BY_CONSTELLATION.get(record.id)?.length ?? 0,
  }));
}

export const constellationEngine = {
  count: CONSTELLATION_RECORDS.length,
  all: (): ConstellationRecord[] => CONSTELLATION_RECORDS.slice().sort(byName),
  get: (slugOrId: string): ConstellationRecord | undefined => CONSTELLATION_BY_SLUG.get(slugOrId) ?? CONSTELLATION_BY_ID.get(slugOrId),
  resolve,
  summaries,

  byFamily: (family: string): ConstellationRecord[] => (CONSTELLATIONS_BY_FAMILY.get(family) ?? []).slice().sort(byName),
  byHemisphere: (h: Hemisphere): ConstellationRecord[] => (CONSTELLATIONS_BY_HEMISPHERE.get(h) ?? []).slice().sort(byName),
  bySeason: (s: string): ConstellationRecord[] => (CONSTELLATIONS_BY_SEASON.get(s) ?? []).slice().sort(byName),
  zodiac: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => c.zodiac).slice().sort(byName),
  circumpolar: (h: "north" | "south"): ConstellationRecord[] =>
    CONSTELLATION_RECORDS.filter((c) => (h === "north" ? c.circumpolarNorth : c.circumpolarSouth)).sort(byName),
  ancient: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => c.ptolemaic).slice().sort(byName),
  modern: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => !c.ptolemaic).slice().sort(byName),
  largest: (n = 12): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => c.rankByArea != null).slice().sort(byRank).slice(0, n),
  smallest: (n = 12): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => c.rankByArea != null).slice().sort((a, b) => (b.rankByArea ?? 0) - (a.rankByArea ?? 0)).slice(0, n),
  withMythology: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => c.mythologyFigureId).slice().sort(byName),
  withMeteorRadiants: (): ConstellationRecord[] => {
    const ids = new Set(meteorShowers.all().map((s) => s.radiantConstellationId));
    return CONSTELLATION_RECORDS.filter((c) => ids.has(c.id)).sort(byName);
  },
  withBrightStars: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => c.brightestStarId).slice().sort(byName),
  withDeepSky: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => (DEEP_SKY_BY_CONSTELLATION.get(c.id)?.length ?? 0) > 0).sort(byName),
  withMessier: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => (DEEP_SKY_BY_CONSTELLATION.get(c.id) ?? []).some(hasMessier)).sort(byName),
  withExoplanets: (): ConstellationRecord[] => CONSTELLATION_RECORDS.filter((c) => exoplanetsOf(c.id).length > 0).sort(byName),
  /** Constellations containing ≥1 deep-sky object of a given entity-id prefix (e.g. "galaxy:", "nebula:"). */
  withObjectType: (prefix: string): ConstellationRecord[] =>
    CONSTELLATION_RECORDS.filter((c) => (DEEP_SKY_BY_CONSTELLATION.get(c.id) ?? []).some((r) => r.id.startsWith(prefix))).sort(byName),
  /** Constellations richest in catalogued deep-sky objects (top N). */
  richestDeepSky: (n = 15): ConstellationRecord[] =>
    CONSTELLATION_RECORDS.filter((c) => (DEEP_SKY_BY_CONSTELLATION.get(c.id)?.length ?? 0) > 0)
      .slice()
      .sort((a, b) => (DEEP_SKY_BY_CONSTELLATION.get(b.id)?.length ?? 0) - (DEEP_SKY_BY_CONSTELLATION.get(a.id)?.length ?? 0))
      .slice(0, n),
  /** Constellations whose slug is in a curated reference set (beginner / milky-way). */
  bySlugs: (slugs: string[]): ConstellationRecord[] =>
    slugs.map((s) => CONSTELLATION_BY_SLUG.get(s)).filter((c): c is ConstellationRecord => Boolean(c)).sort(byName),

  /* families / asterisms / seasons */
  families: (): FamilyRecord[] => families,
  asterisms: (): AsterismRecord[] => asterisms,
  seasons: (): SeasonRecord[] => seasons,

  /* the named resolve* surface from the mission spec */
  resolveConstellation: (slugOrId: string): ResolvedConstellation | null => resolve(slugOrId),
  resolveConstellationFamily: (slug: string): { family: FamilyRecord; members: ConstellationRecord[] } | null => {
    const family = FAMILY_BY_SLUG.get(slug);
    if (!family) return null;
    return { family, members: (CONSTELLATIONS_BY_FAMILY.get(slug) ?? []).slice().sort(byName) };
  },
  resolveSeason: (slug: string): { season: SeasonRecord; members: ConstellationRecord[] } | null => {
    const season = SEASON_BY_SLUG.get(slug);
    if (!season) return null;
    return { season, members: (CONSTELLATIONS_BY_SEASON.get(slug) ?? []).slice().sort(byRank) };
  },
  resolveSkyRegion: (hemisphere: Hemisphere): { hemisphere: Hemisphere; members: ConstellationRecord[] } => ({
    hemisphere,
    members: (CONSTELLATIONS_BY_HEMISPHERE.get(hemisphere) ?? []).slice().sort(byName),
  }),
  resolveAsterism: (slug: string): AsterismRecord | undefined => ASTERISM_BY_SLUG.get(slug),
};
