import type { ScientificValue } from "@/lib/provenance/scientific-value";
import { validateScientificValue, isValidBibcode } from "@/lib/provenance/scientific-value";
import { DEEP_SKY_BY_ID } from "@/knowledge-graph/data/deep-sky-catalog";
import { SIMBAD_DEEP_SKY_ROWS, SIMBAD_DEEP_SKY_RETRIEVED_AT } from "./snapshots/simbad-deep-sky";
import { NED_DEEP_SKY_ROWS, NED_DEEP_SKY_RETRIEVED_AT } from "./snapshots/ned-deep-sky";

/**
 * Deep-sky precision overlay (Program 2).
 *
 * Normalises the committed SIMBAD (`basic` + `mesDistance`) and NED snapshots into
 * per-field `ScientificValue`s per object, without touching the generated OpenNGC
 * catalogue. Honesty rules baked in:
 *  - a **cosmological redshift** is attached only to extragalactic objects; a Galactic
 *    cluster/nebula gets a **radial velocity** instead — the two are never conflated;
 *  - a distance is `catalogued` with its determination method named (never silently
 *    "measured");
 *  - **physical size is derived** (angular size × distance, small-angle) and labelled,
 *    only where both source-backed inputs exist.
 */

const PC_PER = { pc: 1, kpc: 1_000, Mpc: 1_000_000 } as const;
const LY_PER_PC = 3.2615638;
const ARCMIN_TO_RAD = Math.PI / (180 * 60);

export interface DeepSkyPrecision {
  dsId: string;
  simbadId?: string;
  nedName?: string;
  objType?: string;
  extragalactic: boolean;
  raDeg?: ScientificValue;
  decDeg?: ScientificValue;
  distanceLy?: ScientificValue;
  redshift?: ScientificValue; // extragalactic only
  radialVelocityKmS?: ScientificValue;
  physicalMajorLy?: ScientificValue; // derived
  physicalMinorLy?: ScientificValue; // derived
}

// Only a well-formed ADS bibcode is stored as a bibcode; a source's non-ADS reference
// code (e.g. NED's "2005SDSS4.C...0000:") is preserved as a note instead of being
// mislabelled as a bibcode.
const bib = (b: string | null): string | undefined => { const t = b?.trim(); return t && isValidBibcode(t) ? t : undefined; };
const refNote = (b: string | null): string | undefined => { const t = b?.trim(); return t && !isValidBibcode(t) ? `source refcode ${t}` : undefined; };
const joinNotes = (...xs: (string | undefined)[]): string | undefined => { const j = xs.filter(Boolean).join("; "); return j || undefined; };

function distanceToLy(dist: number, unit: string | null): number | null {
  const pc = unit ? (PC_PER as Record<string, number>)[unit] : undefined;
  if (pc == null || !(dist > 0)) return null;
  return dist * pc * LY_PER_PC;
}

