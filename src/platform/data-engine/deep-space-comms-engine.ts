import {
  DSCOMM_RECORDS,
  DSCOMM_BY_ID,
  NETWORK_BY_SLUG,
  STATION_BY_SLUG,
  ANTENNA_BY_SLUG,
  BAND_BY_SLUG,
  NAV_BY_SLUG,
  SYSTEM_BY_SLUG,
  DSCOMM_BY_CATEGORY,
  entryPathFor,
  networks,
  stations,
  antennas,
  bands,
  navigation,
  standards,
  systems,
  type DSCommCategory,
  type DSCommRecord,
} from "@/knowledge-graph/data/deep-space-comms-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Deep Space Communications Engine — resolver and query surface for the Deep Space
 * Communications & Navigation Encyclopedia (engine.deepSpaceCommunications). Pure,
 * deterministic, framework-free. It resolves the new stations / antennas / bands /
 * navigation / timing / communication entities and REUSES the platform's tracking
 * networks (existing ones keep their canonical home), missions, and organizations via the
 * graph — creating and fabricating nothing.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

function catalogRef(r: DSCommRecord | undefined): Ref | undefined {
  if (!r) return undefined;
  return { id: r.id, name: r.name, slug: r.slug, href: entryPathFor(r) };
}
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: entityGraphPath(e) };
}

const byName = (a: DSCommRecord, b: DSCommRecord) => a.name.localeCompare(b.name, "en", { numeric: true });

/** The canonical home of a network: its existing entry for reused networks, else the new page. */
function canonicalHref(r: DSCommRecord): string {
  if (r.existing) {
    const e = getEntityById(r.id);
    if (e) return entityGraphPath(e);
  }
  return entryPathFor(r) ?? `/deep-space-network/network/${r.slug}`;
}

/* ----------------------------------------------------------- resolvers */

export interface ResolvedDSNetwork {
  record: DSCommRecord;
  canonicalHref: string;
  operator?: Ref;
  stations: DSCommRecord[];
  tracksMissions: Ref[];
  bands: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

const bandRefs = (r: DSCommRecord): Ref[] => (r.bandSlugs ?? []).map((s) => catalogRef(BAND_BY_SLUG.get(s))).filter(Boolean) as Ref[];
const stationsOfNetwork = (id: string): DSCommRecord[] => stations.filter((s) => s.networkKey === id).sort(byName);

function resolveNetworkRecord(r: DSCommRecord): ResolvedDSNetwork {
  const entity = getEntityById(r.id);
  return {
    record: r,
    canonicalHref: canonicalHref(r),
    operator: refFromId(r.operatorKey),
    stations: stationsOfNetwork(r.id),
    tracksMissions: (r.tracksMissionKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    bands: bandRefs(r),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedStation {
  record: DSCommRecord;
  network?: Ref;
  operator?: Ref;
  antennas: DSCommRecord[];
  bands: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveStationRecord(r: DSCommRecord): ResolvedStation {
  const entity = getEntityById(r.id);
  return {
    record: r,
    network: refFromId(r.networkKey),
    operator: refFromId(r.operatorKey),
    antennas: antennas.filter((a) => a.stationKey === r.id).sort(byName),
    bands: bandRefs(r),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedInfra {
  record: DSCommRecord;
  station?: Ref;
  bands: Ref[];
  related: Ref[];
  usedBy: DSCommRecord[]; // for a band: entities that use it
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveInfra(r: DSCommRecord): ResolvedInfra {
  const entity = getEntityById(r.id);
  return {
    record: r,
    station: refFromId(r.stationKey),
    bands: bandRefs(r),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: r.kind === "band" ? DSCOMM_RECORDS.filter((x) => (x.bandSlugs ?? []).includes(r.slug)).sort(byName) : [],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

/* ----------------------------------------------------------- engine surface */

export const deepSpaceCommunicationsEngine = {
  count: networks.length,
  recordCount: DSCOMM_RECORDS.length,

  all: (): DSCommRecord[] => DSCOMM_RECORDS.slice(),
  get: (slug: string): DSCommRecord | undefined => NETWORK_BY_SLUG.get(slug) ?? DSCOMM_BY_ID.get(slug),
  canonicalHref,

  networks: (): DSCommRecord[] => networks.slice().sort(byName),
  trackingStations: (): DSCommRecord[] => stations.filter((s) => s.kind === "tracking-station").sort(byName),
  groundStations: (): DSCommRecord[] => stations.filter((s) => s.kind === "ground-station").sort(byName),
  allStations: (): DSCommRecord[] => stations.slice().sort(byName),
  antennas: (): DSCommRecord[] => antennas.slice(),
  signalBands: (): DSCommRecord[] => bands.slice(),
  navigationMethods: (): DSCommRecord[] => navigation.slice(),
  timeStandards: (): DSCommRecord[] => standards.slice(),
  commSystems: (): DSCommRecord[] => systems.slice(),
  laserCommunications: (): DSCommRecord[] => DSCOMM_RECORDS.filter((r) => r.category === "optical").sort(byName),
  byCategory: (c: DSCommCategory): DSCommRecord[] => (DSCOMM_BY_CATEGORY.get(c) ?? []).slice().sort(byName),
  bySlugs: (slugs: string[]): DSCommRecord[] => {
    const bySlug = new Map(DSCOMM_RECORDS.map((r) => [r.slug, r]));
    return slugs.map((s) => bySlug.get(s)).filter((r): r is DSCommRecord => Boolean(r));
  },

  // Every mission supported (tracked) by any network, as resolved refs.
  supportedMissions: (): Ref[] => {
    const ids = new Set<string>();
    for (const n of networks) for (const m of n.tracksMissionKeys ?? []) ids.add(m);
    return [...ids].map((k) => refFromId(k)).filter(Boolean) as Ref[];
  },

  /* the named resolve* surface from the mission spec */
  resolveNetwork: (slug: string): ResolvedDSNetwork | null => {
    const r = NETWORK_BY_SLUG.get(slug);
    return r ? resolveNetworkRecord(r) : null;
  },
  resolveStation: (slug: string): ResolvedStation | null => {
    const r = STATION_BY_SLUG.get(slug);
    return r ? resolveStationRecord(r) : null;
  },
  resolveAntenna: (slug: string): ResolvedInfra | null => {
    const r = ANTENNA_BY_SLUG.get(slug);
    return r ? resolveInfra(r) : null;
  },
  resolveSignalBand: (slug: string): ResolvedInfra | null => {
    const r = BAND_BY_SLUG.get(slug);
    return r ? resolveInfra(r) : null;
  },
  resolveNavigationMethod: (slug: string): ResolvedInfra | null => {
    const r = NAV_BY_SLUG.get(slug);
    return r ? resolveInfra(r) : null;
  },
  resolveCommSystem: (slug: string): ResolvedInfra | null => {
    const r = SYSTEM_BY_SLUG.get(slug);
    return r ? resolveInfra(r) : null;
  },
  // The networks that track a given mission (reverse mission-support lookup).
  resolveMissionSupport: (missionId: string): { mission?: Ref; networks: DSCommRecord[] } => {
    return { mission: refFromId(missionId), networks: networks.filter((n) => (n.tracksMissionKeys ?? []).includes(missionId)).sort(byName) };
  },
};
