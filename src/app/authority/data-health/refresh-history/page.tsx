import type { Metadata } from "next";
import { DataHealthShell, HealthTable, StatusPill } from "@/components/authority/DataHealth";
import { freshnessMetrics } from "@/lib/data-health/metrics";
import { buildMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
const DESC = "The last generation and next scheduled refresh for each snapshot. Automated refresh runs (via the scheduled workflows) will appear here once executed.";
export const metadata: Metadata = buildMetadata({ title: "Data health — Refresh history", description: DESC, path: "/authority/data-health/refresh-history" });
export default function Page() {
  const f = freshnessMetrics();
  return (
    <DataHealthShell title="Refresh history" description={DESC} path="/authority/data-health/refresh-history" asOf={f.asOf}>
      <HealthTable head={["Snapshot", "Provider", "Cadence", "Last generated", "Next scheduled", "Status"]}
        rows={f.rows.map((r)=>[r.id, r.provider, r.cadence, r.retrievedAt, r.nextDue, <StatusPill key="s" status={r.status} />])} />
      <p className="text-xs text-faint">These are the committed snapshots&apos; real generation dates — no refresh run is fabricated. The weekly/monthly/quarterly workflows open a reviewed PR only when a source meaningfully changes; those PRs are the refresh history.</p>
    </DataHealthShell>
  );
}
