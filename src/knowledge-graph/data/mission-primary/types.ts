/**
 * Primary-source verification for mission engineering facts.
 *
 * Rather than transcribe an engineering value from a fact sheet (fragile, and a
 * fabrication risk), a field is verified by CORROBORATION: the committed catalogue /
 * Wikidata value is checked against the official agency primary source — the field is
 * `confirmed_by_primary` only when the primary document actually contains that value.
 * Nothing is invented; a value the primary source does not corroborate stays secondary.
 */

/** Source precedence, highest first. */
export type SourceTier = "primary_agency" | "peer_reviewed" | "official_page" | "structured_secondary" | "wikidata";
export const SOURCE_TIER_RANK: Record<SourceTier, number> = {
  primary_agency: 0, peer_reviewed: 1, official_page: 2, structured_secondary: 3, wikidata: 4,
};

export type FieldVerification = "confirmed_by_primary" | "retained_secondary" | "superseded_by_primary" | "conflict" | "rejected";

/** One curated primary-source document reference (a real, verifiable URL). */
export interface PrimarySourceDef {
  missionId: string;
  agency: string;
  sourceUrl: string;
  sourceTitle: string;
  tier: SourceTier;
}

/** Result of a corroboration run against a primary source (committed snapshot row). */
export interface MissionPrimaryRow {
  missionId: string;
  agency: string;
  sourceUrl: string;
  sourceTitle: string;
  tier: SourceTier;
  retrievedAt: string;
  reachable: boolean;
  catalogueLaunchDate: string | null;
  launchDateVerification: FieldVerification;
  /** The exact on-page text form that corroborated the launch date (evidence for a
   *  `confirmed_by_primary` verdict, re-checkable to be a real rendering of the date). Else null. */
  primaryConfirmedLaunchDateForm: string | null;
  /** The launch date the primary source states when it disagrees with the catalogue (a ±1-day
   *  calendar/timezone boundary), recorded verbatim so both values are preserved. Else null. */
  primaryStatedLaunchDate: string | null;
  wikidataMassKg: number | null;
  /** Mass figures (kg) the primary page explicitly states — extracted verbatim, never invented. */
  primaryStatedMassKg: number[] | null;
  massVerification: FieldVerification;
}
