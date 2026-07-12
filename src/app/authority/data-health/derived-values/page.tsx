import type { Metadata } from "next";
import { DataHealthShell, MetricCard, MetricGrid, DistributionTable } from "@/components/authority/DataHealth";
import { derivedMetrics } from "@/lib/data-health/metrics";
import { FORMULAS } from "@/lib/provenance/formulas";
import { buildMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
const DESC = "Every derived/calculated value, by formula, with its input-provenance and uncertainty state.";
export const metadata: Metadata = buildMetadata({ title: "Data health — Derived values", description: DESC, path: "/authority/data-health/derived-values" });
export default function Page() {
  const d = derivedMetrics();
  return (
    <DataHealthShell title="Derived values" description={DESC} path="/authority/data-health/derived-values">
      <MetricGrid>
        <MetricCard label="Derived / calculated" value={d.total.toLocaleString()} />
        <MetricCard label="In provenance registry" value={d.inRegistry.toLocaleString()} />
        <MetricCard label="With propagated uncertainty" value={d.withUncertainty.toLocaleString()} />
        <MetricCard label="Without uncertainty" value={d.withoutUncertainty.toLocaleString()} sub="inputs carry none" />
      </MetricGrid>
      <section><h2 className="font-display text-xl font-bold">By formula</h2>
        <div className="mt-3 space-y-2">
          {Object.entries(d.byFormula).sort((a,b)=>b[1]-a[1]).map(([id,n])=>(
            <div key={id} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">{FORMULAS[id]?.formula ?? id} <span className="text-faint">(v{FORMULAS[id]?.version ?? "?"})</span></span>
              <span className="font-medium text-fg">{n.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
      <DistributionTable title="By domain" data={d.byDomain} />
    </DataHealthShell>
  );
}
