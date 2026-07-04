import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Deep Space Communications & Navigation Encyclopedia data model (Program AD) — the
 * infrastructure layer that connects nearly every previous program: the communication,
 * tracking, timing, navigation, and control systems that make robotic and human
 * spaceflight possible.
 *
 * Hand-curated from authoritative public sources — NASA/JPL (DSN), ESA (Estrack), JAXA,
 * ISRO, and agency mission pages. EVERY capability, antenna size, station, network,
 * signal band, and timeline is optional and omitted when not reliably known — NEVER
 * invented. Networks REUSE the existing `tracking_network` entities (the Deep Space
 * Network, Estrack, and the Near Space Network already exist and are enriched, not
 * duplicated); missions, spacecraft, and organizations are reused. Only the new
 * infrastructure entities (stations, antennas, signal bands, navigation and timing
 * systems) are created here.
 */

export type DSCommKind =
  | "network" // a tracking/communication network (existing tracking_network type reused)
  | "tracking-station" // a deep-space tracking complex (ground station specialised for deep space)
  | "ground-station" // a near-Earth network ground terminal
  | "antenna" // an antenna class / type
  | "band" // a communication signal band
  | "navigation" // a navigation method / system
  | "time-standard" // a time or clock standard
  | "comm-system"; // a communication system (relay, optical, TT&C)

/** The graph EntityType each kind maps to. `network` reuses the existing tracking_network type. */
export const KIND_ENTITY_TYPE: Record<DSCommKind, EntityType> = {
  network: "tracking_network",
  "tracking-station": "tracking_station",
  "ground-station": "ground_station",
  antenna: "antenna",
  band: "signal_band",
  navigation: "navigation_system",
  "time-standard": "time_standard",
  "comm-system": "communication_system",
};

export const KIND_LABEL: Record<DSCommKind, string> = {
  network: "Network",
  "tracking-station": "Tracking station",
  "ground-station": "Ground station",
  antenna: "Antenna",
  band: "Signal band",
  navigation: "Navigation system",
  "time-standard": "Time standard",
  "comm-system": "Communication system",
};

/** Broad browse category — drives some discovery hubs (not a graph entity). */
export type DSCommCategory =
  | "deep-space"
  | "near-earth"
  | "signal"
  | "navigation"
  | "timing"
  | "optical";

export interface DSCommRecord {
  /* --- identity / graph --- */
  id: string; // "<type>:<slug>"
  slug: string;
  name: string;
  kind: DSCommKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references (resolved in the index; reuse existing entities) --- */
  operatorKey?: string; // full organization id (operated_by)
  operatorLabel?: string; // agency label where the operator is not a graph entity
  networkKey?: string; // full tracking_network id (part_of) — station/comm-system → network
  stationKey?: string; // full tracking_station / ground_station id (located_at) — antenna → station
  bandSlugs?: string[]; // → signal_band (uses_band), by catalog slug
  tracksMissionKeys?: string[]; // full space_mission / space_telescope ids (tracks)
  relatedKeys?: string[]; // full ids of existing entities (associated_with)

  /* --- display specs, ALL optional, never invented --- */
  category?: DSCommCategory;
  locationLabel?: string;
  countryLabel?: string;
  established?: string; // year / date
  diameterLabel?: string; // dish diameter, e.g. "70 m"
  frequencyLabel?: string; // band frequency range, e.g. "7.1–8.5 GHz"
  wavelengthLabel?: string;
  dataRateLabel?: string;
  gainLabel?: string;
  definition?: string;
  role?: string; // what this entity does
  latencyNote?: string; // honest note on signal light-time (never a fabricated fixed delay)

  highlights?: string[];
}
