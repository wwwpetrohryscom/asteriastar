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
import { LiveValue, EnvelopeDetails, DataUnavailable, StaleNotice } from "@/components/space-weather/LiveStatus";
import { SolarWindChart } from "@/components/space-weather/SolarWindChart";
import { solarWindSnapshot, currentSolarWind, reage } from "@/platform/space-weather/service";
import { explainBz, explainSolarWindSpeed } from "@/platform/space-weather/explain";

const DESCRIPTION =
  "The solar wind measured in real time at the L1 Lagrange point: bulk speed, proton density, and the strength and north–south component of the interplanetary magnetic field, with the last hour plotted from NOAA's propagated solar-wind product. Every value carries its observation time and is labelled as an observation or as model output.";

export const metadata: Metadata = buildMetadata({
  title: "Solar Wind — Live Measurements at L1",
  description: DESCRIPTION,
  path: spaceWeatherPath("solar-wind"),
  keywords: ["solar wind speed", "interplanetary magnetic field", "Bz GSM", "proton density", "L1 solar wind", "DSCOVR", "NOAA SWPC"],
});

/** One minute — the publication cadence of the underlying real-time monitor. */
export const revalidate = 60;

export default async function SolarWindPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await solarWindSnapshot(), nowIso);
  const wind = currentSolarWind(s);
  const series = s.solarWindSeries.data ?? [];

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Weather", url: ROUTES.spaceWeather },
    { name: "Solar wind", url: spaceWeatherPath("solar-wind") },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({ name: "Solar Wind — Live Measurements at L1", description: DESCRIPTION, url: spaceWeatherPath("solar-wind") }),
          datasetSchema({
            name: "Real-time solar wind at L1 (NOAA SWPC)",
            description: "Bulk proton speed, proton density and the interplanetary magnetic field measured by NOAA's real-time solar wind monitor at the L1 Lagrange point, together with the propagated-to-bow-shock model product.",
            url: spaceWeatherPath("solar-wind"),
            creatorName: "NOAA Space Weather Prediction Center",
            creatorUrl: "https://www.swpc.noaa.gov",
            license: "https://www.usa.gov/government-works",
            variables: ["solar wind speed", "proton density", "interplanetary magnetic field Bt", "interplanetary magnetic field Bz GSM"],
            repeatFrequency: "PT1M",
            distributionUrl: "https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind-1-hour.json",
          }),
        ]}
      />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Live · NOAA SWPC</span>}
        title="Solar wind"
        lead="A continuous supersonic stream of plasma from the Sun's corona, carrying the Sun's magnetic field past Earth. Measured a million and a half kilometres upstream, which is the only reason there is any warning at all."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SectionNav current="solar-wind" />

        <section aria-labelledby="now-heading" className="space-y-4">
          <h2 id="now-heading" className="font-display text-2xl font-bold">Measured now</h2>
          <StaleNotice envelope={s.solarWindSpeed} />
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
        </section>

        <section aria-labelledby="hour-heading" className="space-y-4">
          <h2 id="hour-heading" className="font-display text-2xl font-bold">The last hour</h2>
          {series.length === 0 ? (
            <DataUnavailable envelope={s.solarWindSeries} what="The propagated solar-wind series" />
          ) : (
            <div className="scientific-card p-5">
              <SolarWindChart points={series} describedBy="wind-series-desc" />
              <p className="mt-4 text-xs leading-relaxed text-faint">
                From NOAA&apos;s propagated solar-wind product: L1 observations advected to Earth&apos;s bow shock nose. Each row
                carries both its observation time at L1 and the modelled time the same plasma reaches Earth, and the table shows
                both. This is a model product, not a measurement made at Earth.
              </p>
            </div>
          )}
        </section>

        <section aria-labelledby="reading-heading" className="space-y-3">
          <h2 id="reading-heading" className="font-display text-2xl font-bold">How to read these numbers</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              <strong className="text-fg">Speed</strong> sets how hard the wind presses on the magnetosphere and how quickly a
              disturbance arrives. The ambient slow wind runs at 300–400 km/s; a coronal-hole stream is typically 500–800 km/s.
            </p>
            <p>
              <strong className="text-fg">Density</strong> multiplies with the square of speed to give the dynamic pressure, which
              is what compresses the magnetosphere. A dense, slow stream and a thin, fast one can push equally hard.
            </p>
            <p>
              <strong className="text-fg">Bz</strong> is the one to watch. It is the north–south component of the interplanetary
              magnetic field in geocentric solar magnetospheric coordinates. When it is negative — southward — it opposes
              Earth&apos;s field where the two meet on the dayside, they reconnect, and solar-wind energy enters the system. A
              900 km/s stream with a firmly northward field does far less than a 450 km/s stream with a sustained southward one.
            </p>
            <p>
              <strong className="text-fg">Bt</strong> is the total field strength. A strong field with no southward component is
              not, by itself, a geomagnetic event.
            </p>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <HonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.solarWindSpeed} title="Speed" />
            <EnvelopeDetails envelope={s.solarWindField} title="Magnetic field" />
            <EnvelopeDetails envelope={s.solarWindSeries} title="Propagated series" />
          </div>
        </section>

        <SourceList keys={["swpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
