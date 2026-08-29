import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, satelliteLivePath } from "@/lib/routes";
import { SatelliteNav, SatellitePanel, LocationPrivacyNote, CoverageNote } from "@/components/satellites/SatelliteUI";
import { PassCalculator } from "@/components/satellites/PassCalculator";
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { issEphemeris, ephemerisWindow, reage } from "@/platform/satellites/service";
import { MINIMUM_PASS_ELEVATION_DEG, DARK_SKY_SUN_ELEVATION_DEG } from "@/platform/satellites/passes";

/**
 * ISS pass prediction, computed on the reader's own device.
 *
 * The server's only job here is to hand over a window of NASA's state vectors. Everything after
 * that — the observer geometry, the eclipse test, the twilight test — happens in the browser, so a
 * reader's coordinates are never transmitted anywhere. That is a stronger privacy guarantee than a
 * promise not to log them, because there is nothing to log.
 */

const DESCRIPTION =
  "When the International Space Station crosses your sky, computed in your own browser from NASA's published trajectory — so the coordinates you enter are never transmitted anywhere. Each pass gives rise and set bearings, maximum elevation, duration and closest approach, and says whether it is actually visible: sunlit station, dark sky, or neither.";

export const metadata: Metadata = buildMetadata({
  title: "ISS Passes Over Your Location",
  description: DESCRIPTION,
  path: satelliteLivePath("passes"),
  keywords: ["ISS pass predictions", "when can I see the ISS", "space station sightings", "ISS visible pass", "satellite pass calculator"],
});

/** Five minutes: the ephemeris changes every few days, and the window sent is a day and a half wide. */
export const revalidate = 300;

/** How much trajectory the browser is given. Wide enough to be useful, narrow enough to be small. */
const WINDOW_HOURS = 36;

export default async function IssPassesPage() {
  const nowIso = new Date().toISOString();
  const nowMs = Date.parse(nowIso);
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, nowIso);
  const window = ephemerisWindow(ephemeris, nowMs, WINDOW_HOURS);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: "Passes", url: satelliteLivePath("passes") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "ISS Passes Over Your Location", description: DESCRIPTION, url: satelliteLivePath("passes") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Computed in your browser · NASA trajectory</span>}
        title="ISS passes"
        lead="The station crosses most inhabited latitudes several times a day, but only a few of those crossings can actually be seen. This works out which — from coordinates you type, on your own device."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SatelliteNav current="passes" />

        <SatellitePanel envelope={ephemeris} title="Find passes" what="The NASA ISS ephemeris" id="calc-heading">
          {!window ? (
            <p className="rounded-lg border border-nasa/40 bg-nasa/[0.08] px-4 py-3 text-sm text-muted">
              NASA&apos;s published ephemeris does not currently extend far enough ahead of this moment to predict passes. No
              times are shown rather than extrapolated ones: the station manoeuvres, and a pass computed past the end of the
              published trajectory would be a guess with a timestamp on it.
            </p>
          ) : (
            <PassCalculator window={window} coverageEndMs={window.endMs} />
          )}
        </SatellitePanel>

        <LocationPrivacyNote />

        <section aria-labelledby="reading-heading" className="space-y-3">
          <h2 id="reading-heading" className="font-display text-2xl font-bold">What makes a pass visible</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              The station produces no light of its own. It is a mirror the size of a football pitch, and seeing it requires three
              things at once: it must be above your horizon, it must be in sunlight, and your sky must be dark. Miss any one and
              there is nothing to see, however precisely you know where it is.
            </p>
            <p>
              That combination only happens for a couple of hours after sunset and before sunrise. In the middle of the night the
              station is usually in Earth&apos;s shadow — passing straight overhead, entirely invisible. In daylight it is lit but
              the sky is brighter. So a location with six overhead passes a day might have one worth going outside for.
            </p>
            <p>
              Passes below <strong className="text-fg">{MINIMUM_PASS_ELEVATION_DEG}°</strong> are not listed. Below that, trees,
              buildings and horizon haze make a sighting a matter of luck, and calling it a prediction would be overselling the
              geometry. A sky counts as dark when the Sun is more than{" "}
              <strong className="text-fg">{Math.abs(DARK_SKY_SUN_ELEVATION_DEG)}°</strong> below the horizon — the end of civil
              twilight, and the conventional threshold for the brightest satellites.
            </p>
            <p>
              What the calculation does <strong className="text-fg">not</strong> include is the weather. There is no cloud,
              humidity or transparency data connected to this platform, so a pass listed as visible is one that is geometrically
              visible and astronomically dark. Whether the sky above you is clear is a separate question that nothing here can
              answer.
            </p>
          </div>
        </section>

        <section aria-labelledby="how-heading" className="space-y-3">
          <h2 id="how-heading" className="font-display text-2xl font-bold">How the times are worked out</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              From NASA&apos;s own trajectory file, not from a two-line element set. The station&apos;s position is interpolated
              between state vectors four minutes apart, converted into an Earth-fixed frame through precession, nutation and
              Earth rotation, and then into the elevation and bearing you would measure standing at the coordinates you gave. The
              frame conversion is checked against NASA&apos;s own equator-crossing longitudes, which it reproduces to within a
              couple of metres — <Link href={satelliteLivePath("iss")} className="text-nasa underline-offset-4 hover:underline">that comparison is on the ISS page</Link>.
            </p>
            <p>
              Predictions stop where the published ephemeris stops, about fifteen days after NASA generates it. Nothing is
              extrapolated past that point, because the station raises its orbit periodically and a trajectory computed through a
              manoeuvre would be confidently wrong.
            </p>
          </div>
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
