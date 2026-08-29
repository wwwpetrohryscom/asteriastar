import { apiResponse } from "@/platform/open-data";
import { closeApproachSnapshot, resolveApproaches, reage } from "@/platform/neo/service";
import { liveCacheControl, serialiseEnvelope } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/neo/close-approaches — near-Earth objects passing within 0.05 au over the next
 * 60 days, each resolved against AsteriaStar's catalogue.
 *
 * Every approach carries its nominal distance in three units, the provider's 3-sigma minimum and
 * maximum, and the 3-sigma uncertainty in the approach time. Serving the nominal distance without
 * those bounds would turn a prediction with real error bars into a fact, which is the single
 * easiest way to mislead with this dataset.
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const now = new Date();
  const s = reage(await closeApproachSnapshot(), now.toISOString());
  const resolved = resolveApproaches(s.closeApproaches, s.sentry);
  const envelope = serialiseEnvelope(s.closeApproaches);

  return apiResponse(
    { ...envelope, data: envelope.data !== undefined ? resolved : undefined },
    {
      provenance:
        "Computed close approaches from NASA/JPL's Center for Near-Earth Object Studies. Times are TDB (barycentric dynamical time), not UTC. Distances are the nominal solution; `distanceMin` and `distanceMax` are the provider's 3-sigma bounds and should be read alongside it. A size given as a range was inferred from absolute magnitude across an assumed albedo range, not measured. `catalogue.notYetCatalogued` marks an object AsteriaStar has no entry for — the normal case, and never grounds for minting one.",
      license: "Underlying data: public domain (US Government work), NASA/JPL-Caltech.",
      source: "NASA/JPL Center for Near-Earth Object Studies, via the AsteriaStar live-provider runtime",
      generatedAt: now.toISOString(),
      count: resolved.length,
      stale: envelope.stale,
      cacheControl: liveCacheControl(["jpl:close-approaches"]),
    },
  );
}
