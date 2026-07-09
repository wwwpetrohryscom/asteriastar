import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space Engineering & Launch Systems Deep Dive data model (Program CB) — the concept-and-method layer
 * that unifies the engineering hardware already in the graph. The subsystems and components (propulsion,
 * thermal, power, avionics, ADCS/GNC, EDL, structures, comms), the rocket engines, stages and
 * propellants, the docking systems, the navigation systems and the operations functions are all REUSED;
 * CB adds only the propulsion *methods*, the rocketry *principles/metrics*, and the flight *maneuvers*
 * that those hardware entities embody but that were not modelled as concepts. One new
 * space_engineering_concept type; kind groups the concepts for discovery. Only well-established
 * engineering is stated (with real, established equations where firmly standard); nothing is fabricated.
 */

export type EngKind =
  | "propulsion" // a propulsion method / technology concept
  | "performance" // a rocketry principle or performance metric
  | "maneuver"; // a flight maneuver / GNC method

export const KIND_ENTITY_TYPE: Record<EngKind, EntityType> = {
  propulsion: "space_engineering_concept",
  performance: "space_engineering_concept",
  maneuver: "space_engineering_concept",
};

export const KIND_LABEL: Record<EngKind, string> = {
  propulsion: "Propulsion method",
  performance: "Rocketry principle",
  maneuver: "Flight maneuver",
};

export interface EngRecord {
  id: string;
  slug: string;
  name: string;
  kind: EngKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED hardware or other new concepts (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "Δv = vₑ ln(m₀/m_f)" — only established, standard relations
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type (always space_engineering_concept). NASA default source. */
export function eng(
  kind: EngKind,
  r: Omit<EngRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): EngRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
