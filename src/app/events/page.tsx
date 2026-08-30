import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
} from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath, ROUTES } from "@/lib/routes";
import {
  BasisLegend,
  CalendarGap,
  CalendarHonestyNote,
  EventCard,
  EventsNav,
  EVENTS_PAGES,
  ProviderProvenance,
} from "@/components/events/EventsUI";
import { buildCalendar, rollingYear } from "@/platform/events/service";
import { CATEGORY_LABEL, type EventCategory } from "@/platform/events/model";
import { UNDATEABLE_SHOWERS } from "@/platform/events/showers";

/**
 * The observing calendar.
 *
 * The hub answers one question — what is next — and then gets out of the way. It shows the soonest
 * event in each category rather than the next thirty events overall, because otherwise forty planned
 * launches would bury the four things that are actually certain.
 */

const DESCRIPTION =
  "A dated astronomical calendar with the provenance attached: lunar phases and planetary events computed here and checked against NASA and US Naval Observatory tables, eclipses taken from NASA's five-millennium catalogue, meteor shower peaks, and planned launches shown as the moving targets they are.";

export const metadata: Metadata = buildMetadata({
  title: "Observing Calendar",
  description: DESCRIPTION,
  path: ROUTES.events,
  keywords: [
    "astronomy calendar",
    "astronomical events",
    "observing calendar",
    "sky events",
    "what is in the sky",
  ],
});

export const revalidate = 900;

const ORDER: EventCategory[] = [
  "moon",
  "eclipse",
  "meteor-shower",
  "opposition",
  "conjunction",
  "season",
  "planet",
  "launch",
];

