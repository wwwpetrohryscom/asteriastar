import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, liveDashboardPath, skyPath } from "@/lib/routes";
import { TonightPlanner } from "@/components/live/dashboard/TonightPlanner";
import { LiveDashboardNav } from "@/components/live/dashboard/DashboardUI";
import { ephemerisWindow, issEphemeris } from "@/platform/satellites/service";
import { latestObservedKp, spaceWeatherSnapshot } from "@/platform/space-weather/service";
import { explainKp } from "@/platform/space-weather/explain";
import { offlineEvents } from "@/platform/events/service";
import { compareEvents } from "@/platform/events/model";

/**
 * The personal observing dashboard.
 *
 * The division of labour is the design. This server component fetches only what is the same for
 * every reader on Earth — a window of NASA's ISS state vectors, the current planetary K index, and
 * the astronomical events of the next two days — and hands them to a browser island that does
 * everything else. Nothing on this page needs to know where anyone is, and the part that does never
 * tells the server.
 */

const DESCRIPTION =
  "A personal observing plan for coordinates you type: twilight and darkness windows, the Moon and its interference, which planets are worth pointing at, visible ISS passes, tonight's events and the current geomagnetic activity. Everything that depends on your location is computed in your own browser and never sent anywhere; a cloud-cover forecast is available only if you explicitly ask for it.";

export const metadata: Metadata = buildMetadata({
  title: "Tonight",
  description: DESCRIPTION,
  path: liveDashboardPath("tonight"),
  keywords: ["what can I see tonight", "observing tonight", "night sky tonight", "stargazing tonight", "observing plan"],
});

/*
 * Fifteen minutes. The ISS ephemeris and the events would be good for far longer, but Kp is a
 * three-hourly index and the window of state vectors shipped to the browser is anchored to "now" —
 * a page frozen at build time would hand a reader in March a pass list from the day of the deploy.
 */
export const revalidate = 900;

export default async function TonightPage() {
  const now = new Date();
  const nowMs = now.getTime();

  const [iss, weather] = await Promise.all([issEphemeris({ now }), spaceWeatherSnapshot()]);
  // Two days of state vectors: enough for every pass a reader will plan around, and a fraction of
  // the fifteen-day file.
  const issWindow = ephemerisWindow(iss, nowMs, 48);
  const kp = latestObservedKp(weather.kpObserved);

  const events = offlineEvents(nowMs, nowMs + 2 * 86_400_000).sort(compareEvents).slice(0, 8);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live", url: ROUTES.live },
    { name: "Tonight", url: liveDashboardPath("tonight") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Tonight", description: DESCRIPTION, url: liveDashboardPath("tonight") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Computed in your browser · NASA · NOAA</span>}
        title="Tonight"
        lead="What is actually worth going outside for, from coordinates you type — and computed on your own machine, so they never leave it."
      />
      <Container className="mt-8 mb-14 space-y-10">
        <LiveDashboardNav current="tonight" />

        {/*
          Rendered OUTSIDE the island, so a provider outage cannot take the explanation with it.
        */}
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-muted">
          This composes engines that already exist rather than adding astronomy of its own: the{" "}
          <Link href={skyPath("sun")} className="underline decoration-white/30 underline-offset-2 hover:text-fg">twilight</Link>,{" "}
          <Link href={skyPath("moon")} className="underline decoration-white/30 underline-offset-2 hover:text-fg">Moon</Link> and{" "}
          <Link href={skyPath("planet-visibility")} className="underline decoration-white/30 underline-offset-2 hover:text-fg">planet</Link>{" "}
          calculators, the ISS pass finder built on{" "}
          <Link href="/satellites/iss" className="underline decoration-white/30 underline-offset-2 hover:text-fg">NASA&apos;s published trajectory</Link>, the{" "}
          <Link href="/events" className="underline decoration-white/30 underline-offset-2 hover:text-fg">observing calendar</Link>, and{" "}
          <Link href="/space-weather/geomagnetic" className="underline decoration-white/30 underline-offset-2 hover:text-fg">NOAA&apos;s geomagnetic index</Link>.
          Each of those pages explains its own accuracy; this one only puts them together.
        </p>

        <TonightPlanner
          issWindow={issWindow}
          issUnavailable={iss.error ?? (issWindow ? undefined : "NASA's published ephemeris does not cover the next two days.")}
          events={events}
          geomagnetic={kp ? { kp: kp.value, label: explainKp(kp.value).label, observedAt: kp.observedAt } : null}
          geomagneticUnavailable={weather.kpObserved.error ?? "NOAA published no recent observed value."}
        />
      </Container>
    </>
  );
}
