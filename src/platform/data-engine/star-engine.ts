import {
  STAR_RECORDS,
  STAR_BY_ID,
  STAR_BY_SLUG,
  STARS_BY_CONSTELLATION,
  STARS_BY_CATEGORY,
  starCatalogNumbers,
} from "@/knowledge-graph/data/star-catalog";
import type { StarRecord, StarCategory } from "@/knowledge-graph/data/star-catalog/types";
import { STAR_CATEGORY_LABELS } from "@/knowledge-graph/data/star-catalog/types";
import {
  CONSTELLATIONS,
  type ConstellationDef,
} from "@/knowledge-graph/data/star-catalog/constellations";
import {
  hemisphereFor,
  seasonFor,
  type Hemisphere,
  type Season,
} from "@/knowledge-graph/data/star-catalog/classify";
import { getConnectionsByDomain, type Connection } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { getEntityById } from "@/knowledge-graph";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Star Engine — the resolver and query surface for the star encyclopedia. Built
 * entirely from the typed star dataset + lightweight graph lookups (no O(n)
 * recommendation scoring), so it scales across thousands of star pages. Pure and
 * framework-independent.
 */

const CON_BY_ID = new Map<string, ConstellationDef>(
  CONSTELLATIONS.map((c) => [`constellation:${c.slug}`, c]),
);

// Precomputed orderings (stable, computed once).
const BRIGHTEST = STAR_RECORDS.filter((r) => r.apparentMagnitude != null)
  .slice()
  .sort((a, b) => (a.apparentMagnitude as number) - (b.apparentMagnitude as number));
const NEAREST = STAR_RECORDS.filter((r) => r.distanceLy != null)
  .slice()
  .sort((a, b) => (a.distanceLy as number) - (b.distanceLy as number));

export interface ResolvedStar {
  record: StarRecord;
  categoryLabel?: string;
  constellation?: ConstellationDef & { id: string };
  hemisphere?: Hemisphere;
  season?: Season;
  catalogNumbers: string[];
  /** Brightest other stars in the same constellation. */
  neighbors: StarRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedStar | null {
  const record = STAR_BY_SLUG.get(slugOrId) ?? STAR_BY_ID.get(slugOrId);
  if (!record) return null;
  const con = CON_BY_ID.get(record.constellation);
  const entity = getEntityById(record.id);
  return {
    record,
    categoryLabel: record.category ? STAR_CATEGORY_LABELS[record.category] : undefined,
    constellation: con ? { ...con, id: record.constellation } : undefined,
    hemisphere: hemisphereFor(record.dec),
    season: seasonFor(record.ra),
    catalogNumbers: starCatalogNumbers(record),
    neighbors: (STARS_BY_CONSTELLATION.get(record.constellation) ?? [])
      .filter((s) => s.id !== record.id)
      .slice(0, 8),
    connections: getConnectionsByDomain(record.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(record.id),
  };
}

export const starEngine = {
  count: STAR_RECORDS.length,
  all: (): StarRecord[] => STAR_RECORDS,
  get: (slugOrId: string): StarRecord | undefined => STAR_BY_SLUG.get(slugOrId) ?? STAR_BY_ID.get(slugOrId),
  resolve,
  byConstellation: (constellationId: string): StarRecord[] => STARS_BY_CONSTELLATION.get(constellationId) ?? [],
  byCategory: (category: StarCategory): StarRecord[] => STARS_BY_CATEGORY.get(category) ?? [],
  brightest: (limit = 50): StarRecord[] => BRIGHTEST.slice(0, limit),
  nearest: (limit = 50): StarRecord[] => NEAREST.slice(0, limit),
  variableStars: (limit?: number): StarRecord[] => {
    const v = BRIGHTEST.filter((r) => r.variable);
    return limit ? v.slice(0, limit) : v;
  },
  multipleStars: (limit?: number): StarRecord[] => {
    const m = BRIGHTEST.filter((r) => r.multiple);
    return limit ? m.slice(0, limit) : m;
  },
  byHemisphere: (h: Hemisphere, limit?: number): StarRecord[] => {
    const list = BRIGHTEST.filter((r) => hemisphereFor(r.dec) === h);
    return limit ? list.slice(0, limit) : list;
  },
  bySeason: (s: Season, limit?: number): StarRecord[] => {
    const list = BRIGHTEST.filter((r) => seasonFor(r.ra) === s);
    return limit ? list.slice(0, limit) : list;
  },
  /** Categories present, with counts (descending). */
  categories: (): { category: StarCategory; label: string; count: number }[] =>
    [...STARS_BY_CATEGORY.entries()]
      .map(([category, list]) => ({ category, label: STAR_CATEGORY_LABELS[category], count: list.length }))
      .sort((a, b) => b.count - a.count),
  /** Constellations with catalogued-star counts (descending). */
  constellations: (): { id: string; def: ConstellationDef; count: number }[] =>
    CONSTELLATIONS.map((def) => ({
      id: `constellation:${def.slug}`,
      def,
      count: (STARS_BY_CONSTELLATION.get(`constellation:${def.slug}`) ?? []).length,
    }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count),
};

export type { Connection };
