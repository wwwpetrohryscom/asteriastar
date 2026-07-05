import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Galaxies, Active Galactic Nuclei & the Extragalactic Universe data model (Program AQ). It
 * REUSES the galaxies, the astrophysical object classes (AGN, quasar, blazar, galaxy cluster,
 * supercluster, cosmic filament, void, dark-matter halo, supermassive black hole), and the
 * cosmology concepts (the cosmic web, large-scale structure, dark matter) already in the graph;
 * the new entities are the galaxy morphologies, the AGN types, the galactic processes, and the
 * named cosmic structures. Nothing is fabricated; the object classes and structures that already
 * exist are reused, not duplicated.
 */

export type ExtragalacticKind =
  | "morphology" // a class of galaxy morphology (the Hubble sequence and beyond)
  | "agn" // a type of active galactic nucleus
  | "process" // a galaxy-evolution process or phenomenon
  | "structure"; // a named large-scale structure (group, cluster, supercluster, wall, void)

export const KIND_ENTITY_TYPE: Record<ExtragalacticKind, EntityType> = {
  morphology: "galaxy_morphology",
  agn: "agn_type",
  process: "galactic_process",
  structure: "cosmic_structure",
};

export const KIND_LABEL: Record<ExtragalacticKind, string> = {
  morphology: "Galaxy morphology",
  agn: "AGN type",
  process: "Galactic process",
  structure: "Cosmic structure",
};

export interface ExtragalacticRecord {
  id: string;
  slug: string;
  name: string;
  kind: ExtragalacticKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with) — galaxies, classes, concepts

  /* display */
  hubbleType?: string; // for a morphology: the Hubble classification, e.g. "Sb", "E0–E7"
  scaleLabel?: string; // for a structure: the scale, e.g. "≈ 10 million light-years across"
  definition?: string;
  highlights?: string[];
}
