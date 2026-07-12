import { derivedForEntity } from "@/knowledge-graph/data/derived-values";
import type { DerivedScientificValue } from "@/lib/provenance/derived-value";
import { SOURCES } from "@/lib/sources";

/**
 * Visible field-level provenance for an entity's DERIVED values. Each value shows with
 * a "Derived" badge and, through progressive disclosure, its formula, source-backed
 * inputs, assumptions, limitations and the versioned implementation + reference instant.
 * Uses the existing card styling — no new design language.
 */

const LABELS: Record<string, string> = {
  surfaceGravity: "Surface gravity", escapeVelocity: "Escape velocity", bulkDensity: "Bulk density",
  axisRatio: "Projected axis ratio (b/a)", missionDuration: "Mission duration", timeSinceLaunch: "Time since launch",
};

function displayValue(v: DerivedScientificValue<number>): string {
  if (v.unit === "d") {
    const d = v.value;
    return d < 365.25 ? `${Math.round(d)} day${Math.round(d) === 1 ? "" : "s"}` : `${(d / 365.25).toFixed(1)} years`;
  }
  // Fixed decimals (trailing zeros kept) so the panel matches the inline QuickFacts/
  // StatGrid rows exactly (gravity 2 dp, escape 1 dp, density/axis-ratio 2 dp).
  const decimals = v.unit === "km/s" ? 1 : 2;
  return `${v.value.toFixed(decimals)}${v.unit ? ` ${v.unit}` : ""}`;
}

export function DerivedValuesPanel({ entityId }: { entityId: string }) {
  const entries = derivedForEntity(entityId);
  if (!entries.length) return null;
  return (
    <section aria-labelledby="derived" className="scientific-card p-5">
      <h2 id="derived" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Derived values</h2>
      <p className="mt-2 text-xs text-muted">Computed from source-backed inputs via standard formulae — not observations. Every input and constant is traced below.</p>
      <ul className="mt-3 space-y-3">
        {entries.map(({ field, value: v }) => (
          <li key={field} className="border-t border-white/5 pt-3 first:border-0 first:pt-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-faint">{LABELS[field] ?? field}</span>
              <span className="text-right text-sm font-medium text-fg">
                {displayValue(v)}
                <span className="ml-2 rounded-full border border-white/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-faint">{v.status}</span>
              </span>
            </div>
            <details className="mt-1.5 text-xs text-faint">
              <summary className="cursor-pointer select-none hover:text-muted">Formula &amp; inputs</summary>
              <div className="mt-2 space-y-1.5">
                <p><span className="text-muted">Formula:</span> <span className="font-mono">{v.formula}</span> <span className="text-faint">(v{v.formulaVersion}, impl v{v.calcImplVersion})</span></p>
                <p><span className="text-muted">Inputs:</span></p>
                <ul className="ml-3 space-y-1">
                  {v.inputs.map((i, idx) => (
                    <li key={idx}>{i.field} = {Number(i.value.toPrecision(6))}{i.unit ? ` ${i.unit}` : ""} · {SOURCES[i.sourceRef]?.name ?? i.sourceRef}</li>
                  ))}
                </ul>
                {v.assumptions?.length ? <p><span className="text-muted">Assumptions:</span> {v.assumptions.join("; ")}</p> : null}
                {v.limitations?.length ? <p><span className="text-muted">Limitations:</span> {v.limitations.join("; ")}</p> : null}
                <p><span className="text-muted">Uncertainty:</span> {v.uncertainty ? `± ${v.uncertainty.symmetric} (${v.uncertaintyMethod})` : "not propagated (inputs carry no catalogued uncertainty)"}</p>
                <p className="text-faint">Computed as of {v.calculatedAt.slice(0, 10)}.</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
