import type { ScientificValue, ValueStatus } from "@/lib/provenance/scientific-value";
import { validateScientificValue } from "@/lib/provenance/scientific-value";
import { SBDB_ROWS, SBDB_RETRIEVED_AT } from "./snapshots/sbdb";
import type { SbdbRow, SbdbValue } from "./types";

/**
 * Small-body precision overlay (Program 3).
 *
 * Normalises the committed JPL SBDB snapshot into per-field `ScientificValue`s per
 * asteroid/comet, without editing the curated catalogues. Every orbital element
 * carries the body's osculating **epoch** and its own **uncertainty (sigma)**; the
 * NEO/PHA/orbit-class flags are SBDB's authoritative values. Honesty rules:
 *  - orbital elements are `calculated` (an orbit-determination fit); physical
 *    parameters are `catalogued` (H, diameter, rotation — SBDB adopts these from
 *    photometric fits / radiometric models / lightcurve databases, so they are never
 *    claimed as direct "measured" observations) or `estimated` (albedo, density);
 *    NEO/PHA/orbit-class are SBDB's authoritative flags — nothing is overstated;
 *  - a hyperbolic comet legitimately has e ≥ 1, a negative semi-major axis and no
 *    aphelion, and is never forced into a bound-orbit shape;
 *  - a field SBDB does not provide is absent, never invented.
 */

export interface SmallBodyPrecision {
  bodyId: string;
  fullname: string;
  spkid?: string;
  neo?: boolean;
  pha?: boolean;
  orbitClassCode?: string;
  orbitClassName?: string;
  epochLabel?: string;
  moidAu?: number;
  conditionCode?: string;
  dataArcDays?: number;
  nObsUsed?: number;
  producer?: string;
  semiMajorAxisAu?: ScientificValue;
  eccentricity?: ScientificValue;
  inclinationDeg?: ScientificValue;
  ascNodeDeg?: ScientificValue;
  argPerihelionDeg?: ScientificValue;
  perihelionAu?: ScientificValue;
  aphelionAu?: ScientificValue;
  orbitalPeriodDays?: ScientificValue;
  absoluteMagnitudeH?: ScientificValue;
  albedo?: ScientificValue;
  diameterKm?: ScientificValue;
  rotationPeriodH?: ScientificValue;
  densityGCm3?: ScientificValue;
}

function jdToLabel(jd: number): string {
  // JD (TDB) → calendar date for display; the exact JD is kept alongside.
  const ms = (jd - 2440587.5) * 86_400_000;
  const iso = new Date(ms).toISOString().slice(0, 10);
  return `${iso} (JD ${jd} TDB)`;
}

function sv(row: SbdbRow, val: SbdbValue | null, unit: string, status: ValueStatus, field: string, method?: string): ScientificValue | undefined {
  if (!val) return undefined;
  return {
    value: val.value, unit: val.unit ?? unit, status,
    uncertainty: val.sigma != null ? { symmetric: val.sigma, unit: val.unit ?? unit } : undefined,
    sourceRef: "jpl", sourceDataset: "JPL SBDB", sourceTable: field.startsWith("phys") ? "phys_par" : "orbit.elements",
    sourceField: field, sourceRowId: row.spkid ?? undefined, objectIdentifier: row.fullname,
    epoch: field.startsWith("phys") ? undefined : (row.epochJd != null ? jdToLabel(row.epochJd) : undefined),
    referenceFrame: field.startsWith("phys") ? undefined : "heliocentric ecliptic J2000",
    method, retrievedAt: SBDB_RETRIEVED_AT,
    notes: row.producer ? `JPL solution by ${row.producer}${row.nObsUsed ? `, ${row.nObsUsed} obs` : ""}` : undefined,
  };
}

const ORBIT_METHOD = "JPL orbit determination (least-squares fit to the observation arc)";

function build(): Map<string, SmallBodyPrecision> {
  const out = new Map<string, SmallBodyPrecision>();
  for (const r of SBDB_ROWS) {
    const p: SmallBodyPrecision = {
      bodyId: r.bodyId, fullname: r.fullname, spkid: r.spkid ?? undefined,
      neo: r.neo ?? undefined, pha: r.pha ?? undefined,
      orbitClassCode: r.orbitClassCode ?? undefined, orbitClassName: r.orbitClassName ?? undefined,
      epochLabel: r.epochJd != null ? jdToLabel(r.epochJd) : undefined,
      moidAu: r.moidAu ?? undefined, conditionCode: r.conditionCode ?? undefined,
      dataArcDays: r.dataArcDays ?? undefined, nObsUsed: r.nObsUsed ?? undefined, producer: r.producer ?? undefined,
      semiMajorAxisAu: sv(r, r.a, "au", "calculated", "a", ORBIT_METHOD),
      eccentricity: sv(r, r.e, "", "calculated", "e", ORBIT_METHOD),
      inclinationDeg: sv(r, r.i, "deg", "calculated", "i", ORBIT_METHOD),
      ascNodeDeg: sv(r, r.om, "deg", "calculated", "om", ORBIT_METHOD),
      argPerihelionDeg: sv(r, r.w, "deg", "calculated", "w", ORBIT_METHOD),
      perihelionAu: sv(r, r.q, "au", "calculated", "q", ORBIT_METHOD),
      aphelionAu: sv(r, r.ad, "au", "calculated", "ad", ORBIT_METHOD),
      orbitalPeriodDays: sv(r, r.per, "d", "calculated", "per", ORBIT_METHOD),
      // Physical parameters are `catalogued` — SBDB adopts H from photometric fits,
      // diameter from radiometric models (IRAS/WISE) and rotation from lightcurve
      // databases, so none is a direct "measured" observation. Albedo/density are
      // model-derived → `estimated`.
      absoluteMagnitudeH: sv(r, r.H, "mag", "catalogued", "phys.H"),
      albedo: sv(r, r.albedo, "", "estimated", "phys.albedo"),
      diameterKm: sv(r, r.diameter, "km", "catalogued", "phys.diameter"),
      rotationPeriodH: sv(r, r.rotPer, "h", "catalogued", "phys.rot_per"),
      densityGCm3: sv(r, r.density, "g/cm^3", "estimated", "phys.density"),
    };
    out.set(r.bodyId, p);
  }
  return out;
}

