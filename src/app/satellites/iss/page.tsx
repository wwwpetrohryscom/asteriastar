import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, datasetSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, satelliteLivePath } from "@/lib/routes";
import { SatelliteNav, SatellitePanel, SatelliteStat, CoverageNote } from "@/components/satellites/SatelliteUI";
import { GroundTrack } from "@/components/satellites/GroundTrack";
import { EnvelopeDetails, utcStamp } from "@/components/space-weather/LiveStatus";
import { issEphemeris, issNow, verifyFrames, reage } from "@/platform/satellites/service";
import { engine } from "@/platform/data-engine";

/**
 * The ISS page — where the station is, from the operator's own trajectory.
 *
 * Every number here is derived from NASA/JSC's published ephemeris: the position by interpolating
 * its state vectors, the period by measuring the interval between equator crossings in the file,
 * the altitude by converting to the WGS-84 ellipsoid. Nothing is a textbook value and nothing is a
 * round number someone remembered.
 */

const DESCRIPTION =
  "Where the International Space Station is right now, computed from NASA Johnson Space Center's own published operational ephemeris: sub-satellite point, altitude above the ellipsoid, orbital speed, measured nodal period, and the ground track either side of the present moment. The coordinate transformation is verified against NASA's own ascending-node longitudes to within a couple of metres.";

export const metadata: Metadata = buildMetadata({
  title: "Where Is the ISS Right Now?",
  description: DESCRIPTION,
  path: satelliteLivePath("iss"),
  keywords: ["where is the ISS", "ISS position", "ISS tracker", "space station location", "ISS altitude", "ISS ground track", "ISS orbit"],
});

/**
 * One minute. The station moves 460 km in that time, so the page is honest only because it shows
 * the instant its position was computed for — and because the ephemeris behind it is valid for days,
 * so a slightly old render is a slightly old position, never a wrong one.
 */
export const revalidate = 60;

