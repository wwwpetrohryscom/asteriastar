import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, liveDashboardPath } from "@/lib/routes";
import { DashboardProvenance, DashboardStat, DashboardTile, LiveDashboardNav, LocationNote } from "@/components/live/dashboard/DashboardUI";
import { issEphemeris, issNow, reage } from "@/platform/satellites/service";

/**
 * Where the Space Station is, at this moment.
 *
 * One satellite, because one satellite has an authoritative, freely-usable operational ephemeris
 * published by its own operator. The sub-satellite point below is not a measurement — it is NASA's
 * own predicted trajectory, interpolated to now — and the page says so rather than letting a moving
 * number imply a live radar track.
 */

const DESCRIPTION =
  "The International Space Station's position at this moment, computed from NASA's own published operational trajectory: latitude, longitude, altitude, speed, and how much of the published ephemeris is still ahead.";

export const metadata: Metadata = buildMetadata({
  title: "Satellites Now",
  description: DESCRIPTION,
  path: liveDashboardPath("satellites"),
  keywords: ["where is the iss now", "space station position now", "iss altitude speed"],
});

export const revalidate = 300;

export default async function LiveSatellitesPage() {
  const nowIso = new Date().toISOString();
  const nowMs = Date.parse(nowIso);
  const { ephemeris } = reage({ ephemeris: await issEphemeris() }, nowIso);
  const state = issNow(ephemeris, nowMs);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live", url: ROUTES.live },
    { name: "Satellites now", url: liveDashboardPath("satellites") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Satellites Now", description: DESCRIPTION, url: liveDashboardPath("satellites") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Live · NASA Johnson Space Center</span>} title="Satellites now"
        lead="The Space Station's position this second, from the trajectory file its own flight controllers publish." />
      <Container className="mt-8 mb-14 space-y-8">
        <LiveDashboardNav current="satellites" />
        <LocationNote />

        <DashboardTile title="The Space Station" envelope={ephemeris} href="/satellites/iss" hrefLabel="The full satellite section">
          <DashboardStat
            label="Latitude" value={state ? `${state.state.geodetic.latitudeDeg.toFixed(2)}°` : undefined}
            unavailable={ephemeris.error ?? "NASA's ephemeris could not be read."}
          />
          <DashboardStat
            label="Longitude" value={state ? `${state.state.geodetic.longitudeDeg.toFixed(2)}°` : undefined}
            unavailable={ephemeris.error ?? "NASA's ephemeris could not be read."}
          />
          <DashboardStat
            label="Altitude" value={state ? state.state.geodetic.altitudeKm.toFixed(0) : undefined} unit="km"
            detail="Above the WGS-84 ellipsoid, not above the ground beneath it."
            unavailable={ephemeris.error ?? undefined}
          />
          <DashboardStat
            label="Speed" value={state ? state.state.speedKmS.toFixed(3) : undefined} unit="km/s"
            detail="In the inertial frame."
            unavailable={ephemeris.error ?? undefined}
          />
          <DashboardStat
            label="Orbital period" value={state?.periodMinutes ? state.periodMinutes.toFixed(2) : undefined} unit="min"
            detail="The nodal period, measured from the file rather than assumed from a textbook formula."
            unavailable="Not derivable from this file."
          />
          <DashboardStat
            label="Trajectory remaining" value={state ? state.coverageHours.toFixed(0) : undefined} unit="h"
            detail="The published file ends, and nothing is offered past it — the station manoeuvres."
            unavailable={ephemeris.error ?? undefined}
          />
        </DashboardTile>

        <section aria-labelledby="honest-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="honest-heading" className="font-display text-lg font-bold text-fg">One satellite, and why</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            This is a <strong className="text-fg">predicted</strong> trajectory interpolated to this
            instant, not a measurement: NASA&apos;s flight operations directorate publishes the station&apos;s
            operational ephemeris as state vectors at four-minute spacing, and the position above sits
            between two of them. No other satellite is tracked here, because no other satellite has a
            source of orbital elements this platform can obtain reliably and use within its licence —
            and inventing pass times for one would be worse than saying so.
          </p>
        </section>

        <DashboardProvenance envelopes={[ephemeris]} />
      </Container>
    </>
  );
}
