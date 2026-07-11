import type { MissionPrecision } from "@/knowledge-graph/data/mission-precision";
import { ProvenanceStatTable, type ProvRow } from "./ProvenanceStatTable";

/**
 * Program 4 — visible rendering of source-traceable mission identity/engineering data
 * from Wikidata (type-verified, unambiguous matches). Wikidata's launch date is shown
 * only as a cross-source confirmation; a disagreement keeps the catalogue's date and
 * is noted, never silently overriding it.
 */
export function MissionPrecisionSection({ p }: { p: MissionPrecision }) {
  const rows: ProvRow[] = [];
  const add = (label: string, v?: ProvRow["v"]) => { if (v) rows.push({ label, v }); };
  add("International designator", p.cosparId);
  add("Operator", p.operator);
  add("Manufacturer", p.manufacturer);
  add("Launch mass", p.launchMassKg);
  if (!rows.length && !p.launchDateConfirmed && !p.launchDateDiscrepancy) return null;

  return (
    <ProvenanceStatTable
      title="Mission data"
      subtitle={
        <>
          Identity and engineering data from{" "}
          <a href={`https://www.wikidata.org/wiki/${p.qid}`} className="text-nasa hover:underline" rel="noopener noreferrer" target="_blank">Wikidata</a>
          {" "}(type-verified match · {p.qid})
          {p.launchDateConfirmed ? <> · <span className="text-success-strong" title="Wikidata's launch date matches the catalogue">launch date {p.launchDateConfirmed} confirmed</span></> : null}
        </>
      }
      rows={rows}
      footnote={
        <>
          Sourced from Wikidata (community-maintained structured data, whose statements link to their own citations where provided); each value carries its Wikidata QID. A field with conflicting Wikidata values is omitted. Launch date is used only to cross-check the catalogue, never to override it.{" "}
          {p.launchDateDiscrepancy
            ? <span className="text-amber-400/90">Wikidata lists a launch date of {p.launchDateDiscrepancy.wikidata}, which disagrees with the catalogue&apos;s {p.launchDateDiscrepancy.catalogue}; the catalogue value is kept.</span>
            : null}{" "}
          Fields Wikidata did not provide, or where conflicting values exist, are omitted, never invented.
        </>
      }
    />
  );
}
