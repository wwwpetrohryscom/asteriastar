import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Astronomical Coordinates, Time & Reference Systems data model (Program CF) — the astrometry & time
 * foundation. The graph already models the reference frames (ICRS, BCRS, GCRS, J2000, B1950, the
 * ecliptic), the time scales (TAI, UTC, UT1, TT, TDB, GPS, sidereal, the leap second), the parallax and
 * proper-motion methods, and the ephemeris systems — all REUSED, not duplicated. CF adds the missing
 * structural pieces: the coordinate systems (RA, declination, and the equatorial/galactic/ecliptic/
 * horizontal/supergalactic systems and the celestial sphere) under a new `coordinate_system` type, and
 * the astrometric effects (precession, nutation, aberration, refraction, light-time, Earth orientation)
 * under a new `astrometric_effect` type; it also adds the FK5/FK4/ICRF3 frames (existing `reference_frame`
 * type), the Julian date (existing `time_standard` type), and the IAU and IERS as `organization`
 * anchors. Only well-established, checkable definitions are stated; nothing is fabricated.
 */

export type CfKind =
  | "coordinate" // a coordinate system (coordinate_system)
  | "frame" // a reference frame / epoch (reference_frame — existing type)
  | "timescale" // a time representation (time_standard — existing type)
  | "effect" // an astrometric effect (astrometric_effect)
  | "body"; // a defining organisation (organization — existing type)

export const KIND_ENTITY_TYPE: Record<CfKind, EntityType> = {
  coordinate: "coordinate_system",
  frame: "reference_frame",
  timescale: "time_standard",
  effect: "astrometric_effect",
  body: "organization",
};

export const KIND_LABEL: Record<CfKind, string> = {
  coordinate: "Coordinate system",
  frame: "Reference frame",
  timescale: "Time scale",
  effect: "Astrometric effect",
  body: "Defining body",
};

export interface CfRecord {
  id: string;
  slug: string;
  name: string;
  kind: CfKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED frames/timescales/methods/anchors or other new CF entities

  /* display — only firmly-established values; unknowns stay empty */
  symbolLabel?: string; // e.g. "α", "δ", "JD" — the standard symbol/abbreviation
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type. IAU default source. */
export function cf(
  kind: CfKind,
  r: Omit<CfRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): CfRecord {
  return { sources: ["iau"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
