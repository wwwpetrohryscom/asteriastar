import { apiResponse } from "@/platform/open-data";
import { geomagneticSnapshot, reage } from "@/platform/space-weather/service";
import { liveCacheControl, serialiseSnapshot, snapshotProvenance } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/space-weather/geomagnetic — the planetary K-index observed and forecast, the
 * NOAA R/S/G scales, and SWPC's watch, warning and alert stream.
 *
 * Every Kp point carries a `provenance` field of `observed`, `estimated` or `predicted`. A consumer
 * that ignores it will treat a forecast as a measurement; the field exists so that no consumer has
 * to guess, and it is never dropped to make the payload tidier.
 */
export const dynamic = "force-dynamic";

const PRODUCTS = ["swpc:kp-index", "swpc:kp-forecast", "swpc:noaa-scales", "swpc:alerts"];

export async function GET(): Promise<Response> {
  const now = new Date();
  const snapshot = serialiseSnapshot(reage(await geomagneticSnapshot(), now.toISOString()));

  return apiResponse(snapshot, {
    provenance: `${snapshotProvenance(snapshot, "Geomagnetic activity from NOAA SWPC")} Every Kp point states whether it is observed, estimated or predicted.`,
    license: "Underlying data: public domain (US Government work), NOAA Space Weather Prediction Center.",
    source: "NOAA Space Weather Prediction Center, via the AsteriaStar live-provider runtime",
    generatedAt: now.toISOString(),
    count: Object.keys(snapshot).length,
    stale: Object.values(snapshot).some((e) => e.stale),
    cacheControl: liveCacheControl(PRODUCTS),
  });
}
