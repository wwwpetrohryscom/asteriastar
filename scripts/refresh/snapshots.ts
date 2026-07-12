/**
 * Registry of refreshable scientific snapshots (Program: automated refresh).
 *
 * Each entry declares a committed deterministic snapshot, the provider it comes from,
 * the ingest script that regenerates it, and — for the semantic diff — which fields are
 * identifiers, classifications, statuses or source-metadata (everything else is a value).
 * The production site always reads the committed snapshot; refresh only ever proposes a
 * change via a reviewed PR.
 */

export type Cadence = "weekly" | "monthly" | "quarterly";

export interface RefreshSnapshot {
  id: string;
  provider: string;
  domain: string;
  /** Path to the committed .ts snapshot, relative to repo root. */
  file: string;
  /** The exported array constant inside the snapshot file. */
  constName: string;
  /** Primary key field for row matching. */
  keyField: string;
  /** Ingest script (tsx) that regenerates this snapshot in place. */
  ingest: string;
  cadence: Cadence;
  /** Field classification for the diff (fields not listed are treated as values). */
  idFields: string[];
  classificationFields: string[];
  statusFields: string[];
  /** Source-metadata fields — a change here alone is source_metadata_only. */
  metadataFields: string[];
  /** Substrings marking uncertainty fields. */
  uncertaintyMarkers: string[];
}

const P = "src/knowledge-graph/data";

export const REFRESH_SNAPSHOTS: RefreshSnapshot[] = [
  {
    id: "simbad-stars", provider: "SIMBAD", domain: "stars", cadence: "monthly",
    file: `${P}/star-catalog/precision/snapshots/simbad-stars.ts`, constName: "SIMBAD_STAR_ROWS", keyField: "hip",
    ingest: "scripts/precision/ingest-simbad-stars.ts",
    idFields: ["hip", "starId", "main_id"], classificationFields: ["otype_txt", "sp_type"], statusFields: [],
    metadataFields: ["coo_bibcode", "plx_bibcode", "pm_bibcode", "rvz_bibcode", "sp_bibcode"], uncertaintyMarkers: ["_err"],
  },
  {
    id: "gaia-stars", provider: "Gaia DR3", domain: "stars", cadence: "quarterly",
    file: `${P}/star-catalog/precision/snapshots/gaia-stars.ts`, constName: "GAIA_STAR_ROWS", keyField: "hip",
    ingest: "scripts/precision/ingest-gaia-stars.ts",
    idFields: ["hip", "starId", "source_id"], classificationFields: [], statusFields: [],
    metadataFields: [], uncertaintyMarkers: ["_error"],
  },
  {
    id: "simbad-deep-sky", provider: "SIMBAD", domain: "deep-sky", cadence: "monthly",
    file: `${P}/deep-sky-catalog/precision/snapshots/simbad-deep-sky.ts`, constName: "SIMBAD_DEEP_SKY_ROWS", keyField: "dsId",
    ingest: "scripts/precision/ingest-deep-sky-simbad.ts",
    idFields: ["dsId", "queryId", "main_id"], classificationFields: ["otype_txt", "rvz_type"], statusFields: [],
    metadataFields: ["coo_bibcode", "rvz_bibcode", "dist_bibcode", "dist_method", "dist_qual"], uncertaintyMarkers: ["_err"],
  },
  {
    id: "ned-deep-sky", provider: "NED", domain: "deep-sky", cadence: "monthly",
    file: `${P}/deep-sky-catalog/precision/snapshots/ned-deep-sky.ts`, constName: "NED_DEEP_SKY_ROWS", keyField: "dsId",
    ingest: "scripts/precision/ingest-ned-galaxies.ts",
    idFields: ["dsId", "queryId", "ned_name"], classificationFields: ["objtype"], statusFields: [],
    metadataFields: ["pos_bibcode", "redshift_bibcode", "redshift_qual"], uncertaintyMarkers: ["_unc"],
  },
  {
    id: "sbdb-small-bodies", provider: "JPL SBDB", domain: "small-bodies", cadence: "weekly",
    file: `${P}/small-body-precision/snapshots/sbdb.ts`, constName: "SBDB_ROWS", keyField: "bodyId",
    ingest: "scripts/precision/ingest-sbdb.ts",
    idFields: ["bodyId", "key", "spkid", "fullname"], classificationFields: ["neo", "pha", "orbitClassCode", "orbitClassName"], statusFields: [],
    metadataFields: ["epochJd", "conditionCode", "dataArcDays", "nObsUsed", "producer"], uncertaintyMarkers: ["sigma"],
  },
  {
    id: "wikidata-missions", provider: "Wikidata", domain: "missions", cadence: "weekly",
    file: `${P}/mission-precision/snapshots/wikidata-missions.ts`, constName: "WIKIDATA_MISSION_ROWS", keyField: "recordId",
    ingest: "scripts/precision/ingest-wikidata-missions.ts",
    idFields: ["recordId", "qid", "qidLabel", "cospar"], classificationFields: ["operator", "manufacturer"], statusFields: [],
    metadataFields: [], uncertaintyMarkers: [],
  },
];

export const SNAPSHOT_BY_ID = new Map(REFRESH_SNAPSHOTS.map((s) => [s.id, s]));
