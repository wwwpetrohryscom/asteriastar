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
import { SatelliteNav, SatellitePanel, SatelliteStat, CoverageNote } from "@/components/satellites/SatelliteUI";
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { issEphemeris, issNow, reage } from "@/platform/satellites/service";

/**
 * Naked-eye satellites.
 *
 * The page is deliberately not a leaderboard of brightnesses. Publishing a table of magnitudes for
 * satellites whose orbits this platform cannot track would be reference material dressed as an
 * observing tool — the numbers would be real but useless, because knowing a satellite is bright
 * tells you nothing about whether it is over you tonight. What is here is the one satellite whose
 * position is genuinely known, and an honest account of what determines visibility for the rest.
 */

const DESCRIPTION =
  "What is actually visible to the naked eye in low Earth orbit, and what makes it so: sunlight, altitude, size and the geometry of twilight. The International Space Station is tracked live from NASA's published trajectory; for other satellites AsteriaStar holds no orbital elements it can legally and reliably obtain, so none are predicted.";

export const metadata: Metadata = buildMetadata({
  title: "Bright Satellites",
  description: DESCRIPTION,
  path: satelliteLivePath("bright"),
  keywords: ["bright satellites", "naked eye satellites", "satellite visibility", "brightest satellite", "satellite magnitude"],
});

export const revalidate = 300;

export default async function BrightSatellitesPage() {
  const nowIso = new Date().toISOString();
  const nowMs = Date.parse(nowIso);
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, nowIso);
  const now = issNow(ephemeris, nowMs);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: "Bright satellites", url: satelliteLivePath("bright") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Bright Satellites", description: DESCRIPTION, url: satelliteLivePath("bright") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Live · NASA Johnson Space Center</span>}
        title="Bright satellites"
        lead="On any clear evening, a few dozen points of light cross the sky without blinking. One of them is far brighter than the rest, and it is the only one this platform can tell you where to find."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SatelliteNav current="bright" />

        <SatellitePanel envelope={ephemeris} title="The brightest of them" what="The NASA ISS ephemeris" id="iss-heading">
          <p className="text-sm leading-relaxed text-muted">
            The International Space Station outshines everything else in orbit by a wide margin. It reaches roughly magnitude −4
            on a high overhead pass — as bright as Venus, and brighter than any star. It manages that by being large, low and
            highly reflective: a hundred metres across, four hundred kilometres up, with an acre of solar array angled at the Sun.
          </p>
          {now && (
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SatelliteStat value={now.state.geodetic.altitudeKm.toFixed(0)} unit="km" label="Altitude now" sub="low enough to appear fast and bright" />
              <SatelliteStat value={now.state.speedKmS.toFixed(1)} unit="km/s" label="Orbital speed" sub="crosses the sky in a few minutes" />
              <SatelliteStat value={now.periodMinutes?.toFixed(0) ?? "—"} unit="min" label="Orbital period" sub="several chances a day, few of them visible" />
              <SatelliteStat value="51.6" unit="°" label="Inclination" sub="the latitudes it can ever pass over" />
            </ul>
          )}
          <p className="text-sm text-muted">
            <Link href={satelliteLivePath("passes")} className="text-nasa underline-offset-4 hover:underline">Find out when it passes over you →</Link>
          </p>
        </SatellitePanel>

        <section aria-labelledby="why-heading" className="space-y-3">
          <h2 id="why-heading" className="font-display text-2xl font-bold">What makes a satellite visible</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              <strong className="text-fg">Sunlight, and only sunlight.</strong> Satellites emit nothing. Every one you have ever
              seen was reflecting the Sun, which is why they appear in the hours around dusk and dawn: high enough to still be lit
              while the ground below has turned away. Watch one long enough after sunset and it will often fade out mid-sky as it
              enters Earth&apos;s shadow — not setting, but eclipsing.
            </p>
            <p>
              <strong className="text-fg">Low is bright.</strong> Brightness falls with the square of distance, so an object at
              400 km can be a hundred times brighter than the same object at 4,000 km. Almost everything visible to the naked eye
              is in low Earth orbit; geostationary satellites, at 36,000 km, are far beyond it.
            </p>
            <p>
              <strong className="text-fg">Big, flat and reflective helps.</strong> Solar arrays and radiators are large flat
              surfaces, and when the geometry lines up they can flare briefly to many times their usual brightness. That is why a
              satellite can appear to pulse: it is tumbling, and its reflecting faces are turning.
            </p>
            <p>
              <strong className="text-fg">It does not blink.</strong> The commonest misidentification is an aircraft. Aircraft
              carry flashing navigation lights and, at altitude, are usually audible on a quiet night. A satellite is a steady
              point of light, silent, moving at a constant rate, and typically crossing the whole sky in three to six minutes.
            </p>
          </div>
        </section>

        <section aria-labelledby="others-heading" className="space-y-3">
          <h2 id="others-heading" className="font-display text-2xl font-bold">Why the others are not listed here</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-muted">
            <p>
              A list of bright satellites would be easy to write and useless to read. Brightness alone tells you nothing about
              whether an object is above your horizon tonight, and predicting that needs current orbital elements for each one.
              AsteriaStar has no source of those it can legally and reliably use: the public catalogue is served by hosts that
              refuse automated access or require credentials whose terms do not permit this, and scraping a tracking site is not
              something this platform does.
            </p>
            <p className="mt-3">
              So rather than publish a table of magnitudes that cannot be turned into a sighting, this page carries the one
              satellite whose trajectory is genuinely known and an explanation of what you are looking at when you see any of the
              others. The reasoning in full is on the{" "}
              <Link href={satelliteLivePath("live")} className="text-nasa underline-offset-4 hover:underline">live status page</Link>.
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
