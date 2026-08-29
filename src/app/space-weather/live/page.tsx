import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceWeatherPath } from "@/lib/routes";
import { SectionNav, HonestyNote } from "@/components/space-weather/SectionNav";
import { LiveValue, EnvelopeDetails, DataUnavailable } from "@/components/space-weather/LiveStatus";
import { AlertPanel, ScalePanel, XrayFlarePanel, AuroraPanel } from "@/components/space-weather/Panels";
import { KpChart } from "@/components/space-weather/KpChart";
import {
  spaceWeatherSnapshot, currentSolarWind, latestObservedKp, currentScales, forecastScales,
  activeAlerts, recentAlerts, peakForecastKp, reage,
} from "@/platform/space-weather/service";
import { explainBz, explainKp, explainSolarWindSpeed } from "@/platform/space-weather/explain";

/**
 * Current space-weather conditions — the section's console.
 *
 * Everything here is a real measurement with the provider's own timestamp beside it. Each panel
 * owns its own failure: a provider that cannot be reached collapses one card into an explicit
 * "unavailable" and leaves the rest of the page working.
 */

const DESCRIPTION =
  "Current space weather, measured: solar wind speed and interplanetary magnetic field from NOAA's real-time monitor at L1, the observed and forecast planetary K-index, the NOAA R, S and G scales, active watches and warnings, the GOES X-ray flare state, and the OVATION aurora forecast. Each value carries the time it was taken and the file it came from.";

export const metadata: Metadata = buildMetadata({
  title: "Current Space Weather Conditions",
  description: DESCRIPTION,
  path: spaceWeatherPath("live"),
  keywords: ["current space weather", "solar wind now", "Kp index now", "geomagnetic storm", "aurora forecast", "NOAA SWPC live"],
});

/**
 * Sixty seconds. The fastest product on this page publishes once a minute, so revalidating faster
 * could not surface a value any sooner — it would only cost NOAA requests that return the same
 * bytes. The freshness badges re-evaluate in the browser, so a page served from this cache still
 * reports its own age honestly.
 */
export const revalidate = 60;

export default async function LiveSpaceWeatherPage() {
  const nowIso = new Date().toISOString();
  const raw = await spaceWeatherSnapshot();
  const s = reage(raw, nowIso);

  const wind = currentSolarWind(s);
  const kp = latestObservedKp(s.kpObserved);
  const peak = peakForecastKp(s.kpForecast, nowIso);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Weather", url: ROUTES.spaceWeather },
    { name: "Current conditions", url: spaceWeatherPath("live") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Current Space Weather Conditions", description: DESCRIPTION, url: spaceWeatherPath("live") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Live · NOAA SWPC &amp; NASA DONKI</span>}
        title="Current conditions"
        lead="What the Sun and the near-Earth environment are doing right now, from the agencies that measure them. Every reading below shows when it was taken."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SectionNav current="live" />

        <section aria-labelledby="wind-heading" className="space-y-4">
          <h2 id="wind-heading" className="font-display text-2xl font-bold">Solar wind at L1</h2>
          {!wind.speed && !wind.bz && !wind.density ? (
            <DataUnavailable envelope={s.solarWindSpeed} what="Solar wind conditions" />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {wind.speed && <li><LiveValue datum={wind.speed} label="Speed" envelope={s.solarWindSpeed} interpretation={explainSolarWindSpeed(wind.speed.value)} precision={0} /></li>}
              {wind.density && <li><LiveValue datum={wind.density} label="Proton density" envelope={s.solarWindSeries} precision={2} /></li>}
              {wind.bt && <li><LiveValue datum={wind.bt} label="Field strength (Bt)" envelope={s.solarWindField} precision={1} /></li>}
              {wind.bz && <li><LiveValue datum={wind.bz} label="North–south field (Bz)" envelope={s.solarWindField} interpretation={explainBz(wind.bz.value)} precision={1} /></li>}
            </ul>
          )}
          <p className="text-xs leading-relaxed text-faint">
            These are measured about 1.5 million kilometres sunward of Earth, at the L1 Lagrange point. At the speeds shown, that
            is roughly half an hour to an hour of travel time before the same plasma reaches us.
          </p>
        </section>

        <section aria-labelledby="geo-heading" className="space-y-4">
          <h2 id="geo-heading" className="font-display text-2xl font-bold">Geomagnetic activity</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {kp ? <LiveValue datum={kp} label="Planetary K-index (latest observed)" envelope={s.kpObserved} interpretation={explainKp(kp.value)} precision={2} /> : <DataUnavailable envelope={s.kpObserved} what="The planetary K-index" />}
            <div className="scientific-card p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Highest forecast Kp</h3>
              {peak ? (
                <>
                  <p className="mt-3 font-display text-3xl font-bold text-fg">{peak.kp.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-muted">{explainKp(peak.kp).label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    NOAA&apos;s highest predicted three-hour Kp in the forecast window, for the interval beginning{" "}
                    {peak.at.slice(0, 10)} {peak.at.slice(11, 16)} UTC. This is a forecast, not a measurement.
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">No future Kp interval is forecast in the window NOAA currently publishes.</p>
              )}
            </div>
          </div>
          {s.kpForecast.data && s.kpForecast.data.length > 0 && (
            <div className="scientific-card p-5">
              <h3 className="font-display text-base font-semibold text-fg">Kp: observed, estimated and predicted</h3>
              <p className="mt-1 mb-3 text-sm text-muted">
                Solid bars are observed intervals; dashed outlines are the interval in progress; hatched bars are NOAA&apos;s forecast.
              </p>
              <KpChart points={s.kpForecast.data} title="Planetary K-index" describedBy="kp-live-desc" />
            </div>
          )}
        </section>

        <ScalePanel envelope={s.scales} current={currentScales(s.scales)} forecast={forecastScales(s.scales)} />
        <AlertPanel envelope={s.alerts} active={activeAlerts(s.alerts, nowIso)} recent={recentAlerts(s.alerts, 12)} />
        <XrayFlarePanel envelope={s.xrayFlare} />
        <AuroraPanel envelope={s.aurora} />

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <HonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.solarWindSpeed} title="Solar wind speed" />
            <EnvelopeDetails envelope={s.kpObserved} title="Planetary K-index" />
            <EnvelopeDetails envelope={s.scales} title="NOAA scales" />
            <EnvelopeDetails envelope={s.aurora} title="Aurora forecast" />
          </div>
        </section>

        <SourceList keys={["swpc", "donki"]} title="Sources & references" />
      </Container>
    </>
  );
}
