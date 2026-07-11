import { SOURCES } from "@/lib/sources";
import type { SmallBodyPrecision } from "@/knowledge-graph/data/small-body-precision";
import { ProvenanceStatTable, type ProvRow } from "./ProvenanceStatTable";

/**
 * Program 3 — visible rendering of source-traceable orbital and physical data from
 * the JPL Small-Body Database. Orbital elements share the body's osculating epoch
 * (shown), each carrying its own uncertainty. Hyperbolic comets are presented
 * honestly (e ≥ 1, no aphelion).
 */
export function SmallBodyPrecisionSection({ p }: { p: SmallBodyPrecision }) {
  const rows: ProvRow[] = [];
  const add = (label: string, v?: ProvRow["v"]) => { if (v) rows.push({ label, v }); };
  add("Semi-major axis", p.semiMajorAxisAu);
  add("Eccentricity", p.eccentricity);
  add("Perihelion distance", p.perihelionAu);
  add("Aphelion distance", p.aphelionAu);
  add("Inclination", p.inclinationDeg);
  add("Longitude of ascending node", p.ascNodeDeg);
  add("Argument of perihelion", p.argPerihelionDeg);
  add("Orbital period", p.orbitalPeriodDays);
  add("Diameter", p.diameterKm);
  add("Geometric albedo", p.albedo);
  add("Rotation period", p.rotationPeriodH);
  add("Absolute magnitude (H)", p.absoluteMagnitudeH);
  if (!rows.length) return null;

  const hyperbolic = p.eccentricity != null && p.eccentricity.value >= 1;
  return (
    <ProvenanceStatTable
      title="Orbit & physical parameters"
      subtitle={
        <>
          Osculating orbit and physical parameters from the{" "}
          <a href="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html" className="text-nasa hover:underline" rel="noopener noreferrer" target="_blank">{SOURCES.jpl.name} Small-Body Database</a>
          {p.orbitClassName ? <> · {p.orbitClassName}</> : null}
          {p.neo ? <> · <span className="text-amber-400/90">near-Earth</span></> : null}
          {p.pha ? <> · <span className="text-amber-400/90" title="Potentially Hazardous Asteroid (MPC/CNEOS criteria)">potentially hazardous</span></> : null}
          {p.epochLabel ? <> · epoch {p.epochLabel}</> : null}
          {p.moidAu != null ? <> · Earth MOID {p.moidAu} au</> : null}
        </>
      }
      rows={rows}
      footnote={
        <>
          Orbital elements are a <strong className="text-muted">calculated</strong> JPL orbit-determination fit, all referred to the single osculating epoch above{p.producer ? ` (solution by ${p.producer})` : ""}; each carries its own uncertainty.{" "}
          {hyperbolic ? "This is an unbound (hyperbolic) orbit: eccentricity ≥ 1, a negative semi-major axis and no aphelion. " : ""}
          Fields the database did not provide are omitted, never invented.
        </>
      }
    />
  );
}
