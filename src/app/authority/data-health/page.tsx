import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusPill, MetricCard, MetricGrid, HealthTable, DistributionTable } from "@/components/authority/DataHealth";
import { dataHealth } from "@/lib/data-health/metrics";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

// Real-time: freshness is computed against the current instant on each request.
export const dynamic = "force-dynamic";

const DESC = "Operator view of scientific-data health: coverage, freshness, provenance completeness, conflicts, derived values and provider status — every number computed from the live registries and committed snapshots.";
export const metadata: Metadata = buildMetadata({ title: "Scientific Data Health", description: DESC, path: "/authority/data-health" });

export default function DataHealthPage() {
  const h = dataHealth();
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Authority", url: ROUTES.authority }, { name: "Data health", url: "/authority/data-health" }];
  const c = h.coverage, q = h.quality;
  const pct = (n: number) => `${((100 * n) / Math.max(1, c.totalValues)).toFixed(1)}%`;

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection eyebrow="Authority" title="Scientific data health" lead={`${DESC} As of ${h.asOf}.`} />

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="coverage">
          <h2 id="coverage" className="font-display text-2xl font-bold">Coverage</h2>
          <div className="mt-4"><MetricGrid>
            <MetricCard label="Source-traced values" value={c.totalValues.toLocaleString()} href="/authority/data-health/provenance" />
            <MetricCard label="Entities" value={c.entities.toLocaleString()} />
            <MetricCard label="Distinct bibcodes" value={c.distinctBibcodes.toLocaleString()} />
            <MetricCard label="With uncertainty" value={c.withUncertainty.toLocaleString()} sub={pct(c.withUncertainty)} />
            <MetricCard label="With exact source row" value={c.withRowReference.toLocaleString()} sub={pct(c.withRowReference)} />
            <MetricCard label="With epoch" value={c.withEpoch.toLocaleString()} sub={pct(c.withEpoch)} />
            <MetricCard label="With reference frame" value={c.withReferenceFrame.toLocaleString()} sub={pct(c.withReferenceFrame)} />
            <MetricCard label="Derived / calculated" value={h.derived.total.toLocaleString()} href="/authority/data-health/derived-values" />
          </MetricGrid></div>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            <DistributionTable title="By domain" data={c.byDomain} />
            <DistributionTable title="By status" data={c.byStatus as Record<string, number>} />
            <DistributionTable title="By source" data={c.bySource as Record<string, number>} />
          </div>
          <p className="mt-3 text-xs text-faint"><Link href="/authority/data-health/sources" className="text-nasa hover:underline">Source breakdown →</Link></p>
        </section>

        <section aria-labelledby="freshness">
          <h2 id="freshness" className="font-display text-2xl font-bold">Freshness</h2>
          <p className="mt-1 text-sm text-muted">Each committed snapshot vs its refresh cadence. <Link href="/authority/data-health/freshness" className="text-nasa hover:underline">Detail →</Link></p>
          <div className="mt-4"><HealthTable
            head={["Snapshot", "Provider", "Cadence", "Retrieved", "Age", "Next due", "Status"]}
            rows={h.freshness.rows.map((r) => [r.id, r.provider, r.cadence, r.retrievedAt, `${r.ageDays} d`, r.nextDue, <StatusPill key="s" status={r.status} />])}
          /></div>
        </section>

        <section aria-labelledby="providers">
          <h2 id="providers" className="font-display text-2xl font-bold">Provider health</h2>
          <div className="mt-4"><HealthTable
            head={["Provider", "Snapshots", "Rows", "Last retrieved", "Status"]}
            rows={h.providers.map((p) => [p.provider, p.snapshots.length, p.rows.toLocaleString(), p.lastRetrieved, <StatusPill key="s" status={p.status} />])}
          /></div>
        </section>

        <section aria-labelledby="quality">
          <h2 id="quality" className="font-display text-2xl font-bold">Quality</h2>
          <div className="mt-4"><MetricGrid>
            <MetricCard label="Values without uncertainty" value={q.withoutUncertainty.toLocaleString()} sub={pct(q.withoutUncertainty)} />
            <MetricCard label="Secondary-sourced (Wikidata)" value={q.secondarySourced.toLocaleString()} />
            <MetricCard label="Source conflicts" value={q.launchDateConflicts.toLocaleString()} sub="launch date vs catalogue" href="/authority/data-health/conflicts" />
            <MetricCard label="Missions unverified by primary" value={q.missionsUnverifiedByPrimary.toLocaleString()} sub="secondary until primary sourcing" />
          </MetricGrid></div>
        </section>

        <p className="text-xs text-faint">Every figure on this page is computed from the live provenance registry and committed snapshots — no hard-coded totals. JSON API: <code className="text-muted">/api/v0/authority/data-health</code>.</p>
      </Container>
    </>
  );
}
