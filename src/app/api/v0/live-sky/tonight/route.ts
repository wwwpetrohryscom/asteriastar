import { apiResponse, apiError } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";

/**
 * GET /api/v0/live-sky/tonight — the Tonight Observing Dashboard: a computed
 * COMPOSITE of the Sun & Twilight, Moon, and Planet engines answering "what can I
 * observe tonight?" for an EXPLICIT location and date.
 *
 * Real, source-backed, DETERMINISTICALLY COMPUTED data (not a live provider feed,
 * and no weather/cloud/seeing/ISS/aurora/meteor/comet data is invented). The
 * response carries its own honesty envelope. Read-only. No auth, no cookies, no
 * tracking. Location is only ever what the caller passes in — never inferred,
 * geolocated, IP-located, or stored.
 *
 * Required: `latitude` (−90..90), `longitude` (−180..180).
 * Optional: `date=YYYY-MM-DD` (defaults to today), `timezone` (IANA; defaults to
 * UTC). Invalid input returns a structured 400 error.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const now = new Date();

  const lat = params.get("latitude");
  const lon = params.get("longitude");
  if (!lat || !lon) {
    return apiError(400, "latitude and longitude are required (e.g. ?latitude=50.08&longitude=14.44). No location is ever inferred.");
  }

  const date = params.get("date") ?? undefined;
  const timezone = params.get("timezone") ?? undefined;

  const result = engine.liveSky.tonight.forLocationDate({ latitude: Number(lat), longitude: Number(lon), date, timezone }, now);
  if (!result.ok) {
    return apiError(400, `${result.field}: ${result.message}`);
  }

  const { data, envelope } = result.value;
  return apiResponse(
    { ...data, envelope },
    {
      provenance: envelope.provenance,
      license: envelope.licenseNotes,
      source: "Asteria Star computed Tonight dashboard — a composite of the computed Sun & Twilight, Moon, and Planet engines (public-domain NOAA / USNO / NASA-JPL formulae)",
      generatedAt: envelope.generatedAt ?? now.toISOString(),
      stale: envelope.stale,
      count: 1,
      cacheControl: date ? "public, max-age=86400, stale-while-revalidate=86400" : "public, max-age=3600, stale-while-revalidate=3600",
    },
  );
}
