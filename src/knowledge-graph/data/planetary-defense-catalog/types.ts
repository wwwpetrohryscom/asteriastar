import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Planetary Defense & NEO Operations data model (Program AS) — the end-to-end system that finds,
 * tracks, assesses, and could deflect a hazardous near-Earth object. It REUSES the survey
 * telescopes (ATLAS, Catalina, Pan-STARRS, LSST), the Rubin Observatory, the Minor Planet Center
 * and CNEOS, the DART and Hera missions and the NEO Surveyor concept, the near-Earth-object
 * classes, and the asteroids (Apophis, Bennu) already in the graph; the new entities are the
 * NEO-operations pipeline stages, the impact-risk scales, and the deflection methods. Nothing is
 * fabricated; deflection-method maturity is stated honestly and nuclear concepts are marked
 * theoretical.
 */

export type DefenseKind =
  | "stage" // a stage of the NEO discovery-to-deflection pipeline
  | "scale" // an impact-risk communication scale
  | "method"; // a deflection method or concept

export const KIND_ENTITY_TYPE: Record<DefenseKind, EntityType> = {
  stage: "defense_stage",
  scale: "risk_scale",
  method: "deflection_method",
};

export const KIND_LABEL: Record<DefenseKind, string> = {
  stage: "Pipeline stage",
  scale: "Risk scale",
  method: "Deflection method",
};

/** Honest technology-maturity levels for deflection methods — never overstated. */
export type DefenseMaturity = "demonstrated" | "in-development" | "concept" | "theoretical";

export const MATURITY_LABEL: Record<DefenseMaturity, string> = {
  demonstrated: "Demonstrated",
  "in-development": "In development",
  concept: "Concept",
  theoretical: "Theoretical",
};

export interface DefenseRecord {
  id: string;
  slug: string;
  name: string;
  kind: DefenseKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with)
  nextStageSlug?: string; // stage → followed_by next stage

  /* display */
  maturity?: DefenseMaturity; // for a deflection method
  order?: number; // for a stage: pipeline order
  definition?: string;
  highlights?: string[];
}
