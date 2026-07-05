import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Cosmic Distance Ladder & Cosmological Tensions data model (Program AV) — the complete
 * distance-measurement layer of modern cosmology and the tension it has revealed. It REUSES the
 * rungs already in the graph (parallax, the Cepheid distance scale, Type Ia supernovae, baryon
 * acoustic oscillations, the CMB), the cosmic-distance-ladder and standard-candles methods, the
 * Hubble constant and Hubble tension, dark energy and dark matter, and the Planck, Gaia, Hubble and
 * JWST facilities and the DESI programme. The new entities are the distance indicators still
 * missing from the graph, the cosmological parameters, the SH0ES programme (created with the
 * existing observational-programme type), and early dark energy (created with the existing
 * cosmology-concept type). Nothing is fabricated; measured values are not invented and proposed
 * resolutions are labelled as unconfirmed.
 */

export type DistanceKind =
  | "indicator" // a distance indicator / rung of the ladder
  | "parameter" // a cosmological parameter
  | "program" // a measurement programme (reused observational-programme type)
  | "concept"; // a cosmology concept (reused cosmology-concept type)

export const KIND_ENTITY_TYPE: Record<DistanceKind, EntityType> = {
  indicator: "distance_indicator",
  parameter: "cosmological_parameter",
  program: "observational_program",
  concept: "cosmology_concept",
};

export const KIND_LABEL: Record<DistanceKind, string> = {
  indicator: "Distance indicator",
  parameter: "Cosmological parameter",
  program: "Measurement programme",
  concept: "Cosmology concept",
};

export interface DistanceRecord {
  id: string;
  slug: string;
  name: string;
  kind: DistanceKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbol?: string; // e.g. "Ωm" for a parameter — a symbol, not a fabricated value
  rungLabel?: string; // e.g. "Geometric" / "Primary" / "Secondary" — the ladder tier, only when well established
  definition?: string;
  highlights?: string[];
}
