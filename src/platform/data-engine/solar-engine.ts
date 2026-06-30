import {
  BODY_RECORDS,
  BODY_BY_ID,
  BODY_BY_SLUG,
  BODIES_BY_KIND,
} from "@/knowledge-graph/data/solar-system-catalog";
import {
  BODY_KIND_LABELS,
  BODY_KIND_PLURAL,
  type BodyRecord,
  type BodyKind,
} from "@/knowledge-graph/data/solar-system-catalog/types";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Solar System Engine — resolver and query surface for the Solar System
 * encyclopedia. Built from the typed BodyRecord dataset plus lightweight graph
 * lookups. Pure, deterministic, framework-independent.
 */

const byRadius = (a: BodyRecord, b: BodyRecord) => (b.radiusKm ?? -1) - (a.radiusKm ?? -1);

export interface ResolvedBody {
  record: BodyRecord;
  kindLabel: string;
  parent?: BodyRecord;
  moons: BodyRecord[];
  features: BodyRecord[];
  missions: BodyRecord[];
  spacecraft: BodyRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedBody | null {
  const record = BODY_BY_SLUG.get(slugOrId) ?? BODY_BY_ID.get(slugOrId);
  if (!record) return null;
  const id = record.id;
  const entity = getEntityById(id);
  return {
    record,
    kindLabel: BODY_KIND_LABELS[record.kind],
    parent: record.parent ? BODY_BY_ID.get(record.parent) : undefined,
    moons: BODY_RECORDS.filter((b) => b.kind === "moon" && b.parent === id).sort(byRadius),
    features: BODY_RECORDS.filter((b) => b.kind === "surface-feature" && b.parent === id),
    missions: BODY_RECORDS.filter((b) => b.kind === "mission" && (b.targets ?? []).includes(id)),
    spacecraft: BODY_RECORDS.filter(
      (b) => b.kind === "spacecraft" && ((b.landedOn ?? []).includes(id) || b.parent === id),
    ),
    connections: getConnectionsByDomain(id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(id),
  };
}

export const solarEngine = {
  count: BODY_RECORDS.length,
  all: (): BodyRecord[] => BODY_RECORDS,
  get: (slugOrId: string): BodyRecord | undefined => BODY_BY_SLUG.get(slugOrId) ?? BODY_BY_ID.get(slugOrId),
  resolve,
  byKind: (kind: BodyKind): BodyRecord[] => BODIES_BY_KIND.get(kind) ?? [],

  planets: (): BodyRecord[] => (BODIES_BY_KIND.get("planet") ?? []).slice().sort((a, b) => (a.distanceFromSun1e6Km ?? 0) - (b.distanceFromSun1e6Km ?? 0)),
  dwarfPlanets: (): BodyRecord[] => BODIES_BY_KIND.get("dwarf-planet") ?? [],
  moons: (): BodyRecord[] => (BODIES_BY_KIND.get("moon") ?? []).slice().sort(byRadius),
  asteroids: (): BodyRecord[] => BODIES_BY_KIND.get("asteroid") ?? [],
  comets: (): BodyRecord[] => BODIES_BY_KIND.get("comet") ?? [],
  missions: (): BodyRecord[] => BODIES_BY_KIND.get("mission") ?? [],
  spacecraft: (): BodyRecord[] => BODIES_BY_KIND.get("spacecraft") ?? [],
  surfaceFeatures: (): BodyRecord[] => BODIES_BY_KIND.get("surface-feature") ?? [],

  /** Largest moons by radius. */
  largestMoons: (limit = 20): BodyRecord[] => (BODIES_BY_KIND.get("moon") ?? []).slice().sort(byRadius).slice(0, limit),
  /** Inner (terrestrial) vs outer (giant) planets. */
  innerPlanets: (): BodyRecord[] => (BODIES_BY_KIND.get("planet") ?? []).filter((p) => /terrestrial/i.test(p.classification ?? "")),
  outerPlanets: (): BodyRecord[] => (BODIES_BY_KIND.get("planet") ?? []).filter((p) => /giant/i.test(p.classification ?? "")),
  gasGiants: (): BodyRecord[] => (BODIES_BY_KIND.get("planet") ?? []).filter((p) => /gas giant/i.test(p.classification ?? "")),
  iceGiants: (): BodyRecord[] => (BODIES_BY_KIND.get("planet") ?? []).filter((p) => /ice giant/i.test(p.classification ?? "")),

  kinds: (): { kind: BodyKind; label: string; plural: string; count: number }[] =>
    [...BODIES_BY_KIND.entries()]
      .map(([kind, list]) => ({ kind, label: BODY_KIND_LABELS[kind], plural: BODY_KIND_PLURAL[kind], count: list.length }))
      .sort((a, b) => b.count - a.count),
};
