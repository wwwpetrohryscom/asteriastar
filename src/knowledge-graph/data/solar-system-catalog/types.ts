import type { SourceKey } from "@/lib/sources";

/**
 * Solar System data model.
 *
 * Records carry REAL data: planet/moon measurements come from the NASA Planetary
 * Fact Sheet and JPL (public domain); smaller bodies, missions, spacecraft, and
 * surface features are curated from established public-domain facts (NASA / JPL /
 * IAU). Every field is optional and omitted when no authoritative value exists —
 * nothing is invented.
 */

export type BodyKind =
  | "star"
  | "planet"
  | "dwarf-planet"
  | "moon"
  | "asteroid"
  | "comet"
  | "spacecraft"
  | "mission"
  | "surface-feature";

export const BODY_KIND_LABELS: Record<BodyKind, string> = {
  star: "Star",
  planet: "Planet",
  "dwarf-planet": "Dwarf planet",
  moon: "Moon",
  asteroid: "Asteroid",
  comet: "Comet",
  spacecraft: "Spacecraft",
  mission: "Mission",
  "surface-feature": "Surface feature",
};

export const BODY_KIND_PLURAL: Record<BodyKind, string> = {
  star: "Stars",
  planet: "Planets",
  "dwarf-planet": "Dwarf planets",
  moon: "Moons",
  asteroid: "Asteroids",
  comet: "Comets",
  spacecraft: "Spacecraft",
  mission: "Missions",
  "surface-feature": "Surface features",
};

export interface BodyRecord {
  /** Graph entity id (existing one is reused, else newly created). */
  id: string;
  kind: BodyKind;
  name: string;
  /** Sub-classification, e.g. "Gas giant", "Galilean moon", "Orbiter". */
  classification?: string;
  /** Parent body entity id (Sun for planets, planet for moons/features). */
  parent?: string;
  /** Formal designation, e.g. "(1) Ceres", "1P/Halley". */
  designation?: string;
  discoveredBy?: string;
  discoveryYear?: string;

  // Orbital parameters
  semiMajorAxisAu?: number;
  /** Mean distance from the Sun, 10^6 km (planet fact-sheet convention). */
  distanceFromSun1e6Km?: number;
  perihelion1e6Km?: number;
  aphelion1e6Km?: number;
  orbitalPeriodDays?: number;
  orbitalPeriodYears?: number;
  orbitalVelocityKms?: number;
  eccentricity?: number;
  inclinationDeg?: number;
  obliquityDeg?: number;

  // Physical parameters
  /** Mass in 10^24 kg. */
  mass1e24Kg?: number;
  radiusKm?: number;
  diameterKm?: number;
  densityGCm3?: number;
  gravityMs2?: number;
  escapeVelocityKms?: number;
  rotationPeriodHours?: number;
  meanTemperatureC?: number;
  albedo?: number;
  magnitude?: number;

  // Atmosphere / surface
  surfacePressureBar?: number;
  atmosphere?: string;
  surface?: string;
  composition?: string;

  // System
  moonCount?: number;
  hasRingSystem?: boolean;
  hasMagneticField?: boolean;

  // Missions & spacecraft
  agency?: string;
  launchYear?: string;
  /** orbiter | lander | rover | flyby | sample-return | impactor | crewed … */
  missionType?: string;
  status?: string;
  /** Target body entity ids (missions/spacecraft). */
  targets?: string[];
  /** Mission entity id a spacecraft belongs to. */
  partOfMission?: string;
  /** Body entity ids a spacecraft has landed on. */
  landedOn?: string[];

  sources: SourceKey[];
}
