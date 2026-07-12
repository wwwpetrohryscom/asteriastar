import { EXPLORATION_BY_ID } from "@/knowledge-graph/data/exploration-catalog";
import { getMissionPrecision } from "@/knowledge-graph/data/mission-precision";
import { PRIMARY_SOURCES } from "./sources";
import { dateForms } from "./date-forms";
import { SOURCE_TIER_RANK, type SourceTier, type FieldVerification, type MissionPrimaryRow } from "./types";
import { NASA_PRIMARY_ROWS, NASA_PRIMARY_RETRIEVED_AT } from "./snapshots/nasa-primary";

/**
 * Primary mission engineering verification overlay (Program 4 — primary sources).
 *
 * The Wikidata/catalogue mission facts (launch date, launch mass) are re-verified against
 * the official agency PRIMARY source by CORROBORATION: a field is `confirmed_by_primary`
 * only when the primary document literally contains that value. Precedence is explicit —
 * a primary agency source outranks Wikidata — but nothing is transcribed from the page and
 * no value is invented; a value the primary does not corroborate stays secondary.
 */

export type { MissionPrimaryRow } from "./types";

const BY_ID = new Map<string, MissionPrimaryRow>(NASA_PRIMARY_ROWS.map((r) => [r.missionId, r]));

export function getMissionPrimary(missionId: string): MissionPrimaryRow | undefined {
  return BY_ID.get(missionId);
}

/** True when tier `a` outranks tier `b` (a primary agency source outranks Wikidata, etc.). */
export function outranks(a: SourceTier, b: SourceTier): boolean {
  return SOURCE_TIER_RANK[a] < SOURCE_TIER_RANK[b];
}

/** Human-readable one-liner for a verification outcome. */
export const VERIFICATION_LABEL: Record<FieldVerification, string> = {
  confirmed_by_primary: "Confirmed by primary source",
  retained_secondary: "Retained (secondary) — not corroborated by primary",
  superseded_by_primary: "Superseded by primary source",
  conflict: "Conflict — primary source states a different value",
  rejected: "Rejected — contradicted by primary source",
};

export const MISSION_PRIMARY_RETRIEVED_AT = NASA_PRIMARY_RETRIEVED_AT;

/** Aggregate, registry-derived — no hard-coded totals. */
export const MISSION_PRIMARY_META = {
  retrievedAt: NASA_PRIMARY_RETRIEVED_AT,
  sources: NASA_PRIMARY_ROWS.length,
  reachable: NASA_PRIMARY_ROWS.filter((r) => r.reachable).length,
  withCatalogueLaunchDate: NASA_PRIMARY_ROWS.filter((r) => r.catalogueLaunchDate != null).length,
  launchDatesConfirmedByPrimary: NASA_PRIMARY_ROWS.filter((r) => r.launchDateVerification === "confirmed_by_primary").length,
  launchDateConflicts: NASA_PRIMARY_ROWS.filter((r) => r.launchDateVerification === "conflict").length,
  withWikidataMass: NASA_PRIMARY_ROWS.filter((r) => r.wikidataMassKg != null).length,
  massesConfirmedByPrimary: NASA_PRIMARY_ROWS.filter((r) => r.massVerification === "confirmed_by_primary").length,
  massConflicts: NASA_PRIMARY_ROWS.filter((r) => r.massVerification === "conflict").length,
} as const;

interface FieldMigration { field: string; total: number; confirmed_by_primary: number; retained_secondary: number; superseded_by_primary: number; conflict: number; rejected: number }

function tally(field: string, statuses: FieldVerification[]): FieldMigration {
  const m: FieldMigration = { field, total: statuses.length, confirmed_by_primary: 0, retained_secondary: 0, superseded_by_primary: 0, conflict: 0, rejected: 0 };
  for (const s of statuses) m[s]++;
  return m;
}

/**
 * Wikidata-migration status: for each field a primary source can corroborate, how many
 * of the values we hold are now confirmed by a primary agency source vs still resting on
 * a secondary source. Only rows that actually hold a value for the field are counted.
 */
export function wikidataMigrationStatus(): FieldMigration[] {
  return [
    tally("launch date", NASA_PRIMARY_ROWS.filter((r) => r.catalogueLaunchDate != null).map((r) => r.launchDateVerification)),
    tally("launch mass", NASA_PRIMARY_ROWS.filter((r) => r.wikidataMassKg != null).map((r) => r.massVerification)),
  ];
}

/** A surfaced primary-vs-committed disagreement (both values preserved, neither hidden). */
export interface PrimaryConflict { missionId: string; field: "launch date" | "launch mass"; committedValue: string; primaryValue: string; sourceUrl: string; sourceTitle: string }

