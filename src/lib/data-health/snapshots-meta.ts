import { SIMBAD_STAR_ROWS, SIMBAD_RETRIEVED_AT } from "@/knowledge-graph/data/star-catalog/precision/snapshots/simbad-stars";
import { GAIA_STAR_ROWS, GAIA_RETRIEVED_AT } from "@/knowledge-graph/data/star-catalog/precision/snapshots/gaia-stars";
import { SIMBAD_DEEP_SKY_ROWS, SIMBAD_DEEP_SKY_RETRIEVED_AT } from "@/knowledge-graph/data/deep-sky-catalog/precision/snapshots/simbad-deep-sky";
import { NED_DEEP_SKY_ROWS, NED_DEEP_SKY_RETRIEVED_AT } from "@/knowledge-graph/data/deep-sky-catalog/precision/snapshots/ned-deep-sky";
import { SBDB_ROWS, SBDB_RETRIEVED_AT } from "@/knowledge-graph/data/small-body-precision/snapshots/sbdb";
import { WIKIDATA_MISSION_ROWS, WIKIDATA_MISSIONS_RETRIEVED_AT } from "@/knowledge-graph/data/mission-precision/snapshots/wikidata-missions";

/**
 * Data facts about each committed snapshot, read straight from the snapshot's own
 * retrieval-date constant and row array — no hard-coded totals or dates. The health
 * dashboard's freshness and provider-health metrics are computed from these.
 */

export type Cadence = "weekly" | "monthly" | "quarterly";
export const CADENCE_DAYS: Record<Cadence, number> = { weekly: 7, monthly: 30, quarterly: 91 };

export interface SnapshotMeta {
  id: string;
  provider: string;
  domain: string;
  cadence: Cadence;
  /** Retrieval date (YYYY-MM-DD) from the snapshot's own constant. */
  retrievedAt: string;
  /** Row count from the snapshot's own array. */
  rows: number;
}

export const SNAPSHOTS_META: SnapshotMeta[] = [
  { id: "simbad-stars", provider: "SIMBAD", domain: "stars", cadence: "monthly", retrievedAt: SIMBAD_RETRIEVED_AT, rows: SIMBAD_STAR_ROWS.length },
  { id: "gaia-stars", provider: "Gaia DR3", domain: "stars", cadence: "quarterly", retrievedAt: GAIA_RETRIEVED_AT, rows: GAIA_STAR_ROWS.length },
  { id: "simbad-deep-sky", provider: "SIMBAD", domain: "deep-sky", cadence: "monthly", retrievedAt: SIMBAD_DEEP_SKY_RETRIEVED_AT, rows: SIMBAD_DEEP_SKY_ROWS.length },
  { id: "ned-deep-sky", provider: "NED", domain: "deep-sky", cadence: "monthly", retrievedAt: NED_DEEP_SKY_RETRIEVED_AT, rows: NED_DEEP_SKY_ROWS.length },
  { id: "sbdb-small-bodies", provider: "JPL SBDB", domain: "small-bodies", cadence: "weekly", retrievedAt: SBDB_RETRIEVED_AT, rows: SBDB_ROWS.length },
  { id: "wikidata-missions", provider: "Wikidata", domain: "missions", cadence: "weekly", retrievedAt: WIKIDATA_MISSIONS_RETRIEVED_AT, rows: WIKIDATA_MISSION_ROWS.length },
];
