import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Astrochemistry & Molecular Universe data model (Program BB) — how chemistry builds stars, planets,
 * and the ingredients of life. It REUSES the spectroscopy method, ALMA and APEX, JWST, the Orion
 * Nebula, the origins-of-life topic, the Murchison and Allende meteorites, and the infrared, radio,
 * submillimetre and ultraviolet bands already in the graph. The new entities are the interstellar
 * environments, the interstellar molecules, and the astrochemical processes. Nothing is fabricated.
 */

export type ChemistryKind =
  | "environment" // an interstellar environment / phase of the ISM
  | "molecule" // an interstellar molecule or molecule class
  | "process"; // an astrochemical process

export const KIND_ENTITY_TYPE: Record<ChemistryKind, EntityType> = {
  environment: "interstellar_environment",
  molecule: "interstellar_molecule",
  process: "astrochemical_process",
};

export const KIND_LABEL: Record<ChemistryKind, string> = {
  environment: "Interstellar environment",
  molecule: "Interstellar molecule",
  process: "Astrochemical process",
};

export interface ChemistryRecord {
  id: string;
  slug: string;
  name: string;
  kind: ChemistryKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  formula?: string; // e.g. "H2O" — a chemical formula, only on a molecule
  definition?: string;
  highlights?: string[];
}
