import {
  SMALLBODY_RECORDS,
  SMALLBODY_BY_ID,
  MISSION_BY_SLUG,
  CLASS_BY_SLUG,
  SAMPLE_BY_SLUG,
  PHASE_BY_SLUG,
  MISSIONS_BY_CATEGORY,
  entryPathFor,
  missions,
  classes,
  samples,
  capsules,
  phases,
  campaigns,
  type MissionCategory,
  type SmallBodyRecord,
} from "@/knowledge-graph/data/small-body-missions-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Small-Body Missions Engine — resolver and query surface for the Small-Body Missions &
 * Sample Return Encyclopedia (engine.smallBodyMissions). Pure, deterministic,
 * framework-free. It resolves the mission-class / returned-sample / capsule / phase /
 * campaign entities and REUSES the platform's space_mission entities (existing ones keep
 * their canonical home), asteroids, comets, rockets, and agencies via the graph —
 * creating and fabricating nothing.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

function catalogRef(r: SmallBodyRecord | undefined): Ref | undefined {
  if (!r) return undefined;
  return { id: r.id, name: r.name, slug: r.slug, href: entryPathFor(r) };
}
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: entityGraphPath(e) };
}

const byDate = (a: SmallBodyRecord, b: SmallBodyRecord) => (a.launchDate ?? "9999").localeCompare(b.launchDate ?? "9999");
const byName = (a: SmallBodyRecord, b: SmallBodyRecord) => a.name.localeCompare(b.name, "en", { numeric: true });

/** The canonical home of a mission: its existing entry for reused missions, else the new page. */
function canonicalHref(r: SmallBodyRecord): string {
  if (r.existing) {
    const e = getEntityById(r.id);
    if (e) return entityGraphPath(e);
  }
  return entryPathFor(r) ?? `/small-body-missions/${r.slug}`;
}

/* ----------------------------------------------------------- resolvers */

