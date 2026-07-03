import { apiResponse, apiError } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";
import { ALL_PLANET_KEYS, type PlanetKey } from "@/platform/live-sky/providers/planetary-position";

/**
 * GET /api/v0/live-sky/planets — computed, location-aware naked-eye planet
 * visibility: rise, set, transit, position, and honest observing rules for an
 * EXPLICIT location and date.
 *
 * Real, source-backed, DETERMINISTICALLY COMPUTED data (not a live provider
 * feed): the response carries its own honesty envelope. Read-only. No auth, no
 * cookies, no tracking. Location is only ever what the caller passes in — never
 * inferred, geolocated, IP-located, or stored.
 *
 * Required: `latitude` (−90..90), `longitude` (−180..180).
 * Optional: `date=YYYY-MM-DD` (defaults to today), `timezone` (IANA; defaults to
 * UTC), and `planet` (one of mercury|venus|mars|jupiter|saturn|uranus|neptune;
 * default is the five naked-eye planets). Invalid input returns a structured 400.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const now = new Date();

  const lat = params.get("latitude");
  const lon = params.get("longitude");
  if (!lat || !lon) {
    return apiError(400, "latitude and longitude are required (e.g. ?latitude=50.08&longitude=14.44). No location is ever inferred.");
  }

  let planet: PlanetKey | undefined;
  const planetParam = params.get("planet");
  if (planetParam) {
    const key = planetParam.toLowerCase();
    if (!(ALL_PLANET_KEYS as string[]).includes(key)) {
      return apiError(400, `Unknown planet '${planetParam}'. Use one of: ${ALL_PLANET_KEYS.join(", ")}.`);
    }
    planet = key as PlanetKey;
  }

  const date = params.get("date") ?? undefined;
  const timezone = params.get("timezone") ?? undefined;

  const result = engine.liveSky.planets.forLocationDate({ latitude: Number(lat), longitude: Number(lon), date, timezone }, now, planet);
  if (!result.ok) {
    return apiError(400, `${result.field}: ${result.message}`);
  }

  const { data, envelope } = result.value;
  return apiResponse(
    { ...data, envelope },
    {
      provenance: envelope.provenance,
      license: envelope.licenseNotes,
      source: "Asteria Star computed planet visibility — public-domain NASA/JPL approximate planetary elements with Astronomical Almanac (USNO) magnitudes",
      generatedAt: envelope.generatedAt ?? now.toISOString(),
      stale: envelope.stale,
      count: data?.planets.length ?? 0,
      // A specific date is immutable; a current response drifts, so a shorter horizon.
      cacheControl: date ? "public, max-age=86400, stale-while-revalidate=86400" : "public, max-age=3600, stale-while-revalidate=3600",
    },
  );
}
