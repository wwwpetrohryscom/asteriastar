import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Planetary Geology & Surface Features Encyclopedia data model (Program AI) — the geology
 * of the worlds of the Solar System: the classes of geological feature, and the named
 * features themselves. The `surface_feature` entities already in the graph and the planets,
 * moons, and dwarf planets are REUSED; only the feature-type entities and the new named
 * features are created. Nothing is fabricated — sizes and ages are omitted when uncertain.
 */

export type GeoKind =
  | "type" // a class of geological feature (crater, volcano, canyon, …)
  | "feature"; // a named surface feature (existing surface_feature reused, or created)

export const KIND_ENTITY_TYPE: Record<GeoKind, EntityType> = {
  type: "geological_feature_type",
  feature: "surface_feature",
};

export const KIND_LABEL: Record<GeoKind, string> = {
  type: "Feature type",
  feature: "Surface feature",
};

export type GeoCategory = "impact" | "volcanic" | "tectonic" | "aeolian" | "fluvial" | "icy" | "other";

export interface GeoRecord {
  id: string;
  slug: string;
  name: string;
  kind: GeoKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  bodyKey?: string; // full planet/moon/dwarf_planet/asteroid id (located_on) — for features
  typeSlug?: string; // → geological_feature_type (member_of_group) — for features
  relatedKeys?: string[]; // full ids (associated_with) — missions/instruments/other features

  /* display */
  category?: GeoCategory;
  bodyLabel?: string;
  dimensionsLabel?: string;
  definition?: string;
  highlights?: string[];
}
