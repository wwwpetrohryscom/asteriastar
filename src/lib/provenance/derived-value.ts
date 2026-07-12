import type { ScientificValue, ValueUncertainty } from "./scientific-value";
import type { SourceKey } from "@/lib/sources";

/**
 * Field-level provenance for a DERIVED value (Program: derived-value migration).
 *
 * A `DerivedScientificValue` is a `ScientificValue` (so it flows through the unified
 * provenance registry, API and export) whose `status` is always `derived` or
 * `calculated`, extended with the full derivation record: the formula (identified and
 * versioned), the exact source-backed inputs, the constants, the calculation time, and
 * any assumptions/limitations. Honesty contract:
 *  - every input carries its own value/unit/uncertainty and a provenance reference;
 *  - no input may be missing or a zero-underflow;
 *  - a time-dependent calculation (elapsed time) records the reference instant it was
 *    computed against — it is never a "timeless" committed number;
 *  - uncertainty is only present when a documented propagation method produced it.
 */

export interface DerivedInput {
  field: string;
  value: number;
  unit: string;
  uncertainty?: ValueUncertainty;
  /** Which source/entity the input came from, e.g. "solar:earth · nasa/jpl fact sheet". */
  provenanceRef: string;
  /** The authoritative source key of the input value. */
  sourceRef: SourceKey;
}

export interface DerivedScientificValue<T = number> extends ScientificValue<T> {
  status: "derived" | "calculated";
  formulaId: string;
  formulaVersion: string;
  /** Human-readable formula, e.g. "g = GM / r²". */
  formula: string;
  /** Version of the calculation implementation (bumped when the code changes). */
  calcImplVersion: string;
  /** ISO instant (or reference date) the value was computed against. */
  calculatedAt: string;
  inputs: DerivedInput[];
  uncertaintyMethod?: string;
  assumptions?: string[];
  limitations?: string[];
}

export function isDerivedScientificValue(v: ScientificValue<unknown>): v is DerivedScientificValue<number | string> {
  return (v.status === "derived" || v.status === "calculated") && "formulaId" in v && "inputs" in v;
}

/**
 * Structural honesty check specific to derived values (in addition to the base
 * `validateScientificValue`). Rejects a derivation that omits its formula, its input
 * provenance, or an input value/unit; that carries uncertainty without a method; or a
 * time-dependent calculation with no reference instant.
 */
export function validateDerivedValue(v: DerivedScientificValue<unknown>, label: string): string[] {
  const out: string[] = [];
  if (!v.formulaId) out.push(`${label}: derived value without a formulaId`);
  if (!v.formula) out.push(`${label}: derived value without a human-readable formula`);
  if (!v.formulaVersion || !v.calcImplVersion) out.push(`${label}: derived value missing a formula/implementation version`);
  if (!v.calculatedAt) out.push(`${label}: derived value without a calculatedAt reference`);
  if (!v.inputs || v.inputs.length === 0) out.push(`${label}: derived value without input provenance`);
  for (const [i, inp] of (v.inputs ?? []).entries()) {
    if (inp.value == null || !Number.isFinite(inp.value)) out.push(`${label}: input[${i}] "${inp.field}" has no finite value`);
    if (!inp.unit) out.push(`${label}: input[${i}] "${inp.field}" has no unit`);
    if (!inp.provenanceRef) out.push(`${label}: input[${i}] "${inp.field}" has no provenance reference`);
  }
  if (v.uncertainty && !v.uncertaintyMethod) out.push(`${label}: has an uncertainty but no propagation method`);
  return out;
}
