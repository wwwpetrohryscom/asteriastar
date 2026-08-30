import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, liveDashboardPath } from "@/lib/routes";
import { DashboardProvenance, LiveDashboardNav, LocationNote } from "@/components/live/dashboard/DashboardUI";
import { BasisLegend, CalendarGap, EventList } from "@/components/events/EventsUI";
import { buildCalendar, utcWeek } from "@/platform/events/service";

/**
 * The week ahead, on the dashboard.
 *
 * A seven-day slice of the observing calendar, framed for someone deciding which night to go out on
 * rather than someone browsing the year. Same events, same bases, same uncertainties — the calendar
 * section is where they are explained, and this is where they are used.
 */

const DESCRIPTION =
  "Every dated astronomical event in the next seven days — lunar phases, eclipses, meteor shower peaks, planetary events and planned launches — each labelled with where its date comes from and how exact it is.";

export const metadata: Metadata = buildMetadata({
  title: "Events This Week",
  description: DESCRIPTION,
  path: liveDashboardPath("events"),
  keywords: ["astronomical events this week", "what is happening in the sky this week", "sky events now"],
});

export const revalidate = 900;

export default async function LiveEventsPage() {
  const now = new Date();
  const window = utcWeek(now.getTime());
  const calendar = await buildCalendar(window.fromMs, window.toMs, { now });

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live", url: ROUTES.live },
    { name: "Events this week", url: liveDashboardPath("events") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Events This Week", description: DESCRIPTION, url: liveDashboardPath("events") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Next seven days</span>} title="Events this week"
        lead="What the calendar says is coming, and how much of each date to believe." />
      <Container className="mt-8 mb-14 space-y-8">
        <LiveDashboardNav current="events" />
        <LocationNote />

        {calendar.gaps.map((gap) => (
          <CalendarGap key={gap.reason} category={gap.category} reason={gap.reason} />
        ))}

        <section aria-labelledby="events-heading" className="space-y-4">
          <h2 id="events-heading" className="font-display text-xl font-bold">
            {calendar.events.length === 1 ? "One event" : `${calendar.events.length} events`}
          </h2>
          <EventList
            events={calendar.events}
            emptyNote="Nothing dated falls in the next seven days. Quiet weeks are common, and the planets and the Moon are up regardless."
          />
        </section>

        <BasisLegend />
        <DashboardProvenance envelopes={[calendar.solar, calendar.lunar, calendar.launches]} />
      </Container>
    </>
  );
}
