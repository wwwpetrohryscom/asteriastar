import { apiResponse } from "@/platform/open-data";
import { solarActivitySnapshot, reage } from "@/platform/space-weather/service";
import { liveCacheControl, serialiseSnapshot, snapshotProvenance } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/space-weather/solar — solar activity: the GOES X-ray flare state, NOAA's daily
 * active-region report, the 10.7 cm radio flux, and NASA CCMC's curated flare and CME catalogues.
 *
 * The operational reading and the curated catalogue are separate keys and are never merged: they
 * have different latencies and answer different questions.
 */
export const dynamic = "force-dynamic";

const PRODUCTS = ["swpc:xray-flares", "swpc:solar-regions", "swpc:f107", "donki:flares", "donki:cmes"];

export async function GET(): Promise<Response> {
  const now = new Date();
  const snapshot = serialiseSnapshot(reage(await solarActivitySnapshot(), now.toISOString()));

  return apiResponse(snapshot, {
    provenance: `${snapshotProvenance(snapshot, "Solar activity from NOAA SWPC and NASA CCMC DONKI")} CCMC states that DONKI's real-time contents should be considered prototyping quality and in a research context.`,
    license: "Underlying data: public domain (US Government works), NOAA SWPC and NASA CCMC.",
    source: "NOAA Space Weather Prediction Center and NASA CCMC DONKI, via the AsteriaStar live-provider runtime",
    generatedAt: now.toISOString(),
    count: Object.keys(snapshot).length,
    stale: Object.values(snapshot).some((e) => e.stale),
    cacheControl: liveCacheControl(PRODUCTS),
  });
}