function build(): Map<string, DeepSkyPrecision> {
  const nedByDs = new Map(NED_DEEP_SKY_ROWS.map((n) => [n.dsId, n]));
  const out = new Map<string, DeepSkyPrecision>();
  for (const s of SIMBAD_DEEP_SKY_ROWS) {
    const rec = DEEP_SKY_BY_ID.get(s.dsId);
    if (!rec) continue;
    // No coordinate-based exclusion: ingestion matches by EXACT catalogue designation
    // (M/NGC/IC/PGC), so SIMBAD cannot return a different-designation object. A large
    // SIMBAD↔catalogue offset for an extended cluster/nebula is a centroid-convention
    // difference, not a wrong match; only a gross offset (a genuine coordinate error) is
    // flagged, by the validator below.
    const extragalactic = rec.entityType === "galaxy";
    const ned = nedByDs.get(s.dsId);
    const p: DeepSkyPrecision = { dsId: s.dsId, simbadId: s.main_id, nedName: ned?.ned_name ?? undefined, objType: s.otype_txt ?? undefined, extragalactic };
    const sbase = { sourceRef: "simbad" as const, sourceDataset: "SIMBAD", objectIdentifier: s.main_id, retrievedAt: SIMBAD_DEEP_SKY_RETRIEVED_AT };

    if (s.ra != null && s.dec != null) {
      p.raDeg = { ...sbase, value: s.ra, unit: "deg", status: "measured", sourceTable: "basic", sourceField: "ra", referenceFrame: "ICRS", epoch: "J2000", bibcode: bib(s.coo_bibcode) };
      p.decDeg = { ...sbase, value: s.dec, unit: "deg", status: "measured", sourceTable: "basic", sourceField: "dec", referenceFrame: "ICRS", epoch: "J2000", bibcode: bib(s.coo_bibcode) };
    }

    // Distance (SIMBAD mesDistance, normalised to light-years, method named).
    let distLy: number | undefined;
    if (s.dist != null) {
      const ly = distanceToLy(s.dist, s.dist_unit);
      if (ly != null) {
        distLy = ly;
        p.distanceLy = {
          ...sbase, value: ly, unit: "ly", status: "catalogued", sourceTable: "mesDistance", sourceField: "dist",
          method: s.dist_method ? `distance indicator: ${s.dist_method}` : undefined, bibcode: bib(s.dist_bibcode),
          notes: `source value ${s.dist} ${s.dist_unit}${s.dist_qual ? ` (quality ${s.dist_qual})` : ""}`,
        };
      }
    }

    // Cosmological redshift — EXTRAGALACTIC ONLY. Prefer NED's authoritative value.
    if (extragalactic) {
      if (ned && ned.redshift != null) {
        p.redshift = {
          sourceRef: "ned", sourceDataset: "NED", sourceTable: "ObjectLookup", sourceField: "Redshift", objectIdentifier: ned.ned_name ?? s.main_id,
          value: ned.redshift, status: "catalogued", uncertainty: ned.redshift_unc != null ? { symmetric: ned.redshift_unc } : undefined,
          bibcode: bib(ned.redshift_bibcode), retrievedAt: NED_DEEP_SKY_RETRIEVED_AT,
          notes: joinNotes(ned.redshift_qual ? `NED quality ${ned.redshift_qual}` : undefined, refNote(ned.redshift_bibcode)),
        };
      } else if (s.rvz_redshift != null && s.rvz_type === "z") {
        // rvz_type 'z' → rvz_err is a (dimensionless) redshift error, belonging here.
        p.redshift = {
          ...sbase, value: s.rvz_redshift, status: "catalogued", sourceTable: "basic", sourceField: "rvz_redshift",
          uncertainty: s.rvz_err != null ? { symmetric: s.rvz_err } : undefined, bibcode: bib(s.rvz_bibcode),
        };
      }
    }

    // Heliocentric radial velocity — for ALL objects (the honest quantity for a
    // Galactic cluster/nebula, and for a galaxy alike; a negative value is a blueshift).
    // rvz_err is only a km/s velocity uncertainty when the SIMBAD measurement type is a
    // velocity ('v'); for a redshift-nature measurement it is a dimensionless z-error and
    // must NOT be shown as ± km/s.
    if (s.rvz_radvel != null)
      p.radialVelocityKmS = {
        ...sbase, value: s.rvz_radvel, unit: "km/s", status: "measured", sourceTable: "basic", sourceField: "rvz_radvel",
        uncertainty: s.rvz_err != null && s.rvz_type === "v" ? { symmetric: s.rvz_err, unit: "km/s" } : undefined, bibcode: bib(s.rvz_bibcode),
      };

    // Derived physical size — angular size (OpenNGC) × distance (SIMBAD), small-angle.
    if (distLy != null && rec.sizeMajorArcmin != null && rec.sizeMajorArcmin > 0) {
      const dbase = {
        sourceRef: "simbad" as const, status: "derived" as const,
        method: "physical size = angular size × distance (small-angle); angular size from OpenNGC, distance from SIMBAD mesDistance",
        sourceDataset: "derived (OpenNGC angular size × SIMBAD distance)", retrievedAt: SIMBAD_DEEP_SKY_RETRIEVED_AT,
      };
      p.physicalMajorLy = { ...dbase, value: distLy * rec.sizeMajorArcmin * ARCMIN_TO_RAD, unit: "ly" };
      if (rec.sizeMinorArcmin != null && rec.sizeMinorArcmin > 0)
        p.physicalMinorLy = { ...dbase, value: distLy * rec.sizeMinorArcmin * ARCMIN_TO_RAD, unit: "ly" };
    }

    out.set(s.dsId, p);
  }
  return out;
}

