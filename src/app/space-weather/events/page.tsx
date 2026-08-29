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
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { CmeEventPanel, FlareEventPanel, SepEventPanel, StormEventPanel } from "@/components/space-weather/Panels";
import { solarEventsSnapshot, reage } from "@/platform/space-weather/service";
import { getLiveProduct } from "@/platform/live-providers/registry";

const DESCRIPTION =
  "Solar and space-weather events as catalogued by NASA's CCMC: flares with begin, peak and end times and their source regions; coronal mass ejections with fitted speeds where an analysis exists; geomagnetic storms with the observed Kp values that define them; and solar energetic particle events with the instrument that detected each one.";

export const metadata: Metadata = buildMetadata({
  title: "Space Weather Events",
  description: DESCRIPTION,
  path: spaceWeatherPath("events"),
  keywords: ["solar flare catalogue", "CME catalogue", "geomagnetic storm events", "solar energetic particle event", "NASA DONKI", "space weather events"],
});

/**
 * Fifteen minutes. DONKI is an analyst-curated catalogue whose entries appear hours after the
 * events they describe, so a shorter window would poll a research service for bytes that have not
 * changed.
 */
export const revalidate = 900;

export default async function SpaceWeatherEventsPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await solarEventsSnapshot(), nowIso);
  const flareWindow = getLiveProduct("donki:flares")?.windowDays ?? 30;
  const cmeWindow = getLiveProduct("donki:cmes")?.windowDays ?? 7;

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Weather", url: ROUTES.spaceWeather },
    { name: "Events", url: spaceWeatherPath("events") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Space Weather Events", description: DESCRIPTION, url: spaceWeatherPath("events") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live · NASA CCMC DONKI</span>}
        title="Events"
        lead="What has actually happened, as reviewed by NASA analysts: flares, eruptions, storms and particle events, each with the times and instruments on the record."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SectionNav current="events" />

        <p className="text-sm leading-relaxed text-muted">
          Flares, geomagnetic storms and particle events cover the last {flareWindow} days; coronal mass ejections cover the last{" "}
          {cmeWindow}, because a full month of CME records is a great deal of text for no added meaning on a current-conditions
          page. Every entry links back to its record in DONKI.
        </p>

        <FlareEventPanel envelope={s.flares} limit={20} />
        <CmeEventPanel envelope={s.cmes} limit={15} />
        <StormEventPanel envelope={s.storms} limit={10} />
        <SepEventPanel envelope={s.sepEvents} limit={10} />

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <HonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.flares} title="Flare catalogue" />
            <EnvelopeDetails envelope={s.cmes} title="CME catalogue" />
            <EnvelopeDetails envelope={s.storms} title="Storm catalogue" />
            <EnvelopeDetails envelope={s.sepEvents} title="SEP catalogue" />
          </div>
        </section>

        <SourceList keys={["donki", "nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
