import {
  DEEP_SKY_RECORDS,
  DEEP_SKY_BY_ID,
  DEEP_SKY_BY_SLUG,
  DEEP_SKY_BY_TYPE,
  DEEP_SKY_BY_CONSTELLATION,
  deepSkyCatalogNumbers,
  deepSkyClassLabel,
} from "@/knowledge-graph/data/deep-sky-catalog";
import {
  DEEP_SKY_TYPE_LABELS,
  DEEP_SKY_TYPE_PLURAL,
  DIFFICULTY_LABELS,
  type DeepSkyType,
  type DeepSkyRecord,
  type ObservationDifficulty,
} from "@/knowledge-graph/data/deep-sky-catalog/types";
import { DIFFICULTY_APERTURE } from "@/knowledge-graph/data/deep-sky-catalog/classify";
import { CONSTELLATIONS, type ConstellationDef } from "@/knowledge-graph/data/star-catalog/constellations";
import {
  hemisphereFor,
  seasonFor,
  type Hemisphere,
  type Season,
} from "@/knowledge-graph/data/star-catalog/classify";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Deep Sky Engine — resolver and query surface for the deep-sky encyclopedia.
 * Built from the typed OpenNGC dataset + lightweight graph lookups. Pure,
 * deterministic, framework-independent.
 */

const CON_BY_ID = new Map<string, ConstellationDef>(CONSTELLATIONS.map((c) => [`constellation:${c.slug}`, c]));
const byMag = (a: DeepSkyRecord, b: DeepSkyRecord) => (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99);
const bySize = (a: DeepSkyRecord, b: DeepSkyRecord) => (b.sizeMajorArcmin ?? -1) - (a.sizeMajorArcmin ?? -1);

const BEGINNER: ObservationDifficulty[] = ["naked-eye", "binoculars", "small-telescope"];
const ADVANCED: ObservationDifficulty[] = ["large-telescope", "challenging"];

export interface ResolvedDeepSky {
  record: DeepSkyRecord;
  typeLabel: string;
  classLabel: string;
  constellation?: ConstellationDef & { id: string };
  hemisphere?: Hemisphere;
  season?: Season;
  difficultyLabel?: string;
  aperture?: string;
  catalogNumbers: string[];
  neighbors: DeepSkyRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedDeepSky | null {
  const record = DEEP_SKY_BY_SLUG.get(slugOrId) ?? DEEP_SKY_BY_ID.get(slugOrId);
  if (!record) return null;
  const con = CON_BY_ID.get(record.constellation);
  const entity = getEntityById(record.id);
  return {
    record,
    typeLabel: DEEP_SKY_TYPE_LABELS[record.type],
    classLabel: deepSkyClassLabel(record),
    constellation: con ? { ...con, id: record.constellation } : undefined,
    hemisphere: hemisphereFor(record.decDeg),
    season: seasonFor(record.raHours),
    difficultyLabel: record.difficulty ? DIFFICULTY_LABELS[record.difficulty] : undefined,
    aperture: record.difficulty ? DIFFICULTY_APERTURE[record.difficulty] : undefined,
    catalogNumbers: deepSkyCatalogNumbers(record),
    neighbors: (DEEP_SKY_BY_CONSTELLATION.get(record.constellation) ?? []).filter((d) => d.id !== record.id).slice(0, 8),
    connections: getConnectionsByDomain(record.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(record.id),
  };
}

const BRIGHTEST = DEEP_SKY_RECORDS.filter((r) => r.apparentMagnitude != null).slice().sort(byMag);

export const deepSkyEngine = {
  count: DEEP_SKY_RECORDS.length,
  all: (): DeepSkyRecord[] => DEEP_SKY_RECORDS,
  get: (slugOrId: string): DeepSkyRecord | undefined => DEEP_SKY_BY_SLUG.get(slugOrId) ?? DEEP_SKY_BY_ID.get(slugOrId),
  resolve,
  byType: (type: DeepSkyType): DeepSkyRecord[] => DEEP_SKY_BY_TYPE.get(type) ?? [],
  byConstellation: (constellationId: string): DeepSkyRecord[] => DEEP_SKY_BY_CONSTELLATION.get(constellationId) ?? [],
  byCatalog: (catalog: "messier" | "caldwell" | "ngc" | "ic"): DeepSkyRecord[] =>
    DEEP_SKY_RECORDS.filter((r) => r.ids[catalog]).sort((a, b) => {
      const an = parseInt((a.ids[catalog] ?? "").replace(/\D/g, ""), 10);
      const bn = parseInt((b.ids[catalog] ?? "").replace(/\D/g, ""), 10);
      return an - bn;
    }),
  brightest: (limit = 250): DeepSkyRecord[] => BRIGHTEST.slice(0, limit),
  byHemisphere: (h: Hemisphere, limit?: number): DeepSkyRecord[] => {
    const l = BRIGHTEST.filter((r) => hemisphereFor(r.decDeg) === h);
    return limit ? l.slice(0, limit) : l;
  },
  bySeason: (s: Season, limit?: number): DeepSkyRecord[] => {
    const l = BRIGHTEST.filter((r) => seasonFor(r.raHours) === s);
    return limit ? l.slice(0, limit) : l;
  },
  byDifficulty: (level: "beginner" | "advanced", limit?: number): DeepSkyRecord[] => {
    const set = level === "beginner" ? BEGINNER : ADVANCED;
    const l = BRIGHTEST.filter((r) => r.difficulty && set.includes(r.difficulty));
    return limit ? l.slice(0, limit) : l;
  },
  largestGalaxies: (limit = 50): DeepSkyRecord[] => (DEEP_SKY_BY_TYPE.get("galaxy") ?? []).slice().sort(bySize).slice(0, limit),
  types: (): { type: DeepSkyType; label: string; plural: string; count: number }[] =>
    [...DEEP_SKY_BY_TYPE.entries()]
      .map(([type, list]) => ({ type, label: DEEP_SKY_TYPE_LABELS[type], plural: DEEP_SKY_TYPE_PLURAL[type], count: list.length }))
      .sort((a, b) => b.count - a.count),
  constellations: (): { id: string; def: ConstellationDef; count: number }[] =>
    CONSTELLATIONS.map((def) => ({ id: `constellation:${def.slug}`, def, count: (DEEP_SKY_BY_CONSTELLATION.get(`constellation:${def.slug}`) ?? []).length }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count),
};
