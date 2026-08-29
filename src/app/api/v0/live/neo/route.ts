import { apiResponse } from "@/platform/open-data";
import { neoSnapshot, neoTotals, reage } from "@/platform/neo/service";
import { liveCacheControl, serialiseSnapshot, snapshotProvenance } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/neo — every near-Earth object feed in one response.
 *
 * Close approaches, the Sentry impact-risk table, newly catalogued objects, and the Minor Planet
 * Centre's unconfirmed candidates, each in its own honesty envelope.
 *
 * Two things a consumer should not have to discover for themselves, and so are stated in the
 * provenance of every response: close-approach times are TDB, not UTC; and impact probabilities are
 * JPL's, carrying JPL's own statement that they can be wrong by a factor of ten.
 */
export const dynamic = "force-dynamic";

const PRODUCTS = ["jpl:close-approaches", "jpl:sentry", "jpl:recent-neos", "mpc:neocp"];

export async function GET(): Promise<Response> {
  const now = new Date();
  const raw = reage(await neoSnapshot(), now.toISOString());
  const snapshot = serialiseSnapshot(raw);

  return apiResponse(
    { totals: neoTotals(raw), ...snapshot },
    {
      provenance: `${snapshotProvenance(snapshot, "Near-Earth objects from NASA/JPL CNEOS and the IAU Minor Planet Center")} Close-approach times are TDB (barycentric dynamical time), NOT UTC. Impact probabilities are JPL's own, and JPL states they can be inaccurate by a factor of a few and occasionally by ten or more. AsteriaStar computes no impact probability of its own.`,
      license: "Underlying data: public domain (US Government work) NASA/JPL-Caltech, and public IAU Minor Planet Center data.",
      source: "NASA/JPL Center for Near-Earth Object Studies and the IAU Minor Planet Center, via the AsteriaStar live-provider runtime",
      generatedAt: now.toISOString(),
      count: Object.keys(snapshot).length,
      stale: Object.values(snapshot).some((e) => e.stale),
      cacheControl: liveCacheControl(PRODUCTS),
    },
  );
}
