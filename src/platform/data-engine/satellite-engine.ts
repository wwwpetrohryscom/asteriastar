import {
  SATELLITE_RECORDS,
  SATELLITE_BY_ID,
  ORBIT_BY_SLUG,
  OPERATOR_BY_SLUG,
  CONSTELLATION_BY_SLUG,
  NETWORK_BY_SLUG,
  SATELLITE_BY_SLUG,
  SATELLITES_BY_CATEGORY,
  SATELLITES_BY_ORBIT,
  SATELLITES_BY_OPERATOR,
  SATELLITES_BY_CONSTELLATION,
  entryPathFor,
  orbits,
  operators,
  constellations,
  networks,
  satellites,
  type SatelliteCategory,
  type SatelliteRecord,
} from "@/knowledge-graph/data/satellites-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById, getRelationsForEntity } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Satellite Engine — resolver and query surface for the Satellite Encyclopedia
 * (engine.satellites). Pure, deterministic, framework-free. It resolves the new
 * satellite / constellation / orbit / operator / tracking-network entities and
 * REUSES the platform's agencies, rockets, launch sites, and existing missions via
 * the graph relations and prebuilt maps — it creates and fabricates nothing. It
 * performs NO real-time orbit propagation or tracking; where a satellite is
 * observable, it links out to the Live Sky tools rather than inventing a position.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

/** Ref to a reused/graph entity — resolves to its content entry or /explore page. */
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: entityGraphPath(e) };
}

/** Ref to a catalog record — always points at its published /satellites/* route. */
function catalogRef(r: SatelliteRecord | undefined): Ref | undefined {
  if (!r) return undefined;
  return { id: r.id, name: r.name, slug: r.slug, href: entryPathFor(r) };
}

/** Full text of the operator, whether it is a catalog record or free-text only. */
function operatorRef(r: SatelliteRecord): Ref | undefined {
  if (r.operatorSlug) {
    const op = OPERATOR_BY_SLUG.get(r.operatorSlug);
    if (op) return catalogRef(op);
  }
  if (r.operatorName) return { id: "", name: r.operatorName };
  return undefined;
}

const byName = (a: SatelliteRecord, b: SatelliteRecord) => a.name.localeCompare(b.name);
const byYear = (a: SatelliteRecord, b: SatelliteRecord) => (a.launchDate ?? "9999").localeCompare(b.launchDate ?? "9999");

/** Whether a status string denotes a currently-operating satellite. */
function isActive(r: SatelliteRecord): boolean {
  const s = (r.status ?? "").toLowerCase();
  return s.startsWith("active") || s.startsWith("operational");
}

/* ----------------------------------------------------------- resolvers */

