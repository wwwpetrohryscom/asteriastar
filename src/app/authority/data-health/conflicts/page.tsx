import type { Metadata } from "next";
import { DataHealthShell, HealthTable, StatusPill } from "@/components/authority/DataHealth";
import { MISSION_PRECISION } from "@/knowledge-graph/data/mission-precision";
import { primaryConflicts } from "@/knowledge-graph/data/mission-primary";
import { buildMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
const DESC = "Real cross-source disagreements surfaced by the platform — never hidden. A Wikidata-vs-catalogue disagreement is resolved in favour of the authoritative catalogue value; a primary-source disagreement preserves both values.";
export const metadata: Metadata = buildMetadata({ title: "Data health — Conflicts", description: DESC, path: "/authority/data-health/conflicts" });
export default function Page() {
  const conflicts = [...MISSION_PRECISION.values()].filter((p) => p.launchDateDiscrepancy);
  const primary = primaryConflicts();
  return (
    <DataHealthShell title="Conflicts" description={DESC} path="/authority/data-health/conflicts">
      <section>
        <h2 className="font-display text-xl font-bold">Launch-date discrepancies (Wikidata vs catalogue)</h2>
        {conflicts.length ? (
          <div className="mt-4"><HealthTable head={["Mission", "Catalogue (kept)", "Wikidata (rejected)", "Status"]}
            rows={conflicts.map((p)=>[p.recordId.replace(/^[a-z_]+:/,""), p.launchDateDiscrepancy!.catalogue, p.launchDateDiscrepancy!.wikidata, <StatusPill key="s" status="conflict" />])} /></div>
        ) : <p className="mt-3 text-sm text-muted">No unresolved conflicts.</p>}
        <p className="mt-3 text-xs text-faint">The catalogue value is authoritative; the disagreeing secondary value is never displayed as fact.</p>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">Primary-source disagreements (agency primary vs committed value)</h2>
        {primary.length ? (
          <div className="mt-4"><HealthTable head={["Mission", "Field", "Committed value", "Primary source states", "Status"]}
            rows={primary.map((p)=>[
              p.missionId.replace(/^[a-z_]+:/,""), p.field, p.committedValue,
              <a key="a" href={p.sourceUrl} rel="noopener noreferrer" target="_blank" className="text-nasa hover:underline" title={p.sourceTitle}>{p.primaryValue}</a>,
              <StatusPill key="s" status="conflict" />])} /></div>
        ) : <p className="mt-3 text-sm text-muted">No primary-source disagreements — every corroborated value matches its primary source.</p>}
        <p className="mt-3 text-xs text-faint">Both values are preserved; neither is hidden, and neither is silently chosen. A launch-date disagreement of one calendar day is the UTC/local-time boundary (the primary source may date a launch to the local evening while the catalogue uses UTC); a mass disagreement shows the exact figure the primary document states alongside the committed value.</p>
      </section>
    </DataHealthShell>
  );
}
