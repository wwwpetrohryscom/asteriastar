import { apiResponse } from "@/platform/open-data";
import { issEphemeris, issNow, satelliteProviderReports, reage } from "@/platform/satellites/service";
import { liveCacheControl, serialiseEnvelope } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/satellites — every satellite AsteriaStar tracks live, which is one.
 *
 * The response says so explicitly rather than leaving a consumer to infer coverage from a
 * single-element array. `trackedCount` and the accompanying note exist so that software reading
 * this endpoint cannot mistake "one satellite is available" for "one satellite is in orbit".
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const now = new Date();
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, now.toISOString());
  const state = issNow(ephemeris, now.getTime());
  const envelope = serialiseEnvelope(ephemeris);

  return apiResponse(
    {
      trackedCount: 1,
      coverage: "The International Space Station only. No general catalogue of orbital elements is connected: the public catalogue is served by hosts that refuse automated access or require credentials whose terms do not permit this use, and AsteriaStar does not scrape tracking sites.",
      satellites: [
        {
          id: "iss",
          noradCatalogId: 25544,
          name: ephemeris.data?.objectName ?? "ISS",
          internationalDesignator: ephemeris.data?.objectId,
          entityId: "satellite:international-space-station",
          ephemeris: { ...envelope, data: undefined },
          current: state
            ? {
                atUtc: new Date(state.state.timeMs).toISOString(),
                latitudeDeg: state.state.geodetic.latitudeDeg,
                longitudeDeg: state.state.geodetic.longitudeDeg,
                altitudeKm: state.state.geodetic.altitudeKm,
                speedKmS: state.state.speedKmS,
                interpolated: state.state.interpolated,
                nodalPeriodMinutes: state.periodMinutes,
                ephemerisCoverageHours: state.coverageHours,
              }
            : null,
        },
      ],
      providers: satelliteProviderReports().map((r) => ({
        providerKey: r.descriptor.providerKey,
        name: r.descriptor.name,
        state: r.state,
        license: r.descriptor.license,
        caveat: r.descriptor.providerCaveat,
      })),
    },
    {
      provenance:
        "The ISS trajectory is NASA Johnson Space Center's own operational ephemeris: state vectors in the mean equator and equinox of J2000, four minutes apart, spanning fifteen days. Positions between them are interpolated by the method the CCSDS standard specifies. `current` is null when the published file does not cover the present moment — nothing is extrapolated past its end, because the station manoeuvres.",
      license: "Underlying data: public domain (US Government work), NASA/JSC.",
      source: "NASA Johnson Space Center Flight Operations Directorate, via the AsteriaStar live-provider runtime",
      generatedAt: now.toISOString(),
      count: 1,
      stale: envelope.stale,
      cacheControl: liveCacheControl(["nasa:iss-ephemeris"]),
    },
  );
}