/** Every conflict the primary sources surfaced — kept visible, never silently resolved. */
export function primaryConflicts(): PrimaryConflict[] {
  const out: PrimaryConflict[] = [];
  for (const r of NASA_PRIMARY_ROWS) {
    if (r.launchDateVerification === "conflict" && r.catalogueLaunchDate && r.primaryStatedLaunchDate)
      out.push({ missionId: r.missionId, field: "launch date", committedValue: r.catalogueLaunchDate, primaryValue: r.primaryStatedLaunchDate, sourceUrl: r.sourceUrl, sourceTitle: r.sourceTitle });
    if (r.massVerification === "conflict" && r.wikidataMassKg != null && r.primaryStatedMassKg?.length === 1)
      out.push({ missionId: r.missionId, field: "launch mass", committedValue: `${r.wikidataMassKg.toLocaleString()} kg`, primaryValue: `${r.primaryStatedMassKg[0].toLocaleString()} kg`, sourceUrl: r.sourceUrl, sourceTitle: r.sourceTitle });
  }
  return out;
}

/** Official primary-source host suffixes per operating agency. A source can only claim
 *  tier `primary_agency` for a mission if its host belongs to THAT mission's agency — a NASA
 *  page about an ESA mission is third-party for ESA and must not be dressed up as primary. */
const AGENCY_HOSTS: Record<string, string[]> = {
  NASA: ["nasa.gov"],
  ESA: ["esa.int"],
  JAXA: ["jaxa.jp"],
  ISRO: ["isro.gov.in"],
};
const hostMatches = (host: string, suffixes: string[]) => suffixes.some((s) => host === s || host.endsWith(`.${s}`));
const VERIFICATIONS: FieldVerification[] = ["confirmed_by_primary", "retained_secondary", "superseded_by_primary", "conflict", "rejected"];
/** Verdicts the corroboration method can actually emit. superseded_by_primary/rejected are part
 *  of the field-verification vocabulary but are NOT producible by corroboration (which only
 *  confirms, conflicts, or under-claims) — a row bearing them would be hand-fabricated. */
const PRODUCIBLE: FieldVerification[] = ["confirmed_by_primary", "retained_secondary", "conflict"];

/**
 * Primary-verification gate. Fails on fabrication-shaped or self-inconsistent rows, never on
 * mere absence of corroboration:
 *  - a row for an unknown mission, or a mission not in the curated source registry;
 *  - a source claiming primary tier whose URL is not on an allow-list of real agency hosts
 *    (a secondary source must never be dressed up as primary);
 *  - `confirmed_by_primary` where the source was unreachable, or where the catalogue/Wikidata
 *    value it claims to confirm is absent (you cannot confirm a value you do not hold);
 *  - `conflict` without the on-page evidence that establishes it;
 *  - a stated on-page mass that is claimed as an exact confirmation despite disagreeing.
 */
