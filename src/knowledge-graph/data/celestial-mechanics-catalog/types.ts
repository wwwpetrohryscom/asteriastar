import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Celestial Mechanics & Timekeeping data model (Program BE) — the mathematical foundation of how
 * bodies move and how time is kept. It REUSES universal gravitation, gravity and spacetime, Kepler
 * and Newton, JPL, the Jupiter orbital resonances, the TAI and UTC time standards, the precession
 * discovery, the planets, and JWST already in the graph. The new entities are the orbital-mechanics
 * concepts, the reference frames, the ephemeris systems, and six additional time standards (created
 * with the existing time-standard type). Nothing is fabricated; only well-established constants
 * (e.g. TT = TAI + 32.184 s) are stated.
 */

export type MechanicsKind =
  | "dynamics" // an orbital-mechanics concept
  | "frame" // a reference frame or epoch
  | "ephemeris" // an ephemeris system
  | "timekeeping"; // a time standard (reused time-standard type)

export const KIND_ENTITY_TYPE: Record<MechanicsKind, EntityType> = {
  dynamics: "orbital_mechanics_concept",
  frame: "reference_frame",
  ephemeris: "ephemeris_system",
  timekeeping: "time_standard",
};

export const KIND_LABEL: Record<MechanicsKind, string> = {
  dynamics: "Orbital mechanics",
  frame: "Reference frame",
  ephemeris: "Ephemeris system",
  timekeeping: "Time standard",
};

export interface MechanicsRecord {
  id: string;
  slug: string;
  name: string;
  kind: MechanicsKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "TT" / "L1–L5" — only when well established
  definition?: string;
  highlights?: string[];
}