export const DEEP_SKY_PRECISION: Map<string, DeepSkyPrecision> = build();

export const DEEP_SKY_PRECISION_META = {
  simbadRetrievedAt: SIMBAD_DEEP_SKY_RETRIEVED_AT,
  nedRetrievedAt: NED_DEEP_SKY_RETRIEVED_AT,
  simbadRows: SIMBAD_DEEP_SKY_ROWS.length,
  nedRows: NED_DEEP_SKY_ROWS.length,
  objects: DEEP_SKY_PRECISION.size,
} as const;

export function getDeepSkyPrecision(dsId: string): DeepSkyPrecision | undefined {
  return DEEP_SKY_PRECISION.get(dsId);
}

function sepArcsec(ra1: number, dec1: number, ra2: number, dec2: number): number {
  const d = Math.PI / 180;
  const cos = Math.sin(dec1 * d) * Math.sin(dec2 * d) + Math.cos(dec1 * d) * Math.cos(dec2 * d) * Math.cos((ra1 - ra2) * d);
  return (Math.acos(Math.min(1, Math.max(-1, cos))) / d) * 3600;
}

/**
 * Deep-sky precision gate. Rejects fabrication-shaped or contradictory data, never
 * mere absence: structural honesty of every value; the redshift/velocity distinction
 * (a cosmological redshift must never sit on a Galactic object); a SIMBAD↔catalogue
 * coordinate cross-check; and physical-size consistency (positive, minor ≤ major).
 */
export function validateDeepSkyPrecision(): string[] {
  const issues: string[] = [];
  for (const p of DEEP_SKY_PRECISION.values()) {
    const rec = DEEP_SKY_BY_ID.get(p.dsId);
    if (!rec) { issues.push(`precision for unknown deep-sky object ${p.dsId}`); continue; }
    const values: [string, ScientificValue<unknown> | undefined][] = [
      ["raDeg", p.raDeg], ["decDeg", p.decDeg], ["distanceLy", p.distanceLy], ["redshift", p.redshift],
      ["radialVelocityKmS", p.radialVelocityKmS], ["physicalMajorLy", p.physicalMajorLy], ["physicalMinorLy", p.physicalMinorLy],
    ];
    for (const [name, v] of values) if (v) for (const e of validateScientificValue(v, `${p.dsId}.${name}`)) issues.push(e);

    // Redshift/velocity confusion: a cosmological redshift may not sit on a Galactic object.
    if (p.redshift && rec.entityType !== "galaxy")
      issues.push(`${p.dsId}: cosmological redshift attached to a non-extragalactic ${rec.entityType} (should be a radial velocity)`);
    // Coordinate cross-check (catalogue RA is in hours → ×15). Because objects are
    // matched by EXACT designation, SIMBAD can't return a different-designation object,
    // and extended clusters/nebulae legitimately have centroid-convention offsets of
    // tens of arcmin — so only a GROSS separation (> 3°) is flagged, which would signal a
    // genuine coordinate data error (e.g. a unit bug), never an extended-object centroid.
    if (p.raDeg && p.decDeg && rec.raHours != null && rec.decDeg != null) {
      const sep = sepArcsec(p.raDeg.value, p.decDeg.value, rec.raHours * 15, rec.decDeg);
      if (sep > 10800) issues.push(`${p.dsId}: SIMBAD position differs from catalogue by ${Math.round(sep / 60)}′ (> 3°; coordinate data error)`);
    }
    if (p.distanceLy && p.distanceLy.value <= 0) issues.push(`${p.dsId}: non-positive distance`);
    if (p.physicalMajorLy && p.physicalMajorLy.value <= 0) issues.push(`${p.dsId}: non-positive physical size`);
    if (p.physicalMajorLy && p.physicalMinorLy && p.physicalMinorLy.value > p.physicalMajorLy.value * 1.001)
      issues.push(`${p.dsId}: derived minor axis exceeds major axis`);
  }
  return issues;
}
