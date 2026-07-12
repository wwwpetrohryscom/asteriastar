import { collectProvenance, provenanceStats } from "@/lib/provenance/registry";
import { DERIVED_STATS } from "@/knowledge-graph/data/derived-values";
import { MISSION_PRECISION_META, MISSION_PRECISION } from "@/knowledge-graph/data/mission-precision";
import { MISSION_PRIMARY_META, getMissionPrimary } from "@/knowledge-graph/data/mission-primary";
import { SOURCES, type SourceKey } from "@/lib/sources";
import { SNAPSHOTS_META, CADENCE_DAYS, type SnapshotMeta } from "./snapshots-meta";

/**
 * Data-health metrics engine (Program: source & provenance health dashboard).
 *
 * EVERY number here is computed from the live registries and committed snapshots — there
 * are no hard-coded totals, no static metrics and no invented provider status. A status
 * is only `healthy` when it is genuinely so; there is no composite "trust score".
 */

export type HealthStatus = "healthy" | "warning" | "stale" | "failed" | "unavailable" | "unverified" | "conflict" | "planned";

/** Deterministic FNV-1a hash of a snapshot's id + retrieval date + row count — a
 *  lightweight metadata signature (not a content checksum) that changes when a snapshot
 *  is regenerated. Full content change detection is the refresh diff's job. */
