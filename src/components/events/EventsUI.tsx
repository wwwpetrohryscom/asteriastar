import Link from "next/link";
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { eventsPath, ROUTES, type EventsSlug } from "@/lib/routes";
import {
  BASIS_LABEL,
  BASIS_MEANING,
  CATEGORY_LABEL,
  type AstronomicalEvent,
  type EventBasis,
} from "@/platform/events/model";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";

/**
 * Shared presentation for the observing calendar.
 *
 * One rule governs everything here: a row must never let a reader mistake one kind of claim for
 * another. A computed instant, a NASA prediction, an annual forecast and somebody's launch plan all
 * arrive as a title and a date, and by default they would render identically. So the basis is on
 * every card, in words rather than only in colour, and the time is printed to the precision the
 * event actually has — a launch known to the quarter shows a quarter, not a minute it never had.
 */

export const EVENTS_PAGES: {
  slug: EventsSlug;
  title: string;
  blurb: string;
}[] = [
  {
    slug: "today",
    title: "Today",
    blurb: "What is happening in the next twenty-four hours.",
  },
  { slug: "this-week", title: "This week", blurb: "The next seven days." },
  {
    slug: "this-month",
    title: "This month",
    blurb: "The whole calendar month.",
  },
  {
    slug: "moon",
    title: "Moon",
    blurb:
      "Phases, perigee and apogee, computed from the platform's own lunar series.",
  },
  {
    slug: "eclipses",
    title: "Eclipses",
    blurb: "Solar and lunar, from NASA's five-millennium catalogue.",
  },
  {
    slug: "meteor-showers",
    title: "Meteor showers",
    blurb: "Peak nights, with the Moon's interference worked out.",
  },
  {
    slug: "conjunctions",
    title: "Conjunctions",
    blurb:
      "Planets passing close on the sky, and the dates they vanish into the Sun.",
  },
  {
    slug: "oppositions",
    title: "Oppositions",
    blurb: "When each outer planet is closest, brightest and up all night.",
  },
  {
    slug: "launches",
    title: "Launches",
    blurb:
      "Planned orbital launches — dates that move, shown as dates that move.",
  },
];

