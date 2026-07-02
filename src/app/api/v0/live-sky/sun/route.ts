import { apiResponse, apiError } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";

/**
 * GET /api/v0/live-sky/sun — sunrise, sunset, solar noon, twilight, day length,
 * and a solar summary for an EXPLICIT location and date.
 *
 * Real, source-backed, DETERMINISTICALLY COMPUTED data (not a live provider
 * feed): the response carries its own honesty envelope with the real computation
 * time, validity window, source, and method. Read-only. No auth, no cookies, no
 * tracking. Location is only ever what the caller passes in — it is never
 * inferred, geolocated, IP-located, or stored.
 *
 * Required: `latitude` (−90..90), `longitude` (−180..180).
 * Optional: `date=YYYY-MM-DD` (defaults to today, UTC), `timezone` (IANA id;
 * defaults to UTC). Invalid input returns a structured 400 error.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const now = new Date();

  const latStr = params.get("latitude");
  const lonStr = params.get("longitude");
  if (!latStr || !lonStr) {
    return apiError(400, "latitude and longitude are required (e.g. ?latitude=50.08&longitude=14.44). No location is ever inferred.");
  }

  const date = params.get("date") ?? now.toISOString().slice(0, 10);
  const timezone = params.get("timezone") ?? undefined;

  const result = engine.liveSky.sun.forLocationDate(
    { latitude: Number(latStr), longitude: Number(lonStr), date, timezone },
    now,
  );
  if (!result.ok) {
    return apiError(400, `${result.field}: ${result.message}`);
  }

  const { data, envelope } = result.value;
  return apiResponse(
    { ...data, envelope },
    {
      provenance: envelope.provenance,
      license: envelope.licenseNotes,
      source: "Asteria Star computed Sun & Twilight — the public-domain NOAA Solar Calculator algorithm with the Astronomical Almanac (USNO) low-precision solar formulae",
      generatedAt: envelope.generatedAt ?? now.toISOString(),
      stale: envelope.stale,
      count: 1,
      // Deterministic and immutable for a given date + location, so cacheable for a day.
      cacheControl: "public, max-age=86400, stale-while-revalidate=86400",
    },
  );
}
