import type { EntityRef, MediaId, ObservationId, ProfileId, Visibility } from "@/lib/community/ids";
import type { ImageLicense } from "@/lib/media/types";

/**
 * Astrophotography model — ARCHITECTURE ONLY. A user astrophoto extends the
 * provenance discipline of the Observatory image platform (license + credit)
 * and links back into the graph: the object imaged, the equipment used, and the
 * observation it came from. No fabricated or unlicensed imagery is bundled.
 */

export interface CaptureDetails {
  camera?: string;
  lens?: string;
  /** Telescope as a graph entity reference where applicable. */
  telescopeEntity?: EntityRef;
  exposure?: string;
  /** Number of stacked frames, etc. */
  acquisition?: string;
}

export interface Astrophoto {
  id: MediaId;
  contributorProfileId: ProfileId;
  title: string;
  alt: string;
  /** Remote, licensed/owned image URL — absent until cleared. */
  url?: string;
  /** The graph entity depicted, e.g. "nebula:orion-nebula". */
  objectEntity: EntityRef;
  capture: CaptureDetails;
  location?: string;
  captureDate?: string;
  license: ImageLicense;
  credit: string;
  /** Optional link to the observation this image came from. */
  observationId?: ObservationId;
  visibility: Visibility;
}
