import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, satelliteLivePath, satelliteConstellationPath } from "@/lib/routes";
import { SatelliteNav, CoverageNote } from "@/components/satellites/SatelliteUI";
import { satelliteProviderReports } from "@/platform/satellites/service";
import { engine } from "@/platform/data-engine";

/**
 * Live data status for the satellite constellations.
 *
 * The live thing on this page is AsteriaStar's own integration state, and the page says so in its
 * first sentence. It is NOT orbital data for these constellations, because none is connected — and
 * a page under a `/live` URL that implied otherwise would be exactly the misuse of the word the
 * platform's honesty model forbids.
 *
 * Publishing this rather than nothing is a deliberate choice: "which of these can this site actually
 * track, and why not?" is a real question with a real answer, and burying it would leave a reader to
 * work it out from absences.
 */

const DESCRIPTION =
  "The state of live orbital data for the large satellite constellations — GPS, Galileo, GLONASS, BeiDou, Starlink, OneWeb, Iridium and the rest. None is connected, and this page says exactly why: the public catalogue of orbital elements is served by hosts that refuse automated access or require credentials whose terms do not permit it. The constellations themselves are covered in full in the satellite encyclopedia.";

export const metadata: Metadata = buildMetadata({
  title: "Satellite Constellations — Live Data Status",
  description: DESCRIPTION,
  path: satelliteLivePath("constellations/live"),
  keywords: ["satellite constellation tracking", "Starlink tracking", "GPS satellites live", "constellation orbital elements", "satellite catalogue"],
});

/** Reference plus integration state; neither changes minute to minute. */
export const revalidate = 3600;

export default function ConstellationsLivePage() {
  const constellations = engine.satellites.constellations();
  const reports = satelliteProviderReports();
  const connectedOrbital = reports.filter((r) => r.state === "CONNECTED");

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: "Constellations — live status", url: satelliteLivePath("constellations/live") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Satellite Constellations — Live Data Status", description: DESCRIPTION, url: satelliteLivePath("constellations/live") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Integration status</span>}
        title="Constellations — live data status"
        lead="What is live on this page is AsteriaStar's own integration state, not the constellations' positions. None of them is tracked here, and the reason is worth stating plainly rather than leaving to be inferred."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SatelliteNav current="constellations/live" />

        <section aria-labelledby="status-heading" className="space-y-4">
          <h2 id="status-heading" className="font-display text-2xl font-bold">Where each one stands</h2>
          <p className="text-sm leading-relaxed text-muted">
            Tracking a constellation means holding current orbital elements for every satellite in it — thousands, in the case of
            Starlink. AsteriaStar holds none, for any of them. The {connectedOrbital.length === 1 ? "one orbital provider" : `${connectedOrbital.length} orbital providers`}{" "}
            connected {connectedOrbital.length === 1 ? "covers" : "cover"} a single spacecraft, the International Space Station,
            because its operator publishes its trajectory openly.
          </p>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="px-3 pt-3 text-left text-xs text-faint">
                Every row says the same thing, and that is the point: this is a complete and uniform absence, not a partial
                rollout with gaps.
              </caption>
              <thead className="text-faint">
                <tr>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Constellation</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Live orbital data</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Encyclopedia coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {constellations.map((c) => (
                  <tr key={c.slug}>
                    <td className="px-3 py-2 font-medium text-fg">{c.name}</td>
                    <td className="px-3 py-2"><StatusBadge tone="planned">Not connected</StatusBadge></td>
                    <td className="px-3 py-2">
                      <Link href={satelliteConstellationPath(c.slug)} className="text-xs text-nasa underline-offset-4 hover:underline">
                        Full entry →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="why-heading" className="space-y-3">
          <h2 id="why-heading" className="font-display text-2xl font-bold">Why none of them is connected</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              The orbital elements for essentially every tracked object come from one place — the United States Space Force&apos;s
              catalogue — and reach the public through a small number of redistributors. Reaching them automatically requires
              either credentials whose terms constrain what may be done with the data, or a host that permits it. AsteriaStar has
              neither: it holds no Space-Track account, and the redistributor it evaluated refused automated connections outright.
            </p>
            <p>
              The alternative would be to read the data out of somebody else&apos;s tracking website. That is not something this
              platform does — it is unreliable, it puts a layer of another site&apos;s arithmetic between this one and the source,
              and it takes data through a channel its publisher did not intend.
            </p>
            <p>
              So the honest position is this one: no constellation is tracked, every one is documented, and the difference between
              those two things is stated rather than blurred. If a licence-clear source of orbital elements becomes available, the
              runtime that already tracks the station will take it without redesign — the machinery is not the obstacle.
            </p>
          </div>
        </section>

        <section aria-labelledby="instead-heading" className="space-y-3">
          <h2 id="instead-heading" className="font-display text-2xl font-bold">What is here instead</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <li className="scientific-card p-5">
              <Link href={ROUTES.satellites} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">Satellite encyclopedia →</Link>
              <p className="mt-1 text-sm text-muted">{engine.satellites.count} catalogued satellites with their operators, orbits, instruments and missions.</p>
            </li>
            <li className="scientific-card p-5">
              <Link href={satelliteLivePath("iss")} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">The ISS, live →</Link>
              <p className="mt-1 text-sm text-muted">The one spacecraft whose trajectory is published by its operator and tracked here.</p>
            </li>
            <li className="scientific-card p-5">
              <Link href={satelliteLivePath("live")} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">Live data status →</Link>
              <p className="mt-1 text-sm text-muted">The full account of which orbital providers are connected and which are not.</p>
            </li>
          </ul>
          <CoverageNote />
        </section>

        <SourceList keys={["nasa", "celestrak"]} title="Sources & references" />
      </Container>
    </>
  );
}
