import { apiResponse, apiError } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";

/**
 * GET /api/v0/live-sky/moon — the current Moon phase and illumination.
 *
 * Real, source-backed, DETERMINISTICALLY COMPUTED data (not a live provider
 * feed): the response carries its own honesty envelope with the real computation
 * time, validity window, source, method, and stale flag. Read-only. No auth, no
 * cookies, no tracking, no user location.
 *
 * Optional `?date=YYYY-MM-DD` (or ISO timestamp) computes the phase for that
 * instant. Moon phase and illumination are global, so latitude/longitude/
 * timezone are not needed in v1 (moonrise/moonset is out of scope) and are
 * ignored if supplied.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const now = new Date();

  let enveloped;
  const dateParam = params.get("date");
  if (dateParam) {
    const instant = new Date(dateParam);
    if (Number.isNaN(instant.getTime())) {
      return apiError(400, `Invalid 'date' parameter '${dateParam}'. Use YYYY-MM-DD or an ISO-8601 timestamp.`);
    }
    const year = instant.getUTCFullYear();
    if (year < 1900 || year > 2100) {
      return apiError(400, "The computed Moon model is validated for years 1900–2100; request a date in that range.");
    }
    enveloped = engine.liveSky.moon.at(instant, now);
  } else {
    enveloped = engine.liveSky.moon.current(now);
  }

  const { data, envelope } = enveloped;
  const locationNote =
    params.get("latitude") || params.get("longitude") || params.get("timezone")
      ? " Location parameters are not used in v1: phase and illumination are global (no moonrise/moonset yet)."
      : "";

  return apiResponse(
    { ...data, envelope },
    {
      provenance: envelope.provenance + locationNote,
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
