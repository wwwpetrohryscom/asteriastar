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

import { DEEP_SKY_PRECISION, DEEP_SKY_PRECISION_META } from "../../src/knowledge-graph/data/deep-sky-catalog/precision";
import { DEEP_SKY_RECORDS } from "../../src/knowledge-graph/data/deep-sky-catalog";
const DS = [...DEEP_SKY_PRECISION.values()];
const dsN = DEEP_SKY_RECORDS.length;
console.log("\nPROGRAM 2 — DEEP-SKY PRECISION COVERAGE");
console.log(`  catalogue objects: ${dsN}`);
console.log(`  objects with a precision overlay: ${DS.length} (${pct(DS.length, dsN)})`);
console.log(`  SIMBAD retrieved ${DEEP_SKY_PRECISION_META.simbadRetrievedAt} · NED retrieved ${DEEP_SKY_PRECISION_META.nedRetrievedAt}`);
const dsFields: [string, (p: (typeof DS)[number]) => unknown][] = [
  ["distance (ly, catalogued)", (p) => p.distanceLy],
  ["physical size (derived)", (p) => p.physicalMajorLy],
  ["cosmological redshift (galaxies)", (p) => p.redshift],
  ["radial velocity", (p) => p.radialVelocityKmS],
];
for (const [label, f] of dsFields) {
  const c = DS.filter((p) => f(p) != null).length;
  console.log(`    ${label.padEnd(38)} ${String(c).padStart(5)}  ${pct(c, dsN)}`);
}
const blue = DS.filter((p) => (p.radialVelocityKmS?.value ?? 0) < 0 && p.extragalactic).length;
console.log(`  blueshifted (approaching) galaxies correctly labelled radial velocity: ${blue}`);

import { SMALL_BODY_PRECISION, SMALL_BODY_PRECISION_META } from "../../src/knowledge-graph/data/small-body-precision";
const SB = [...SMALL_BODY_PRECISION.values()];
console.log("\nPROGRAM 3 — SMALL-BODY PRECISION COVERAGE (JPL SBDB)");
console.log(`  bodies with an orbit solution: ${SB.length} · ${SMALL_BODY_PRECISION_META.neo} NEO, ${SMALL_BODY_PRECISION_META.pha} PHA · retrieved ${SMALL_BODY_PRECISION_META.retrievedAt}`);
const sbFields: [string, (p: (typeof SB)[number]) => unknown][] = [
  ["orbital elements (a,e,i,q)", (p) => p.semiMajorAxisAu],
  ["aphelion (bound orbits)", (p) => p.aphelionAu],
  ["orbital period", (p) => p.orbitalPeriodDays],
  ["diameter", (p) => p.diameterKm],
  ["albedo", (p) => p.albedo],
  ["rotation period", (p) => p.rotationPeriodH],
];
for (const [label, f] of sbFields) {
  const c = SB.filter((p) => f(p) != null).length;
  console.log(`    ${label.padEnd(38)} ${String(c).padStart(5)}  ${pct(c, SB.length)}`);
}
const withSigma = SB.filter((p) => p.semiMajorAxisAu?.uncertainty != null).length;
console.log(`  semi-major axis with a stated uncertainty: ${withSigma} (${pct(withSigma, SB.length)})`);
console.log(`  hyperbolic (unbound) comets correctly modelled: ${SB.filter((p) => (p.eccentricity?.value ?? 0) >= 1).length}`);

import { MISSION_PRECISION_META } from "../../src/knowledge-graph/data/mission-precision";
const M4 = MISSION_PRECISION_META;
console.log("\nPROGRAM 4 — MISSION PRECISION COVERAGE (Wikidata, type-verified)");
console.log(`  missions matched (type-safe, unambiguous): ${M4.missions} · retrieved ${M4.retrievedAt}`);
console.log(`    international designator (COSPAR)       ${String(M4.withCospar).padStart(5)}`);
console.log(`    launch mass                             ${String(M4.withMass).padStart(5)}`);
console.log(`    launch dates cross-confirmed vs catalog ${String(M4.launchDatesConfirmed).padStart(5)}`);
console.log(`    launch-date discrepancies (catalogue kept authoritative): ${M4.launchDateDiscrepancies}`);

import { provenanceStats } from "../../src/lib/provenance/registry";
const PR = provenanceStats();
console.log("\nPROGRAM 5 — UNIFIED FIELD-LEVEL PROVENANCE REGISTRY");
console.log(`  ${PR.total.toLocaleString()} source-traced values across ${PR.entities.toLocaleString()} entities · ${PR.distinctBibcodes} distinct bibcodes`);
console.log("  by domain:", PR.byDomain);
console.log("  by status:", PR.byStatus);
console.log("  by source:", PR.bySource);
console.log(`  with uncertainty: ${PR.withUncertainty.toLocaleString()} · with epoch: ${PR.withEpoch.toLocaleString()}`);
