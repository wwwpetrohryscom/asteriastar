import type { SourceKey } from "@/lib/sources";

/**
 * Deep-sky data model.
 *
 * Records are generated from the open OpenNGC database (NGC/IC + Messier +
 * Caldwell, CC BY-SA 4.0). Every value is real catalogue data; fields are
 * optional and omitted when no reliable value exists — nothing is invented.
 */

export type DeepSkyType =
  | "galaxy"
  | "galaxy-group"
  | "nebula"
  | "emission-nebula"
  | "reflection-nebula"
  | "dark-nebula"
  | "planetary-nebula"
  | "supernova-remnant"
  | "hii-region"
  | "cluster-nebula"
  | "open-cluster"
  | "globular-cluster"
  | "star-cloud"
  | "asterism";

export const DEEP_SKY_TYPE_LABELS: Record<DeepSkyType, string> = {
  galaxy: "Galaxy",
  "galaxy-group": "Galaxy group",
  nebula: "Nebula",
  "emission-nebula": "Emission nebula",
  "reflection-nebula": "Reflection nebula",
  "dark-nebula": "Dark nebula",
  "planetary-nebula": "Planetary nebula",
  "supernova-remnant": "Supernova remnant",
  "hii-region": "H II region",
  "cluster-nebula": "Cluster with nebulosity",
  "open-cluster": "Open cluster",
  "globular-cluster": "Globular cluster",
  "star-cloud": "Star cloud",
  asterism: "Asterism",
};

export const DEEP_SKY_TYPE_PLURAL: Record<DeepSkyType, string> = {
  galaxy: "Galaxies",
  "galaxy-group": "Galaxy groups",
  nebula: "Nebulae",
  "emission-nebula": "Emission nebulae",
  "reflection-nebula": "Reflection nebulae",
  "dark-nebula": "Dark nebulae",
  "planetary-nebula": "Planetary nebulae",
  "supernova-remnant": "Supernova remnants",
  "hii-region": "H II regions",
  "cluster-nebula": "Clusters with nebulosity",
  "open-cluster": "Open clusters",
  "globular-cluster": "Globular clusters",
  "star-cloud": "Star clouds",
  asterism: "Asterisms",
};

/** Galaxy morphology, classified from the catalogue's Hubble type. */
export type GalaxyType =
  | "spiral"
  | "barred-spiral"
  | "elliptical"
  | "lenticular"
  | "irregular"
  | "dwarf";

export const GALAXY_TYPE_LABELS: Record<GalaxyType, string> = {
  spiral: "Spiral galaxy",
  "barred-spiral": "Barred spiral galaxy",
  elliptical: "Elliptical galaxy",
  lenticular: "Lenticular galaxy",
  irregular: "Irregular galaxy",
  dwarf: "Dwarf galaxy",
};

export type ObservationDifficulty =
  | "naked-eye"
  | "binoculars"
  | "small-telescope"
  | "medium-telescope"
  | "large-telescope"
  | "challenging";

export const DIFFICULTY_LABELS: Record<ObservationDifficulty, string> = {
  "naked-eye": "Naked eye",
  binoculars: "Binoculars",
  "small-telescope": "Small telescope",
  "medium-telescope": "Medium telescope",
  "large-telescope": "Large telescope",
  challenging: "Challenging",
};

export interface DeepSkyIdentifiers {
  messier?: string;
  ngc?: string;
  ic?: string;
  caldwell?: string;
  pgc?: string;
  ugc?: string;
  common?: string;
}

export interface DeepSkyRecord {
  /** Graph entity id, "<type>:<slug>" (existing reused, else created). */
  id: string;
  slug: string;
  name: string;
  type: DeepSkyType;
  /** Graph entity type the object maps to. */
  entityType: "galaxy" | "nebula" | "star_cluster";
  galaxyType?: GalaxyType;
  constellation: string;
  constellationAbbr: string;
  ids: DeepSkyIdentifiers;
  apparentMagnitude?: number;
  sizeMajorArcmin?: number;
  sizeMinorArcmin?: number;
  raHours?: number;
  decDeg?: number;
  /** Raw Hubble morphology string (galaxies). */
  hubbleType?: string;
  difficulty?: ObservationDifficulty;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing: boolean;
}
