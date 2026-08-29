import { apiResponse } from "@/platform/open-data";
import { spaceWeatherSnapshot, reage } from "@/platform/space-weather/service";
import { liveCacheControl, serialiseSnapshot, snapshotProvenance } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/space-weather — every current space-weather product in one response.
 *
 * Read-only. No auth, no cookies, no tracking, no parameters. Each product is returned inside its
 * own honesty envelope: provider, exact source URL, the provider's own timestamp, freshness status,
 * cache window, licence and limitations. A product that could not be read is present with a status
 * and a reason and NO `data` key — there is deliberately nothing a consumer could mistake for a
 * measurement of zero.
 *
 * `force-dynamic` is deliberate. Without it a parameterless GET handler is prerendered at build
 * time, and this endpoint would serve whatever the Sun was doing when the site was last deployed.
 */
export const dynamic = "force-dynamic";

const PRODUCTS = [
  "swpc:solar-wind-speed", "swpc:solar-wind-mag", "swpc:solar-wind-propagated",
  "swpc:kp-index", "swpc:kp-forecast", "swpc:noaa-scales", "swpc:alerts",
  "swpc:xray-flares", "swpc:solar-regions", "swpc:f107", "swpc:ovation-aurora",
];

export async function GET(): Promise<Response> {
  const now = new Date();
  const snapshot = serialiseSnapshot(reage(await spaceWeatherSnapshot(), now.toISOString()));

  return apiResponse(snapshot, {
    provenance: snapshotProvenance(snapshot, "Current space weather from NOAA SWPC"),
    license: "Underlying data: public domain (US Government work), NOAA Space Weather Prediction Center.",
    source: "NOAA Space Weather Prediction Center, via the AsteriaStar live-provider runtime",
    generatedAt: now.toISOString(),
    count: Object.keys(snapshot).length,
    stale: Object.values(snapshot).some((e) => e.stale),
    cacheControl: liveCacheControl(PRODUCTS),
  });
}
