import type { Metadata } from "next";
import { DataHealthShell, HealthTable, StatusPill } from "@/components/authority/DataHealth";
import { freshnessMetrics } from "@/lib/data-health/metrics";
import { buildMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
const DESC = "Each committed snapshot's retrieval date versus its refresh cadence and next-due date.";
export const metadata: Metadata = buildMetadata({ title: "Data health — Freshness", description: DESC, path: "/authority/data-health/freshness" });
export default function Page() {
  const f = freshnessMetrics();
  return (
    <DataHealthShell title="Freshness" description={DESC} path="/authority/data-health/freshness" asOf={f.asOf}>
      <HealthTable head={["Snapshot", "Provider", "Domain", "Cadence", "Retrieved", "Age", "Next due", "Meta signature", "Status"]}
        rows={f.rows.map((r)=>[r.id, r.provider, r.domain, r.cadence, r.retrievedAt, `${r.ageDays} d`, r.nextDue, <code key="c" className="text-xs text-faint">{r.signature}</code>, <StatusPill key="s" status={r.status} />])} />
      <p className="text-xs text-faint">Fresh within one cadence period; aging up to 1.5×; stale beyond. The meta signature (id · date · row count) changes when a snapshot is regenerated; full content-change detection is the refresh diff&apos;s job.</p>
    </DataHealthShell>
  );
}
