import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, datasetSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceWeatherPath } from "@/lib/routes";
import { SectionNav, HonestyNote } from "@/components/space-weather/SectionNav";
import { LiveValue, EnvelopeDetails, DataUnavailable } from "@/components/space-weather/LiveStatus";
import { AlertPanel, ScalePanel } from "@/components/space-weather/Panels";
import { KpChart } from "@/components/space-weather/KpChart";
import { geomagneticSnapshot, latestObservedKp, peakForecastKp, currentScales, forecastScales, activeAlerts, recentAlerts, reage } from "@/platform/space-weather/service";
import { explainKp } from "@/platform/space-weather/explain";

const DESCRIPTION =
  "Geomagnetic activity from NOAA's Space Weather Prediction Center: the observed planetary K-index over the last week, NOAA's three-hourly Kp forecast, the G-scale storm level, and every watch, warning and alert currently inside its own validity window. Observed, estimated and predicted values are kept distinct throughout.";

export const metadata: Metadata = buildMetadata({
  title: "Geomagnetic Activity — Kp Index, Storms & Alerts",
  description: DESCRIPTION,
  path: spaceWeatherPath("geomagnetic"),
  keywords: ["Kp index", "planetary K-index", "geomagnetic storm", "G-scale", "geomagnetic forecast", "space weather alerts", "NOAA SWPC"],
});

/** Five minutes. Kp is defined over three-hour intervals, so this is two orders of magnitude finer
 *  than the quantity's own resolution; polling faster would return identical bytes. */
export const revalidate = 300;

export default async function GeomagneticPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await geomagneticSnapshot(), nowIso);
  const kp = latestObservedKp(s.kpObserved);
  const peak = peakForecastKp(s.kpForecast, nowIso);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Weather", url: ROUTES.spaceWeather },
    { name: "Geomagnetic activity", url: spaceWeatherPath("geomagnetic") },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({ name: "Geomagnetic Activity", description: DESCRIPTION, url: spaceWeatherPath("geomagnetic") }),
          datasetSchema({
            name: "Planetary K-index, observed and forecast (NOAA SWPC)",
            description: "The three-hourly planetary K-index as observed, estimated and predicted by NOAA's Space Weather Prediction Center, with the corresponding NOAA G-scale storm levels.",
            url: spaceWeatherPath("geomagnetic"),
            creatorName: "NOAA Space Weather Prediction Center",
            creatorUrl: "https://www.swpc.noaa.gov",
            license: "https://www.usa.gov/government-works",
            variables: ["planetary K-index", "NOAA G-scale geomagnetic storm level"],
            repeatFrequency: "PT3H",
            distributionUrl: "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json",
          }),
        ]}
      />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Live · NOAA SWPC</span>}
        title="Geomagnetic activity"
        lead="How disturbed Earth's magnetic field is, measured by a worldwide network of magnetometers and summarised three hours at a time."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SectionNav current="geomagnetic" />

        <section aria-labelledby="kp-heading" className="space-y-4">
          <h2 id="kp-heading" className="font-display text-2xl font-bold">The planetary K-index</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {kp ? <LiveValue datum={kp} label="Latest observed" envelope={s.kpObserved} interpretation={explainKp(kp.value)} precision={2} /> : <DataUnavailable envelope={s.kpObserved} what="The observed planetary K-index" />}
            <div className="scientific-card p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Highest forecast Kp</h3>
              {peak ? (
                <>
                  <p className="mt-3 font-display text-3xl font-bold text-fg">{peak.kp.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-muted">{explainKp(peak.kp).label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    For the three-hour interval beginning {peak.at.slice(0, 10)} {peak.at.slice(11, 16)} UTC. A forecast, issued by
                    NOAA — not a measurement.
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">No future interval is forecast in the window NOAA currently publishes.</p>
              )}
            </div>
          </div>

          {s.kpForecast.data && s.kpForecast.data.length > 0 && (
            <div className="scientific-card p-5">
              <h3 className="font-display text-base font-semibold text-fg">Observed, estimated and predicted</h3>
              <p className="mt-1 mb-3 text-sm text-muted">
                NOAA publishes all three in one series and marks each row. AsteriaStar keeps that marking on every bar it draws:
                solid is observed, dashed outline is the interval currently in progress, hatched is forecast.
              </p>
              <KpChart points={s.kpForecast.data} title="Planetary K-index (observed and forecast)" describedBy="kp-forecast-desc" />
            </div>
          )}

          {s.kpObserved.data && s.kpObserved.data.length > 0 && (
            <div className="scientific-card p-5">
              <h3 className="font-display text-base font-semibold text-fg">The last week, observed only</h3>
              <p className="mt-1 mb-3 text-sm text-muted">NOAA&apos;s definitive observed series — no forecast values at all.</p>
              <KpChart points={s.kpObserved.data} title="Planetary K-index (observed)" describedBy="kp-observed-desc" />
            </div>
          )}
        </section>

        <ScalePanel envelope={s.scales} current={currentScales(s.scales)} forecast={forecastScales(s.scales)} />
        <AlertPanel envelope={s.alerts} active={activeAlerts(s.alerts, nowIso)} recent={recentAlerts(s.alerts, 15)} />

        <section aria-labelledby="reading-heading" className="space-y-3">
          <h2 id="reading-heading" className="font-display text-2xl font-bold">What Kp measures, and what it does not</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              Kp is a quasi-logarithmic index derived from the range of variation seen at a network of mid-latitude magnetometer
              observatories over each three-hour interval, then averaged into a single planetary figure. It runs from 0 to 9 and
              is published in thirds.
            </p>
            <p>
              Because it is planetary and three-hourly, it is a blunt instrument by construction. A sharp local disturbance lasting
              twenty minutes can barely move it, and a quiet Kp does not guarantee a quiet magnetometer anywhere in particular. It
              is a good summary of global conditions and a poor description of any single place.
            </p>
            <p>
              NOAA maps Kp onto the G-scale: Kp 5 is G1, and each further whole step raises the level to G5 at Kp 9. AsteriaStar
              uses NOAA&apos;s own mapping rather than inventing thresholds.
            </p>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <HonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.kpObserved} title="Observed Kp" />
            <EnvelopeDetails envelope={s.kpForecast} title="Kp forecast" />
            <EnvelopeDetails envelope={s.scales} title="NOAA scales" />
            <EnvelopeDetails envelope={s.alerts} title="Alerts" />
          </div>
        </section>

        <SourceList keys={["swpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
