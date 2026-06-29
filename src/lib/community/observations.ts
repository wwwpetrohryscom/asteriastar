import type { EntityRef, MediaId, ObservationId, ProfileId, Visibility } from "@/lib/community/ids";

/**
 * Observation model — ARCHITECTURE ONLY. Every observation references the graph
 * entity observed (and, optionally, the equipment/location as references). An
 * observation is never an isolated object — it always points into the graph.
 */

export interface SkyConditions {
  /** e.g. "clear", "partly cloudy". */
  weather?: string;
  /** Bortle scale 1–9 (light pollution), if known. */
  bortleScale?: number;
  /** Seeing/transparency notes. */
  notes?: string;
}

export interface Observation {
  id: ObservationId;
  observerProfileId: ProfileId;
  /** The graph entity observed, e.g. "planet:jupiter". REQUIRED — no isolated observations. */
  objectEntity: EntityRef;
  /** ISO date of the observation. */
  date: string;
  /** Free-text or future structured location reference. */
  location?: string;
  /** Equipment used, as graph entity references (telescopes/launch is N/A here). */
  equipmentEntities?: EntityRef[];
  skyConditions?: SkyConditions;
  notes?: string;
  mediaIds?: MediaId[];
  visibility: Visibility;
}
