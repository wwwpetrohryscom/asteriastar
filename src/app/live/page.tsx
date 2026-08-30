import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { LiveCards } from "@/components/live/LiveCards";
import { LiveStatusPanel } from "@/components/live/LiveStatusPanel";
import { DashboardStat, DashboardTile, LiveDashboardNav, LIVE_DASHBOARD_PAGES, LocationNote } from "@/components/live/dashboard/DashboardUI";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, liveDashboardPath, liveDiscoveryPath } from "@/lib/routes";
import { BT_DISCOVERIES } from "@/app/live/discovery";
import { currentSolarWind, latestObservedKp, reage as reageWeather, spaceWeatherSnapshot } from "@/platform/space-weather/service";
import { explainKp } from "@/platform/space-weather/explain";
import { neoSnapshot, neoTotals, reage as reageNeo } from "@/platform/neo/service";
import { issEphemeris, issNow, reage as reageSat } from "@/platform/satellites/service";
import { offlineEvents } from "@/platform/events/service";

/**
 * Live now — the dashboard, and the platform behind it.
 *
 * This page used to be a catalogue of providers and nothing else, which answered "who do you get
 * data from" while never answering "what does it say". It now answers the second question first,
 * with the current value from each connected domain, and keeps the catalogue below — because the
 * two belong together and a reader who wants to know how much to trust a number should be one
 * scroll away from the licence and the failure record.
 *
 * Every value on this page is the same for every reader on Earth. The one surface that needs a
 * location is Tonight, and it never sends one anywhere.
 */

const DESCRIPTION =
  "What AsteriaStar's connected scientific providers are reporting at this moment: the solar wind and geomagnetic index from NOAA, near-Earth-object counts from JPL and the Minor Planet Center, the Space Station's position from NASA, and the astronomical events of the week — each with the provider's own timestamp, and each linked to the provider record that states its licence, limitations and failure history.";

export const metadata: Metadata = buildMetadata({ title: "Live Now", description: DESCRIPTION, path: ROUTES.live });

export const revalidate = 900;

