import type { SourceKey } from "@/lib/sources";
import { SOURCES } from "@/lib/sources";

/**
 * Field-level scientific provenance.
 *
 * A `ScientificValue<T>` carries a value together with everything needed to answer
 * "where did this come from, and how sure are we?": the authoritative source, the
 * exact catalogue/table/row/field it was read from, the epoch/reference frame, the
 * uncertainty, the measurement/derivation status, and (for paper-backed values) the
 * ADS bibcode or DOI.
 *
 * Honesty contract — enforced by `validateScientificValue` and the per-domain gates:
 *  - a value is only ever constructed from a REAL source row; unknowns stay absent;
 *  - `status` never silently upgrades (modeled ≠ measured, planned ≠ historical);
 *  - a `derived` value must name its `method`; nothing here is fabricated.
 */

export type ValueStatus =
  | "measured"
  | "catalogued"
  | "estimated"
  | "modeled"
  | "calculated"
  | "derived"
  | "disputed"
  | "upper_limit"
  | "lower_limit"
  | "planned"
  | "historical";

export interface ValueUncertainty {
  plus?: number;
  minus?: number;
  symmetric?: number;
  unit?: string;
}

export interface ScientificValue<T = number> {
  value: T;
  unit?: string;
  uncertainty?: ValueUncertainty;
  status: ValueStatus;
  method?: string;
  /** Authoritative source, keyed to the shared SOURCES registry. */
  sourceRef: SourceKey;
  /** Named dataset / release, e.g. "Gaia DR3", "SIMBAD", "JPL SBDB". */
  sourceDataset?: string;
  /** Table within the dataset, e.g. "gaiadr3.gaia_source", "basic". */
  sourceTable?: string;
  /** Column the value was read from, e.g. "parallax", "plx_value". */
  sourceField?: string;
  /** Row/object identifier within the table, e.g. a Gaia source_id. */
  sourceRowId?: string;
  /** The object's identifier in the source, e.g. "HIP 91262", "* alf Lyr". */
  objectIdentifier?: string;
  epoch?: string;
  referenceFrame?: string;
  /** ADS bibcode of the paper the source attributes the value to. */
  bibcode?: string;
  doi?: string;
  /** ISO date the value was retrieved from the live source into a repo snapshot. */
  retrievedAt?: string;
  verifiedAt?: string;
  notes?: string;
}

/**
 * 19-character ADS bibcode: 4-digit year, then 14 chars of journal/volume/page
 * (letters, digits, `.`, `&`, `+`), then a trailing author-initial letter.
 * e.g. "2007A&A...474..653V", "1971PW&SO...1a...1S". Kept deliberately permissive
 * so real, unusual bibcodes are accepted — it exists to catch corruption/fabrication,
 * not to second-guess a value the source itself supplied.
 */
const BIBCODE_RE = /^\d{4}[A-Za-z0-9.&+]{14}[A-Za-z]$/;
const DOI_RE = /^10\.\d{4,9}\/\S+$/;

export function isValidBibcode(b: string): boolean {
  return b.length === 19 && BIBCODE_RE.test(b);
}
export function isValidDoi(d: string): boolean {
  return DOI_RE.test(d);
}

/**
 * Structural honesty check for one value. Returns the list of problems (empty = ok).
 * It rejects fabrication-shaped data — a missing source, a malformed bibcode/DOI, a
 * derived value with no method — but never rejects a merely-absent optional field.
 */
export function validateScientificValue(v: ScientificValue<unknown>, label: string): string[] {
  const out: string[] = [];
  if (v.value === undefined || v.value === null || (typeof v.value === "number" && !Number.isFinite(v.value)))
    out.push(`${label}: value is missing or non-finite`);
  if (!v.sourceRef || !(v.sourceRef in SOURCES)) out.push(`${label}: sourceRef "${v.sourceRef}" is not a known source`);
  if (v.status === "derived" || v.status === "calculated") {
    if (!v.method) out.push(`${label}: ${v.status} value must document a method`);
  }
  if (v.bibcode && !isValidBibcode(v.bibcode)) out.push(`${label}: malformed bibcode "${v.bibcode}"`);
  if (v.doi && !isValidDoi(v.doi)) out.push(`${label}: malformed DOI "${v.doi}"`);
  if (v.uncertainty) {
    const u = v.uncertainty;
    for (const [k, n] of [["plus", u.plus], ["minus", u.minus], ["symmetric", u.symmetric]] as const)
      if (n != null && (!Number.isFinite(n) || n < 0)) out.push(`${label}: uncertainty.${k} must be a non-negative number`);
  }
  return out;
}

/** Human-readable one-line source label for a value, e.g. "Gaia DR3 · gaiadr3.gaia_source". */
export function sourceLabel(v: ScientificValue<unknown>): string {
  const org = SOURCES[v.sourceRef]?.name ?? v.sourceRef;
  return [v.sourceDataset ?? org, v.sourceTable].filter(Boolean).join(" · ");
}
