import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Professional Observatory Planning Suite data model (Program BQ). Each planner is a first-class
 * entity that organises the platform's REAL live-sky computations (twilight, the Moon, the planets,
 * transits, visibility — engine.liveSky) and the existing observing equipment, sites, and techniques
 * into an observing workflow. It REUSES those computations and entities; it does not re-implement or
 * fabricate ephemerides. The external-data integrations (weather, seeing, transparency, cloud cover,
 * Bortle sky brightness) are modelled as architecture-ready interfaces — honestly labelled as
 * awaiting a connected provider, with no conditions ever invented. Privacy-first: an observer's
 * location stays on their device. Unknown values are left empty.
 */

export type ObservingKind =
  | "planner" // an observing planner backed by real live-sky computation and reused entities
  | "integration"; // an architecture-ready external-data integration (no fabricated conditions)

export const KIND_ENTITY_TYPE: Record<ObservingKind, EntityType> = {
  planner: "observing_planner",
  integration: "observing_integration",
};

export const KIND_LABEL: Record<ObservingKind, string> = {
  planner: "Observing planner",
  integration: "Data integration",
};

/** Whether a planner's data is computed today (via engine.liveSky) or awaits a connected provider. */
export type ComputeStatus = "computed" | "architecture";

export interface ObservingRecord {
  id: string;
  slug: string;
  name: string;
  kind: ObservingKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** For planners: whether it is backed by real computation today, or architecture-ready. */
  computeStatus?: ComputeStatus;
  /** Human-readable name of the reused engine capability, e.g. "engine.liveSky.twilight". */
  dataSource?: string;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string;
  definition?: string;
  highlights?: string[];
}
