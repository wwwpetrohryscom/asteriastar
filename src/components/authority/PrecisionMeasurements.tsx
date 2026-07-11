import type { ScientificValue, ValueStatus } from "@/lib/provenance/scientific-value";
import { sourceLabel } from "@/lib/provenance/scientific-value";
import { SOURCES } from "@/lib/sources";
import type { StarPrecision } from "@/knowledge-graph/data/star-catalog/precision";

/**
 * Program 1 — visible rendering of source-traceable star measurements.
 *
 * Each value shows inline with its unit and uncertainty; the exact provenance
 * (dataset · table · column · bibcode · epoch · retrieval date · status) is revealed
 * through progressive disclosure so the default view stays uncluttered. Uses the
 * existing table/card styling — no new design language.
 */

const STATUS_NOTE: Record<ValueStatus, string> = {
  measured: "direct catalogue measurement",
  catalogued: "catalogue identifier/value",
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
  if (a !== 0 && (a < 0.01 || a >= 1e6)) return v.toExponential(3);
  return Number(v.toFixed(a >= 100 ? 1 : 4)).toString();
}

function ValueCell({ v }: { v: ScientificValue<number | string> }) {
  const val = typeof v.value === "number" ? fmt(v.value) : v.value;
  const unc = v.uncertainty?.symmetric != null ? ` ± ${fmt(v.uncertainty.symmetric)}` : "";
  return (
    <span className="font-medium text-fg">
      {val}{unc}{v.unit ? <span className="text-faint"> {v.unit}</span> : null}
    </span>
  );
}

interface Row { label: string; v: ScientificValue<number | string> }

export function PrecisionMeasurements({ p }: { p: StarPrecision }) {
  const rows: Row[] = [];
  const add = (label: string, v?: ScientificValue<number | string>) => { if (v) rows.push({ label, v }); };
  add("Parallax", p.parallaxMas);
  add("Distance", p.distancePc);
  add("Proper motion (RA)", p.properMotionRaMasYr);
  add("Proper motion (Dec)", p.properMotionDecMasYr);
  add("Radial velocity", p.radialVelocityKmS);
  add("Spectral type", p.spectralType);
  add("Effective temperature", p.effectiveTempK);
  add("Radius", p.radiusSolar);
  add("Surface gravity (log g)", p.surfaceGravityLogg);
  add("Metallicity [M/H]", p.metallicityMH);
  add("Right ascension (ICRS)", p.raDeg);
  add("Declination (ICRS)", p.decDeg);
  if (!rows.length) return null;

  return (
    <section aria-labelledby="precision">
      <h2 id="precision" className="font-display text-2xl font-bold">Precision measurements</h2>
      <p className="mt-1 text-sm text-muted">
        Astrometry and astrophysics from{" "}
        <a href={SOURCES.simbad.url} className="text-nasa hover:underline" rel="noopener noreferrer" target="_blank">SIMBAD</a>
        {p.gaiaSourceId ? <> and <a href={SOURCES.gaia.url} className="text-nasa hover:underline" rel="noopener noreferrer" target="_blank">Gaia DR3</a></> : null}
        {p.gaiaSourceId ? <> · <span className="text-faint">{p.gaiaSourceId.objectIdentifier}</span></> : null}
        {p.astrometryFlagged ? <> · <span className="text-amber-400/90" title={`Gaia RUWE = ${p.astrometryRuwe?.toFixed(2)} (> 1.4): the single-star astrometric fit is poor, often a sign of an unresolved companion.`}>elevated RUWE</span></> : null}
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-white/5">
            {rows.map(({ label, v }) => (
              <tr key={label} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-2.5 align-top text-faint">{label}</td>
                <td className="px-4 py-2.5 text-right"><ValueCell v={v} /></td>
                <td className="px-4 py-2.5 text-right align-top">
                  <span
                    className="cursor-help text-xs text-faint underline decoration-dotted underline-offset-2"
                    title={[
                      `${STATUS_NOTE[v.status]} (${v.status})`,
                      sourceLabel(v),
                      v.sourceField ? `column: ${v.sourceField}` : "",
                      v.bibcode ? `bibcode: ${v.bibcode}` : "",
                      v.method ? `method: ${v.method}` : "",
                      v.epoch ? `epoch: ${v.epoch}` : "",
                      v.retrievedAt ? `retrieved: ${v.retrievedAt}` : "",
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
              {v.sourceRowId ? ` · row ${v.sourceRowId}` : ""} · {STATUS_NOTE[v.status]}{v.retrievedAt ? ` · retrieved ${v.retrievedAt}` : ""}
            </li>
          ))}
        </ul>
      </details>
      <p className="mt-2 text-xs text-faint">
        <strong className="text-muted">measured</strong> = direct catalogue value ·{" "}
        <strong className="text-muted">estimated</strong> = Bayesian inference (Bailer-Jones distance) ·{" "}
        <strong className="text-muted">modeled</strong> = model output (Gaia GSP-Phot). Fields a source did not provide are omitted, never invented.
      </p>
    </section>
  );
}
