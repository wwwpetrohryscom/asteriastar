import {
  ROCKET_RECORDS,
  ROCKET_BY_ID,
  ROCKET_BY_SLUG,
  ROCKETS_BY_KIND,
} from "@/knowledge-graph/data/rockets-catalog";
import { KIND_LABEL, KIND_PLURAL, type RocketKind, type RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import { getConnectionsByDomain, getEntityById, getRelationsForEntity } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Launch Vehicle Engine — resolver and query surface for the Rockets & Launch
 * Vehicles encyclopedia (engine.launchVehicles). Pure, deterministic, and
 * framework-independent. It resolves the graph entity ids that rocket records
 * reference into renderable refs, groups stages/engines/vehicles, and exposes the
 * honest quality/review surface. It performs NO physics and fabricates nothing.
 */

type Ref = { id: string; name: string; slug?: string; kind?: RocketKind };

/** Names of existing (reused) graph entities referenced by slug but not defined here. */
const EXTERNAL_NAMES: Record<string, string> = {
  "launch_site:kennedy-space-center": "Kennedy Space Center",
  "launch_site:cape-canaveral": "Cape Canaveral",
  "launch_site:vandenberg": "Vandenberg",
  "launch_site:baikonur": "Baikonur Cosmodrome",
  "launch_site:guiana-space-centre": "Guiana Space Centre",
  "launch_site:tanegashima": "Tanegashima Space Center",
  "launch_site:satish-dhawan": "Satish Dhawan Space Centre",
  "launch_site:jiuquan": "Jiuquan",
  "launch_site:xichang": "Xichang",
  "launch_site:wenchang": "Wenchang",
  "launch_site:starbase": "Starbase",
  "launch_site:wallops": "Wallops",
  "launch_site:plesetsk": "Plesetsk",
};

function refFromRecord(r: RocketRecord): Ref {
  return { id: r.id, name: r.name, slug: r.slug, kind: r.kind };
}

/** Resolve a catalogue slug to a renderable ref (catalog record, else external entity). */
function resolveSlug(slug: string | undefined): Ref | undefined {
  if (!slug) return undefined;
  const r = ROCKET_BY_SLUG.get(slug);
  if (r) return refFromRecord(r);
  return undefined;
}

/** Resolve a full graph id (e.g. an external launch_site) to a renderable ref. */
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const r = ROCKET_BY_ID.get(id);
  if (r) return refFromRecord(r);
  const name = EXTERNAL_NAMES[id] ?? getEntityById(id)?.name;
  return name ? { id, name } : undefined;
}

/* --- prebuilt grouping maps (by catalogue slug) --- */
const STAGES_BY_VEHICLE = new Map<string, RocketRecord[]>();
const VEHICLES_BY_FAMILY = new Map<string, RocketRecord[]>();
for (const r of ROCKET_RECORDS) {
  if (r.kind === "vehicle") {
    for (const s of r.stageSlugs ?? []) {
      const st = ROCKET_BY_SLUG.get(s);
      if (st) (STAGES_BY_VEHICLE.get(r.slug) ?? STAGES_BY_VEHICLE.set(r.slug, []).get(r.slug)!).push(st);
    }
    if (r.familySlug) (VEHICLES_BY_FAMILY.get(r.familySlug) ?? VEHICLES_BY_FAMILY.set(r.familySlug, []).get(r.familySlug)!).push(r);
  }
}

/** Engines an engine/stage/vehicle record references directly, resolved. */
function enginesOf(r: RocketRecord): RocketRecord[] {
  return (r.engineSlugs ?? []).map((s) => ROCKET_BY_SLUG.get(s)).filter((x): x is RocketRecord => Boolean(x));
}
/** Propellants a record references, resolved. */
function propellantsOf(r: RocketRecord): Ref[] {
  return (r.propellantSlugs ?? []).map(resolveSlug).filter((x): x is Ref => Boolean(x));
}

/** Launch vehicles a given engine powers — the reverse of the powered_by edges,
 *  restricted to launch_vehicle entities (stages that use it are shown separately). */
function launchVehiclesOfEngine(engineId: string): Ref[] {
  const refs: Ref[] = [];
  const seen = new Set<string>();
  for (const rel of getRelationsForEntity(engineId)) {
    if (rel.type === "powered_by" && rel.to === engineId && rel.from.startsWith("launch_vehicle:") && !seen.has(rel.from)) {
      seen.add(rel.from);
      const ref = refFromId(rel.from);
      if (ref) refs.push(ref);
    }
  }
  return refs;
}

