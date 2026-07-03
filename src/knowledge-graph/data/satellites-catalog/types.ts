import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Satellite Encyclopedia data model (Program X).
 *
 * Hand-curated from authoritative public sources (agency mission pages, ESA/NASA/
 * NOAA/EUMETSAT documentation, and operator specifications). EVERY technical field
 * is optional and omitted when not reliably known — launch dates, operators,
 * orbital parameters (altitude/inclination/period), status, and specifications are
 * NEVER invented. Cross-references reuse existing graph entities (agencies, rockets,
 * launch sites, instruments, missions, and the astronomy satellites already modelled
 * as space telescopes) — this program duplicates none of them.
 */

export type SatelliteKind =
  | "satellite"
  | "constellation"
  | "orbit"
  | "operator"
  | "network";

/** The graph EntityType each kind maps to. satellite/operator reuse existing types. */
export const KIND_ENTITY_TYPE: Record<SatelliteKind, EntityType> = {
  satellite: "satellite", // existing type — reuse
  constellation: "satellite_constellation",
  orbit: "orbit_type",
  operator: "organization", // existing type — reuse
  network: "tracking_network",
};

export const KIND_LABEL: Record<SatelliteKind, string> = {
  satellite: "Satellite",
  constellation: "Satellite constellation",
  orbit: "Orbit type",
  operator: "Operator",
  network: "Tracking network",
};

export const KIND_PLURAL: Record<SatelliteKind, string> = {
  satellite: "Satellites",
  constellation: "Satellite constellations",
  orbit: "Orbit types",
  operator: "Operators",
  network: "Tracking networks",
};

/** Broad application category — drives discovery hubs (not a graph entity). */
export type SatelliteCategory =
  | "communications"
  | "navigation"
  | "earth-observation"
  | "weather"
  | "astronomy"
  | "science"
  | "commercial"
  | "technology"
  | "military-history"
  | "human-spaceflight";

export interface SatelliteRecord {
  /* --- identity / graph --- */
  id: string; // "<type>:<slug>"
  slug: string;
  name: string;
  kind: SatelliteKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references by slug / id (resolved in the index; reuse existing entities) --- */
  operatorSlug?: string; // → organization (operator)
  builtBySlug?: string; // → organization (manufacturer)
  launchVehicleSlug?: string; // → launch_vehicle (reused rocket)
  launchSiteSlug?: string; // → launch_site (reused)
  orbitSlug?: string; // → orbit_type
  constellationSlug?: string; // satellite → its constellation
  programSlug?: string; // → mission_program (reused, existing)
  instrumentSlugs?: string[]; // → scientific_instrument (reused)
  relatedKeys?: string[]; // full ids of existing entities to link (associated_with)
  replacedBySlug?: string; // → another satellite/constellation
  networkAgencySlug?: string; // tracking network → operating agency

  /* --- display specs, ALL optional, never invented --- */
  category?: SatelliteCategory;
  status?: string; // "Active" | "Retired" | "Operational" | "In development" | "Planned"
  country?: string;
  operatorName?: string;
  launchDate?: string; // first-launch year, YYYY (or full date if well-known)
  retiredDate?: string;

  // orbital parameters
  orbitClass?: string; // "LEO" | "MEO" | "GEO" | "SSO" | "HEO" | "Polar"
  altitudeKm?: number;
  altitudeRange?: string; // for orbit_type or a constellation, e.g. "540–570 km"
  inclinationDeg?: number;
  periodMinutes?: number;
  periodLabel?: string; // human period, e.g. "≈ 24 h" for GEO

  // satellite
  massKg?: number;
  applications?: string;

  // constellation
  constellationSizeLabel?: string; // e.g. "thousands", "24 operational + spares" — only when well-established

  // orbit type
  use?: string; // typical uses of the orbit

  highlights?: string[];
}
