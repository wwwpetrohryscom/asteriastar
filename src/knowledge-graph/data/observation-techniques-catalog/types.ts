import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Professional Observation Techniques data model (Program CG) — the practical observing layer. The graph
 * already models the frontier techniques (lucky & speckle imaging, image stacking, the AO chain, the
 * spectrograph and detector technologies) and the measurement methods (photometry, spectroscopy,
 * astrometry, adaptive optics, calibration) — reused where relevant, not duplicated. CG adds the
 * everyday capture-to-image techniques that were missing: visual astronomy, astrophotography and its
 * planetary/deep-sky/narrowband variants, the calibration frames, image processing and drizzle, plate
 * solving, autoguiding, and the imaging workflow that ties them together. Every new entity is an
 * `observing_technique` (the existing type introduced by observatory-frontier); no new EntityType is
 * introduced. Only well-established practice is stated; nothing is fabricated.
 */

export type CgKind =
  | "visual" // naked-eye / eyepiece observing
  | "imaging" // a camera-based capture technique
  | "processing" // a post-capture processing technique
  | "workflow"; // an end-to-end observing workflow

export const KIND_ENTITY_TYPE: Record<CgKind, EntityType> = {
  visual: "observing_technique",
  imaging: "observing_technique",
  processing: "observing_technique",
  workflow: "observing_technique",
};

export const KIND_LABEL: Record<CgKind, string> = {
  visual: "Visual observing",
  imaging: "Imaging technique",
  processing: "Processing technique",
  workflow: "Observing workflow",
};

export interface CgRecord {
  id: string;
  slug: string;
  name: string;
  kind: CgKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED techniques/detectors/equipment/methods or other new CG entities

  /* display */
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type (always observing_technique). NASA default source. */
export function cg(
  kind: CgKind,
  r: Omit<CgRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): CgRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
