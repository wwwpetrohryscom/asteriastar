import type { Metadata } from "next";
import Link from "next/link";
import { DataHealthShell, HealthTable, MetricCard, MetricGrid, StatusPill } from "@/components/authority/DataHealth";
import { buildMetadata } from "@/lib/seo/metadata";
import { liveProviderReports, liveProviderTotals, spaceWeatherSnapshot, solarEventsSnapshot } from "@/platform/space-weather/service";
import { cacheSize, CACHE_FALLBACK_RETENTION_SECONDS } from "@/platform/live-providers/cache";
import { humanDuration } from "@/components/space-weather/LiveStatus";
import type { HealthStatus } from "@/lib/data-health/metrics";
import type { ProviderState } from "@/platform/live-providers/envelope";

/**
 * Live provider health — the operator view of the external feeds Program CJ connected.
 *
 * The page PROBES the providers as it renders, rather than reading a stored history, because there
 * is no stored history to read: no operational response is written to the repository, and a
 * serverless instance may be seconds old. So the honest thing a dashboard can report is what a
 * request made right now actually did — which is what the numbers below are.
 *
 * There is no uptime percentage and no reliability score anywhere on this page. Both would be
 * fabrications built on a sample of one.
 */

const DESC =
  "Every external live provider AsteriaStar fetches from: its terms, authentication, documented rate limits, cache window, publication cadence and stale threshold — and what a request made while rendering this page actually did.";

export const metadata: Metadata = buildMetadata({
  title: "Live Provider Health",
  description: DESC,
  path: "/authority/data-health/live-providers",
  // An operator view of a running process. It is a real page with canonical metadata, but it is
  // not in the sitemap and there is nothing here for a search engine to keep.
  noindex: true,
});

/** The counters describe this running process, so a cached render would describe a dead one. */
export const dynamic = "force-dynamic";

/** Map a provider state onto the dashboard's existing status vocabulary. */
const STATE_TO_HEALTH: Record<ProviderState, HealthStatus> = {
  CONNECTED: "healthy",
  DEGRADED: "warning",
  UNAVAILABLE: "failed",
  PLANNED: "planned",
  DISABLED: "unverified",
};

