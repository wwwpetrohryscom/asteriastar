import type { Metadata } from "next";
import Link from "next/link";
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
import { AuroraPanel } from "@/components/space-weather/Panels";
import { KpChart } from "@/components/space-weather/KpChart";
import { auroraSnapshot, latestObservedKp, peakForecastKp, reage } from "@/platform/space-weather/service";
import { explainKp } from "@/platform/space-weather/explain";
import { aurora as auroraReference } from "@/platform/live-sky/aurora";

const DESCRIPTION =
  "The aurora forecast from NOAA's OVATION model, reduced to what it can honestly say: how far towards the equator the auroral oval reaches in each hemisphere, and the strongest probability along it. Paired with the observed and forecast planetary K-index. No city-level visibility is claimed, because cloud and light pollution are not in this dataset.";

export const metadata: Metadata = buildMetadata({
  title: "Aurora Forecast",
  description: DESCRIPTION,
  path: spaceWeatherPath("aurora"),
  keywords: ["aurora forecast", "OVATION", "northern lights forecast", "aurora borealis", "aurora australis", "Kp aurora", "NOAA SWPC"],
});

/** Ten minutes: OVATION is regenerated every five minutes for a forecast valid about an hour
 *  ahead, so this is a small fraction of the forecast's own validity window. */
export const revalidate = 600;

export default async function AuroraPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await auroraSnapshot(), nowIso);
  const kp = latestObservedKp(s.kpObserved);
  const peak = peakForecastKp(s.kpForecast, nowIso);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Weather", url: ROUTES.spaceWeather },
    { name: "Aurora", url: spaceWeatherPath("aurora") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Aurora Forecast", description: DESCRIPTION, url: spaceWeatherPath("aurora") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Live · NOAA SWPC OVATION</span>}
        title="Aurora"
        lead="Where the auroral oval reaches, according to NOAA's model — and, just as importantly, what that does and does not tell you about whether you will see anything."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SectionNav current="aurora" />

        <AuroraPanel envelope={s.aurora} />

        <section aria-labelledby="kp-heading" className="space-y-4">
          <h2 id="kp-heading" className="font-display text-2xl font-bold">The index behind the oval</h2>
          <p className="text-sm leading-relaxed text-muted">
            The auroral oval widens and pushes equatorward as geomagnetic activity rises, which is why the planetary K-index is the
            number aurora watchers follow. It is a three-hourly planetary average, so it describes the global state, not your sky.
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {kp
              ? <LiveValue datum={kp} label="Latest observed Kp" envelope={s.kpObserved} interpretation={explainKp(kp.value)} precision={2} />
              : <DataUnavailable envelope={s.kpObserved} what="The observed planetary K-index" />}
            <div className="scientific-card p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Highest forecast Kp</h3>
              {peak ? (
                <>
                  <p className="mt-3 font-display text-3xl font-bold text-fg">{peak.kp.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-muted">{explainKp(peak.kp).label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    For the interval beginning {peak.at.slice(0, 10)} {peak.at.slice(11, 16)} UTC. A NOAA forecast, not an observation.
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">No future interval is forecast in NOAA&apos;s current window.</p>
              )}
            </div>
          </div>
          {s.kpForecast.data && s.kpForecast.data.length > 0 && (
            <div className="scientific-card p-5">
              <KpChart points={s.kpForecast.data} title="Planetary K-index for aurora watching" describedBy="kp-aurora-desc" />
            </div>
          )}
        </section>

        <section aria-labelledby="physics-heading" className="space-y-3">
          <h2 id="physics-heading" className="font-display text-2xl font-bold">What makes an aurora</h2>
          <p className="text-sm leading-relaxed text-muted">{auroraReference.reference.cause}</p>
          <p className="text-sm leading-relaxed text-muted">
            OVATION estimates the flux of precipitating particles from the solar-wind conditions measured upstream at L1, and turns
            that into a probability of visible aurora on a grid covering both hemispheres. Because it is driven by an upstream
            measurement, it is a genuine forecast — typically about an hour ahead — rather than a nowcast.
          </p>
        </section>

        <section aria-labelledby="limits-heading" className="space-y-3">
          <h2 id="limits-heading" className="font-display text-2xl font-bold">What this page will not tell you</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm leading-relaxed text-muted">
              It will not tell you whether you will see the aurora tonight from where you live. That question needs four things
              this dataset does not contain: whether the sky above you is clear, how dark it is where you are, how much light
              pollution sits on your northern horizon, and whether the Moon is up. Two of those are answerable elsewhere on this
              platform — the{" "}
              <Link href="/live/tonight" className="text-nasa underline-offset-4 hover:underline">Tonight planner</Link>{" "}
              works out the darkness and the Moon for coordinates you type, and will fetch a cloud-cover forecast if you ask it
              to. Light pollution is not connected to anything here, and none of it is guessed at.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              What it does tell you is real and useful: how far the oval currently reaches, how strong the model thinks it is, and
              what the geomagnetic index is doing. If the oval is nowhere near your latitude, the weather does not matter. If it
              is, cloud cover is the next thing to check, and the Tonight planner will fetch it from MET Norway on request —
              from your own browser, so your location never reaches this site.
            </p>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <HonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.aurora} title="OVATION aurora forecast" />
            <EnvelopeDetails envelope={s.kpObserved} title="Observed Kp" />
          </div>
        </section>

        <SourceList keys={["swpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