export interface ResolvedLaunchVehicle {
  record: RocketRecord;
  kindLabel: string;
  family?: Ref;
  provider?: Ref;
  manufacturer?: Ref;
  program?: Ref;
  derivedFrom?: Ref;
  succeededBy?: Ref;
  site?: Ref;
  pads: Ref[];
  stages: RocketRecord[];
  engines: RocketRecord[];
  propellants: Ref[];
  vehicles: RocketRecord[]; // for a family: its member vehicles
  launchVehicles: Ref[]; // for an engine: vehicles it powers
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedLaunchVehicle | null {
  const record = ROCKET_BY_SLUG.get(slugOrId) ?? ROCKET_BY_ID.get(slugOrId);
  if (!record) return null;
  const entity = getEntityById(record.id);
  const pads = (record.padSlugs ?? []).map(resolveSlug).filter((x): x is Ref => Boolean(x));
  return {
    record,
    kindLabel: KIND_LABEL[record.kind],
    family: resolveSlug(record.familySlug),
    provider: resolveSlug(record.providerSlug) ?? refFromId(record.providerSlug ? `organization:${record.providerSlug}` : undefined),
    manufacturer: resolveSlug(record.builtBySlug) ?? refFromId(record.builtBySlug ? `organization:${record.builtBySlug}` : undefined),
    program: resolveSlug(record.programSlug),
    derivedFrom: resolveSlug(record.derivedFromSlug),
    succeededBy: resolveSlug(record.succeededBySlug),
    site: refFromId(record.siteSlug ? `launch_site:${record.siteSlug}` : undefined),
    pads,
    stages: record.kind === "vehicle" ? STAGES_BY_VEHICLE.get(record.slug) ?? [] : [],
    engines: enginesOf(record),
    propellants: propellantsOf(record),
    vehicles: record.kind === "family" ? VEHICLES_BY_FAMILY.get(record.slug) ?? [] : [],
    launchVehicles: record.kind === "engine" ? launchVehiclesOfEngine(record.id) : [],
    connections: getConnectionsByDomain(record.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(record.id),
  };
}

const byName = (a: RocketRecord, b: RocketRecord) => a.name.localeCompare(b.name);
const byFirstFlight = (a: RocketRecord, b: RocketRecord) => (a.firstFlight ?? "9999").localeCompare(b.firstFlight ?? "9999");

export const launchVehicleEngine = {
  count: ROCKET_RECORDS.length,
  all: (): RocketRecord[] => ROCKET_RECORDS,
  get: (slugOrId: string): RocketRecord | undefined => ROCKET_BY_SLUG.get(slugOrId) ?? ROCKET_BY_ID.get(slugOrId),
  resolve,
  byKind: (kind: RocketKind): RocketRecord[] => ROCKETS_BY_KIND.get(kind) ?? [],

  vehicles: (): RocketRecord[] => (ROCKETS_BY_KIND.get("vehicle") ?? []).slice().sort(byFirstFlight),
  families: (): RocketRecord[] => (ROCKETS_BY_KIND.get("family") ?? []).slice().sort(byName),
  stages: (): RocketRecord[] => (ROCKETS_BY_KIND.get("stage") ?? []).slice().sort(byName),
  engines: (): RocketRecord[] => (ROCKETS_BY_KIND.get("engine") ?? []).slice().sort(byName),
  propellants: (): RocketRecord[] => (ROCKETS_BY_KIND.get("propellant") ?? []).slice().sort(byName),
  pads: (): RocketRecord[] => (ROCKETS_BY_KIND.get("pad") ?? []).slice().sort(byName),
  providers: (): RocketRecord[] => (ROCKETS_BY_KIND.get("provider") ?? []).slice().sort(byName),
  programs: (): RocketRecord[] => (ROCKETS_BY_KIND.get("program") ?? []).slice().sort(byName),

  /** Member vehicles of a family (by family slug). */
  vehiclesOfFamily: (familySlug: string): RocketRecord[] => VEHICLES_BY_FAMILY.get(familySlug) ?? [],

  kinds: (): { kind: RocketKind; label: string; plural: string; count: number }[] =>
    (Object.keys(KIND_LABEL) as RocketKind[])
      .map((kind) => ({ kind, label: KIND_LABEL[kind], plural: KIND_PLURAL[kind], count: (ROCKETS_BY_KIND.get(kind) ?? []).length }))
      .filter((k) => k.count > 0),

  /* --- the resolve* surface named in the mission spec --- */
  resolveVehicle: (slugOrId: string): ResolvedLaunchVehicle | null => resolve(slugOrId),
  resolveEngine: (slugOrId: string): ResolvedLaunchVehicle | null => resolve(slugOrId),
  resolveRocketFamily: (slugOrId: string): ResolvedLaunchVehicle | null => resolve(slugOrId),
  resolveLaunchProvider: (slugOrId: string): ResolvedLaunchVehicle | null => resolve(slugOrId),
  resolveLaunchPad: (slugOrId: string): ResolvedLaunchVehicle | null => resolve(slugOrId),
};
