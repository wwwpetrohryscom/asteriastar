import type { Metadata } from "next";
import { DataHealthShell, MetricCard, MetricGrid, DistributionTable } from "@/components/authority/DataHealth";
import { coverageMetrics } from "@/lib/data-health/metrics";
import { buildMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
const DESC = "Field-level provenance completeness: how many values carry an exact source row, bibcode, epoch, reference frame and uncertainty.";
export const metadata: Metadata = buildMetadata({ title: "Data health — Provenance", description: DESC, path: "/authority/data-health/provenance" });
export default function Page() {
  const c = coverageMetrics(); const pct = (n: number) => `${((100*n)/Math.max(1,c.totalValues)).toFixed(1)}%`;
  return (
    <DataHealthShell title="Provenance" description={DESC} path="/authority/data-health/provenance">
      <MetricGrid>
        <MetricCard label="Source-traced values" value={c.totalValues.toLocaleString()} />
        <MetricCard label="Exact source row" value={c.withRowReference.toLocaleString()} sub={pct(c.withRowReference)} />
        <MetricCard label="Bibcode" value={c.withBibcode.toLocaleString()} sub={pct(c.withBibcode)} />
        <MetricCard label="DOI" value={c.withDoi.toLocaleString()} sub={pct(c.withDoi)} />
        <MetricCard label="Epoch" value={c.withEpoch.toLocaleString()} sub={pct(c.withEpoch)} />
        <MetricCard label="Reference frame" value={c.withReferenceFrame.toLocaleString()} sub={pct(c.withReferenceFrame)} />
        <MetricCard label="Uncertainty" value={c.withUncertainty.toLocaleString()} sub={pct(c.withUncertainty)} />
        <MetricCard label="Distinct bibcodes" value={c.distinctBibcodes.toLocaleString()} />
      </MetricGrid>
      <section className="grid gap-8 sm:grid-cols-2">
        <DistributionTable title="By value status" data={c.byStatus as Record<string, number>} />
        <DistributionTable title="By domain" data={c.byDomain} />
      </section>
    </DataHealthShell>
  );
}