export default async function LiveHubPage() {
  const e = engine.liveScientificData;
  const report = e.statusReport();
  const now = new Date();
  const nowIso = now.toISOString();
  const nowMs = now.getTime();

  const [weatherRaw, neoRaw, issRaw] = await Promise.all([spaceWeatherSnapshot(), neoSnapshot(), issEphemeris()]);
  const weather = reageWeather(weatherRaw, nowIso);
  const neo = reageNeo(neoRaw, nowIso);
  const { ephemeris } = reageSat({ ephemeris: issRaw }, nowIso);

  const wind = currentSolarWind(weather);
  const kp = latestObservedKp(weather.kpObserved);
  const totals = neoTotals(neo);
  const iss = issNow(ephemeris, nowMs);
  const weekEvents = offlineEvents(nowMs, nowMs + 7 * 86_400_000);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live", url: ROUTES.live },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Live Now", description: DESCRIPTION, url: ROUTES.live })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>{report.connected} of {e.count} providers connected</span>}
        title="Live now"
        lead="The Sun does not wait, and neither do the asteroids. This is what the instruments say at this moment — with the time each agency measured it, and never a value invented to fill a gap."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <LiveDashboardNav current="home" />
        <LocationNote />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <DashboardTile title="Space weather" envelope={weather.kpObserved} href={liveDashboardPath("space-weather")} hrefLabel="Space weather now">
            <DashboardStat label="Solar wind" value={wind.speed ? Math.round(wind.speed.value) : undefined} unit="km/s"
              unavailable={weather.solarWindSpeed.error ?? "NOAA published no recent value."} />
            <DashboardStat label="Planetary Kp" value={kp ? kp.value.toFixed(1) : undefined}
              detail={kp ? explainKp(kp.value).label : undefined}
              unavailable={weather.kpObserved.error ?? "NOAA published no recent value."} />
            <DashboardStat label="IMF Bz" value={wind.bz ? wind.bz.value.toFixed(1) : undefined} unit="nT"
              unavailable={weather.solarWindField.error ?? "NOAA published no recent value."} />
          </DashboardTile>

          <DashboardTile title="Near-Earth objects" envelope={neo.closeApproaches} href={liveDashboardPath("neo")} hrefLabel="Near-Earth objects now">
            <DashboardStat label="Approaches, 60 days" value={totals.approaches}
              unavailable={neo.closeApproaches.error ?? "JPL could not be reached."} />
            <DashboardStat label="Inside one lunar distance" value={totals.withinOneLunarDistance}
              unavailable={neo.closeApproaches.error ?? "JPL could not be reached."} />
            <DashboardStat label="Above Torino 0" value={totals.torinoAboveZero}
              detail="Torino 0 means no consequence."
              unavailable={neo.sentry.error ?? "JPL could not be reached."} />
          </DashboardTile>

          <DashboardTile title="The Space Station" envelope={ephemeris} href={liveDashboardPath("satellites")} hrefLabel="Satellites now">
            <DashboardStat label="Latitude" value={iss ? `${iss.state.geodetic.latitudeDeg.toFixed(1)}°` : undefined}
              unavailable={ephemeris.error ?? "NASA's ephemeris could not be read."} />
            <DashboardStat label="Longitude" value={iss ? `${iss.state.geodetic.longitudeDeg.toFixed(1)}°` : undefined}
              unavailable={ephemeris.error ?? "NASA's ephemeris could not be read."} />
            <DashboardStat label="Altitude" value={iss ? iss.state.geodetic.altitudeKm.toFixed(0) : undefined} unit="km"
              unavailable={ephemeris.error ?? undefined} />
          </DashboardTile>

          <DashboardTile title="Events this week" href={liveDashboardPath("events")} hrefLabel="Events this week">
            <DashboardStat label="Dated events" value={weekEvents.length}
              detail="Computed instants and annual forecasts, which need no network at all." />
            <DashboardStat label="Next one" value={weekEvents[0] ? weekEvents[0].title : undefined}
              detail={weekEvents[0] ? new Date(weekEvents[0].start).toUTCString().slice(0, 22) + " UTC" : undefined}
              unavailable="Nothing dated in the next seven days." />
          </DashboardTile>
        </div>

        <section aria-labelledby="tonight-heading" className="rounded-2xl border border-nasa/40 bg-nasa/10 p-5">
          <h2 id="tonight-heading" className="font-display text-xl font-bold text-fg">Make it personal</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Everything above is true everywhere. What is worth going outside for depends on where you
            are, and{" "}
            <Link href={liveDashboardPath("tonight")} className="text-nasa underline-offset-4 hover:underline">Tonight</Link>{" "}
            works that out from coordinates you type — twilight and darkness, the Moon and its
            interference, the planets worth pointing at, and visible Space Station passes. The whole
            calculation runs in your own browser, so your location never reaches this site.
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {LIVE_DASHBOARD_PAGES.map((p) => (
              <li key={p.slug} className="text-sm">
                <Link href={liveDashboardPath(p.slug)} className="font-medium text-fg underline-offset-4 hover:text-nasa hover:underline">{p.title}</Link>
                <span className="text-muted"> — {p.blurb}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="status-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="status-heading" className="font-display text-2xl font-bold">Provider status</h2>
            <Link href={`${ROUTES.live}/data-status`} className="text-sm text-nasa hover:underline">Full data-status →</Link>
          </div>
          <div className="mt-4"><LiveStatusPanel report={report} /></div>
        </section>

        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">By category</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BT_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={liveDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} providers</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="providers-heading">
          <h2 id="providers-heading" className="font-display text-2xl font-bold">The providers</h2>
          <div className="mt-4"><LiveCards records={e.all()} /></div>
        </section>

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Each provider is a first-class knowledge-graph entity resolved through the Scientific Data
            Engine, reusing the operating organisation and the space-weather phenomena already in the
            graph, and taking its status from the live-provider registry rather than from a hand-typed
            field. {report.connected} of {e.count} are connected end-to-end and serve real values with
            the provider&apos;s own timestamps; the rest show no values at all and record why, because a
            status with no reason behind it is an aspiration. Nothing is fabricated, and a provider
            that cannot be reached is reported as unreachable rather than substituted. See{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
