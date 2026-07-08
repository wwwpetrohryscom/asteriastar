import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Black Holes, Neutron Stars & Compact Objects data model (Program BZ) — the end-states of gravity.
 * It REUSES the black-hole and neutron-star/magnetar classes already in the graph
 * (astrophysical_object_class), the Sgr A* and M87* black holes (black_hole), the event horizon,
 * Hawking radiation, accretion disk and Schwarzschild radius (cosmology_concept), the merger, kilonova
 * and tidal-disruption transient classes, the Event Horizon Telescope, the gravitational-wave and
 * black-hole-mass methods, and the Crab Nebula. The NEW entities are the black-hole and general-
 * relativity physics concepts (created with the existing cosmology_concept type, alongside the event
 * horizon), the neutron-star physics concepts (stellar_physics_concept), the pulsar sub-type classes
 * (astrophysical_object_class), and the specific objects — the black holes Cygnus X-1 and V404 Cygni
 * (black_hole) and the neutron stars (a new neutron_star type). Only well-established astrophysics is
 * stated; masses and distances are given only where firmly measured, uncertainties and open questions
 * are flagged, and nothing is fabricated.
 */

export type CompactKind =
  | "bh-physics" // a black-hole / general-relativity structure or concept (cosmology_concept)
  | "bh-process" // a process around a black hole (cosmology_concept)
  | "ns-physics" // a neutron-star physics concept (stellar_physics_concept)
  | "ns-class" // a pulsar sub-type class (astrophysical_object_class)
  | "bh-object" // a specific black hole (black_hole)
  | "ns-object"; // a specific neutron star (neutron_star)

export const KIND_ENTITY_TYPE: Record<CompactKind, EntityType> = {
  "bh-physics": "cosmology_concept",
  "bh-process": "cosmology_concept",
  "ns-physics": "stellar_physics_concept",
  "ns-class": "astrophysical_object_class",
  "bh-object": "black_hole",
  "ns-object": "neutron_star",
};

export const KIND_LABEL: Record<CompactKind, string> = {
  "bh-physics": "Black-hole physics",
  "bh-process": "Black-hole process",
  "ns-physics": "Neutron-star physics",
  "ns-class": "Pulsar class",
  "bh-object": "Black hole",
  "ns-object": "Neutron star",
};

export interface CompactRecord {
  id: string;
  slug: string;
  name: string;
  kind: CompactKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "~21 M☉" / "33 ms period" — only when firmly measured
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type. Default source is NASA; override per record. */
export function compact(
  kind: CompactKind,
  r: Omit<CompactRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): CompactRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
