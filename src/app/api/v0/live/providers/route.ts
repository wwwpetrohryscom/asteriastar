import { apiResponse } from "@/platform/open-data";
import { liveProviderReports, liveProviderTotals } from "@/platform/space-weather/service";
import { cacheSize } from "@/platform/live-providers/cache";

/**
 * GET /api/v0/live/providers — the live provider registry and this instance's request record.
 *
 * Every descriptive field (terms, authentication, documented rate limits, cache window, publication
 * cadence, stale threshold) was read off the provider's own documentation before it was written
 * down. Every operational field (last attempt, last success, latency, consecutive failures, schema
 * state) is a real measurement made by THIS server process.
 *
 * There is deliberately no uptime percentage and no reliability score. This deployment retains no
 * operational history — no provider response is written to the repository — so any long-run figure
 * would be invented, and a serverless instance may be seconds old. The response says so.
 *
 * `force-dynamic`: the counters describe the running process, so a build-time snapshot of them
 * would be a record of a machine that no longer exists.
 */
export const dynamic = "force-dynamic";

export function GET(): Response {
  const now = new Date();
  const reports = liveProviderReports();
  const totals = liveProviderTotals();

  return apiResponse(
    {
      totals: { ...totals, cachedResponses: cacheSize() },
      providers: reports.map((r) => ({
        providerKey: r.descriptor.providerKey,
        name: r.descriptor.name,
        organization: r.descriptor.organization,
        documentation: r.descriptor.documentation,
        category: r.descriptor.category,
        state: r.state,
        integration: r.descriptor.integration,
        authentication: r.descriptor.authentication,
        rateLimits: r.descriptor.rateLimits,
        redistribution: r.descriptor.redistribution,
        license: r.descriptor.license,
        attribution: r.descriptor.attribution,
        providerCaveat: r.descriptor.providerCaveat,
        schemaVersion: r.descriptor.schemaVersion,
        verifiedAt: r.descriptor.verifiedAt,
        products: r.products.map((p) => ({
          productKey: p.productKey,
          label: p.label,
          url: p.url,
          cacheSeconds: p.cacheSeconds,
          refreshCadenceSeconds: p.refreshCadenceSeconds,
          staleAfterSeconds: p.staleAfterSeconds,
          runtime: p.health
            ? {
                lastAttemptAt: p.health.lastAttemptAt,
                lastSuccessAt: p.health.lastSuccessAt,
                lastFailureAt: p.health.lastFailureAt,
                lastFailureReason: p.health.lastFailureReason,
                lastLatencyMs: p.health.lastLatencyMs,
                lastBytes: p.health.lastBytes,
                consecutiveFailures: p.health.consecutiveFailures,
                successCount: p.health.successCount,
                failureCount: p.health.failureCount,
                schemaState: p.health.schemaState,
              }
            : null,
        })),
      })),
    },
    {
      provenance:
        "Provider terms, cadences and cache windows are read from each provider's own documentation. Runtime counters are real measurements made by this server instance since it started, and a serverless cold start resets them: `runtime: null` means this instance has not yet requested that product, not that the product has never been fetched. There is no uptime percentage and no reliability score, because no operational history is retained.",
      source: "AsteriaStar live-provider runtime",
      generatedAt: now.toISOString(),
      count: reports.length,
      // The counters change with every request this process serves, so the response is not cacheable.
      cacheControl: "no-store",
    },
  );
}
