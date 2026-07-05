import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Stellar Astrophysics Deep-Dive data model (Program BF) — how stars form, live, forge the elements,
 * and die. It REUSES the stellar end-states already in the graph (the white dwarf, neutron star,
 * magnetar, brown dwarf and stellar-mass black hole under astrophysical_object_class; the supernovae,
 * kilonova, novae and variable-star classes under transient_class), the spectral-classification and
 * asteroseismology methods, the Harvard classification, Big Bang nucleosynthesis, the molecular-cloud
 * environment, the Roche limit, Chandrasekhar, and real example stars, clusters and nebulae. The new
 * entities are the evolutionary processes, the nucleosynthesis pathways, and the physics concepts.
 * Nothing is fabricated; only well-established astrophysics is stated, and unknown values are left empty.
 */

export type StellarKind =
  | "process" // a stellar formation / evolution process or phase
  | "nucleosynthesis" // a nucleosynthesis pathway
  | "concept"; // a stellar-physics concept

export const KIND_ENTITY_TYPE: Record<StellarKind, EntityType> = {
  process: "stellar_process",
  nucleosynthesis: "nucleosynthesis_process",
  concept: "stellar_physics_concept",
};

export const KIND_LABEL: Record<StellarKind, string> = {
  process: "Stellar process",
  nucleosynthesis: "Nucleosynthesis",
  concept: "Stellar physics",
};

export interface StellarRecord {
  id: string;
  slug: string;
  name: string;
  kind: StellarKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "H → He" / "O B A F G K M" — only when well established
  definition?: string;
  highlights?: string[];
}
