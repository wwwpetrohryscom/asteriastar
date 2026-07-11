"use client";

import { useState } from "react";
import { CALC_BY_SLUG } from "@/lib/calculators/registry";

/** Format a number for display: switch to scientific notation for very large/small magnitudes. */
function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const a = Math.abs(n);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) return n.toExponential(3);
  return Number(n.toPrecision(5)).toString();
}

/**
 * Interactive calculator. Reads the calculator's variables and pure compute function from the
 * client-safe registry and evaluates the published formula live as the user edits the inputs. The
 * maths runs on the device; nothing is fetched and no value is invented.
 */
export function CalculatorWidget({ slug }: { slug: string }) {
  const calc = CALC_BY_SLUG.get(slug);
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {};
    if (calc) for (const v of calc.variables) o[v.symbol] = v.default;
    return o;
  });
  if (!calc) return null;

  let result: number | null;
  try {
    const out = calc.compute(inputs);
    result = Number.isFinite(out) ? out : null;
  } catch {
    result = null;
  }

  return (
    <section aria-label="Interactive calculator" className="scientific-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {calc.variables.map((v) => (
          <label key={v.symbol} className="flex flex-col gap-1">
            <span className="text-sm text-muted">{v.label}{v.unit ? <span className="text-faint"> ({v.unit})</span> : null}</span>
            <input
              type="number"
              inputMode="decimal"
              value={Number.isFinite(inputs[v.symbol]) ? inputs[v.symbol] : ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, [v.symbol]: e.target.value === "" ? NaN : Number(e.target.value) }))}
              className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-fg outline-none focus:border-nasa/60"
            />
          </label>
        ))}
      </div>
      <div className="mt-6 flex items-baseline justify-between gap-3 rounded-xl border border-nasa/25 bg-nasa/[0.06] px-4 py-3">
        <span className="text-sm text-muted">{calc.resultLabel}</span>
        <span className="font-display text-2xl font-bold text-fg tabular-nums">
          {result === null ? "—" : fmt(result)}<span className="ml-1 text-sm font-normal text-faint">{calc.resultUnit}</span>
        </span>
      </div>
      <p className="mt-3 text-xs text-faint">Formula: <span className="text-muted">{calc.formula}</span></p>
    </section>
  );
}
