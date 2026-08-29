import { apiError, apiResponse } from "@/platform/open-data";
import { issEphemeris, issPasses, reage } from "@/platform/satellites/service";
import { validateObserver, MINIMUM_PASS_ELEVATION_DEG, DARK_SKY_SUN_ELEVATION_DEG } from "@/platform/satellites/passes";
import { liveCacheControl } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/satellites/{id}/passes — visible passes for an EXPLICIT observer position.
 *
 * PRIVACY. The coordinates are read from the query string, used to evaluate a pure function, and
 * discarded when the response is written. They are not logged, not stored, not counted, not sent to
 * an analytics service, and not used to derive anything about the caller. Nothing infers a location
 * either: there is no default, no geolocation, and no inspection of the request's network address —
 * omitting the parameters returns an error, never a guess.
 *
 * The website does not use this endpoint. The pass page ships the ephemeris window to the browser
 * and computes there, so a reader's coordinates never leave their device at all. This exists for
 * people writing their own software, who are making a deliberate choice to send coordinates to a
 * server — and it is documented as exactly that.
 */
export const dynamic = "force-dynamic";

const KNOWN = new Set(["iss", "25544", "zarya", "international-space-station"]);
const MAX_HOURS = 240;
const DEFAULT_HOURS = 48;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id: raw } = await params;
  let requested: string;
  try {
    requested = decodeURIComponent(raw ?? "").trim().toLowerCase();
  } catch {
    requested = (raw ?? "").trim().toLowerCase();
  }
  if (!KNOWN.has(requested)) {
    return apiError(404, `No live satellite with id "${requested}". Pass prediction is available for the International Space Station only, id "iss": it is the one satellite whose operator publishes an open, documented operational ephemeris.`);
  }

  const query = new URL(req.url).searchParams;
  const latitude = query.get("latitude");
  const longitude = query.get("longitude");
  if (latitude === null || longitude === null) {
    return apiError(400, "latitude and longitude are required (e.g. ?latitude=51.4779&longitude=-0.0015). No location is ever inferred, geolocated or defaulted.");
  }

  const observer = validateObserver(latitude, longitude);
  if (!observer.ok) return apiError(400, observer.problem);

  const hoursRaw = Number(query.get("hours") ?? DEFAULT_HOURS);
  const hours = Number.isFinite(hoursRaw) ? Math.min(MAX_HOURS, Math.max(1, Math.floor(hoursRaw))) : DEFAULT_HOURS;

  const now = new Date();
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, now.toISOString());
  if (!ephemeris.data) {
    return apiResponse(
      { passes: [], observer: { latitudeDeg: observer.observer.latitudeDeg, longitudeDeg: observer.observer.longitudeDeg }, ephemerisAvailable: false },
      {
        provenance: `The ISS ephemeris could not be read from NASA (${ephemeris.error ?? "no reason given"}), so no passes are computed. An empty list here means "unknown", not "none" — the two are different answers and this one is the first.`,
        generatedAt: now.toISOString(),
        count: 0,
        cacheControl: "no-store",
      },
    );
  }

  const passes = issPasses(ephemeris, observer.observer, now.getTime(), hours);
  const coverageEnd = ephemeris.data.states[ephemeris.data.states.length - 1].timeMs;
  const truncated = now.getTime() + hours * 3_600_000 > coverageEnd;

  return apiResponse(
    {
      observer: { latitudeDeg: observer.observer.latitudeDeg, longitudeDeg: observer.observer.longitudeDeg, altitudeKm: 0 },
      windowHours: hours,
      windowTruncatedByEphemeris: truncated,
      ephemerisCoversToUtc: new Date(coverageEnd).toISOString(),
      minimumElevationDeg: MINIMUM_PASS_ELEVATION_DEG,
      darkSkySunElevationDeg: DARK_SKY_SUN_ELEVATION_DEG,
      passes: passes.map((p) => ({
        startUtc: new Date(p.startMs).toISOString(),
        peakUtc: new Date(p.peakMs).toISOString(),
        endUtc: new Date(p.endMs).toISOString(),
        durationSeconds: p.durationSeconds,
        maxElevationDeg: p.maxElevationDeg,
        riseAzimuthDeg: p.riseAzimuthDeg,
        riseCompass: p.riseCompass,
        setAzimuthDeg: p.setAzimuthDeg,
        setCompass: p.setCompass,
        peakAzimuthDeg: p.peakAzimuthDeg,
        minRangeKm: p.minRangeKm,
        visibility: p.visibility,
        visibleFromUtc: p.visibleFromMs ? new Date(p.visibleFromMs).toISOString() : undefined,
        visibleToUtc: p.visibleToMs ? new Date(p.visibleToMs).toISOString() : undefined,
      })),
    },
    {
      provenance:
        `Deterministic geometry over NASA/JSC's published ISS ephemeris for the coordinates supplied in this request. Those coordinates are used to evaluate a pure function and are not logged, stored, counted or transmitted anywhere. A pass is reported "visible" when the station is above ${MINIMUM_PASS_ELEVATION_DEG}° elevation, sunlit, and the Sun is more than ${Math.abs(DARK_SKY_SUN_ELEVATION_DEG)}° below the observer's horizon; the other visibility values say which of those conditions failed. NO WEATHER IS MODELLED — a visible pass is geometrically and astronomically visible, not forecast to be seen. Predictions stop where the published ephemeris stops; nothing is extrapolated past it.`,
      license: "Underlying data: public domain (US Government work), NASA/JSC.",
      source: "NASA Johnson Space Center Flight Operations Directorate, via the AsteriaStar live-provider runtime",
      generatedAt: now.toISOString(),
      count: passes.length,
      stale: ephemeris.stale,
      cacheControl: liveCacheControl(["nasa:iss-ephemeris"]),
    },
  );
}
