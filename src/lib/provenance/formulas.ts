import type { DerivedScientificValue, DerivedInput } from "./derived-value";
import type { ValueUncertainty } from "./scientific-value";

/**
 * Registry of the standard formulae used to derive values, each identified and
 * versioned so a derived value can name exactly how it was produced. Constants are the
 * project-approved CODATA/IAU values, versioned alongside the formula.
 */

export interface FormulaDef {
  id: string;
  version: string;
  /** Human-readable formula. */
  formula: string;
  description: string;
  /** Constants used, with their source. */
  constants?: Record<string, { value: number; unit: string; source: string }>;
  references: string[];
}

export const CONSTANTS = {
  G: { value: 6.674e-11, unit: "m³ kg⁻¹ s⁻²", source: "CODATA 2018" },
  M_earth: { value: 5.972e24, unit: "kg", source: "IAU nominal (IAU 2015 B3)" },
  R_earth: { value: 6.371e6, unit: "m", source: "IAU nominal volumetric mean radius" },
} as const;

export const FORMULAS: Record<string, FormulaDef> = {
  "surface-gravity": {
    id: "surface-gravity", version: "1.0.0", formula: "g = GM / r²",
    description: "Surface gravitational acceleration of a spherical body.",
    constants: { G: CONSTANTS.G }, references: ["CODATA 2018 (G)"],
  },
  "escape-velocity": {
    id: "escape-velocity", version: "1.0.0", formula: "v = √(2GM / r)",
    description: "Escape velocity from the surface of a spherical body.",
    constants: { G: CONSTANTS.G }, references: ["CODATA 2018 (G)"],
  },
  "bulk-density": {
    id: "bulk-density", version: "1.0.0", formula: "ρ = M / (4⁄3·π·r³)",
    description: "Mean bulk density from mass and radius, assuming a sphere.",
    constants: { M_earth: CONSTANTS.M_earth, R_earth: CONSTANTS.R_earth },
    references: ["IAU 2015 B3 nominal solar/planetary constants"],
  },
  "projected-axis-ratio": {
    id: "projected-axis-ratio", version: "1.0.0", formula: "b/a = minor angular axis ÷ major angular axis",
    description: "Sky-projected axis ratio (elongation) from two angular diameters.",
    references: ["OpenNGC isophotal diameters"],
  },
  "mission-duration": {
    id: "mission-duration", version: "1.0.0", formula: "Δt = end − launch",
    description: "Elapsed time between two source-backed mission dates (a fixed, timeless span).",
    references: ["Mission catalogue dates"],
  },
  "mission-elapsed": {
    id: "mission-elapsed", version: "1.0.0", formula: "Δt = reference − launch",
    description: "Time a still-active mission has been under way, evaluated against a stated reference instant (never a timeless committed value).",
    references: ["Mission catalogue dates"],
  },
};

/**
 * Construct a `DerivedScientificValue` from a formula, output and source-backed inputs.
 * `status` defaults to "derived"; use "calculated" for a purely-arithmetic result
 * (e.g. a duration between two dates). Uncertainty is attached only if a propagation
 * method is supplied.
 */
export function deriveValue<T extends number | string>(opts: {
  formulaId: keyof typeof FORMULAS & string;
  value: T; unit: string;
  calculatedAt: string;
  calcImplVersion: string;
  inputs: DerivedInput[];
  status?: "derived" | "calculated";
  uncertainty?: ValueUncertainty;
  uncertaintyMethod?: string;
  assumptions?: string[];
  limitations?: string[];
  notes?: string;
  objectIdentifier?: string;
}): DerivedScientificValue<T> {
  const f = FORMULAS[opts.formulaId];
  return {
    value: opts.value, unit: opts.unit, status: opts.status ?? "derived",
    sourceRef: "asteriastar-derived", sourceDataset: "AsteriaStar derivation engine",
    method: f.formula, formulaId: f.id, formulaVersion: f.version, formula: f.formula,
    calcImplVersion: opts.calcImplVersion, calculatedAt: opts.calculatedAt, inputs: opts.inputs,
    uncertainty: opts.uncertainty, uncertaintyMethod: opts.uncertaintyMethod,
    assumptions: opts.assumptions, limitations: opts.limitations, notes: opts.notes,
    objectIdentifier: opts.objectIdentifier,
  };
}
