import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/deep-space-comms-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type DSCommKind, type DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";
import { networks } from "@/knowledge-graph/data/deep-space-comms-catalog/data/networks";
import { stations } from "@/knowledge-graph/data/deep-space-comms-catalog/data/stations";
import { antennas } from "@/knowledge-graph/data/deep-space-comms-catalog/data/antennas";
import { bands } from "@/knowledge-graph/data/deep-space-comms-catalog/data/bands";
import { navigation } from "@/knowledge-graph/data/deep-space-comms-catalog/data/navigation";
import { standards } from "@/knowledge-graph/data/deep-space-comms-catalog/data/standards";
import { systems } from "@/knowledge-graph/data/deep-space-comms-catalog/data/systems";

/**
 * Deep Space Communications & Navigation catalog (Program AD) — the infrastructure layer.
 * It REUSES the existing tracking_network entities (Deep Space Network, Estrack, Near Space
 * Network are enriched via existing:true, never duplicated) and the platform's missions and
 * organizations, and CREATES the stations, antennas, signal bands, navigation and timing
 * systems, and communication systems. Cross-references resolve against the map for the
 * target kind; relations that duplicate an existing graph edge or whose endpoints don't
 * resolve are dropped. Nothing is fabricated — capabilities, antenna sizes, and coverage
 * are omitted when not reliably known.
 */
export const DSCOMM_RECORDS: DSCommRecord[] = [
  ...networks, ...stations, ...antennas, ...bands, ...navigation, ...standards, ...systems,
];

export const DSCOMM_BY_ID = new Map(DSCOMM_RECORDS.map((r) => [r.id, r]));

const byKind = (k: DSCommKind | DSCommKind[]) => {
  const kinds = Array.isArray(k) ? k : [k];
  return new Map(DSCOMM_RECORDS.filter((r) => kinds.includes(r.kind)).map((r) => [r.slug, r]));
};
export const NETWORK_BY_SLUG = byKind("network");
// tracking + ground stations share the /deep-space-network/station/{slug} route.
export const STATION_BY_SLUG = byKind(["tracking-station", "ground-station"]);
export const ANTENNA_BY_SLUG = byKind("antenna");
export const BAND_BY_SLUG = byKind("band");
export const NAV_BY_SLUG = byKind("navigation");
export const TIME_BY_SLUG = byKind("time-standard");
export const SYSTEM_BY_SLUG = byKind("comm-system");

const rBand = (s?: string) => (s ? BAND_BY_SLUG.get(s)?.id : undefined);

/* ----------------------------------------------------------- entities */

export function entryPathFor(r: Pick<DSCommRecord, "kind" | "slug">): string | undefined {
  switch (r.kind) {
    case "network":
      return `/deep-space-network/network/${r.slug}`;
    case "tracking-station":
    case "ground-station":
      return `/deep-space-network/station/${r.slug}`;
    case "antenna":
      return `/deep-space-network/antenna/${r.slug}`;
    case "band":
      return `/deep-space-network/band/${r.slug}`;
    case "navigation":
      return `/deep-space-network/navigation/${r.slug}`;
    case "time-standard": // supporting entities resolve to the standalone /explore graph page
    case "comm-system":
      return undefined;
  }
}

// Existing networks keep their canonical home; only new records become graph entities.
const newRecords = DSCOMM_RECORDS.filter((r) => !r.existing);

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

