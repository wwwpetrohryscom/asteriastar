import type { ScientificValue } from "@/lib/provenance/scientific-value";
import { validateScientificValue } from "@/lib/provenance/scientific-value";
import { STAR_BY_ID } from "@/knowledge-graph/data/star-catalog";
import { SIMBAD_STAR_ROWS, SIMBAD_RETRIEVED_AT } from "./snapshots/simbad-stars";
import { GAIA_STAR_ROWS, GAIA_RETRIEVED_AT } from "./snapshots/gaia-stars";
import type { SimbadStarRow, GaiaStarRow } from "./types";

/**
 * Star-precision overlay (Program 1).
 *
 * Normalises the committed SIMBAD + Gaia DR3 snapshots into per-field
 * `ScientificValue`s, one entry per star, WITHOUT touching the generated HYG
 * catalogue. Every value is transcribed from a real source row; honesty rules are
 * baked into construction:
 *  - a SIMBAD parallax is "measured"; a Bailer-Jones distance is "estimated"
 *    (a Bayesian inference, not an observation); a Gaia GSP-Phot Teff/radius is
 *    "modeled" — never "measured";
 *  - a non-positive parallax is never turned into a distance;
 *  - RUWE > 1.4 is surfaced as an astrometric-quality flag, not hidden;
 *  - a field a source did not provide is simply absent.
 */

export interface StarPrecision {
  starId: string;
  simbadId?: string;
  objectType?: string;
  gaiaSourceId?: ScientificValue<string>;
  raDeg?: ScientificValue;
  decDeg?: ScientificValue;
  parallaxMas?: ScientificValue;
  distancePc?: ScientificValue;
  properMotionRaMasYr?: ScientificValue;
  properMotionDecMasYr?: ScientificValue;
  radialVelocityKmS?: ScientificValue;
  spectralType?: ScientificValue<string>;
  effectiveTempK?: ScientificValue;
  radiusSolar?: ScientificValue;
  surfaceGravityLogg?: ScientificValue;
  metallicityMH?: ScientificValue;
  /** Gaia astrometric renormalised unit weight error; > 1.4 flags a poor single-star fit. */
  astrometryRuwe?: number;
  astrometryFlagged?: boolean;
}

const bib = (b: string | null): string | undefined => (b && b.trim() ? b.trim() : undefined);

function fromSimbad(s: SimbadStarRow): Partial<StarPrecision> {
  const p: Partial<StarPrecision> = { simbadId: s.main_id, objectType: s.otype_txt ?? undefined };
  const obj = s.main_id;
  const base = { sourceRef: "simbad" as const, sourceDataset: "SIMBAD", sourceTable: "basic", objectIdentifier: obj, retrievedAt: SIMBAD_RETRIEVED_AT };
  if (s.ra != null && s.dec != null) {
    p.raDeg = { ...base, value: s.ra, unit: "deg", status: "measured", sourceField: "ra", referenceFrame: "ICRS", epoch: "J2000", bibcode: bib(s.coo_bibcode) };
    p.decDeg = { ...base, value: s.dec, unit: "deg", status: "measured", sourceField: "dec", referenceFrame: "ICRS", epoch: "J2000", bibcode: bib(s.coo_bibcode) };
  }
  // A parallax must be positive to be physical; SIMBAD's best value only.
  if (s.plx_value != null && s.plx_value > 0)
    p.parallaxMas = { ...base, value: s.plx_value, unit: "mas", status: "measured", sourceField: "plx_value", uncertainty: s.plx_err != null ? { symmetric: s.plx_err, unit: "mas" } : undefined, bibcode: bib(s.plx_bibcode) };
  if (s.pmra != null)
    p.properMotionRaMasYr = { ...base, value: s.pmra, unit: "mas/yr", status: "measured", sourceField: "pmra", bibcode: bib(s.pm_bibcode) };
  if (s.pmdec != null)
    p.properMotionDecMasYr = { ...base, value: s.pmdec, unit: "mas/yr", status: "measured", sourceField: "pmdec", bibcode: bib(s.pm_bibcode) };
  if (s.rvz_radvel != null)
    p.radialVelocityKmS = { ...base, value: s.rvz_radvel, unit: "km/s", status: "measured", sourceField: "rvz_radvel", uncertainty: s.rvz_err != null ? { symmetric: s.rvz_err, unit: "km/s" } : undefined, bibcode: bib(s.rvz_bibcode) };
  if (s.sp_type)
    p.spectralType = { ...base, value: s.sp_type, status: "catalogued", sourceField: "sp_type", bibcode: bib(s.sp_bibcode) };
  return p;
}

