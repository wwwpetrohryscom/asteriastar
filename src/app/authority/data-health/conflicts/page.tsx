import type { Metadata } from "next";
import { DataHealthShell, HealthTable, StatusPill } from "@/components/authority/DataHealth";
import { MISSION_PRECISION } from "@/knowledge-graph/data/mission-precision";
import { buildMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
const DESC = "Real cross-source disagreements surfaced by the platform — never hidden, and resolved in favour of the authoritative value.";
export const metadata: Metadata = buildMetadata({ title: "Data health — Conflicts", description: DESC, path: "/authority/data-health/conflicts" });
export default function Page() {
  const conflicts = [...MISSION_PRECISION.values()].filter((p) => p.launchDateDiscrepancy);
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
    </DataHealthShell>
  );
}
