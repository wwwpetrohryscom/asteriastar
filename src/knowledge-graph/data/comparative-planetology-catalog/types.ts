import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Comparative Planetology & Planetary Atmospheres data model (Program BA) — how planets and moons
 * evolve, across the Solar System and beyond. It REUSES the planets (Mercury–Neptune), the moons
 * (Titan, Europa, Enceladus, Io, Triton), Pluto, the super-Earth/mini-Neptune/hot-Jupiter classes,
 * the magnetosphere, the cryovolcano feature, the habitable zone, and the ocean-worlds theme already
 * in the graph. The new entities are the planetary interior layers, the planetary processes, and
 * three exoplanet world-types (created with the existing planetary-class type). Nothing is
 * fabricated; hypothetical classes are labelled as such.
 */

export type PlanetologyKind =
  | "interior" // a planetary interior layer
  | "process" // a planetary process
  | "worldtype"; // an exoplanet world-type (reused planetary-class type)

export const KIND_ENTITY_TYPE: Record<PlanetologyKind, EntityType> = {
  interior: "planetary_interior",
  process: "planetary_process",
  worldtype: "planetary_class",
};

export const KIND_LABEL: Record<PlanetologyKind, string> = {
  interior: "Interior layer",
  process: "Planetary process",
  worldtype: "World type",
};

export interface PlanetologyRecord {
  id: string;
  slug: string;
  name: string;
  kind: PlanetologyKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  domainLabel?: string; // e.g. "Terrestrial" / "Icy world" / "Proposed" — only when well established
  definition?: string;
  highlights?: string[];
}
