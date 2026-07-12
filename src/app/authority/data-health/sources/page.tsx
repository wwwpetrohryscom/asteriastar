import type { Metadata } from "next";
import { DataHealthShell, DistributionTable, HealthTable } from "@/components/authority/DataHealth";
import { coverageMetrics, qualityMetrics } from "@/lib/data-health/metrics";
import { SOURCES, AUTHORITY_TYPE_LABELS } from "@/lib/sources";
import { buildMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
const DESC = "Every source-traced value by its authoritative source and authority type.";
export const metadata: Metadata = buildMetadata({ title: "Data health — Sources", description: DESC, path: "/authority/data-health/sources" });
export default function Page() {
  const c = coverageMetrics(); const q = qualityMetrics();
  const bySource = c.bySource as Record<string, number>;
  return (
    <DataHealthShell title="Sources" description={DESC} path="/authority/data-health/sources">
      <section><h2 className="font-display text-xl font-bold">By source</h2>
        <div className="mt-4"><HealthTable head={["Source", "Organization", "Authority", "Values"]}
          rows={Object.entries(bySource).sort((a,b)=>b[1]-a[1]).map(([k,v])=>[SOURCES[k as keyof typeof SOURCES]?.name ?? k, SOURCES[k as keyof typeof SOURCES]?.organization ?? "—", AUTHORITY_TYPE_LABELS[SOURCES[k as keyof typeof SOURCES]?.authorityType] ?? "—", v.toLocaleString()])} /></div>
      </section>
      <section className="grid gap-8 sm:grid-cols-2">
        <DistributionTable title="By authority type" data={q.bySourceAuthority} />
        <div><h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Secondary-sourced</h3>
          <p className="mt-2 text-sm text-muted">{q.secondarySourced.toLocaleString()} values come from a community structured secondary source (Wikidata); all others are authoritative catalogues/archives.</p></div>
      </section>
    </DataHealthShell>
  );
}
