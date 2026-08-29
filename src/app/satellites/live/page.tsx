import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, satelliteLivePath } from "@/lib/routes";
import { SatelliteNav, SATELLITE_LIVE_PAGES, SatellitePanel, SatelliteStat, CoverageNote } from "@/components/satellites/SatelliteUI";
import { EnvelopeDetails, ProviderStateBadge, utcStamp } from "@/components/space-weather/LiveStatus";
import { issEphemeris, issNow, satelliteProviderReports, reage } from "@/platform/satellites/service";
import { getProvider } from "@/platform/live-sky";
import { engine } from "@/platform/data-engine";

/**
 * The live satellite hub.
 *
 * Its most useful content is the negative kind: exactly which orbital data is connected, which is
 * not, and the specific reason in each case. A section that tracked one satellite while implying it
 * tracked thousands would be the failure here.
 */

const DESCRIPTION =
  "What orbital data AsteriaStar actually has live, and what it does not. The International Space Station is tracked from NASA's own published operational ephemeris; general catalogues of orbital elements for other satellites are either behind credentials whose terms do not permit this use, or served by hosts that refuse automated access — so they are honestly absent rather than approximately present.";

export const metadata: Metadata = buildMetadata({
  title: "Live Satellite Data",
  description: DESCRIPTION,
  path: satelliteLivePath("live"),
  keywords: ["live satellite tracking", "ISS tracking data", "orbital elements", "satellite ephemeris", "TLE"],
});

export const revalidate = 300;

export default async function SatellitesLivePage() {
  const nowIso = new Date().toISOString();
  const nowMs = Date.parse(nowIso);
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, nowIso);
  const now = issNow(ephemeris, nowMs);
  const reports = satelliteProviderReports();
  const celestrak = getProvider("celestrak");

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: "Live status", url: satelliteLivePath("live") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Live Satellite Data", description: DESCRIPTION, url: satelliteLivePath("live") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Live · NASA Johnson Space Center</span>}
        title="Live satellite data"
        lead="One satellite is tracked here in real time, and that is the honest result of checking what is actually available rather than a first step towards more."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SatelliteNav current="live" />

        <SatellitePanel envelope={ephemeris} title="The station right now" what="The NASA ISS ephemeris" id="iss-heading">
          {now ? (
            <>
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <SatelliteStat value={`${Math.abs(now.state.geodetic.latitudeDeg).toFixed(1)}° ${now.state.geodetic.latitudeDeg >= 0 ? "N" : "S"}`} label="Latitude" />
                <SatelliteStat value={`${Math.abs(now.state.geodetic.longitudeDeg).toFixed(1)}° ${now.state.geodetic.longitudeDeg >= 0 ? "E" : "W"}`} label="Longitude" />
                <SatelliteStat value={now.state.geodetic.altitudeKm.toFixed(0)} unit="km" label="Altitude" />
                <SatelliteStat value={now.periodMinutes?.toFixed(1) ?? "—"} unit="min" label="Orbital period" sub="measured from the ephemeris" />
              </ul>
              <p className="text-sm text-muted">
                <Link href={satelliteLivePath("iss")} className="text-nasa underline-offset-4 hover:underline">Full position, ground track and verification →</Link>
                {" · "}
                <Link href={satelliteLivePath("passes")} className="text-nasa underline-offset-4 hover:underline">When it crosses your sky →</Link>
              </p>
            </>
          ) : (
            <p className="rounded-lg border border-nasa/40 bg-nasa/[0.08] px-4 py-3 text-sm text-muted">
              The published ephemeris does not cover the present moment, so no position is shown. Nothing is extrapolated past the
              end of NASA&apos;s file.
            </p>
          )}
        </SatellitePanel>

        <section aria-labelledby="sections-heading">
          <h2 id="sections-heading" className="font-display text-2xl font-bold">The section</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SATELLITE_LIVE_PAGES.filter((p) => p.slug !== "live").map((p) => (
              <li key={p.slug} className="scientific-card flex flex-col p-5">
                <Link href={satelliteLivePath(p.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{p.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{p.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="providers-heading" className="space-y-4">
          <h2 id="providers-heading" className="font-display text-2xl font-bold">Providers</h2>
          <ul className="space-y-4">
            {reports.map((r) => (
              <li key={r.descriptor.providerKey} className="scientific-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-fg">{r.descriptor.name}</h3>
                  <ProviderStateBadge state={r.state} />
                </div>
                <p className="mt-1 text-xs text-faint">{r.descriptor.organization}</p>
                <p className="mt-2 text-sm text-muted">{r.descriptor.license}</p>
                <p className="mt-2 text-xs leading-relaxed text-faint">{r.descriptor.rateLimits}</p>
                {r.descriptor.providerCaveat && <p className="mt-2 text-xs leading-relaxed text-faint">{r.descriptor.providerCaveat}</p>}
                {r.descriptor.note && <p className="mt-2 text-xs leading-relaxed text-faint">{r.descriptor.note}</p>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="absent-heading" className="space-y-4">
          <h2 id="absent-heading" className="font-display text-2xl font-bold">What is not connected, and why</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              <strong className="text-fg">General catalogues of orbital elements.</strong> Tracking an arbitrary satellite needs
              two-line element sets for it. The public catalogue is distributed by a small number of hosts, and at the time this
              was built the one AsteriaStar evaluated — {celestrak?.name ?? "CelesTrak"} — refused automated connections outright
              after a handful of requests. That is its operator&apos;s prerogative and their terms are theirs to set; what it
              means here is that an integration could not be established, let alone verified, so none is claimed.
            </p>
            <p>
              <strong className="text-fg">Space-Track.</strong> The United States Space Force&apos;s catalogue requires an account
              and its terms govern redistribution. AsteriaStar holds no credentials for it, and building a public feature on
              credentials the platform does not have would be architecture pretending to be capability.
            </p>
            <p>
              <strong className="text-fg">Scraping a tracking website.</strong> Not done, and not planned. Reading somebody
              else&apos;s rendered page to extract data they publish deliberately through other channels is neither reliable nor
              respectful, and it would put a layer of somebody else&apos;s arithmetic between this platform and the truth.
            </p>
            <p>
              The consequence is a section that does one thing properly. The station is tracked from the operator&apos;s own
              trajectory file, the coordinate transformation is verified against the operator&apos;s own numbers, and the pass
              predictions run on the reader&apos;s device. Everything else in the satellite encyclopedia — its{" "}
              {engine.satellites.count} catalogued satellites, their operators, orbits and constellations — remains reference
              material, which is what it has always honestly been.
            </p>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <CoverageNote />
          <EnvelopeDetails envelope={ephemeris} title="ISS operational ephemeris" />
          {ephemeris.data && (
            <p className="text-xs text-faint">
              File generated by {ephemeris.data.originator ?? "the provider"}
              {ephemeris.data.creationTime ? ` at ${utcStamp(ephemeris.data.creationTime)}` : ""}, covering{" "}
              {utcStamp(new Date(ephemeris.data.startMs).toISOString())} to {utcStamp(new Date(ephemeris.data.stopMs).toISOString())} in{" "}
              {ephemeris.data.states.length.toLocaleString("en-GB")} state vectors.
            </p>
          )}
        </section>

        <SourceList keys={["nasa", "celestrak"]} title="Sources & references" />
      </Container>
    </>
  );
}
