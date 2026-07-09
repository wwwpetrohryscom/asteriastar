import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Exoplanet Science & Characterization data model (Program CC) — the methods and physics of studying
 * other worlds, layered on top of the large exoplanet base already in the graph. The 849 planets, the
 * eight detection methods (exoplanet_detection_method:*), the planetary classes, the habitable zone, the
 * biosignatures, the atmospheric-escape / greenhouse / circulation processes, the protoplanetary disk,
 * JWST / Spitzer / Kepler / TESS / Roman / HWO / ELT / GMT / TMT, and the spectroscopy technique are all
 * REUSED via relatedKeys. CC adds only what was missing: the characterization *methods*, the
 * atmosphere *concepts*, the planet-formation *concepts*, and the two absent exoplanet missions (Ariel,
 * PLATO). The concepts share one new exoplanet_science_concept type; the two missions are proper
 * space_telescope entities. kind groups the entries for discovery. Only well-established science is
 * stated; missions not yet launched are flagged, and nothing is fabricated.
 */

export type CcKind =
  | "characterization" // an atmospheric-characterization method
  | "atmosphere" // an exoplanet-atmosphere concept
  | "formation" // a planet-formation concept
  | "mission"; // a dedicated exoplanet space telescope (not yet launched)

export const KIND_ENTITY_TYPE: Record<CcKind, EntityType> = {
  characterization: "exoplanet_science_concept",
  atmosphere: "exoplanet_science_concept",
  formation: "exoplanet_science_concept",
  mission: "space_telescope",
};

export const KIND_LABEL: Record<CcKind, string> = {
  characterization: "Characterization method",
  atmosphere: "Atmosphere concept",
  formation: "Planet formation",
  mission: "Exoplanet mission",
};

export interface CcRecord {
  id: string;
  slug: string;
  name: string;
  kind: CcKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED entities or other new CC concepts (associated_with)

  /* display */
  symbolLabel?: string;
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type. NASA default source. */
export function cc(
  kind: CcKind,
  r: Omit<CcRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): CcRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
