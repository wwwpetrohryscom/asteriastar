/**
 * Raw Wikidata snapshot row for one mission/spacecraft, transcribed verbatim from a
 * TYPE-VERIFIED, UNAMBIGUOUS match (exactly one spacecraft/spaceflight-typed entity
 * for the name). `null` means Wikidata had no value; `massValues` records every mass
 * statement so a conflict is visible rather than silently resolved.
 */
export interface WikidataMissionRow {
  recordId: string; // our exploration-catalogue entity id
  name: string;
  qid: string; // Wikidata QID (the source row identifier)
  qidLabel: string;
  launchDate: string | null; // ISO (P619)
  cospar: string | null; // international designator / COSPAR id (P247)
  operator: string | null; // P137 label
  manufacturer: string | null; // P176 label
  /** Adopted launch mass (kg) ONLY when Wikidata has a single unambiguous value. */
  launchMassKg: number | null; // P2067
  /** Every distinct mass statement (kg), so a conflict is transparent, not hidden. */
  massValues: number[];
}