export interface ResolvedSatellite {
  record: SatelliteRecord;
  orbit?: Ref;
  operator?: Ref;
  launchVehicle?: Ref;
  launchSite?: Ref;
  constellation?: Ref;
  instruments: Ref[];
  /** Reused, existing entities linked via associated_with (e.g. Sputnik 1). */
  related: Ref[];
  /** All graph connections, grouped by domain (science only, for satellites). */
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

/** Follow a specific outgoing relation type from an id to its target ref(s). */
function outgoing(id: string, type: string): Ref[] {
  const out: Ref[] = [];
  const seen = new Set<string>();
  for (const r of getRelationsForEntity(id)) {
    if (r.type === type && r.from === id && !seen.has(r.to)) {
      seen.add(r.to);
      const ref = refFromId(r.to);
      if (ref) out.push(ref);
    }
  }
  return out;
}

function resolveSatelliteRecord(r: SatelliteRecord): ResolvedSatellite {
  const entity = getEntityById(r.id);
  return {
    record: r,
    orbit: catalogRef(r.orbitSlug ? ORBIT_BY_SLUG.get(r.orbitSlug) : undefined),
    operator: operatorRef(r),
    launchVehicle: outgoing(r.id, "launched_by")[0],
    launchSite: outgoing(r.id, "launched_from")[0],
    constellation: catalogRef(r.constellationSlug ? CONSTELLATION_BY_SLUG.get(r.constellationSlug) : undefined),
    instruments: outgoing(r.id, "contains_instrument"),
    related: outgoing(r.id, "associated_with"),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedConstellationSat {
  record: SatelliteRecord;
  operator?: Ref;
  orbit?: Ref;
  /** Individual member satellites modelled in the graph (belongs_to_constellation). */
  members: SatelliteRecord[];
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

export interface ResolvedOperator {
  record: SatelliteRecord;
  /** The operator's fleet modelled in the graph — satellites and constellations. */
  satellites: SatelliteRecord[];
  constellations: SatelliteRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

export interface ResolvedOrbit {
  record: SatelliteRecord;
  satellites: SatelliteRecord[];
  constellations: SatelliteRecord[];
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

export interface ResolvedNetwork {
  record: SatelliteRecord;
  agency?: Ref;
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

/** A satellite program surfaced from an EXISTING mission_program entity (reused). */
export interface ResolvedProgram {
  program: Ref;
  satellites: Ref[];
}

/* ----------------------------------------------------------- engine surface */

export const satelliteEngine = {
  count: satellites.length,
  recordCount: SATELLITE_RECORDS.length,

  all: (): SatelliteRecord[] => satellites.slice().sort(byName),
  get: (slugOrId: string): SatelliteRecord | undefined => SATELLITE_BY_SLUG.get(slugOrId) ?? SATELLITE_BY_ID.get(slugOrId),

  satellites: (): SatelliteRecord[] => satellites.slice().sort(byName),
  constellations: (): SatelliteRecord[] => constellations.slice().sort(byName),
  orbits: (): SatelliteRecord[] => orbits.slice(),
  operators: (): SatelliteRecord[] => operators.slice().sort(byName),
  networks: (): SatelliteRecord[] => networks.slice().sort(byName),

  /* queries */
  byCategory: (c: SatelliteCategory): SatelliteRecord[] => (SATELLITES_BY_CATEGORY.get(c) ?? []).slice().sort(byYear),
  byOrbit: (slug: string): SatelliteRecord[] => (SATELLITES_BY_ORBIT.get(slug) ?? []).slice().sort(byName),
  byOperator: (slug: string): SatelliteRecord[] => (SATELLITES_BY_OPERATOR.get(slug) ?? []).slice().sort(byName),
  inConstellation: (slug: string): SatelliteRecord[] => (SATELLITES_BY_CONSTELLATION.get(slug) ?? []).slice().sort(byName),
  active: (): SatelliteRecord[] => satellites.filter(isActive).slice().sort(byName),
  historical: (): SatelliteRecord[] => satellites.filter((r) => !isActive(r)).slice().sort(byYear),
  earliest: (n = 12): SatelliteRecord[] => satellites.filter((r) => r.launchDate).slice().sort(byYear).slice(0, n),
  /** Distinct application categories that have ≥1 modelled satellite. */
  categories: (): SatelliteCategory[] => [...SATELLITES_BY_CATEGORY.keys()].sort() as SatelliteCategory[],
  bySlugs: (slugs: string[]): SatelliteRecord[] =>
    slugs.map((s) => SATELLITE_BY_SLUG.get(s)).filter((r): r is SatelliteRecord => Boolean(r)).sort(byName),

  /* the named resolve* surface from the mission spec */
  resolve: (slugOrId: string): ResolvedSatellite | null => {
    const r = SATELLITE_BY_SLUG.get(slugOrId) ?? SATELLITE_BY_ID.get(slugOrId);
    return r && r.kind === "satellite" ? resolveSatelliteRecord(r) : null;
  },
  resolveSatellite: (slugOrId: string): ResolvedSatellite | null => {
    const r = SATELLITE_BY_SLUG.get(slugOrId) ?? SATELLITE_BY_ID.get(slugOrId);
    return r && r.kind === "satellite" ? resolveSatelliteRecord(r) : null;
  },
  resolveConstellation: (slug: string): ResolvedConstellationSat | null => {
    const r = CONSTELLATION_BY_SLUG.get(slug);
    if (!r) return null;
    const entity = getEntityById(r.id);
    return {
      record: r,
      operator: operatorRef(r),
      orbit: catalogRef(r.orbitSlug ? ORBIT_BY_SLUG.get(r.orbitSlug) : undefined),
      members: (SATELLITES_BY_CONSTELLATION.get(slug) ?? []).slice().sort(byName),
      related: outgoing(r.id, "associated_with"),
      connections: getConnectionsByDomain(r.id),
      quality: entity ? computeEntityQuality(entity) : null,
      reviewStatus: reviewStatusFor(r.id),
    };
  },
  resolveOperator: (slug: string): ResolvedOperator | null => {
    const r = OPERATOR_BY_SLUG.get(slug);
    if (!r) return null;
    const entity = getEntityById(r.id);
    const fleet = SATELLITES_BY_OPERATOR.get(slug) ?? [];
    return {
      record: r,
      satellites: fleet.filter((x) => x.kind === "satellite").slice().sort(byName),
      constellations: fleet.filter((x) => x.kind === "constellation").slice().sort(byName),
      connections: getConnectionsByDomain(r.id),
      quality: entity ? computeEntityQuality(entity) : null,
      reviewStatus: reviewStatusFor(r.id),
    };
  },
  resolveOrbit: (slug: string): ResolvedOrbit | null => {
    const r = ORBIT_BY_SLUG.get(slug);
    if (!r) return null;
    const entity = getEntityById(r.id);
    const members = SATELLITES_BY_ORBIT.get(slug) ?? [];
    return {
      record: r,
      satellites: members.filter((x) => x.kind === "satellite").slice().sort(byName),
      constellations: members.filter((x) => x.kind === "constellation").slice().sort(byName),
      quality: entity ? computeEntityQuality(entity) : null,
      reviewStatus: reviewStatusFor(r.id),
    };
  },
  resolveNetwork: (slug: string): ResolvedNetwork | null => {
    const r = NETWORK_BY_SLUG.get(slug);
    if (!r) return null;
    const entity = getEntityById(r.id);
    return {
      record: r,
      agency: r.networkAgencySlug ? catalogRef(OPERATOR_BY_SLUG.get(r.networkAgencySlug)) : undefined,
      connections: getConnectionsByDomain(r.id),
      quality: entity ? computeEntityQuality(entity) : null,
      reviewStatus: reviewStatusFor(r.id),
    };
  },
  /**
   * Resolve a satellite PROGRAM from an existing `mission_program:*` entity (reused,
   * never created here) plus the satellites that declare part_of_program to it.
   * Returns null when the id is not a known mission program.
   */
  resolveProgram: (id: string): ResolvedProgram | null => {
    const program = refFromId(id);
    if (!program || !id.startsWith("mission_program:")) return null;
    const sats: Ref[] = [];
    const seen = new Set<string>();
    for (const r of getRelationsForEntity(id)) {
      if (r.type === "part_of_program" && r.to === id && r.from.startsWith("satellite:") && !seen.has(r.from)) {
        seen.add(r.from);
        const ref = refFromId(r.from);
        if (ref) sats.push(ref);
      }
    }
    return { program, satellites: sats };
  },
};
