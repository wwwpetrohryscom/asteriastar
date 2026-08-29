import { apiError, apiResponse } from "@/platform/open-data";
import { issEphemeris, issNow, verifyFrames, reage } from "@/platform/satellites/service";
import { liveCacheControl, serialiseEnvelope } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/satellites/{id} — one satellite's current state.
 *
 * The only recognised id is `iss` (or its NORAD catalogue number, 25544). Anything else returns 404
 * with an explicit statement of coverage, rather than an empty result that a consumer might read as
 * "this satellite does not exist".
 *
 * The response carries the frame-verification figures: the disagreement between our coordinate
 * transformation and NASA's own published equator-crossing longitudes. A consumer relying on these
 * positions is entitled to see how far they can be trusted, measured rather than claimed.
 */
export const dynamic = "force-dynamic";

const KNOWN = new Set(["iss", "25544", "zarya", "international-space-station"]);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id: raw } = await params;
  let requested: string;
  try {
    requested = decodeURIComponent(raw ?? "").trim().toLowerCase();
  } catch {
    requested = (raw ?? "").trim().toLowerCase();
  }
  if (!requested || requested.length > 40 || !/^[a-z0-9-]+$/.test(requested)) {
    return apiError(400, "id must be 1-40 characters of lowercase letters, digits or hyphens.");
  }
  if (!KNOWN.has(requested)) {
    return apiError(404, `No live satellite with id "${requested}". AsteriaStar tracks exactly one satellite live — the International Space Station, id "iss" — because it is the only one whose operator publishes an open, documented operational ephemeris. This is a statement about this platform's coverage, not about the satellite.`);
  }

  const now = new Date();
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, now.toISOString());
  const state = issNow(ephemeris, now.getTime());
  const envelope = serialiseEnvelope(ephemeris);
  const checks = ephemeris.data ? verifyFrames(ephemeris.data) : [];

  return apiResponse(
    {
      id: "iss",
      noradCatalogId: 25544,
      name: ephemeris.data?.objectName ?? "ISS",
      internationalDesignator: ephemeris.data?.objectId,
      entityId: "satellite:international-space-station",
      massKg: ephemeris.data?.massKg,
      ephemeris: {
        ...envelope,
        data: undefined,
        referenceFrame: ephemeris.data?.referenceFrame,
        timeSystem: ephemeris.data?.timeSystem,
        originator: ephemeris.data?.originator,
        stateVectorCount: ephemeris.data?.states.length,
        coversFromUtc: ephemeris.data ? new Date(ephemeris.data.startMs).toISOString() : undefined,
        coversToUtc: ephemeris.data ? new Date(ephemeris.data.stopMs).toISOString() : undefined,
      },
      current: state
        ? {
            atUtc: new Date(state.state.timeMs).toISOString(),
            latitudeDeg: state.state.geodetic.latitudeDeg,
            longitudeDeg: state.state.geodetic.longitudeDeg,
            altitudeKm: state.state.geodetic.altitudeKm,
            speedKmS: state.state.speedKmS,
            positionEciKm: state.state.positionEci,
            velocityEciKmS: state.state.velocityEci,
            interpolated: state.state.interpolated,
            nodalPeriodMinutes: state.periodMinutes,
            ephemerisCoverageHours: state.coverageHours,
          }
        : null,
      frameVerification: checks.map((c) => ({
        node: c.node,
        atUtc: new Date(c.timeMs).toISOString(),
        providerLongitudeDeg: c.expectedLongitudeDeg,
        computedLongitudeDeg: c.computedLongitudeDeg,
        computedLatitudeDeg: c.computedLatitudeDeg,
        groundDisagreementMetres: c.groundErrorMetres,
      })),
    },
    {
      provenance:
        "Position derived from NASA/JSC's operational ephemeris by interpolation and a J2000-to-Earth-fixed transformation through IAU 1976 precession, IAU 1980 nutation and Greenwich apparent sidereal time. `frameVerification` compares that transformation against NASA's own published equator-crossing longitudes from the same file — a measured statement of how far these coordinates can be trusted. Polar motion and the UT1 offset are not modelled; both are well under a kilometre.",
      license: "Underlying data: public domain (US Government work), NASA/JSC.",
      source: "NASA Johnson Space Center Flight Operations Directorate, via the AsteriaStar live-provider runtime",
      generatedAt: now.toISOString(),
      stale: envelope.stale,
      cacheControl: liveCacheControl(["nasa:iss-ephemeris"]),
    },
  );
}