function fromGaia(g: GaiaStarRow): Partial<StarPrecision> {
  const p: Partial<StarPrecision> = {};
  const obj = `Gaia DR3 ${g.source_id}`;
  const gsrc = { sourceRef: "gaia" as const, sourceDataset: "Gaia DR3", objectIdentifier: obj, sourceRowId: g.source_id, retrievedAt: GAIA_RETRIEVED_AT };
  p.gaiaSourceId = { ...gsrc, value: g.source_id, status: "catalogued", sourceTable: "gaiadr3.gaia_source", sourceField: "source_id" };
  if (g.ruwe != null) { p.astrometryRuwe = g.ruwe; p.astrometryFlagged = g.ruwe > 1.4; }
  // Bailer-Jones (2021) geometric distance — a Bayesian estimate, not a direct measurement.
  if (g.r_med_geo != null && g.r_med_geo > 0)
    p.distancePc = {
      ...gsrc, value: g.r_med_geo, unit: "pc", status: "estimated",
      method: "Bailer-Jones et al. (2021) geometric distance inferred from the Gaia EDR3 parallax",
      sourceDataset: "Gaia EDR3 · Bailer-Jones (2021)", sourceTable: "external.gaiaedr3_distance", sourceField: "r_med_geo",
    };
  // GSP-Phot astrophysical parameters are MODEL outputs, never direct observations.
  const ap = { ...gsrc, status: "modeled" as const, method: "Gaia DR3 GSP-Phot (Apsis)", sourceTable: "gaiadr3.astrophysical_parameters" };
  if (g.teff_gspphot != null) p.effectiveTempK = { ...ap, value: g.teff_gspphot, unit: "K", sourceField: "teff_gspphot" };
  if (g.radius_gspphot != null) p.radiusSolar = { ...ap, value: g.radius_gspphot, unit: "R_sun", sourceField: "radius_gspphot" };
  if (g.logg_gspphot != null) p.surfaceGravityLogg = { ...ap, value: g.logg_gspphot, unit: "log(cm/s^2)", sourceField: "logg_gspphot" };
  if (g.mh_gspphot != null) p.metallicityMH = { ...ap, value: g.mh_gspphot, unit: "dex", sourceField: "mh_gspphot" };
  return p;
}

function build(): Map<string, StarPrecision> {
  // Safety net: if two stars ever genuinely resolve to one Gaia source_id, attaching
  // it to both would assign one object's astrometry/astrophysics to the other, so the
  // Gaia overlay is dropped for the whole shared set (SIMBAD, which resolves them, is
  // kept). With source_id preserved as an exact string there are currently 0 such
  // collisions — an earlier apparent collision (Struve 2398 A/B) was a float64
  // rounding artifact of the two distinct 64-bit ids, fixed at the ingestion layer.
  const gaiaCount = new Map<string, number>();
  for (const g of GAIA_STAR_ROWS) gaiaCount.set(g.source_id, (gaiaCount.get(g.source_id) ?? 0) + 1);
  const gaiaByStar = new Map(GAIA_STAR_ROWS.filter((g) => gaiaCount.get(g.source_id) === 1).map((g) => [g.starId, g]));
  const out = new Map<string, StarPrecision>();
  for (const s of SIMBAD_STAR_ROWS) {
    if (!STAR_BY_ID.has(s.starId)) continue; // never attach to a star that no longer exists
    const g = gaiaByStar.get(s.starId);
    out.set(s.starId, { starId: s.starId, ...fromSimbad(s), ...(g ? fromGaia(g) : {}) });
  }
  return out;
}

export const STAR_PRECISION: Map<string, StarPrecision> = build();

export const STAR_PRECISION_META = {
  simbadRetrievedAt: SIMBAD_RETRIEVED_AT,
  gaiaRetrievedAt: GAIA_RETRIEVED_AT,
  simbadRows: SIMBAD_STAR_ROWS.length,
  gaiaRows: GAIA_STAR_ROWS.length,
  stars: STAR_PRECISION.size,
} as const;