export function EventsNav({ current }: { current?: EventsSlug | "home" }) {
  return (
    <nav aria-label="Calendar sections" className="flex flex-wrap gap-2">
      {/* The hub is a tab like any other and marks itself when it is the page being viewed. */}
      <Link
        href={ROUTES.events}
        aria-current={current === "home" ? "page" : undefined}
        className={`rounded-full border px-3 py-1.5 text-sm transition ${current === "home" ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
      >
        Calendar home
      </Link>
      {EVENTS_PAGES.map((p) => (
        <Link
          key={p.slug}
          href={eventsPath(p.slug)}
          aria-current={current === p.slug ? "page" : undefined}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${current === p.slug ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
        >
          {p.title}
        </Link>
      ))}
    </nav>
  );
}

/**
 * The basis badge.
 *
 * Colour alone would fail anyone who cannot distinguish these hues, so the word is always present
 * and the colour only reinforces it. `title` carries the full meaning for a pointer; the same
 * sentence is repeated in the legend below every list, where it is reachable by keyboard.
 */
const BASIS_TONE: Record<EventBasis, string> = {
  computed: "border-nasa/40 bg-nasa/10 text-fg",
  "source-backed": "border-success/40 bg-success/10 text-success-strong",
  forecast: "border-white/20 bg-white/[0.05] text-muted",
  planned: "border-nasa-red/40 bg-nasa-red/[0.08] text-muted",
};

export function BasisBadge({ basis }: { basis: EventBasis }) {
  return (
    <span
      title={BASIS_MEANING[basis]}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] ${BASIS_TONE[basis]}`}
    >
      {BASIS_LABEL[basis]}
    </span>
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const QUARTERS = ["first", "second", "third", "fourth"];

/**
 * The date, printed to the precision the event has and no further — and the `datetime` attribute is
 * held to the same rule as the words beside it, because it is the form a machine reads.
 *
 * Everything is stored as a UTC instant so the calendar can sort. Printing all of it would claim a
 * minute for a launch scheduled to the quarter and an hour for a shower whose peak is a night.
 */
export function EventTime({ event }: { event: AstronomicalEvent }) {
  const d = new Date(event.start);
  if (!Number.isFinite(d.getTime()))
    return <span className="text-faint">date unavailable</span>;
  const day = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  const time = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;

  switch (event.precision) {
    case "minute":
      return (
        <time dateTime={event.start}>
          {day}, {time}
        </time>
      );
    case "hour":
      return (
        <time dateTime={event.start}>
          {day}, about {time}
        </time>
      );
    case "night": {
      const end = event.end ? new Date(event.end) : d;
      return (
        <time dateTime={event.start}>
          night of {d.getUTCDate()}–{end.getUTCDate()}{" "}
          {MONTHS[end.getUTCMonth()]} {end.getUTCFullYear()}
        </time>
      );
    }
    case "day":
      return <time dateTime={event.start.slice(0, 10)}>{day}</time>;
    case "month":
      return (
        <time dateTime={event.start.slice(0, 7)}>
          {MONTHS[d.getUTCMonth()]} {d.getUTCFullYear()}, day not yet set
        </time>
      );
    case "quarter":
      return (
        <time dateTime={event.start.slice(0, 7)}>
          the {QUARTERS[Math.floor(d.getUTCMonth() / 3)]} quarter of{" "}
          {d.getUTCFullYear()}, no date set
        </time>
      );
    case "year":
      return (
        <time dateTime={event.start.slice(0, 4)}>
          sometime in {d.getUTCFullYear()}
        </time>
      );
  }
}

export function EventCard({ event }: { event: AstronomicalEvent }) {
  return (
    <li className="scientific-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-fg">
          {event.title}
        </h3>
        <BasisBadge basis={event.basis} />
      </div>
      <p className="mt-1 text-sm font-medium text-nasa">
        <EventTime event={event} />
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{event.summary}</p>

      {/*
        The uncertainty is never behind a disclosure. It is the single most important thing on the
        card after the date itself — a date without its error bar is the bare number this platform
        exists not to publish — and a reader who prints the page, or who never opens a `<details>`,
        must still have it.
      */}
      {event.uncertainty && (
        <p className="mt-2 text-xs leading-relaxed text-faint">
          <span className="font-semibold uppercase tracking-wider">How exact:</span> {event.uncertainty}
        </p>
      )}

      {event.facts && event.facts.length > 0 && (
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {event.facts.map((fact) => (
            <div key={fact.label} className="flex flex-wrap gap-x-2">
              <dt className="text-xs uppercase tracking-wider text-faint">
                {fact.label}
              </dt>
              <dd className="text-sm text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <details className="mt-3 text-xs text-faint">
        <summary className="cursor-pointer text-muted">
          Where this date comes from
        </summary>
        <div className="mt-2 space-y-1.5 leading-relaxed">
          <p>{BASIS_MEANING[event.basis]}</p>
          {event.method && (
            <p>
              <strong className="text-muted">Method:</strong>{" "}
              {event.method.note} ({event.method.algorithm}, version{" "}
              {event.method.version})
            </p>
          )}
          {event.source && (
            <p>
              {/*
                The link text names the document it points at. Five cards on one page all reading
                "the published record" gave a screen-reader links list five indistinguishable
                entries — pointing at two different catalogues.
              */}
              <strong className="text-muted">Source:</strong>{" "}
              <a
                href={event.source.url}
                className="underline decoration-white/30 underline-offset-2 hover:text-fg"
                rel="noopener"
              >
                {event.source.label}
              </a>
              {event.source.lastVerifiedAt
                ? ` (last confirmed ${event.source.lastVerifiedAt})`
                : ""}
            </p>
          )}
          {event.uncertainty && (
            <p>
              <strong className="text-muted">Uncertainty:</strong>{" "}
              {event.uncertainty}
            </p>
          )}
          <p>
            <strong className="text-muted">Where it applies:</strong>{" "}
            {event.applicability.detail}
          </p>
        </div>
      </details>
    </li>
  );
}

export function EventList({
  events,
  emptyNote,
}: {
  events: AstronomicalEvent[];
  emptyNote: string;
}) {
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
        {emptyNote}
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.eventId} event={event} />
      ))}
    </ul>
  );
}

/** The legend, present under every list so the badges are never the only explanation. */
export function BasisLegend() {
  return (
    <section
      aria-labelledby="basis-legend"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
    >
      <h2
        id="basis-legend"
        className="font-display text-sm font-semibold uppercase tracking-wider text-faint"
      >
        Four kinds of date
      </h2>
      <dl className="mt-3 space-y-3">
        {(Object.keys(BASIS_LABEL) as EventBasis[]).map((basis) => (
          <div key={basis}>
            <dt className="text-sm font-semibold text-fg">
              {BASIS_LABEL[basis]}
            </dt>
            <dd className="text-sm leading-relaxed text-muted">
              {BASIS_MEANING[basis]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Reported when a provider could not be reached, in place of the events it would have carried. */
export function CalendarGap({
  category,
  reason,
}: {
  category: string;
  reason: string;
}) {
  return (
    <div className="rounded-lg border border-nasa-red/30 bg-nasa-red/[0.06] px-4 py-3 text-sm text-muted">
      <strong className="text-fg">
        {CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] ?? category}{" "}
        are missing from this list.
      </strong>{" "}
      The provider could not be reached, so nothing is shown for them — rather
      than a plausible-looking substitute. Reported reason: {reason}
    </div>
  );
}

export function ProviderProvenance({
  envelopes,
}: {
  envelopes: LiveEnvelope<unknown>[];
}) {
  const real = envelopes.filter((e) => e.providerKey !== "not-requested");
  if (real.length === 0) return null;
  return (
    <div className="space-y-3">
      {real.map((envelope) => (
        <EnvelopeDetails
          key={envelope.productKey}
          envelope={envelope}
          title={`Provenance — ${envelope.productKey}`}
        />
      ))}
    </div>
  );
}

/** The section's standing statement, shown on the hub and every list. */
export function CalendarHonestyNote() {
  return (
    <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-muted">
      Times are UTC throughout, because an instant is the same everywhere and a local rendering would
      hide which day an event actually falls on for you. Nothing here knows or asks where you are.
      Every computed instant carries an uncertainty, and most of those are measurements rather than
      estimates: every build checks the lunar phases against NASA&apos;s own published table, the
      equinoxes, solstices and Earth&apos;s apsides against the US Naval Observatory&apos;s, and the
      planetary positions the remaining events are derived from against JPL Horizons. The Moon&apos;s
      perigee and apogee are the one family with no external table to check against, and their cards
      say so.
    </p>
  );
}
