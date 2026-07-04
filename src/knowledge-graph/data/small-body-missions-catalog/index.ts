import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/small-body-missions-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type SmallBodyKind, type SmallBodyRecord, type MissionStatus } from "@/knowledge-graph/data/small-body-missions-catalog/types";
import { missions } from "@/knowledge-graph/data/small-body-missions-catalog/data/missions";
import { classes } from "@/knowledge-graph/data/small-body-missions-catalog/data/classes";
import { samples } from "@/knowledge-graph/data/small-body-missions-catalog/data/samples";
import { capsules } from "@/knowledge-graph/data/small-body-missions-catalog/data/capsules";
import { phases } from "@/knowledge-graph/data/small-body-missions-catalog/data/phases";
import { campaigns } from "@/knowledge-graph/data/small-body-missions-catalog/data/campaigns";

/**
 * Small-Body Missions & Sample Return catalog (Program AC) — the engineering bridge
 * across the small-body arc. Missions REUSE the existing space_mission entities (existing
 * ones enriched via existing:true, never duplicated); new concept/planned missions are
 * created. The mission-class / returned-sample / capsule / phase / campaign entities are
 * created here, and relations reuse the graph's asteroids, comets, rockets, and agencies.
 *
 * Cross-references resolve against the map for the target kind; relations that duplicate
 * an existing graph edge or whose endpoints don't resolve are dropped. Nothing is
 * fabricated — timelines, targets, sample masses, and outcomes are omitted when unknown,
 * and a planned/concept/cancelled mission never asserts a past-tense operational relation.
 */
export const SMALLBODY_RECORDS: SmallBodyRecord[] = [
  ...missions, ...classes, ...samples, ...capsules, ...phases, ...campaigns,
];

export const SMALLBODY_BY_ID = new Map(SMALLBODY_RECORDS.map((r) => [r.id, r]));

const byKind = (k: SmallBodyKind) => new Map(SMALLBODY_RECORDS.filter((r) => r.kind === k).map((r) => [r.slug, r]));
export const MISSION_BY_SLUG = byKind("mission");
export const CLASS_BY_SLUG = byKind("class");
export const SAMPLE_BY_SLUG = byKind("sample");
export const CAPSULE_BY_SLUG = byKind("capsule");
export const PHASE_BY_SLUG = byKind("phase");
export const CAMPAIGN_BY_SLUG = byKind("campaign");

const rClass = (s?: string) => (s ? CLASS_BY_SLUG.get(s)?.id : undefined);
const rSample = (s?: string) => (s ? SAMPLE_BY_SLUG.get(s)?.id : undefined);
const rPhase = (s?: string) => (s ? PHASE_BY_SLUG.get(s)?.id : undefined);
const rMission = (s?: string) => (s ? `space_mission:${s}` : undefined);

/** Statuses for which no encounter has happened yet, so no past-tense relation is valid. */
const NOT_YET: ReadonlySet<MissionStatus> = new Set(["planned", "concept", "cancelled"]);
/** Only these entity types are valid small-body mission targets. */
const BODY_PREFIXES = ["asteroid:", "comet:", "dwarf_planet:", "moon:"];
const isBodyId = (k: string) => BODY_PREFIXES.some((p) => k.startsWith(p));

/* ----------------------------------------------------------- entities */

export function entryPathFor(r: Pick<SmallBodyRecord, "kind" | "slug">): string | undefined {
  switch (r.kind) {
    case "mission":
      return `/small-body-missions/${r.slug}`;
    case "class":
      return `/small-body-missions/type/${r.slug}`;
    case "sample":
      return `/small-body-missions/sample/${r.slug}`;
    case "capsule": // supporting entities resolve to the standalone /explore graph page
    case "phase":
    case "campaign":
      return undefined;
  }
}

// Existing missions keep their canonical home; only new records become graph entities.
const newRecords = SMALLBODY_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => {
  const entryPath = entryPathFor(r);
  return {
    id: r.id,
    type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
    name: r.name,
    domain: "science" as const,
    ...(entryPath ? { entryPath } : {}),
    description: r.description,
    aliases: r.altNames,
    sources: r.sources,
  };
});

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science"));
}

