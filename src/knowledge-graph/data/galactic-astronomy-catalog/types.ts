import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Galactic Astronomy & the Milky Way data model (Program BG) — the anatomy and life of our Galaxy.
 * It REUSES the Milky Way galaxy, Sagittarius A*, the Local Group, the Magellanic Clouds, Andromeda
 * and Triangulum, the dark-matter halo and dark-matter concept, the galaxy-rotation-curve method,
 * the galaxy-merger/evolution processes, Gaia and its DR3 survey, the diffuse interstellar medium and
 * interstellar dust, and the stellar-populations concept already in the graph. The new entities are
 * the structural components of the Galaxy and its dynamical and archaeological phenomena. Nothing is
 * fabricated; only well-established galactic astronomy is stated, and unknown values are left empty.
 */

export type GalacticKind =
  | "structure" // a structural component of the Galaxy
  | "dynamics"; // a dynamical, archaeological, or environmental phenomenon

export const KIND_ENTITY_TYPE: Record<GalacticKind, EntityType> = {
  structure: "galactic_structure",
  dynamics: "galactic_dynamics",
};

export const KIND_LABEL: Record<GalacticKind, string> = {
  structure: "Galactic structure",
  dynamics: "Galactic dynamics",
};

export interface GalacticRecord {
  id: string;
  slug: string;
  name: string;
  kind: GalacticKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "~8 kpc" / "~230 Myr" — only when well established
  definition?: string;
  highlights?: string[];
}
