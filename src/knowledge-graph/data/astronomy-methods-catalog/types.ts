import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Astronomy Methods, Measurements & Scientific Techniques Encyclopedia data model (Program AO)
 * — how astronomy actually works. It REUSES the exoplanet-detection methods, the cosmology
 * concepts (redshift, the Hubble–Lemaître law, the CMB), the observing bands (gravitational
 * waves, neutrinos, multi-messenger), and the Gaia telescope and Harvard classification
 * already in the graph; the new entities are the method categories and the measurement and
 * observation techniques not yet modelled. Nothing is fabricated; uncertainty is part of the
 * method, not hidden.
 */

export type MethodKind =
  | "category" // a family of techniques (the grouping)
  | "method"; // a measurement or observation technique

export const KIND_ENTITY_TYPE: Record<MethodKind, EntityType> = {
  category: "method_category",
  method: "astronomy_method",
};

export const KIND_LABEL: Record<MethodKind, string> = {
  category: "Method category",
  method: "Technique",
};

export interface MethodRecord {
  id: string;
  slug: string;
  name: string;
  kind: MethodKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  categorySlug?: string; // → method_category (member_of_group) — for methods
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with)

  /* display */
  measures?: string; // a short "what it measures / how it works" label
  definition?: string;
  highlights?: string[];
}
