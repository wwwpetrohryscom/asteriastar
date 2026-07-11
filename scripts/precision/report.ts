/**
 * Precision coverage report. Summarises how much of each domain now carries
 * source-traced, field-level values, and with what provenance quality.
 *   npx tsx scripts/precision/report.ts   (npm run precision:report)
 */
import { STAR_PRECISION, STAR_PRECISION_META } from "../../src/knowledge-graph/data/star-catalog/precision";
import { STAR_RECORDS } from "../../src/knowledge-graph/data/star-catalog";

function pct(n: number, d: number): string {
  return d === 0 ? "0%" : `${((100 * n) / d).toFixed(1)}%`;
}

const P = [...STAR_PRECISION.values()];
const N = STAR_RECORDS.length;
const count = (f: (p: (typeof P)[number]) => unknown) => P.filter((p) => f(p) != null).length;

const fields: [string, (p: (typeof P)[number]) => unknown][] = [
  ["SIMBAD id", (p) => p.simbadId],
  ["Gaia DR3 source id", (p) => p.gaiaSourceId],
  ["parallax (measured)", (p) => p.parallaxMas],
  ["distance (Bailer-Jones, estimated)", (p) => p.distancePc],
  ["proper motion", (p) => p.properMotionRaMasYr],
  ["radial velocity", (p) => p.radialVelocityKmS],
  ["spectral type", (p) => p.spectralType],
  ["effective temperature (modeled)", (p) => p.effectiveTempK],
  ["radius (modeled)", (p) => p.radiusSolar],
  ["metallicity (modeled)", (p) => p.metallicityMH],
];

console.log("PROGRAM 1 — STAR PRECISION COVERAGE");
console.log(`  catalogue stars: ${N}`);
console.log(`  stars with a precision overlay: ${P.length} (${pct(P.length, N)})`);
console.log(`  SIMBAD retrieved ${STAR_PRECISION_META.simbadRetrievedAt} · Gaia DR3 retrieved ${STAR_PRECISION_META.gaiaRetrievedAt}`);
console.log("  field coverage (of all catalogue stars):");
for (const [label, f] of fields) {
  const c = count(f);
  console.log(`    ${label.padEnd(38)} ${String(c).padStart(5)}  ${pct(c, N)}`);
}
const uncert = P.filter((p) => p.parallaxMas?.uncertainty != null).length;
const bibcodes = new Set(P.flatMap((p) => [p.parallaxMas?.bibcode, p.radialVelocityKmS?.bibcode, p.spectralType?.bibcode].filter(Boolean)));
const flagged = P.filter((p) => p.astrometryFlagged).length;
console.log(`  parallax with uncertainty: ${uncert} (${pct(uncert, P.length)})`);
console.log(`  distinct source bibcodes referenced: ${bibcodes.size}`);
console.log(`  Gaia RUWE-flagged (astrometric-quality note surfaced): ${flagged}`);