for (const r of DSCOMM_RECORDS) {
  switch (r.kind) {
    case "network":
      add(r.id, "operated_by", r.operatorKey);
      for (const m of r.tracksMissionKeys ?? []) add(r.id, "tracks", m);
      for (const b of r.bandSlugs ?? []) add(r.id, "uses_band", rBand(b));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "tracking-station":
    case "ground-station":
      add(r.id, "part_of", r.networkKey);
      add(r.id, "operated_by", r.operatorKey);
      for (const b of r.bandSlugs ?? []) add(r.id, "uses_band", rBand(b));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "antenna":
      add(r.id, "located_at", r.stationKey);
      for (const b of r.bandSlugs ?? []) add(r.id, "uses_band", rBand(b));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "navigation":
      for (const b of r.bandSlugs ?? []) add(r.id, "uses_band", rBand(b));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "comm-system":
      add(r.id, "part_of", r.networkKey);
      for (const b of r.bandSlugs ?? []) add(r.id, "uses_band", rBand(b));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "band":
    case "time-standard":
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: DSCommRecord) => string | undefined) {
  const m = new Map<string, DSCommRecord[]>();
  for (const r of DSCOMM_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const DSCOMM_BY_KIND = group((r) => r.kind);
export const DSCOMM_BY_CATEGORY = group((r) => r.category);

export const DSCOMM_STATS = {
  records: DSCOMM_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...DSCOMM_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  networks: DSCOMM_BY_KIND.get("network")?.length ?? 0,
  reusedNetworks: networks.filter((n) => n.existing).length,
  newNetworks: networks.filter((n) => !n.existing).length,
  trackingStations: DSCOMM_BY_KIND.get("tracking-station")?.length ?? 0,
  groundStations: DSCOMM_BY_KIND.get("ground-station")?.length ?? 0,
  antennas: DSCOMM_BY_KIND.get("antenna")?.length ?? 0,
  bands: DSCOMM_BY_KIND.get("band")?.length ?? 0,
  navigation: DSCOMM_BY_KIND.get("navigation")?.length ?? 0,
  timeStandards: DSCOMM_BY_KIND.get("time-standard")?.length ?? 0,
  commSystems: DSCOMM_BY_KIND.get("comm-system")?.length ?? 0,
} as const;

export function validateDeepSpaceCommunications(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as DSCommKind[]);
  const seenSlugByKind = new Map<DSCommKind, Set<string>>();
  for (const r of DSCOMM_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate deep-space-comms id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    // Every referenced graph id must be well-formed (endpoints resolved at graph level).
    for (const k of [r.operatorKey, r.networkKey, r.stationKey, ...(r.tracksMissionKeys ?? []), ...(r.relatedKeys ?? [])].filter(Boolean) as string[]) {
      if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
    }
  }

  // ---- reference-type integrity (Phase 12 checks)
  for (const r of DSCOMM_RECORDS) {
    if (r.operatorKey && !r.operatorKey.startsWith("organization:")) issues.push(`${r.id}: operatorKey must be an organization id: "${r.operatorKey}"`);
    // Network membership: a station / comm-system must attach to a tracking_network.
    if (r.networkKey && !r.networkKey.startsWith("tracking_network:")) issues.push(`${r.id}: networkKey must be a tracking_network id: "${r.networkKey}"`);
    if ((r.kind === "tracking-station" || r.kind === "ground-station") && !r.networkKey) issues.push(`${r.id}: station has no network`);
    // Antenna location must be a station.
    if (r.stationKey && !(r.stationKey.startsWith("tracking_station:") || r.stationKey.startsWith("ground_station:"))) issues.push(`${r.id}: stationKey must be a tracking/ground station id: "${r.stationKey}"`);
    // Only networks track missions; the field on any other kind would emit no edge and
    // so escape the graph-endpoint existence check — reject it rather than drop it silently.
    if (r.kind !== "network" && (r.tracksMissionKeys?.length ?? 0) > 0) issues.push(`${r.id}: tracksMissionKeys is only valid on a network`);
    // Mission-support links must point at a mission or telescope.
    for (const m of r.tracksMissionKeys ?? []) if (!m.startsWith("space_mission:") && !m.startsWith("space_telescope:")) issues.push(`${r.id}: tracked target must be a space_mission/space_telescope id: "${m}"`);
    // Signal-band validity: every band slug must resolve to a signal_band record.
    for (const b of r.bandSlugs ?? []) if (!rBand(b)) issues.push(`${r.id}: unresolved signal band "${b}"`);
  }

  // ---- no duplicate canonical homes: tracking + ground stations share one route namespace.
  const stationSlugs = new Set<string>();
  for (const r of DSCOMM_RECORDS) {
    if (r.kind !== "tracking-station" && r.kind !== "ground-station") continue;
    if (stationSlugs.has(r.slug)) issues.push(`duplicate station slug across kinds: ${r.slug}`);
    stationSlugs.add(r.slug);
  }

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
export type { DSCommRecord, DSCommKind, DSCommCategory } from "@/knowledge-graph/data/deep-space-comms-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/deep-space-comms-catalog/types";
export { networks, stations, antennas, bands, navigation, standards, systems };