export function validateMissionPrimary(): string[] {
  const issues: string[] = [];
  const sourceIds = new Set(PRIMARY_SOURCES.map((s) => s.missionId));
  const rel = (a: number, b: number) => Math.abs(a - b) / Math.max(a, b);

  if (NASA_PRIMARY_ROWS.length !== PRIMARY_SOURCES.length)
    issues.push(`snapshot has ${NASA_PRIMARY_ROWS.length} rows but registry lists ${PRIMARY_SOURCES.length} sources — re-run ingest`);

  const seen = new Set<string>();
  for (const r of NASA_PRIMARY_ROWS) {
    const id = r.missionId.split(":")[1] ?? r.missionId;
    if (seen.has(r.missionId)) issues.push(`${id}: duplicate primary row`);
    seen.add(r.missionId);
    if (!EXPLORATION_BY_ID.has(r.missionId)) issues.push(`${id}: primary row for unknown mission`);
    if (!sourceIds.has(r.missionId)) issues.push(`${id}: primary row not backed by a registered source`);

    let host = "";
    try { host = new URL(r.sourceUrl).hostname; } catch { issues.push(`${id}: malformed source URL ${r.sourceUrl}`); }
    if (!/^https:/.test(r.sourceUrl)) issues.push(`${id}: primary source URL is not https`);
    if (r.tier === "primary_agency" && host) {
      const suffixes = AGENCY_HOSTS[r.agency];
      if (!suffixes) issues.push(`${id}: no known primary host for agency ${r.agency}`);
      else if (!hostMatches(host, suffixes)) issues.push(`${id}: tier primary_agency but host ${host} is not ${r.agency}'s own domain (${suffixes.join("/")}) — a third-party page must not be labelled primary`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.retrievedAt)) issues.push(`${id}: bad retrievedAt ${r.retrievedAt}`);
    if (!VERIFICATIONS.includes(r.launchDateVerification)) issues.push(`${id}: bad launchDateVerification`);
    if (!VERIFICATIONS.includes(r.massVerification)) issues.push(`${id}: bad massVerification`);
    // corroboration can only confirm/conflict/under-claim; a superseded/rejected verdict is fabricated.
    if (!PRODUCIBLE.includes(r.launchDateVerification)) issues.push(`${id}: launchDateVerification ${r.launchDateVerification} is not producible by corroboration`);
    if (!PRODUCIBLE.includes(r.massVerification)) issues.push(`${id}: massVerification ${r.massVerification} is not producible by corroboration`);

    // confirmations must rest on real, held, corroborated values — with recorded on-page evidence.
    if (r.launchDateVerification === "confirmed_by_primary") {
      if (!r.reachable) issues.push(`${id}: launch date confirmed but source unreachable`);
      if (!r.catalogueLaunchDate) issues.push(`${id}: launch date confirmed but no catalogue date held`);
      else if (!r.primaryConfirmedLaunchDateForm || !dateForms(r.catalogueLaunchDate).includes(r.primaryConfirmedLaunchDateForm))
        issues.push(`${id}: launch date confirmed but the recorded evidence form is not a rendering of ${r.catalogueLaunchDate}`);
      if (r.primaryStatedLaunchDate) issues.push(`${id}: launch date confirmed yet a conflicting primary date is recorded`);
    } else if (r.primaryConfirmedLaunchDateForm) {
      issues.push(`${id}: primaryConfirmedLaunchDateForm set without a confirmed verdict`);
    }
    // a launch-date conflict must come from a reachable source and preserve the primary's ±1-day date.
    if (r.launchDateVerification === "conflict") {
      if (!r.reachable) issues.push(`${id}: launch date conflict but source unreachable`);
      if (!r.catalogueLaunchDate) issues.push(`${id}: launch date conflict but no catalogue date held`);
      if (!r.primaryStatedLaunchDate) issues.push(`${id}: launch date conflict but primary's date not recorded`);
      else if (r.catalogueLaunchDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(r.primaryStatedLaunchDate)) issues.push(`${id}: bad primaryStatedLaunchDate`);
        const diff = Math.abs(new Date(`${r.primaryStatedLaunchDate}T00:00:00Z`).getTime() - new Date(`${r.catalogueLaunchDate}T00:00:00Z`).getTime()) / 86_400_000;
        if (diff !== 1) issues.push(`${id}: launch-date conflict not a ±1-day boundary (${r.catalogueLaunchDate} vs ${r.primaryStatedLaunchDate})`);
      }
    } else if (r.primaryStatedLaunchDate) {
      issues.push(`${id}: primaryStatedLaunchDate set without a conflict verdict`);
    }
    if (r.massVerification === "confirmed_by_primary") {
      if (!r.reachable) issues.push(`${id}: mass confirmed but source unreachable`);
      if (r.wikidataMassKg == null) issues.push(`${id}: mass confirmed but no Wikidata mass held`);
      else if (!(r.primaryStatedMassKg ?? []).some((s) => rel(s, r.wikidataMassKg!) <= 0.005))
        issues.push(`${id}: mass claimed confirmed but no on-page figure matches ${r.wikidataMassKg} kg`);
    }
    // a conflict must come from a reachable source, backed by a single same-magnitude, clearly-different figure.
    if (r.massVerification === "conflict") {
      const stated = r.primaryStatedMassKg ?? [];
      if (!r.reachable) issues.push(`${id}: mass conflict but source unreachable`);
      if (r.wikidataMassKg == null) issues.push(`${id}: mass conflict but no Wikidata mass held`);
      else if (stated.length !== 1 || rel(stated[0], r.wikidataMassKg) <= 0.02 || stated[0] < r.wikidataMassKg * 0.5 || stated[0] > r.wikidataMassKg * 2)
        issues.push(`${id}: mass conflict not supported by a single same-magnitude, clearly-different on-page figure`);
    }
    // a mass we do not hold cannot have any verdict other than retained_secondary.
    if (r.wikidataMassKg == null && r.massVerification !== "retained_secondary")
      issues.push(`${id}: mass verdict ${r.massVerification} but no Wikidata mass held`);

    // cross-check the held values against the live overlays (snapshot must not drift), null-symmetric.
    const rec = EXPLORATION_BY_ID.get(r.missionId) as { launchDate?: string } | undefined;
    if ((rec?.launchDate ?? null) !== r.catalogueLaunchDate)
      issues.push(`${id}: snapshot launch date ${r.catalogueLaunchDate} != catalogue ${rec?.launchDate ?? null}`);
    const massNow = getMissionPrecision(r.missionId)?.launchMassKg?.value ?? null;
    if (r.wikidataMassKg !== massNow)
      issues.push(`${id}: snapshot Wikidata mass ${r.wikidataMassKg} != overlay ${massNow}`);
  }
  return issues;
}
