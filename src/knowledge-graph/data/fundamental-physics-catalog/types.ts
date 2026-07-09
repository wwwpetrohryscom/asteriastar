import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Quantum & Fundamental Physics for Astronomy data model (Program CA) — the physics that underpins the
 * cosmos, told through its astronomical relevance. It REUSES the concepts already in the graph (special
 * relativity, spacetime, cosmic inflation, dark matter, dark energy, the cosmological constant, the
 * Standard Model, quantum gravity — all cosmology_concept; general relativity — astronomical_theory;
 * neutrino astronomy, cosmic rays, IceCube). The NEW entities are the quantum-mechanics concepts, the
 * particle-physics concepts, the additional relativity concepts, and the quantum-cosmology concepts,
 * all created with a single new physics_concept type. Only well-established physics is stated, always
 * framed by where it matters for astronomy; open questions are flagged and nothing is fabricated.
 */

export type PhysicsKind =
  | "quantum" // a quantum-mechanics concept
  | "particle" // a particle-physics concept
  | "relativity" // a relativity concept
  | "cosmo"; // a quantum-cosmology / high-energy concept

export const KIND_ENTITY_TYPE: Record<PhysicsKind, EntityType> = {
  quantum: "physics_concept",
  particle: "physics_concept",
  relativity: "physics_concept",
  cosmo: "physics_concept",
};

export const KIND_LABEL: Record<PhysicsKind, string> = {
  quantum: "Quantum physics",
  particle: "Particle physics",
  relativity: "Relativity",
  cosmo: "High-energy & quantum cosmology",
};

export interface PhysicsRecord {
  id: string;
  slug: string;
  name: string;
  kind: PhysicsKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "E = mc²" / "Δx·Δp ≥ ħ/2" — only when firmly established
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type (always physics_concept). NASA default source. */
export function physics(
  kind: PhysicsKind,
  r: Omit<PhysicsRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): PhysicsRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
