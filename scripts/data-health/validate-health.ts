/**
 * Data-health integrity gate. Proves every dashboard metric equals registry-derived
 * truth (no hard-coded totals, no fabricated status, no count mismatch) and that the
 * freshness logic behaves correctly. Fails the build otherwise.
 *   npx tsx scripts/data-health/validate-health.ts   (npm run datahealth:validate)
 */
import { collectProvenance } from "../../src/lib/provenance/registry";
import { DERIVED_STATS } from "../../src/knowledge-graph/data/derived-values";
import { MISSION_PRECISION } from "../../src/knowledge-graph/data/mission-precision";
import { coverageMetrics, qualityMetrics, derivedMetrics, freshnessMetrics } from "../../src/lib/data-health/metrics";
import { SNAPSHOTS_META, CADENCE_DAYS } from "../../src/lib/data-health/snapshots-meta";
import { REFRESH_SNAPSHOTS } from "../refresh/snapshots";

const DAY = 86_400_000;
const at = (iso: string, plusDays: number) => new Date(+new Date(`${iso}T00:00:00Z`) + plusDays * DAY);

const issues: string[] = [];
const eq = (name: string, a: unknown, b: unknown) => { if (a !== b) issues.push(`${name}: dashboard ${JSON.stringify(a)} ≠ registry ${JSON.stringify(b)}`); };

const all = collectProvenance();
const cov = coverageMetrics();

// 1) Every coverage metric equals an INDEPENDENT recomputation from the live registry
// (a hard-coded or drifted number fails). Not just sums — each displayed figure.
eq("coverage.totalValues", cov.totalValues, all.length);
eq("coverage.entities", cov.entities, new Set(all.map((e) => e.entityId)).size);
eq("coverage.withUncertainty", cov.withUncertainty, all.filter((e) => e.value.uncertainty).length);
eq("coverage.withRowReference", cov.withRowReference, all.filter((e) => e.value.sourceRowId).length);
eq("coverage.withBibcode", cov.withBibcode, all.filter((e) => e.value.bibcode).length);
eq("coverage.withDoi", cov.withDoi, all.filter((e) => e.value.doi).length);
eq("coverage.withEpoch", cov.withEpoch, all.filter((e) => e.value.epoch).length);
eq("coverage.withReferenceFrame", cov.withReferenceFrame, all.filter((e) => e.value.referenceFrame).length);
eq("coverage.distinctBibcodes", cov.distinctBibcodes, new Set(all.map((e) => e.value.bibcode).filter(Boolean)).size);

// Distributions must match bucket-by-bucket, not merely on their sum.
const recount = (key: (e: (typeof all)[number]) => string) => {
  const m: Record<string, number> = {};
  for (const e of all) m[key(e)] = (m[key(e)] ?? 0) + 1;
  return m;
};
const deepEq = (name: string, a: Record<string, number>, b: Record<string, number>) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if (a[k] !== b[k]) issues.push(`${name}[${k}]: dashboard ${a[k]} ≠ registry ${b[k]}`);
};
deepEq("byDomain", cov.byDomain, recount((e) => e.domain));
deepEq("byStatus", cov.byStatus as Record<string, number>, recount((e) => e.value.status));
deepEq("bySource", cov.bySource as Record<string, number>, recount((e) => e.value.sourceRef));

// 2) Derived + quality metrics equal their registries.
const der = derivedMetrics();
eq("derived.total", der.total, DERIVED_STATS.total);
eq("derived.inRegistry", der.inRegistry, all.filter((e) => "formulaId" in e.value).length);
eq("derived.withoutUncertainty", der.withoutUncertainty, DERIVED_STATS.total - DERIVED_STATS.withUncertainty);
const qual = qualityMetrics();
eq("quality.launchDateConflicts", qual.launchDateConflicts, [...MISSION_PRECISION.values()].filter((p) => p.launchDateDiscrepancy).length);
eq("quality.withoutUncertainty", qual.withoutUncertainty, all.length - all.filter((e) => e.value.uncertainty).length);
eq("quality.secondarySourced", qual.secondarySourced, all.filter((e) => e.value.sourceRef === "wikidata").length);

// 3) Freshness thresholds behave correctly, tested relative to each snapshot's own date.
for (const m of SNAPSHOTS_META) {
  const period = CADENCE_DAYS[m.cadence];
  const half = freshnessMetrics(at(m.retrievedAt, Math.floor(period / 2))).rows.find((r) => r.id === m.id)!;
  if (half.status !== "healthy") issues.push(`freshness: ${m.id} at half a cadence should be healthy, got ${half.status}`);
  const twice = freshnessMetrics(at(m.retrievedAt, period * 2)).rows.find((r) => r.id === m.id)!;
  if (twice.status !== "stale") issues.push(`freshness: ${m.id} at 2× its cadence should be stale, got ${twice.status}`);
}
// A retrieval date in the future (asOf before it) must be "unverified", never falsely fresh/stale —
// tested both at year scale and in the sub-day window (asOf 12h before the retrieval midnight).
if (!freshnessMetrics(new Date("2020-01-01T00:00:00Z")).rows.every((r) => r.status === "unverified"))
  issues.push("freshness: a year-future retrieval date must be 'unverified'");
for (const m of SNAPSHOTS_META) {
  const asOf = new Date(+new Date(`${m.retrievedAt}T00:00:00Z`) - 12 * 3_600_000); // 12h before the retrieval midnight
  const row = freshnessMetrics(asOf).rows.find((r) => r.id === m.id)!;
  if (row.status !== "unverified") issues.push(`freshness: ${m.id} viewed 12h before its retrieval must be 'unverified', got ${row.status}`);
}

// 4) The dashboard's snapshot metadata must agree with the refresh config (no drift).
const refreshById = new Map(REFRESH_SNAPSHOTS.map((s) => [s.id, s]));
for (const m of SNAPSHOTS_META) {
  const r = refreshById.get(m.id);
  if (!r) { issues.push(`snapshots-meta: "${m.id}" not in the refresh config`); continue; }
  if (r.provider !== m.provider) issues.push(`${m.id}: provider mismatch (${m.provider} vs ${r.provider})`);
  if (r.cadence !== m.cadence) issues.push(`${m.id}: cadence mismatch (${m.cadence} vs ${r.cadence})`);
}
if (SNAPSHOTS_META.length !== REFRESH_SNAPSHOTS.length) issues.push(`snapshot count mismatch: dashboard ${SNAPSHOTS_META.length} vs refresh ${REFRESH_SNAPSHOTS.length}`);

if (issues.length) {
  console.error(`✗ ${issues.length} data-health issue(s):`);
  for (const i of issues) console.error(`  • ${i}`);
  process.exit(1);
}
console.log(`✓ Data health valid — ${cov.totalValues.toLocaleString()} values, ${SNAPSHOTS_META.length} snapshots; every dashboard metric equals registry truth, freshness thresholds correct, no drift vs the refresh config.`);
