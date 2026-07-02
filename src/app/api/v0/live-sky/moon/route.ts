import { apiResponse, apiError } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";

/**
 * GET /api/v0/live-sky/moon — the computed Moon.
 *
 * Real, source-backed, DETERMINISTICALLY COMPUTED data (not a live provider
 * feed): every response carries its own honesty envelope with the real
 * computation time, validity window, source, method, and stale flag. Read-only.
 * No auth, no cookies, no tracking.
 *
 * Two modes, backward-compatible:
 *  - WITHOUT latitude/longitude → the global Moon phase and illumination
 *    (unchanged Program P behaviour). Optional `?date=` computes for that instant.
 *  - WITH `latitude` and `longitude` → location-aware moonrise, moonset, transit,
 *    position, phase, and horizon status for the date (defaults to today).
 *    Optional `date` (YYYY-MM-DD) and IANA `timezone`. Location is only ever what
 *    the caller passes in — never inferred, geolocated, IP-located, or stored.
 *
 * Invalid input returns a structured 400 error.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const now = new Date();

  const lat = params.get("latitude");
  const lon = params.get("longitude");

  // Location-aware mode (Program R): both coordinates required.
  if (lat || lon) {
    if (!lat || !lon) {
      return apiError(400, "Provide both latitude and longitude for location-aware Moon data (moonrise/moonset/position), or neither for the global phase. No location is ever inferred.");
    }
    const date = params.get("date") ?? undefined;
    const timezone = params.get("timezone") ?? undefined;
    const result = engine.liveSky.moon.forLocationDate({ latitude: Number(lat), longitude: Number(lon), date, timezone }, now);
    if (!result.ok) {
      return apiError(400, `${result.field}: ${result.message}`);
    }
    const { data, envelope } = result.value;
    return apiResponse(
      { ...data, envelope },
      {
        provenance: envelope.provenance,
        license: envelope.licenseNotes,
        source: "Asteria Star computed Moon position — public-domain low-precision lunar theory (Astronomical Almanac / USNO; methodology per J. Meeus)",
        generatedAt: envelope.generatedAt ?? now.toISOString(),
        stale: envelope.stale,
        count: 1,
        // A specific date is immutable; a current-position response drifts, so a shorter horizon.
        cacheControl: date ? "public, max-age=86400, stale-while-revalidate=86400" : "public, max-age=3600, stale-while-revalidate=3600",
      },
    );
  }

  // Phase-only mode (Program P): global phase/illumination, backward-compatible.
  let enveloped;
  const dateParam = params.get("date");
  if (dateParam) {
    const instant = new Date(dateParam);
    if (Number.isNaN(instant.getTime())) {
      return apiError(400, `Invalid 'date' parameter '${dateParam}'. Use YYYY-MM-DD or an ISO-8601 timestamp.`);
    }
    const year = instant.getUTCFullYear();
    if (year < 1901 || year > 2099) {
      return apiError(400, "The computed Moon model is validated for years 1901–2099; request a date in that range.");
    }
    enveloped = engine.liveSky.moon.at(instant, now);
  } else {
    enveloped = engine.liveSky.moon.current(now);
  }

  const { data, envelope } = enveloped;
  return apiResponse(
    { ...data, envelope },
    {
      provenance: envelope.provenance,
      license: envelope.licenseNotes,
      source: "Asteria Star computed Moon phase — USNO approximate solar coordinates and public-domain low-precision lunar formulae (Meeus / Astronomical Almanac)",
      generatedAt: envelope.generatedAt ?? now.toISOString(),
      stale: envelope.stale,
      count: 1,
      // Conservative: cache for an hour even though the value is valid for three.
      cacheControl: "public, max-age=3600, stale-while-revalidate=3600",
    },
  );
}