function signature(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function coverageMetrics() {
  const stats = provenanceStats();
  const all = collectProvenance();
  const withRowRef = all.filter((e) => e.value.sourceRowId).length;
  const withDoi = all.filter((e) => e.value.doi).length;
  const withFrame = all.filter((e) => e.value.referenceFrame).length;
  return {
    totalValues: stats.total,
    entities: stats.entities,
    byDomain: stats.byDomain,
    bySource: stats.bySource,
    byStatus: stats.byStatus,
    distinctBibcodes: stats.distinctBibcodes,
    withUncertainty: stats.withUncertainty,
    withEpoch: stats.withEpoch,
    withRowReference: withRowRef,
    withBibcode: all.filter((e) => e.value.bibcode).length,
    withDoi,
    withReferenceFrame: withFrame,
  };
}

export function qualityMetrics() {
  const all = collectProvenance();
  const total = all.length;
  const secondarySourceKeys: SourceKey[] = ["wikidata"]; // community structured secondary source
  const bySourceAuthority: Record<string, number> = {};
  for (const e of all) {
    const auth = SOURCES[e.value.sourceRef]?.authorityType ?? "unknown";
    bySourceAuthority[auth] = (bySourceAuthority[auth] ?? 0) + 1;
  }
  // Primary-verification universe: the missions we hold structured data for, and how many of
  // those have a launch date confirmed by an official agency primary source.
  const structuredMissions = MISSION_PRECISION.size;
  const primaryConfirmed = [...MISSION_PRECISION.keys()].filter((id) => getMissionPrimary(id)?.launchDateVerification === "confirmed_by_primary").length;
  return {
    withoutUncertainty: total - all.filter((e) => e.value.uncertainty).length,
    secondarySourced: all.filter((e) => secondarySourceKeys.includes(e.value.sourceRef)).length,
    bySourceAuthority,
    disputed: all.filter((e) => e.value.status === "disputed").length,
    upperLimits: all.filter((e) => e.value.status === "upper_limit").length,
    lowerLimits: all.filter((e) => e.value.status === "lower_limit").length,
    // A real, surfaced cross-source conflict: Wikidata launch dates that disagree with the catalogue.
    launchDateConflicts: MISSION_PRECISION_META.launchDateDiscrepancies,
    // Primary-source verification (Program 4), reported over ONE explicit universe so the
    // confirmed/unverified counts reconcile: the missions we hold structured (Wikidata/catalogue)
    // data for. `primaryConfirmed + unverified === withStructuredData`, always.
    missionsWithStructuredData: structuredMissions,
    missionsPrimaryConfirmed: primaryConfirmed,
    missionsUnverifiedByPrimary: structuredMissions - primaryConfirmed,
    // Curated primary-source registry coverage — a SEPARATE universe (the missions Program 4
    // examined), labelled as such wherever shown so it is not confused with the count above.
    curatedPrimarySources: MISSION_PRIMARY_META.sources,
    curatedLaunchDatesConfirmed: MISSION_PRIMARY_META.launchDatesConfirmedByPrimary,
    // Field-level conflict count: launch-date conflicts + mass conflicts (a row may contribute to both).
    missionPrimaryConflicts: MISSION_PRIMARY_META.launchDateConflicts + MISSION_PRIMARY_META.massConflicts,
  };
}

export function derivedMetrics() {
  // Only the derived-value engine's own outputs carry a formulaId — this excludes
  // catalogue-native derived/calculated-status values (SBDB orbit elements, deep-sky
  // physical sizes), so inRegistry equals the derived-value registry, not every
  // derived-status value in provenance.
  const inRegistry = collectProvenance().filter((e) => "formulaId" in e.value).length;
  return {
    total: DERIVED_STATS.total,
    byFormula: DERIVED_STATS.byFormula,
    byDomain: DERIVED_STATS.byDomain,
    withUncertainty: DERIVED_STATS.withUncertainty,
    withoutUncertainty: DERIVED_STATS.total - DERIVED_STATS.withUncertainty,
    inRegistry,
  };
}

export interface FreshnessRow extends SnapshotMeta {
  ageDays: number;
  nextDue: string;
  status: HealthStatus;
  signature: string;
}

/** Completed days between a YYYY-MM-DD date and an instant (b − a), floored — so a
 *  retrieval date in the future yields a strictly-negative age (→ "unverified") and a
 *  same-day snapshot is 0 days old, never rounded up. */
function daysBetween(aIso: string, b: Date): number {
  const a = new Date(`${aIso}T00:00:00Z`).getTime();
  return Math.floor((b.getTime() - a) / 86_400_000);
}
function addDays(aIso: string, days: number): string {
  return new Date(new Date(`${aIso}T00:00:00Z`).getTime() + days * 86_400_000).toISOString().slice(0, 10);
}

export function freshnessMetrics(asOf: Date = new Date()): { asOf: string; rows: FreshnessRow[] } {
  const rows = SNAPSHOTS_META.map((s): FreshnessRow => {
    const period = CADENCE_DAYS[s.cadence];
    const ageDays = daysBetween(s.retrievedAt, asOf);
    // fresh within one cadence period, aging up to 1.5×, stale beyond; a future date is unverified.
    let status: HealthStatus = "healthy";
    if (ageDays < 0) status = "unverified";
    else if (ageDays > period * 1.5) status = "stale";
    else if (ageDays > period) status = "warning";
    return { ...s, ageDays, nextDue: addDays(s.retrievedAt, period), status, signature: signature(`${s.id}:${s.retrievedAt}:${s.rows}`) };
  });
  return { asOf: asOf.toISOString().slice(0, 10), rows };
}

export interface ProviderHealthRow {
  provider: string;
  snapshots: string[];
  lastRetrieved: string;
  rows: number;
  status: HealthStatus;
}

export function providerHealth(asOf: Date = new Date()): ProviderHealthRow[] {
  const fresh = freshnessMetrics(asOf).rows;
  const byProvider = new Map<string, FreshnessRow[]>();
  for (const r of fresh) (byProvider.get(r.provider) ?? byProvider.set(r.provider, []).get(r.provider)!).push(r);
  const rank: Record<HealthStatus, number> = { healthy: 0, planned: 1, unverified: 2, warning: 3, conflict: 4, stale: 5, unavailable: 6, failed: 7 };
  return [...byProvider.entries()].map(([provider, rs]) => ({
    provider,
    snapshots: rs.map((r) => r.id),
    lastRetrieved: rs.map((r) => r.retrievedAt).sort().at(-1)!,
    rows: rs.reduce((a, r) => a + r.rows, 0),
    status: rs.map((r) => r.status).reduce((a, b) => (rank[a] >= rank[b] ? a : b)),
  })).sort((a, b) => a.provider.localeCompare(b.provider));
}

/** Everything the dashboard renders, computed once. */
export function dataHealth(asOf: Date = new Date()) {
  return {
    asOf: asOf.toISOString().slice(0, 10),
    coverage: coverageMetrics(),
    quality: qualityMetrics(),
    derived: derivedMetrics(),
    freshness: freshnessMetrics(asOf),
    providers: providerHealth(asOf),
  };
}
