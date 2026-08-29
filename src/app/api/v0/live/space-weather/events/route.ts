import { apiResponse } from "@/platform/open-data";
import { solarEventsSnapshot, reage } from "@/platform/space-weather/service";
import { liveCacheControl, serialiseSnapshot, snapshotProvenance } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/space-weather/events — NASA CCMC DONKI's catalogued flares, coronal mass
 * ejections, geomagnetic storms and solar energetic particle events.
 *
 * An empty array means the catalogue held no records in the window, which is not the same as
 * nothing having happened: DONKI is curated by analysts and lags events by hours. That distinction
 * is stated in the provenance of every response rather than left for a consumer to discover.
 */
export const dynamic = "force-dynamic";

const PRODUCTS = ["donki:flares", "donki:cmes", "donki:geomagnetic-storms", "donki:sep"];

export async function GET(): Promise<Response> {
  const now = new Date();
  const snapshot = serialiseSnapshot(reage(await solarEventsSnapshot(), now.toISOString()));

  return apiResponse(snapshot, {
    provenance: `${snapshotProvenance(snapshot, "Space weather events from NASA CCMC DONKI")} DONKI is analyst-curated and lags events by hours: an empty list means nothing is catalogued yet, not that nothing happened. CCMC states its real-time contents should be considered prototyping quality and in a research context.`,
    license: "Underlying data: public domain (US Government work), NASA CCMC.",
    source: "NASA CCMC DONKI, via the AsteriaStar live-provider runtime",
    generatedAt: now.toISOString(),
    count: Object.keys(snapshot).length,
    stale: Object.values(snapshot).some((e) => e.stale),
    cacheControl: liveCacheControl(PRODUCTS),
  });
}