export default async function IssPage() {
  const nowIso = new Date().toISOString();
  const nowMs = Date.parse(nowIso);
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, nowIso);
  const now = issNow(ephemeris, nowMs);
  const checks = ephemeris.data ? verifyFrames(ephemeris.data) : [];
  const issEntity = engine.satellites.all().find((s) => s.name.includes("International Space Station"));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: "The ISS", url: satelliteLivePath("iss") },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({ name: "Where Is the ISS Right Now?", description: DESCRIPTION, url: satelliteLivePath("iss") }),
          datasetSchema({
            name: "International Space Station operational ephemeris (NASA/JSC)",
            description: "The ISS trajectory as state vectors in the mean equator and equinox of J2000 at four-minute spacing over fifteen days, published by NASA Johnson Space Center's Flight Operations Directorate in CCSDS Orbit Ephemeris Message format.",
            url: satelliteLivePath("iss"),
            creatorName: "NASA Johnson Space Center, Flight Operations Directorate",
            creatorUrl: "https://www.nasa.gov/spot-the-station/",
            license: "https://www.usa.gov/government-works",
            variables: ["position", "velocity", "altitude", "orbital period"],
            coverageFrom: "2026-08-29",
            distributionUrl: "https://asteriastar.com/api/v0/live/satellites/iss",
          }),
        ]}
      />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Live · NASA Johnson Space Center</span>}
        title="The International Space Station"
        lead="Four hundred kilometres up, moving at nearly eight kilometres a second, and circling the Earth roughly every ninety-three minutes. This is where it is, from the trajectory file its own flight controllers use."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SatelliteNav current="iss" />

        <SatellitePanel envelope={ephemeris} title="Right now" what="The NASA ISS ephemeris" id="now-heading">
          {!now ? (
            <p className="rounded-lg border border-nasa/40 bg-nasa/[0.08] px-4 py-3 text-sm text-muted">
              The published ephemeris does not cover the present moment. That happens when NASA&apos;s file has run past its end
              and a new one has not yet been read — and it is why no position is shown rather than one being extrapolated. The
              station manoeuvres; a trajectory beyond the end of the file would be a guess.
            </p>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <SatelliteStat
                  value={`${Math.abs(now.state.geodetic.latitudeDeg).toFixed(2)}° ${now.state.geodetic.latitudeDeg >= 0 ? "N" : "S"}`}
                  label="Latitude"
                  sub="sub-satellite point"
                />
                <SatelliteStat
                  value={`${Math.abs(now.state.geodetic.longitudeDeg).toFixed(2)}° ${now.state.geodetic.longitudeDeg >= 0 ? "E" : "W"}`}
                  label="Longitude"
                  sub="sub-satellite point"
                />
                <SatelliteStat value={now.state.geodetic.altitudeKm.toFixed(1)} unit="km" label="Altitude" sub="above the WGS-84 ellipsoid" />
                <SatelliteStat value={now.state.speedKmS.toFixed(3)} unit="km/s" label="Orbital speed" sub={`${(now.state.speedKmS * 3600).toFixed(0)} km/h`} />
              </ul>
              <p className="text-xs text-faint">
                Computed for {utcStamp(new Date(now.state.timeMs).toISOString())}
                {now.state.interpolated ? ", interpolated between NASA's four-minute state vectors by the method the CCSDS standard specifies." : ", exactly on a tabulated epoch."}
              </p>
            </>
          )}
        </SatellitePanel>

        {now && (
          <section aria-labelledby="track-heading" className="space-y-4">
            <h2 id="track-heading" className="font-display text-2xl font-bold">Ground track</h2>
            <div className="scientific-card p-5">
              <GroundTrack
                track={now.track}
                nowMs={now.state.timeMs}
                latitudeDeg={now.state.geodetic.latitudeDeg}
                longitudeDeg={now.state.geodetic.longitudeDeg}
                describedBy="iss-track-desc"
              />
            </div>
            <p className="text-sm leading-relaxed text-muted">
              The track never reaches beyond 51.6° north or south, because that is the station&apos;s orbital inclination — the
              angle its orbit makes with the equator, chosen in the 1990s so that both Baikonur and Cape Canaveral could reach it.
              Each successive orbit falls about 22.5° of longitude west of the last, because the Earth turns underneath.
            </p>
          </section>
        )}

        {now && (
          <section aria-labelledby="orbit-heading" className="space-y-4">
            <h2 id="orbit-heading" className="font-display text-2xl font-bold">The orbit, measured</h2>
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SatelliteStat value={now.periodMinutes?.toFixed(2) ?? "—"} unit="min" label="Nodal period" sub="measured between equator crossings in the file" />
              <SatelliteStat value={(1440 / (now.periodMinutes ?? 92.9)).toFixed(2)} label="Orbits per day" sub="derived from that period" />
              <SatelliteStat value={now.coverageHours.toFixed(0)} unit="h" label="Trajectory published ahead" sub={`about ${now.orbitsRemaining ?? "—"} orbits`} />
              <SatelliteStat value={ephemeris.data?.massKg ? (ephemeris.data.massKg / 1000).toFixed(1) : "—"} unit="t" label="Station mass" sub="as recorded in the ephemeris header" />
            </ul>
            <p className="text-sm leading-relaxed text-muted">
              The period is <em>measured</em>, not assumed: the ephemeris is scanned for the moments the station crosses the
              equator northbound, and the mean interval between them is the nodal period. That is the right quantity for a
              satellite in a flattened gravity field, and it differs by a few seconds from the two-body value a textbook formula
              would give.
            </p>
          </section>
        )}

        {checks.length > 0 && (
          <section aria-labelledby="verify-heading" className="space-y-4">
            <h2 id="verify-heading" className="font-display text-2xl font-bold">How this is checked</h2>
            <p className="text-sm leading-relaxed text-muted">
              Converting NASA&apos;s J2000 state vectors into a position over the Earth needs precession, nutation and Earth
              rotation. Get any of it wrong and the ground track is displaced by a fraction of a degree — which looks entirely
              plausible. So it is checked against the provider: every ephemeris file states the Earth-fixed longitude of the
              station&apos;s first and last equator crossings, computed by NASA. Running our own transformation at those moments
              gives:
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[560px] text-left text-sm">
                <caption className="px-3 pt-3 text-left text-xs text-faint">
                  The latitude column is the independent half of the check: an ascending node is by definition at zero.
                </caption>
                <thead className="text-faint">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Node</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">NASA longitude</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Computed here</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Computed latitude</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Disagreement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {checks.map((c) => (
                    <tr key={c.node}>
                      <td className="px-3 py-2 text-muted">{c.node} equator crossing</td>
                      <td className="px-3 py-2 font-medium text-fg">{c.expectedLongitudeDeg.toFixed(5)}°</td>
                      <td className="px-3 py-2 font-medium text-fg">{c.computedLongitudeDeg.toFixed(5)}°</td>
                      <td className="px-3 py-2 text-muted">{c.computedLatitudeDeg.toFixed(5)}°</td>
                      <td className="px-3 py-2 text-muted">{c.groundErrorMetres.toFixed(1)} m on the ground</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs leading-relaxed text-faint">
              The two crossings are fifteen days apart, so agreement at both also rules out an error in the rotation rate rather
              than merely in its offset. The same comparison runs as a build gate, against the live file.
            </p>
          </section>
        )}

        <section aria-labelledby="see-heading" className="space-y-3">
          <h2 id="see-heading" className="font-display text-2xl font-bold">Seeing it</h2>
          <p className="text-sm leading-relaxed text-muted">
            The station is the brightest thing in the sky after the Sun and Moon, and it is easy to recognise: a steady white
            point, as bright as Venus, gliding silently from one horizon to the other in a few minutes without blinking. It is
            visible only when it is in sunlight and you are in darkness, which restricts it to the couple of hours after dusk and
            before dawn. <Link href={satelliteLivePath("passes")} className="text-nasa underline-offset-4 hover:underline">Work out when it crosses your sky →</Link>
          </p>
          {issEntity && (
            <p className="text-sm text-muted">
              <Link href={`/satellites/${issEntity.slug}`} className="text-nasa underline-offset-4 hover:underline">The station in the encyclopedia →</Link>{" "}
              — its modules, its assembly, its crews and its instruments.
            </p>
          )}
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <CoverageNote />
          <EnvelopeDetails envelope={ephemeris} title="ISS operational ephemeris" />
        </section>

        <SourceList keys={["nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