export interface ResolvedMission {
  record: SmallBodyRecord;
  canonicalHref: string;
  classes: Ref[];
  targets: Ref[];
  operator?: Ref;
  launchVehicle?: Ref;
  sample?: Ref;
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function targetsOf(r: SmallBodyRecord): Ref[] {
  const ids = [...(r.targetKeys ?? []), ...(r.visitedKeys ?? []), ...(r.orbitedKeys ?? []), ...(r.landedOnKeys ?? []), ...(r.impactedKeys ?? []), ...(r.sampleFromKeys ?? [])];
  const seen = new Set<string>();
  const refs: Ref[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const ref = refFromId(id);
    if (ref) refs.push(ref);
  }
  return refs;
}

function resolveMissionRecord(r: SmallBodyRecord): ResolvedMission {
  const entity = getEntityById(r.id);
  return {
    record: r,
    canonicalHref: canonicalHref(r),
    classes: (r.classSlugs ?? []).map((s) => catalogRef(CLASS_BY_SLUG.get(s))).filter(Boolean) as Ref[],
    targets: targetsOf(r),
    operator: refFromId(r.operatorKey),
    launchVehicle: refFromId(r.launchVehicleKey),
    sample: catalogRef(r.collectedSampleSlug ? SAMPLE_BY_SLUG.get(r.collectedSampleSlug) : undefined),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedSample {
  record: SmallBodyRecord;
  body?: Ref;
  collectedBy?: SmallBodyRecord;
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveSampleRecord(r: SmallBodyRecord): ResolvedSample {
  const entity = getEntityById(r.id);
  return {
    record: r,
    body: refFromId(r.sampleBodyKey),
    collectedBy: r.collectedByMissionSlug ? MISSION_BY_SLUG.get(r.collectedByMissionSlug) : undefined,
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedMissionClass {
  record: SmallBodyRecord;
  members: SmallBodyRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function membersOfClass(slug: string): SmallBodyRecord[] {
  return missions.filter((m) => (m.classSlugs ?? []).includes(slug)).sort(byDate);
}

/* ----------------------------------------------------------- engine surface */

export const smallBodyMissionsEngine = {
  count: missions.length,
  recordCount: SMALLBODY_RECORDS.length,

  all: (): SmallBodyRecord[] => missions.slice().sort(byDate),
  get: (slug: string): SmallBodyRecord | undefined => MISSION_BY_SLUG.get(slug) ?? SMALLBODY_BY_ID.get(slug),

  missions: (): SmallBodyRecord[] => missions.slice().sort(byDate),
  classes: (): SmallBodyRecord[] => classes.slice(),
  samples: (): SmallBodyRecord[] => samples.slice().sort(byName),
  capsules: (): SmallBodyRecord[] => capsules.slice().sort(byName),
  phases: (): SmallBodyRecord[] => phases.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  campaigns: (): SmallBodyRecord[] => campaigns.slice(),
  canonicalHref,

  /* discovery queries */
  byCategory: (c: MissionCategory): SmallBodyRecord[] => (MISSIONS_BY_CATEGORY.get(c) ?? []).slice().sort(byDate),
  byClass: membersOfClass,
  sampleReturnMissions: (): SmallBodyRecord[] => missions.filter((m) => (m.classSlugs ?? []).includes("sample-return")).sort(byDate),
  cometMissions: (): SmallBodyRecord[] => missions.filter((m) => m.category === "comet").sort(byDate),
  asteroidMissions: (): SmallBodyRecord[] => missions.filter((m) => m.category === "asteroid").sort(byDate),
  planetaryDefenseMissions: (): SmallBodyRecord[] => missions.filter((m) => m.category === "planetary-defense").sort(byDate),
  activeSmallBodyMissions: (): SmallBodyRecord[] => missions.filter((m) => m.status === "active").sort(byDate),
  completedMissions: (): SmallBodyRecord[] => missions.filter((m) => m.status === "completed" || m.status === "extended").sort(byDate),
  futureMissions: (): SmallBodyRecord[] => missions.filter((m) => m.status === "planned" || m.status === "concept").sort(byName),
  historicMissions: (): SmallBodyRecord[] => missions.filter((m) => m.status === "completed").sort(byDate),
  returnedSamples: (): SmallBodyRecord[] => samples.slice().sort(byName),
  missionTimeline: (): SmallBodyRecord[] => missions.filter((m) => m.launchDate).sort(byDate),
  bySlugs: (slugs: string[]): SmallBodyRecord[] => slugs.map((s) => MISSION_BY_SLUG.get(s)).filter((r): r is SmallBodyRecord => Boolean(r)),

  /* the named resolve* surface from the mission spec */
  resolveMission: (slug: string): ResolvedMission | null => {
    const r = MISSION_BY_SLUG.get(slug);
    return r ? resolveMissionRecord(r) : null;
  },
  resolveSampleReturn: (slug: string): ResolvedMission | null => {
    const r = MISSION_BY_SLUG.get(slug);
    return r && (r.classSlugs ?? []).includes("sample-return") ? resolveMissionRecord(r) : null;
  },
  resolveReturnedSample: (slug: string): ResolvedSample | null => {
    const r = SAMPLE_BY_SLUG.get(slug);
    return r ? resolveSampleRecord(r) : null;
  },
  resolveMissionPhase: (slug: string): { record: SmallBodyRecord; next?: Ref; exemplars: Ref[] } | null => {
    const r = PHASE_BY_SLUG.get(slug);
    if (!r) return null;
    return {
      record: r,
      next: catalogRef(r.nextPhaseSlug ? PHASE_BY_SLUG.get(r.nextPhaseSlug) : undefined),
      exemplars: (r.exemplarKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    };
  },
  resolveMissionClass: (slug: string): ResolvedMissionClass | null => {
    const r = CLASS_BY_SLUG.get(slug);
    if (!r) return null;
    const entity = getEntityById(r.id);
    return {
      record: r,
      members: membersOfClass(slug),
      connections: getConnectionsByDomain(r.id),
      quality: entity ? computeEntityQuality(entity) : null,
      reviewStatus: reviewStatusFor(r.id),
    };
  },
  // The missions that targeted a given body (reverse lookup over the reused targets).
  resolveMissionTarget: (bodyId: string): { body?: Ref; missions: SmallBodyRecord[] } => {
    const ms = missions.filter((m) => [...(m.targetKeys ?? []), ...(m.visitedKeys ?? []), ...(m.orbitedKeys ?? []), ...(m.landedOnKeys ?? []), ...(m.impactedKeys ?? []), ...(m.sampleFromKeys ?? [])].includes(bodyId)).sort(byDate);
    return { body: refFromId(bodyId), missions: ms };
  },
};
