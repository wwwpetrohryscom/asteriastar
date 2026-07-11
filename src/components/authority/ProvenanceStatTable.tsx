import type { ReactNode } from "react";
import type { ScientificValue, ValueStatus } from "@/lib/provenance/scientific-value";
import { sourceLabel } from "@/lib/provenance/scientific-value";
import { SOURCES } from "@/lib/sources";

/**
 * Reusable source-traceable value table. Each value shows inline with unit and
 * uncertainty, a per-row `source · status` chip, and a progressive-disclosure
 * "Full field-level provenance" list. Uses the existing table/card styling — no new
 * design language. Shared by every precision domain.
 */

export const STATUS_NOTE: Record<ValueStatus, string> = {
  measured: "direct catalogue measurement",
  catalogued: "catalogued value",
  estimated: "Bayesian estimate",
  modeled: "model output",
  calculated: "calculated",
  derived: "derived",
  disputed: "disputed",
  upper_limit: "upper limit",
  lower_limit: "lower limit",
  planned: "planned",
  historical: "historical",
};

function fmt(v: number): string {
  const a = Math.abs(v);
  if (a !== 0 && (a < 1e-4 || a >= 1e7)) return v.toExponential(4);
  if (a >= 1000) return Math.round(v).toLocaleString();
  const r = Number(v.toFixed(6));
  // Never let a non-integer collapse onto an integer — e.g. a near-parabolic hyperbolic
  // eccentricity like 1.0000188 must not render as a bare "1" (which would read as a
  // parabola / bound orbit). Fall back to significant-figure precision in that case.
  if (r === Math.trunc(r) && !Number.isInteger(v)) return v.toPrecision(8).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  return r.toString();
}

export interface ProvRow { label: string; v: ScientificValue<number | string> }

export function ProvenanceStatTable({ title, subtitle, rows, footnote }: {
  title: string; subtitle?: ReactNode; rows: ProvRow[]; footnote?: ReactNode;
}) {
  if (!rows.length) return null;
  return (
    <section aria-labelledby="precision">
      <h2 id="precision" className="font-display text-2xl font-bold">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-white/5">
            {rows.map(({ label, v }) => (
              <tr key={label} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-2.5 align-top text-faint">{label}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className="font-medium text-fg">
                    {typeof v.value === "number" ? fmt(v.value) : v.value}
                    {v.uncertainty?.symmetric != null ? ` ± ${fmt(v.uncertainty.symmetric)}` : ""}
                    {v.unit ? <span className="text-faint"> {v.unit}</span> : null}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right align-top">
                  <span
                    className="cursor-help text-xs text-faint underline decoration-dotted underline-offset-2"
                    title={[
                      `${STATUS_NOTE[v.status]} (${v.status})`, sourceLabel(v),
                      v.sourceField ? `column: ${v.sourceField}` : "", v.bibcode ? `bibcode: ${v.bibcode}` : "",
                      v.method ? `method: ${v.method}` : "", v.epoch ? `epoch: ${v.epoch}` : "",
                      v.notes ? v.notes : "", v.retrievedAt ? `retrieved: ${v.retrievedAt}` : "",
                    ].filter(Boolean).join("\n")}
                  >
                    {SOURCES[v.sourceRef].name} · {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="mt-3 text-xs text-faint">
        <summary className="cursor-pointer select-none hover:text-muted">Full field-level provenance</summary>
        <ul className="mt-2 space-y-1.5">
          {rows.map(({ label, v }) => (
            <li key={label}>
              <span className="text-muted">{label}:</span> {SOURCES[v.sourceRef].organization} · {sourceLabel(v)}
              {v.sourceField ? ` · ${v.sourceField}` : ""}{v.bibcode ? ` · ${v.bibcode}` : ""}
              {v.method ? ` · ${v.method}` : ""} · {STATUS_NOTE[v.status]}{v.notes ? ` · ${v.notes}` : ""}
              {v.retrievedAt ? ` · retrieved ${v.retrievedAt}` : ""}
            </li>
          ))}
        </ul>
      </details>
      {footnote ? <p className="mt-2 text-xs text-faint">{footnote}</p> : null}
    </section>
  );
}