export default async function EventsPage() {
  // One clock read, and the same instant is handed to the providers so their freshness is judged
  // against the moment this page was built rather than a slightly later one.
  const now = new Date();
  const window = rollingYear(now.getTime());
  const calendar = await buildCalendar(window.fromMs, window.toMs, { now });

  const nextByCategory = ORDER.map((category) => ({
    category,
    event: calendar.events.find((e) => e.category === category),
  })).filter((row) => row.event);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observing calendar", url: ROUTES.events },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            name: "Observing Calendar",
            description: DESCRIPTION,
            url: ROUTES.events,
          }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Computed · NASA/GSFC · IMO · Launch Library</span>}
        title="Observing calendar"
        lead="Four kinds of date, never mixed up: instants this platform computes and checks against published tables, eclipse predictions taken from NASA, showers that recur every year to within a day, and launches somebody intends to fly."
      />

      <Container className="printable-calendar mt-8 mb-14 space-y-12">
        <div data-print="hide">
          <EventsNav current="home" />
        </div>
        <CalendarHonestyNote />

        <section aria-labelledby="next-heading" className="space-y-4">
          <h2 id="next-heading" className="font-display text-xl font-bold">
            What is next
          </h2>
          <p className="text-sm text-muted">
            The soonest event of each kind, from a year-long window. Everything
            in the next week, month or year is on the pages above.
          </p>
          <ul className="space-y-4">
            {nextByCategory.map(
              (row) =>
                row.event && (
                  <EventCard key={row.event.eventId} event={row.event} />
                ),
            )}
          </ul>
          {calendar.gaps.map((gap) => (
            <CalendarGap
              key={gap.reason}
              category={gap.category}
              reason={gap.reason}
            />
          ))}
        </section>

        <section aria-labelledby="sections-heading" className="space-y-4">
          <h2 id="sections-heading" className="font-display text-xl font-bold">
            By kind
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EVENTS_PAGES.map((page) => (
              <li key={page.slug} className="scientific-card p-4">
                <Link
                  href={eventsPath(page.slug)}
                  className="font-display text-base font-semibold text-fg hover:text-nasa"
                >
                  {page.title}
                </Link>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {page.blurb}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <BasisLegend />

        <section aria-labelledby="limits-heading" className="space-y-3">
          <h2 id="limits-heading" className="font-display text-xl font-bold">
            What this calendar does not do
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-muted">
            <li>
              <strong className="text-fg">
                It does not know where you are.
              </strong>{" "}
              Every time is UTC. Nothing asks your browser for a position,
              nothing is stored, and no coordinate ever appears in a URL. Rise
              and set times for a place you type are on the{" "}
              <Link
                href="/sky/night-sky-tonight"
                className="underline decoration-white/30 underline-offset-2 hover:text-fg"
              >
                night-sky page
              </Link>
              , which computes them in your browser.
            </li>
            <li>
              <strong className="text-fg">
                It does not give local eclipse circumstances.
              </strong>{" "}
              NASA&apos;s catalogue gives the instant and place of greatest
              eclipse; what an eclipse looks like from a particular town needs
              the Besselian elements, which are published separately and are not
              read here. The path maps are on NASA&apos;s own pages, linked from
              every eclipse.
            </li>
            <li>
              <strong className="text-fg">
                It does not predict meteor rates.
              </strong>{" "}
              The peak nights recur annually and are reliable to about a day.
              The rate is not: a shower with a nominal rate of a hundred has
              produced fifteen and has produced four hundred.
              {UNDATEABLE_SHOWERS.length > 0 && (
                <>
                  {" "}
                  {UNDATEABLE_SHOWERS.map((s) => s.name).join(", ")}{" "}
                  {UNDATEABLE_SHOWERS.length === 1 ? "has" : "have"} no single
                  peak night in the reference data — a broad plateau rather than
                  a night — so{" "}
                  {UNDATEABLE_SHOWERS.length === 1 ? "it is" : "they are"}{" "}
                  described on the{" "}
                  <Link
                    href="/sky/meteor-showers"
                    className="underline decoration-white/30 underline-offset-2 hover:text-fg"
                  >
                    meteor shower pages
                  </Link>{" "}
                  and deliberately left out of the dated calendar rather than
                  given an invented date.
                </>
              )}
            </li>
            <li>
              <strong className="text-fg">
                It does not promise a launch will happen.
              </strong>{" "}
              The launch feed is maintained by volunteers aggregating operator
              announcements — not by any space agency. Dates move by weeks. Each
              entry says how precisely its date is known and when it was last
              confirmed.
            </li>
            <li>
              <strong className="text-fg">It does not know the weather.</strong>{" "}
              No cloud, seeing or transparency data is connected to this
              platform, and none is implied by anything on these pages.
            </li>
          </ul>
        </section>

        <section aria-labelledby="take-heading" className="space-y-3">
          <h2 id="take-heading" className="font-display text-xl font-bold">
            Take it with you
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            The next year of events is available as an{" "}
            <Link
              href="/events/calendar.ics"
              className="underline decoration-white/30 underline-offset-2 hover:text-fg"
            >
              iCalendar file
            </Link>{" "}
            — subscribe to it and unconfirmed events arrive marked tentative,
            which is how your calendar software will show them. The same data is
            in the{" "}
            <Link
              href="/api/v0/live/events"
              className="underline decoration-white/30 underline-offset-2 hover:text-fg"
            >
              Open Data API
            </Link>
            , with the basis, method or source, and uncertainty on every entry.
            Both are free and neither needs a key.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            These pages also print. Printing switches them to black on white, drops the navigation,
            keeps an event from being split across a page break, and prints every link with its
            address spelled out — and the basis, the date and the stated uncertainty are on the page
            itself rather than behind a disclosure, so they come out on paper with everything else.
          </p>
          <p className="text-sm text-muted">
            Categories available in both:{" "}
            {ORDER.map((c) => CATEGORY_LABEL[c]).join(" · ")}.
          </p>
        </section>

        <ProviderProvenance
          envelopes={[calendar.solar, calendar.lunar, calendar.launches]}
        />
      </Container>
    </>
  );
}
