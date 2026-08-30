import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, liveDashboardPath } from "@/lib/routes";
import { DashboardProvenance, DashboardStat, DashboardTile, LiveDashboardNav, LocationNote } from "@/components/live/dashboard/DashboardUI";
import { currentScales, currentSolarWind, latestObservedKp, reage, spaceWeatherSnapshot } from "@/platform/space-weather/service";
import { explainBz, explainKp, explainSolarWindSpeed } from "@/platform/space-weather/explain";

/**
 * Space weather, right now — the four numbers, and what they mean for tonight.
 *
 * This is not a second copy of `/space-weather`. That section explains the physics, holds the charts
 * and the event catalogues, and is where a reader goes to understand a storm. This is the operational
 * glance: what the instruments say at this moment, how old it is, and the one observing consequence
 * — which is the aurora, and which is stated in the terms NOAA states it in rather than as a verdict
 * for anybody's town.
 */

const DESCRIPTION =
  "The current state of space weather in four numbers: solar wind speed, the interplanetary magnetic field's north-south component, the planetary K index and the NOAA storm scales — each with the time NOAA measured it, and what it does and does not imply for observing tonight.";

export const metadata: Metadata = buildMetadata({
  title: "Space Weather Now",
  description: DESCRIPTION,
  path: liveDashboardPath("space-weather"),
  keywords: ["space weather now", "current kp index", "solar wind now", "aurora activity now"],
});

export const revalidate = 900;

export default async function LiveSpaceWeatherPage() {
  const now = new Date();
  const snapshot = reage(await spaceWeatherSnapshot(), now.toISOString());
  const wind = currentSolarWind(snapshot);
  const kp = latestObservedKp(snapshot.kpObserved);
  const scales = currentScales(snapshot.scales);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live", url: ROUTES.live },
    { name: "Space weather now", url: liveDashboardPath("space-weather") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Space Weather Now", description: DESCRIPTION, url: liveDashboardPath("space-weather") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Live · NOAA SWPC</span>} title="Space weather now"
        lead="The Sun's weather at this moment, as NOAA's instruments report it — and the one thing it actually decides for an observer." />
      <Container className="mt-8 mb-14 space-y-8">
        <LiveDashboardNav current="space-weather" />
        <LocationNote />

        <DashboardTile title="At L1 and at Earth" envelope={snapshot.solarWindSpeed} href="/space-weather/live" hrefLabel="The full space-weather section">
          <DashboardStat
            label="Solar wind speed" value={wind.speed ? Math.round(wind.speed.value) : undefined} unit="km/s"
            detail={wind.speed ? `${explainSolarWindSpeed(wind.speed.value).label}. Measured at the L1 point, about an hour upstream of Earth.` : undefined}
            unavailable={snapshot.solarWindSpeed.error ?? "NOAA published no recent value."}
          />
          <DashboardStat
            label="IMF Bz" value={wind.bz ? wind.bz.value.toFixed(1) : undefined} unit="nT"
            detail={wind.bz ? explainBz(wind.bz.value).label : undefined}
            unavailable={snapshot.solarWindField.error ?? "NOAA published no recent value."}
          />
          <DashboardStat
            label="Planetary Kp" value={kp ? kp.value.toFixed(1) : undefined}
            detail={kp ? `${explainKp(kp.value).label}. A three-hourly index, so the newest value is legitimately up to three hours old.` : undefined}
            unavailable={snapshot.kpObserved.error ?? "NOAA published no recent observed value."}
          />
        </DashboardTile>

        <section aria-labelledby="means-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="means-heading" className="font-display text-lg font-bold text-fg">What it means for tonight</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            For almost everything an observer does, the answer is nothing at all: space weather does not
            affect seeing, transparency, or whether a galaxy is visible. It matters for one thing, and
            that is the aurora.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {kp
              ? `Kp is ${kp.value.toFixed(1)} — ${explainKp(kp.value).label.toLowerCase()}. Whether that reaches YOUR sky depends on your geomagnetic latitude, which is not the same as your geographic one, and on how far the auroral oval has expanded at the moment you look.`
              : "Kp is unavailable, so there is nothing to say about aurora likelihood — and an absent index is not a quiet one."}{" "}
            AsteriaStar does not compute an aurora verdict for a place. NOAA publishes the viewline and
            the hemispheric forecast, and those are the right things to read.
          </p>
          {scales && (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              NOAA&apos;s scales for {scales.date} ({scales.provenance}): G{scales.geomagnetic?.scale ?? 0} geomagnetic,
              R{scales.radioBlackout?.scale ?? 0} radio blackout, S{scales.solarRadiation?.scale ?? 0} radiation. Only the
              first of those is an observing matter, and only for the aurora.
            </p>
          )}
        </section>

        <DashboardProvenance envelopes={[snapshot.solarWindSpeed, snapshot.solarWindField, snapshot.kpObserved, snapshot.scales]} />
      </Container>
    </>
  );
}