for (const r of SMALLBODY_RECORDS) {
  switch (r.kind) {
    case "mission": {
      for (const c of r.classSlugs ?? []) add(r.id, "member_of_group", rClass(c));
      // A planned/concept/cancelled mission has not launched, so no past-tense launched_by
      // (its intended launch vehicle is still shown as a field).
      if (!(r.status && NOT_YET.has(r.status))) add(r.id, "launched_by", r.launchVehicleKey);
      add(r.id, "operated_by", r.operatorKey);
      // Pending / planned encounters (future-safe).
      for (const k of r.targetKeys ?? []) add(r.id, "target_of_mission", k);
      // Past-tense operational relations — only for encounters that happened.
      for (const k of r.visitedKeys ?? []) add(r.id, "visited", k);
      for (const k of r.orbitedKeys ?? []) add(r.id, "orbited", k);
      for (const k of r.landedOnKeys ?? []) add(r.id, "landed_on", k);
      for (const k of r.impactedKeys ?? []) add(r.id, "impacted", k);
      for (const k of r.sampleFromKeys ?? []) add(r.id, "returned_samples_from", k);
      add(r.id, "collected_sample", rSample(r.collectedSampleSlug));
      break;
    }
    case "sample":
      add(r.id, "associated_with", r.sampleBodyKey);
      break;
    case "capsule":
      add(r.id, "part_of_mission", rMission(r.missionSlug));
      break;
    case "phase":
      add(r.id, "followed_by", rPhase(r.nextPhaseSlug));
      for (const k of r.exemplarKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "campaign":
      for (const k of r.missionKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "class":
      break; // incoming edges only
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: SmallBodyRecord) => string | undefined) {
  const m = new Map<string, SmallBodyRecord[]>();
  for (const r of SMALLBODY_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const SMALLBODY_BY_KIND = group((r) => r.kind);
export const MISSIONS_BY_CATEGORY = group((r) => (r.kind === "mission" ? r.category : undefined));
export const MISSIONS_BY_STATUS = group((r) => (r.kind === "mission" ? r.status : undefined));

export const SMALLBODY_STATS = {
  records: SMALLBODY_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...SMALLBODY_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  missions: SMALLBODY_BY_KIND.get("mission")?.length ?? 0,
  reusedMissions: missions.filter((m) => m.existing).length,
  newMissions: missions.filter((m) => !m.existing).length,
  classes: SMALLBODY_BY_KIND.get("class")?.length ?? 0,
  samples: SMALLBODY_BY_KIND.get("sample")?.length ?? 0,
  capsules: SMALLBODY_BY_KIND.get("capsule")?.length ?? 0,
  phases: SMALLBODY_BY_KIND.get("phase")?.length ?? 0,
  campaigns: SMALLBODY_BY_KIND.get("campaign")?.length ?? 0,
} as const;

export function validateSmallBodyMissions(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as SmallBodyKind[]);
  const seenSlugByKind = new Map<SmallBodyKind, Set<string>>();
  for (const r of SMALLBODY_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate small-body id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    if (r.launchDate && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(r.launchDate)) issues.push(`${r.id}: malformed launchDate "${r.launchDate}"`);
    // Every referenced graph id must be well-formed (endpoints resolved at graph level).
    const refs = [r.operatorKey, r.launchVehicleKey, r.sampleBodyKey, ...(r.targetKeys ?? []), ...(r.visitedKeys ?? []), ...(r.orbitedKeys ?? []), ...(r.landedOnKeys ?? []), ...(r.impactedKeys ?? []), ...(r.sampleFromKeys ?? []), ...(r.exemplarKeys ?? []), ...(r.missionKeys ?? [])].filter(Boolean) as string[];
    for (const k of refs) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }

  // ---- mission integrity + tense honesty (never fabricate outcomes)
  for (const r of SMALLBODY_RECORDS) {
    if (r.kind === "mission") {
      if (!r.status) issues.push(`${r.id}: mission missing status`);
      if (r.launchVehicleKey && !r.launchVehicleKey.startsWith("launch_vehicle:")) issues.push(`${r.id}: launchVehicleKey must be a launch_vehicle id: "${r.launchVehicleKey}"`);
      if (r.operatorKey && !r.operatorKey.startsWith("organization:")) issues.push(`${r.id}: operatorKey must be an organization id: "${r.operatorKey}"`);
      // A planned/concept/cancelled mission must NOT assert a past-tense operational relation.
      if (r.status && NOT_YET.has(r.status)) {
        const past = [...(r.visitedKeys ?? []), ...(r.orbitedKeys ?? []), ...(r.landedOnKeys ?? []), ...(r.impactedKeys ?? []), ...(r.sampleFromKeys ?? [])];
        if (past.length) issues.push(`${r.id}: a ${r.status} mission must not assert a past-tense encounter (use targetKeys)`);
        if (r.collectedSampleSlug) issues.push(`${r.id}: a ${r.status} mission cannot have returned a sample`);
      }
      // Mission-target integrity: every encounter target must be an actual small body.
      for (const k of [...(r.targetKeys ?? []), ...(r.visitedKeys ?? []), ...(r.orbitedKeys ?? []), ...(r.landedOnKeys ?? []), ...(r.impactedKeys ?? []), ...(r.sampleFromKeys ?? [])]) {
        if (!isBodyId(k)) issues.push(`${r.id}: target "${k}" is not an asteroid/comet/dwarf_planet/moon`);
      }
      // A returned sample must come from a completed / extended mission.
      if (r.collectedSampleSlug) {
        if (!rSample(r.collectedSampleSlug)) issues.push(`${r.id}: unresolved collectedSampleSlug "${r.collectedSampleSlug}"`);
        if (r.status && r.status !== "completed" && r.status !== "extended") issues.push(`${r.id}: only a completed/extended mission can have a returned sample`);
      }
      for (const c of r.classSlugs ?? []) if (!rClass(c)) issues.push(`${r.id}: unresolved class "${c}"`);
    }
    if (r.kind === "sample") {
      if (!r.sampleBodyKey) issues.push(`${r.id}: returned sample has no source body`);
      else if (!isBodyId(r.sampleBodyKey)) issues.push(`${r.id}: sample source "${r.sampleBodyKey}" is not an asteroid/comet/dwarf_planet/moon`);
      // Sample integrity: a returned sample must be collected by a mission that has flown.
      if (r.collectedByMissionSlug) {
        const m = MISSION_BY_SLUG.get(r.collectedByMissionSlug);
        if (!m) issues.push(`${r.id}: unresolved collectedByMissionSlug "${r.collectedByMissionSlug}"`);
        else if (m.status !== "completed" && m.status !== "extended") issues.push(`${r.id}: returned sample's collecting mission "${r.collectedByMissionSlug}" has not completed a return`);
      }
    }
    if (r.kind === "capsule" && r.missionSlug && !MISSION_BY_SLUG.get(r.missionSlug)) issues.push(`${r.id}: unresolved missionSlug "${r.missionSlug}"`);
    if (r.kind === "phase" && r.nextPhaseSlug && !rPhase(r.nextPhaseSlug)) issues.push(`${r.id}: unresolved nextPhaseSlug "${r.nextPhaseSlug}"`);
  }

  // ---- no duplicate canonical homes: mission slugs are unique (already per-kind above),
  // and returned-sample / class slugs each have their own route namespace.

  // ---- no isolated new entity: every created entity carries at least one relation.
  const connected = new Set<string>();
  for (const x of relations) {
    connected.add(x.from);
    connected.add(x.to);
  }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

// Re-export record types + helpers for the engine.
export type { SmallBodyRecord, SmallBodyKind, MissionStatus, MissionCategory } from "@/knowledge-graph/data/small-body-missions-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL, STATUS_LABEL } from "@/knowledge-graph/data/small-body-missions-catalog/types";
export { missions, classes, samples, capsules, phases, campaigns };
