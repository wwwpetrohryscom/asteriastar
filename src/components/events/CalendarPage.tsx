import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  astronomicalEventSchema,
  breadcrumbSchema,
  eventListSchema,
  webPageSchema,
  type Crumb,
} from "@/lib/seo/jsonld";
import { eventsPath, ROUTES, type EventsSlug } from "@/lib/routes";
import {
  BasisLegend,
  CalendarGap,
  CalendarHonestyNote,
  EventList,
  EventsNav,
  ProviderProvenance,
} from "@/components/events/EventsUI";
import {
  buildCalendar,
  rollingYear,
  utcDay,
  utcMonth,
  utcWeek,
  type CalendarWindow,
} from "@/platform/events/service";
import type { AstronomicalEvent, EventCategory } from "@/platform/events/model";

/**
 * The shared body of every calendar page.
 *
 * Ten pages differ only in the window they ask for and the categories they keep, so they share one
 * renderer. The important consequence is that the honesty apparatus — the basis legend, the
 * provenance panels, the gap notices when a provider fails — cannot be present on one page and
 * missing from another, because there is only one place it is written.
 *
 * Structured data is emitted only for events whose date is settled and known to at least the hour.
 * A planned launch appears on the page and not in the markup: `Event.startDate` cannot express "the
 * provider believes the second quarter", and a consumer reading a fixed timestamp would be entitled
 * to treat somebody's intention as an appointment.
 */

export interface CalendarPageProps {
  slug: EventsSlug;
  title: string;
  lead: string;
  eyebrow: string;
  description: string;
  /**
   * WHICH window, not the window itself.
   *
   * The pages name a span and this component resolves it. Reading the clock in a page body puts an
   * impure call on the render path — the same instant would be read again on every re-render — so it
   * happens once, here, inside the async component that is going to await a provider anyway.
   */
  windowKind: WindowKind;
  categories?: EventCategory[];
  emptyNote: string;
  /** Static context that must survive a provider outage, so it is rendered outside the data path. */
  children?: React.ReactNode;
}

/**
 * Which events reach the structured data.
 *
 * Four conditions, and each removes a different way of lying in markup: the date must be settled
 * (`confirmed`), it must be known to the minute rather than hedged, it must still be ahead — a past
 * eclipse emitted as `EventScheduled` is a claim about the future that has already been falsified —
 * and there must be a published place, because a node without one cannot validate and inventing one
 * is not available. In practice this is the eclipses and nothing else.
 */
function schemaEligible(event: AstronomicalEvent, nowMs: number): boolean {
  return event.confirmed && event.precision === "minute" && event.geo !== undefined && Date.parse(event.start) >= nowMs;
}

export type WindowKind = "day" | "week" | "month" | "year";

const WINDOW: Record<WindowKind, (nowMs: number) => CalendarWindow> = {
  day: utcDay,
  week: utcWeek,
  month: utcMonth,
  year: rollingYear,
};

export async function CalendarPage({
  slug,
  title,
  lead,
  eyebrow,
  description,
  windowKind,
  categories,
  emptyNote,
  children,
}: CalendarPageProps) {
  const now = new Date();
  const window = WINDOW[windowKind](now.getTime());
  const calendar = await buildCalendar(window.fromMs, window.toMs, {
    categories,
    now,
  });
  const path = eventsPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observing calendar", url: ROUTES.events },
    { name: title, url: path },
  ];

  const schemaEvents = calendar.events
    .filter((e) => schemaEligible(e, now.getTime()))
    .slice(0, 50)
    .map((e) =>
      astronomicalEventSchema({
        name: e.title,
        description: e.summary,
        startDate: e.start,
        endDate: e.end,
        url: path,
        geo: e.geo!,
        sourceName: e.source?.label,
        sourceUrl: e.source?.url,
      }),
    );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({ name: title, description, url: path }),
          ...(schemaEvents.length > 0
            ? [
                eventListSchema({
                  name: title,
                  url: path,
                  events: schemaEvents,
                }),
              ]
            : []),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>{eyebrow}</span>}
        title={title}
        lead={lead}
      />
      <Container className="mt-8 mb-14 space-y-10">
        <EventsNav current={slug} />
        <CalendarHonestyNote />

        {children}

        {calendar.gaps.map((gap) => (
          <CalendarGap
            key={gap.reason}
            category={gap.category}
            reason={gap.reason}
          />
        ))}

        <section aria-labelledby="events-heading" className="space-y-4">
          <h2 id="events-heading" className="font-display text-xl font-bold">
            {calendar.events.length === 1
              ? "One event"
              : `${calendar.events.length} events`}
          </h2>
          <EventList events={calendar.events} emptyNote={emptyNote} />
        </section>

        <BasisLegend />

        <p className="text-sm text-muted" data-print="hide">
          Take this away as a calendar file:{" "}
          <Link
            href="/events/calendar.ics"
            className="underline decoration-white/30 underline-offset-2 hover:text-fg"
          >
            subscribe or download the next year of events
          </Link>
          , or read it as{" "}
          <Link
            href="/api/v0/live/events"
            className="underline decoration-white/30 underline-offset-2 hover:text-fg"
          >
            JSON from the Open Data API
          </Link>
          . Both carry the basis, the method or source, and the uncertainty for
          every entry.
        </p>

        <ProviderProvenance
          envelopes={[calendar.solar, calendar.lunar, calendar.launches]}
        />
      </Container>
    </>
  );
}