export function getStarPrecision(starId: string): StarPrecision | undefined {
  return STAR_PRECISION.get(starId);
}

/** Great-circle separation between two ICRS points, in arcseconds. */
function sepArcsec(ra1: number, dec1: number, ra2: number, dec2: number): number {
  const d = Math.PI / 180;
  const cos = Math.sin(dec1 * d) * Math.sin(dec2 * d) + Math.cos(dec1 * d) * Math.cos(dec2 * d) * Math.cos((ra1 - ra2) * d);
  return Math.acos(Math.min(1, Math.max(-1, cos))) / d * 3600;
}

/**
 * Star-precision integrity gate. Rejects fabrication-shaped or contradictory
 * overlay data, never mere absence: structural honesty of every value, a
 * SIMBAD↔catalogue coordinate cross-check (a large separation means the wrong
 * object was matched), impossible physical ranges, and duplicate source ids
 * (one Gaia/SIMBAD object mapped onto two stars = a crossmatch/component error).
 */
export function validateStarPrecision(): string[] {
  const issues: string[] = [];
  const valueFieldsOf = (p: StarPrecision): [string, ScientificValue<unknown> | undefined][] => [
    ["gaiaSourceId", p.gaiaSourceId], ["raDeg", p.raDeg], ["decDeg", p.decDeg], ["parallaxMas", p.parallaxMas],
    ["distancePc", p.distancePc], ["properMotionRaMasYr", p.properMotionRaMasYr], ["properMotionDecMasYr", p.properMotionDecMasYr],
    ["radialVelocityKmS", p.radialVelocityKmS], ["spectralType", p.spectralType], ["effectiveTempK", p.effectiveTempK],
    ["radiusSolar", p.radiusSolar], ["surfaceGravityLogg", p.surfaceGravityLogg], ["metallicityMH", p.metallicityMH],
  ];
  const seenGaia = new Map<string, string>();
  const seenSimbad = new Map<string, string>();
  for (const p of STAR_PRECISION.values()) {
    const star = STAR_BY_ID.get(p.starId);
    if (!star) { issues.push(`precision for unknown star ${p.starId}`); continue; }
    for (const [name, v] of valueFieldsOf(p)) {
      if (!v) continue;
      for (const e of validateScientificValue(v, `${p.starId}.${name}`)) issues.push(e);
    }
    // Coordinate cross-check: catalogue RA is in hours → ×15 for degrees.
    if (p.raDeg && p.decDeg && star.ra != null && star.dec != null) {
      const sep = sepArcsec(p.raDeg.value, p.decDeg.value, star.ra * 15, star.dec);
      if (sep > 30) issues.push(`${p.starId}: SIMBAD position differs from catalogue by ${Math.round(sep)}″ (possible wrong match)`);
    }
    // Impossible physical ranges (generous — reject only the physically impossible).
    if (p.parallaxMas && (p.parallaxMas.value <= 0 || p.parallaxMas.value > 800)) issues.push(`${p.starId}: parallax ${p.parallaxMas.value} mas out of range`);
    if (p.distancePc && p.distancePc.value <= 0) issues.push(`${p.starId}: non-positive distance`);
    if (p.effectiveTempK && (p.effectiveTempK.value < 1000 || p.effectiveTempK.value > 60000)) issues.push(`${p.starId}: Teff ${p.effectiveTempK.value} K out of range`);
    if (p.radiusSolar && (p.radiusSolar.value <= 0 || p.radiusSolar.value > 2500)) issues.push(`${p.starId}: radius ${p.radiusSolar.value} R_sun out of range`);
    // Duplicate source ids → one physical object mapped onto two stars.
    if (p.gaiaSourceId) {
      const prev = seenGaia.get(p.gaiaSourceId.value);
      if (prev) issues.push(`Gaia source_id ${p.gaiaSourceId.value} maps to two stars: ${prev} and ${p.starId}`);
      seenGaia.set(p.gaiaSourceId.value, p.starId);
    }
    if (p.simbadId) {
      const prev = seenSimbad.get(p.simbadId);
      if (prev) issues.push(`SIMBAD id "${p.simbadId}" maps to two stars: ${prev} and ${p.starId}`);
      seenSimbad.set(p.simbadId, p.starId);
    }
  }
  return issues;
}