export const SMALL_BODY_PRECISION: Map<string, SmallBodyPrecision> = build();

export const SMALL_BODY_PRECISION_META = {
  retrievedAt: SBDB_RETRIEVED_AT,
  bodies: SMALL_BODY_PRECISION.size,
  neo: [...SMALL_BODY_PRECISION.values()].filter((p) => p.neo).length,
  pha: [...SMALL_BODY_PRECISION.values()].filter((p) => p.pha).length,
} as const;

export function getSmallBodyPrecision(bodyId: string): SmallBodyPrecision | undefined {
  return SMALL_BODY_PRECISION.get(bodyId);
}

/**
 * Small-body precision gate. Rejects impossible/contradictory orbital data, never
 * absence: structural honesty of every value; Keplerian element ordering for BOUND
 * orbits (q ≤ a ≤ Q) while allowing hyperbolic comets (e ≥ 1, a < 0, no aphelion);
 * physical-range sanity; NEO/PHA consistency (PHA ⊆ NEO; near-Earth class ⇒ q < 1.3 au);
 * and unique SPK-IDs (a designation collision would map two bodies to one object).
 */
export function validateSmallBodyPrecision(): string[] {
  const issues: string[] = [];
  const seenSpk = new Map<string, string>();
  for (const p of SMALL_BODY_PRECISION.values()) {
    const values: [string, ScientificValue<unknown> | undefined][] = [
      ["semiMajorAxisAu", p.semiMajorAxisAu], ["eccentricity", p.eccentricity], ["inclinationDeg", p.inclinationDeg],
      ["ascNodeDeg", p.ascNodeDeg], ["argPerihelionDeg", p.argPerihelionDeg], ["perihelionAu", p.perihelionAu],
      ["aphelionAu", p.aphelionAu], ["orbitalPeriodDays", p.orbitalPeriodDays], ["absoluteMagnitudeH", p.absoluteMagnitudeH],
      ["albedo", p.albedo], ["diameterKm", p.diameterKm], ["rotationPeriodH", p.rotationPeriodH], ["densityGCm3", p.densityGCm3],
    ];
    for (const [name, v] of values) if (v) for (const e of validateScientificValue(v, `${p.bodyId}.${name}`)) issues.push(e);

    const e = p.eccentricity?.value;
    const a = p.semiMajorAxisAu?.value;
    const q = p.perihelionAu?.value;
    const Q = p.aphelionAu?.value;
    const hyperbolic = e != null && e >= 1;
    if (e != null && e < 0) issues.push(`${p.bodyId}: negative eccentricity ${e}`);
    if (q != null && q <= 0) issues.push(`${p.bodyId}: non-positive perihelion ${q} au`);
    if (p.inclinationDeg && (p.inclinationDeg.value < 0 || p.inclinationDeg.value > 180)) issues.push(`${p.bodyId}: inclination out of range`);
    // Bound-orbit ordering only (a hyperbolic comet has a < 0 and no aphelion).
    if (!hyperbolic) {
      if (q != null && a != null && q > a * 1.001) issues.push(`${p.bodyId}: perihelion ${q} exceeds semi-major axis ${a} au`);
      if (a != null && Q != null && a > Q * 1.001) issues.push(`${p.bodyId}: semi-major axis ${a} exceeds aphelion ${Q} au`);
      if (a != null && a <= 0) issues.push(`${p.bodyId}: non-positive semi-major axis on a bound orbit`);
    } else if (a != null && a >= 0) {
      issues.push(`${p.bodyId}: hyperbolic orbit (e ≥ 1) must have a negative semi-major axis`);
    }
    if (p.diameterKm && p.diameterKm.value <= 0) issues.push(`${p.bodyId}: non-positive diameter`);
    if (p.albedo && (p.albedo.value < 0 || p.albedo.value > 1.5)) issues.push(`${p.bodyId}: albedo ${p.albedo.value} out of range`);
    if (p.moidAu != null && p.moidAu < 0) issues.push(`${p.bodyId}: negative MOID`);
    // NEO/PHA consistency (per SBDB's own flags).
    if (p.pha === true && p.neo !== true) issues.push(`${p.bodyId}: flagged PHA but not NEO`);
    if (p.neo === true && q != null && q >= 1.3 * 1.001) issues.push(`${p.bodyId}: NEO but perihelion ${q} au ≥ 1.3`);
    // Unique SPK-ID.
    if (p.spkid) {
      const prev = seenSpk.get(p.spkid);
      if (prev) issues.push(`SPK-ID ${p.spkid} maps to two bodies: ${prev} and ${p.bodyId}`);
      seenSpk.set(p.spkid, p.bodyId);
    }
  }
  return issues;
}
