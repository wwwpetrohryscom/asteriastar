import type { SourceKey } from "@/lib/sources";

/**
 * Scientific Calculators data model (Program BP). Each calculator is a first-class entity that
 * carries its published formula, its variables, and a PURE compute function that evaluates the
 * formula from the user's inputs and the real physical constants. Nothing is fabricated: results are
 * derived from measured/defined constants (CODATA 2018, IAU 2015) and the inputs. Every calculator
 * ships a worked example whose expected value is a known textbook result — the validator recomputes
 * it and checks the formula against it, so the equations are validated, not asserted.
 */

export type CalcCategory =
  | "orbital" // orbital mechanics & gravity
  | "stellar" // stellar physics
  | "observational" // photometry, distance & astrometry
  | "exoplanet" // exoplanets & habitability
  | "cosmology" // redshift & cosmological distance
  | "instrument"; // telescopes & instruments

export const CATEGORY_LABEL: Record<CalcCategory, string> = {
  orbital: "Orbital mechanics",
  stellar: "Stellar physics",
  observational: "Photometry & distance",
  exoplanet: "Exoplanets & habitability",
  cosmology: "Cosmology",
  instrument: "Telescopes & instruments",
};

export interface CalcVariable {
  /** Short symbol, unique within the calculator, used as the input key. */
  symbol: string;
  label: string;
  /** Unit the input is expressed in (e.g. "M☉", "AU", "K", "nm"). */
  unit: string;
  /** Default value — also the input for the worked example. */
  default: number;
}

export interface CalculatorRecord {
  id: string;
  slug: string;
  name: string;
  category: CalcCategory;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** Plain-text form of the published equation. */
  formula: string;
  variables: CalcVariable[];
  resultUnit: string;
  resultLabel: string;
  /** Pure evaluation: inputs keyed by variable symbol (in the variable's unit) → result in resultUnit. */
  compute: (v: Record<string, number>) => number;
  /** A known textbook result for the default inputs, used to validate the formula. */
  example: { expected: number; tol: number; note?: string };

  relatedKeys?: string[];
  highlights?: string[];
}
