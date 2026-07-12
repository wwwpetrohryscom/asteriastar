/**
 * Cross-domain field-level provenance gate + report.
 *   npx tsx scripts/precision/validate-provenance.ts   (npm run provenance:validate)
 * Runs the structural honesty check on every ScientificValue across all precision
 * domains and prints coverage. Exits non-zero on any violation.
 */
import { provenanceStats, validateAllProvenance } from "../../src/lib/provenance/registry";
import { DERIVED_STATS, validateDerivedValues } from "../../src/knowledge-graph/data/derived-values";

const stats = provenanceStats();
console.log("FIELD-LEVEL PROVENANCE REGISTRY");
console.log(`  ${stats.total.toLocaleString()} source-traced values across ${stats.entities.toLocaleString()} entities`);
console.log("  by domain:", stats.byDomain);
console.log("  by status:", stats.byStatus);
console.log("  by source:", stats.bySource);
console.log(`  distinct bibcodes: ${stats.distinctBibcodes} · values with uncertainty: ${stats.withUncertainty.toLocaleString()} · with epoch: ${stats.withEpoch.toLocaleString()}`);

console.log(`  derived values: ${DERIVED_STATS.total} (${Object.entries(DERIVED_STATS.byFormula).map(([k, v]) => `${v} ${k}`).join(", ")})`);

const issues = [...validateDerivedValues(), ...validateAllProvenance()];
if (issues.length) {
  console.error(`\n✗ ${issues.length} provenance issue(s):`);
  for (const i of issues.slice(0, 40)) console.error(`  • ${i}`);
  process.exit(1);
}
console.log("\n✓ Field-level provenance valid — every value carries a known source and truthful status; no fabricated identifier, bibcode or method.");