export default async function LiveProviderHealthPage() {
  // Probing before reading the registry is the point: it is what turns "we believe this works"
  // into "a request made a moment ago returned this".
  await Promise.all([spaceWeatherSnapshot(), solarEventsSnapshot()]);

  const reports = liveProviderReports();
  const totals = liveProviderTotals();
  const now = new Date().toISOString();

  return (
    <DataHealthShell title="Live provider health" description={DESC} path="/authority/data-health/live-providers" asOf={now.slice(0, 19).replace("T", " ") + " UTC"}>
      <section aria-labelledby="totals">
        <h2 id="totals" className="font-display text-2xl font-bold">Totals</h2>
        <div className="mt-4">
          <MetricGrid>
            <MetricCard label="Providers" value={totals.providers} />
            <MetricCard label="Connected" value={totals.connected} />
            <MetricCard label="Degraded" value={totals.degraded} />
            <MetricCard label="Unavailable" value={totals.unavailable} />
            <MetricCard label="Products" value={totals.products} />
            <MetricCard label="Products fetched this render" value={totals.productsExercised} />
            <MetricCard label="Products failing" value={totals.productsFailing} />
            <MetricCard label="Schema mismatches" value={totals.schemaChanges} />
            <MetricCard label="Cached responses held" value={cacheSize()} sub={`kept ${humanDuration(CACHE_FALLBACK_RETENTION_SECONDS)} past expiry for the failure path`} />
          </MetricGrid>
        </div>
      </section>

      {reports.map((r) => (
        <section key={r.descriptor.providerKey} aria-labelledby={`p-${r.descriptor.providerKey}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id={`p-${r.descriptor.providerKey}`} className="font-display text-2xl font-bold">{r.descriptor.name}</h2>
            <StatusPill status={STATE_TO_HEALTH[r.state]} />
          </div>
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4 border-b border-white/5 py-1"><dt className="text-faint">Organisation</dt><dd className="text-right text-muted">{r.descriptor.organization}</dd></div>
            <div className="flex justify-between gap-4 border-b border-white/5 py-1"><dt className="text-faint">Authentication</dt><dd className="text-right text-muted">{r.descriptor.authentication}</dd></div>
            <div className="flex justify-between gap-4 border-b border-white/5 py-1"><dt className="text-faint">Integration</dt><dd className="text-right text-muted">{r.descriptor.integration}</dd></div>
            <div className="flex justify-between gap-4 border-b border-white/5 py-1"><dt className="text-faint">Schema version</dt><dd className="text-right text-muted">{r.descriptor.schemaVersion}</dd></div>
            <div className="flex justify-between gap-4 border-b border-white/5 py-1"><dt className="text-faint">Verified end-to-end</dt><dd className="text-right text-muted">{r.descriptor.verifiedAt ?? "never"}</dd></div>
            <div className="flex justify-between gap-4 border-b border-white/5 py-1"><dt className="text-faint">Licence</dt><dd className="text-right text-muted">{r.descriptor.license}</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-faint"><strong className="text-muted">Rate limits.</strong> {r.descriptor.rateLimits}</p>
          <p className="mt-2 text-xs leading-relaxed text-faint"><strong className="text-muted">Redistribution.</strong> {r.descriptor.redistribution}</p>
          {r.descriptor.providerCaveat && <p className="mt-2 text-xs leading-relaxed text-faint"><strong className="text-muted">The provider&apos;s own caveat.</strong> {r.descriptor.providerCaveat}</p>}

          <div className="mt-4">
            <HealthTable
              head={["Product", "Cadence", "Cached", "Stale after", "Last attempt", "Last success", "Latency", "Fails", "Schema"]}
              rows={r.products.map((p) => [
                p.label,
                humanDuration(p.refreshCadenceSeconds),
                humanDuration(p.cacheSeconds),
                humanDuration(p.staleAfterSeconds),
                p.health?.lastAttemptAt?.slice(11, 19) ?? "—",
                p.health?.lastSuccessAt?.slice(11, 19) ?? "—",
                p.health?.lastLatencyMs !== undefined ? `${p.health.lastLatencyMs} ms` : "—",
                p.health?.consecutiveFailures ?? 0,
                p.health?.schemaState ?? "unknown",
              ])}
            />
          </div>
          {r.products.some((p) => p.health?.lastFailureMessage) && (
            <ul className="mt-3 space-y-1 text-xs text-faint">
              {r.products
                .filter((p) => p.health?.lastFailureMessage)
                .map((p) => (
                  <li key={p.productKey}>
                    <span className="text-muted">{p.label}:</span> {p.health?.lastFailureReason} — {p.health?.lastFailureMessage}
                  </li>
                ))}
            </ul>
          )}
        </section>
      ))}

      <section aria-labelledby="honesty">
        <h2 id="honesty" className="font-display text-2xl font-bold">What these numbers are</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
          <p>
            The descriptive columns — cadence, cache window, stale threshold, terms — were read off each provider&apos;s own
            documentation before they were written down, and they change only when someone changes the registry.
          </p>
          <p>
            The operational columns are measurements taken by <em>this</em> server process. Rendering this page issues a real
            request to every product, so &ldquo;last attempt&rdquo; is a few hundred milliseconds ago by construction. A serverless
            cold start resets the counters, which is why they are labelled as belonging to an instance and not to the site.
          </p>
          <p>
            There is no uptime figure, no availability percentage and no reliability score, because AsteriaStar retains no
            operational history: no provider response is written to the repository, and the cache holds a response for at most{" "}
            {humanDuration(CACHE_FALLBACK_RETENTION_SECONDS)} past its window purely so that a failed refresh can show the last
            real value marked stale. A long-run statistic computed from that would be invented.
          </p>
          <p className="text-xs text-faint">
            Machine-readable: <code className="text-muted">/api/v0/live/providers</code>. Provider catalogue:{" "}
            <Link href="/live" className="text-nasa hover:underline">/live</Link>. Current values:{" "}
            <Link href="/space-weather/live" className="text-nasa hover:underline">/space-weather/live</Link>.
          </p>
        </div>
      </section>
    </DataHealthShell>
  );
}
