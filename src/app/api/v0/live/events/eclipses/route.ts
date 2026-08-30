import { apiResponse } from "@/platform/open-data";
import { liveCacheControl, serialiseEnvelope } from "@/platform/space-weather/api";
import { lunarEclipseCatalogue, solarEclipseCatalogue } from "@/platform/events/service";
import { LUNAR_KEY_URL, SOLAR_KEY_URL } from "@/platform/events/eclipses";

/**
 * GET /api/v0/live/events/eclipses — every solar and lunar eclipse of the twenty-first century.
 *
 * Reproduced from NASA/GSFC's Five Millennium Catalog. The one transformation applied is the
 * catalogue's own: its instants are Terrestrial Dynamical Time, and `greatestEclipseUtc` is that
 * time less the delta-T the catalogue publishes for each eclipse. Both values are in the response,
 * so a consumer can check the arithmetic rather than trust it.
 */
export const dynamic = "force-dynamic";

const PRODUCTS = ["gsfc:solar-eclipses", "gsfc:lunar-eclipses"];

export async function GET(): Promise<Response> {
  const now = new Date();
  const [solar, lunar] = await Promise.all([solarEclipseCatalogue({ now }), lunarEclipseCatalogue({ now })]);

  return apiResponse(
    { solar: serialiseEnvelope(solar), lunar: serialiseEnvelope(lunar) },
    {
      provenance: `Eclipse predictions by Fred Espenak and Jean Meeus, NASA/Goddard Space Flight Center Eclipse Web Site. Instants in the catalogue are Terrestrial Dynamical Time; \`greatestEclipseUtc\` is TD less the catalogue's own \`deltaTSeconds\`. Column definitions: ${SOLAR_KEY_URL} and ${LUNAR_KEY_URL}. These are the circumstances of GREATEST eclipse only — not local circumstances for any place, which need the Besselian elements NASA publishes separately.`,
      license: "Public domain (US Government work), subject to NASA's media usage guidelines. Credit Espenak and Meeus.",
      source: "NASA/GSFC Five Millennium Catalog of Solar and Lunar Eclipses",
      generatedAt: now.toISOString(),
      count: (solar.data?.eclipses.length ?? 0) + (lunar.data?.eclipses.length ?? 0),
      stale: solar.stale || lunar.stale,
      cacheControl: liveCacheControl(PRODUCTS, !solar.data || !lunar.data),
    },
  );
}
