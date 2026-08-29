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
import { ActiveRegionPanel, CmeEventPanel, FlareEventPanel, XrayFlarePanel } from "@/components/space-weather/Panels";
import { solarActivitySnapshot, reage } from "@/platform/space-weather/service";
import { explainRadioFlux } from "@/platform/space-weather/explain";
import { NO_VALUE_STATUSES } from "@/platform/live-providers/envelope";

const DESCRIPTION =
  "Solar activity now: the GOES X-ray flare state, NOAA's daily numbered active regions with their sunspot classifications and flare probabilities, the 10.7 cm radio flux, and NASA's catalogued flares and coronal mass ejections. Operational measurements and the analyst-curated research catalogue are kept separate, because they answer different questions.";

export const metadata: Metadata = buildMetadata({
  title: "Solar Activity — Flares, Active Regions & Radio Flux",
  description: DESCRIPTION,
  path: spaceWeatherPath("solar-activity"),
  keywords: ["solar flare", "active region", "sunspot", "F10.7", "solar radio flux", "coronal mass ejection", "GOES X-ray", "NASA DONKI"],
});

/** Five minutes: the X-ray state changes on a one-minute cadence but the daily region report and
 *  the DONKI catalogues do not, and this page is dominated by the slower two. */
export const revalidate = 300;

export default async function SolarActivityPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await solarActivitySnapshot(), nowIso);
  const flux = s.radioFlux.data && !NO_VALUE_STATUSES.has(s.radioFlux.status) ? s.radioFlux.data : undefined;

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Weather", url: ROUTES.spaceWeather },
    { name: "Solar activity", url: spaceWeatherPath("solar-activity") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Solar Activity", description: DESCRIPTION, url: spaceWeatherPath("solar-activity") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live · NOAA SWPC &amp; NASA DONKI</span>}
        title="Solar activity"
        lead="What the Sun itself is doing: how bright it is in X-rays, which regions carry the twisted magnetic fields that produce flares, and what has actually erupted."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SectionNav current="solar-activity" />

        <XrayFlarePanel envelope={s.xrayFlare} />

        <section aria-labelledby="flux-heading" className="space-y-4">
          <h2 id="flux-heading" className="font-display text-2xl font-bold">10.7 cm radio flux</h2>
          {flux ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LiveValue
                datum={{ value: flux.sfu, unit: "sfu", observedAt: flux.observedAt, kind: "index", status: s.radioFlux.status, product: "10.7 cm radio flux", quality: "A disc-integrated index in solar flux units (10⁻²² W m⁻² Hz⁻¹), measured daily." }}
                label="F10.7"
                envelope={s.radioFlux}
                interpretation={explainRadioFlux(flux.sfu)}
                precision={0}
              />
              <div className="scientific-card p-5 text-sm leading-relaxed text-muted">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Why this index</h3>
                <p className="mt-2">
                  The 10.7 cm radio flux has been measured daily since 1947, which makes it the longest continuous instrumental
                  record of solar activity. It tracks the magnetic complexity of the corona closely enough to serve as a proxy for
                  it, and unlike sunspot counting it does not depend on an observer&apos;s judgement or on clear skies.
                </p>
              </div>
            </div>
          ) : (
            <DataUnavailable envelope={s.radioFlux} what="The 10.7 cm radio flux" />
          )}
        </section>

        <ActiveRegionPanel envelope={s.activeRegions} />
        <FlareEventPanel envelope={s.flares} limit={10} />
        <CmeEventPanel envelope={s.cmes} limit={8} />

        <section aria-labelledby="two-heading" className="space-y-3">
          <h2 id="two-heading" className="font-display text-2xl font-bold">Two kinds of flare record</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              The X-ray panel above is an <strong className="text-fg">instrument reading</strong>: the flux GOES is measuring in
              the 1–8 Ångström band at this moment, expressed as a flare class. It is current to the minute and it is not curated.
              A flare in progress has no end time and its class can still rise.
            </p>
            <p>
              The catalogued flares are a <strong className="text-fg">research record</strong>: events reviewed by NASA CCMC
              analysts, with begin, peak and end times and an associated active region. Curation lags the event by hours, so the
              most recent hours are routinely incomplete. An empty catalogue is not evidence of a quiet Sun.
            </p>
            <p>
              AsteriaStar shows both and never merges them. They are produced by different processes with different latencies and
              different purposes, and a single combined list would inherit the weaknesses of each.
            </p>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <HonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.xrayFlare} title="GOES X-ray flare state" />
            <EnvelopeDetails envelope={s.activeRegions} title="Active regions" />
            <EnvelopeDetails envelope={s.radioFlux} title="10.7 cm radio flux" />
            <EnvelopeDetails envelope={s.flares} title="DONKI flare catalogue" />
          </div>
        </section>

        <SourceList keys={["swpc", "donki", "nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
