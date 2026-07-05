import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Ground-Based Observatories & Instrumentation Frontier data model (Program AU) — the modern
 * frontier of professional observational astronomy. It REUSES the ground observatories already in
 * the graph (the ELT, TMT, Rubin, Keck, Subaru, the VLT, Gemini, ALMA, the SKA, the VLA, MeerKAT,
 * LOFAR and more), the adaptive-optics, interferometry, and spectroscopy methods, the SPHERE, MUSE
 * and HIRES instruments, the wavelength bands, and the ESO/ALMA archives. The new entities are the
 * three next-generation facilities still missing from the graph (GMT, ngVLA, CTA — created with the
 * EXISTING telescope/observatory types, never a parallel type), the instrumentation techniques, the
 * detector technologies, the interferometry techniques, and the ground observing techniques. Nothing
 * is fabricated; facilities under construction are described honestly as such.
 */

export type FrontierKind =
  | "facility" // a next-generation ground facility — a NEW entity of the EXISTING telescope/observatory type
  | "instrument" // an instrumentation technique / optical system
  | "detector" // a detector technology
  | "interferometry" // an interferometry technique
  | "technique"; // a ground observing technique

/** Entity-type mapping for the non-facility kinds. Facilities carry their own telescope/observatory
 *  entity type (reused, not duplicated) resolved from the record's `facilityType`. */
export const KIND_ENTITY_TYPE: Record<Exclude<FrontierKind, "facility">, EntityType> = {
  instrument: "instrument_technique",
  detector: "detector_technology",
  interferometry: "interferometry_technique",
  technique: "observing_technique",
};

export const KIND_LABEL: Record<FrontierKind, string> = {
  facility: "Next-generation facility",
  instrument: "Instrumentation",
  detector: "Detector technology",
  interferometry: "Interferometry technique",
  technique: "Observing technique",
};

/** The reused entity types a facility may take. */
export type FacilityType = "telescope" | "observatory";

export interface FrontierRecord {
  id: string;
  slug: string;
  name: string;
  kind: FrontierKind;
  facilityType?: FacilityType; // only for kind "facility" — the reused entity type
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  statusLabel?: string; // e.g. "Under construction" — stated honestly, only when well established
  definition?: string;
  highlights?: string[];
}
