import { SOURCES } from "@/lib/sources";
import type { DeepSkyPrecision } from "@/knowledge-graph/data/deep-sky-catalog/precision";
import { ProvenanceStatTable, type ProvRow } from "./ProvenanceStatTable";

/**
 * Program 2 — visible rendering of source-traceable deep-sky measurements. A
 * cosmological redshift is shown only for extragalactic objects; Galactic objects
 * show a radial velocity instead. Physical size is labelled a derived value.
 */
export function DeepSkyPrecisionSection({ p }: { p: DeepSkyPrecision }) {
  const rows: ProvRow[] = [];
  const add = (label: string, v?: ProvRow["v"]) => { if (v) rows.push({ label, v }); };
  add("Distance", p.distanceLy);
  add("Physical size (major axis)", p.physicalMajorLy);
  add("Physical size (minor axis)", p.physicalMinorLy);
  if (p.extragalactic) add("Redshift (z)", p.redshift);
  // "Radial velocity" is honest for both signs — many nearby galaxies (M31, M33, …) are
  // blueshifted and approaching, so "recession velocity" would be a false claim.
  add("Radial velocity", p.radialVelocityKmS);
  add("Right ascension (ICRS)", p.raDeg);
  add("Declination (ICRS)", p.decDeg);
  if (!rows.length) return null;

  return (
    <ProvenanceStatTable
      title="Precision measurements"
      subtitle={
        <>
          Distances and velocities from{" "}
          <a href={SOURCES.simbad.url} className="text-nasa hover:underline" rel="noopener noreferrer" target="_blank">SIMBAD</a>
          {p.redshift?.sourceRef === "ned" ? <> and redshift from <a href={SOURCES.ned.url} className="text-nasa hover:underline" rel="noopener noreferrer" target="_blank">NED</a></> : null}
          {p.simbadId ? <> · <span className="text-faint">{p.simbadId}</span></> : null}
        </>
      }
      rows={rows}
      footnote={
        <>
          Physical size is <strong className="text-muted">derived</strong> from the OpenNGC angular size and the catalogued distance (small-angle: size = angle × distance).{" "}
          {p.extragalactic
            ? "Redshift is the object's measured redshift — a negative value is a blueshift (the galaxy is approaching, its motion dominated by local rather than cosmic expansion)."
            : "This is a Galactic object: its Doppler shift is shown as a radial velocity, not a cosmological redshift."}{" "}
          Fields a source did not provide are omitted, never invented.
        </>
      }
    />
  );
}
