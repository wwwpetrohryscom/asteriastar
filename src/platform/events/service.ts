import { loadProduct, renderDeadline, type LoadOptions } from "@/platform/live-providers/client";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import { computedEvents } from "@/platform/events/computed";
import { eclipseEvents, parseLunarCatalogue, parseSolarCatalogue, type EclipseCatalogue } from "@/platform/events/eclipses";
import { launchEvents, parseLaunches, type LaunchFeed } from "@/platform/events/launches";
import { meteorShowerEvents } from "@/platform/events/showers";
import { compareEvents, type AstronomicalEvent, type EventCategory } from "@/platform/events/model";

/**
 * Assembling the calendar.
 *
 * Four sources of very different character are merged here, and the merge is designed so that any of
 * them can fail without taking the page with it. Computed events and meteor showers need no network
 * at all; eclipses and launches do. A NASA outage removes the eclipses and says so. A launch-provider
 * outage removes the launches and says so. Neither empties the calendar, and neither is ever papered
 * over with a plausible-looking substitute.
 *
 * The computed half is memoised per calendar year. Locating a year of events means several thousand
 * evaluations of the position series, which is cheap once and wasteful on every request; the results
 * are deterministic, so caching them is caching a pure function.
 */

const YEAR_CACHE = new Map<number, AstronomicalEvent[]>();

/** How many years of computed events may be held at once. Generous; a year is a few hundred rows. */
const MAX_CACHED_YEARS = 8;

/**
 * How far outside the year each scan reaches.
 *
 * The extremum finder cannot report a turning point at the very edge of its window: with samples on
 * only one side there is no way to tell a real one from the scan running out, so it refuses. That is
 * correct in isolation and was catastrophic here, because the years were scanned on exactly abutting
 * windows — so the refused band at the end of one year and the start of the next was covered by
 * neither. An apogee near New Year simply did not exist on the site: the Moon's apogee of 1 January
 * 2028 was missing, leaving a twenty-eight-day gap between two consecutive perigees.
 *
 * Each year is now scanned with three days of overlap on both sides and the results filtered back to
 * the year, so every instant is found inside a window that extends past it. Three days is many times
 * the largest scan step (one day) with room to spare.
 */
const YEAR_SCAN_MARGIN_MS = 3 * 86_400_000;

/** Every computed and shower event for one calendar year, memoised. */
function eventsForYear(year: number): AstronomicalEvent[] {
  const cached = YEAR_CACHE.get(year);
  if (cached) return cached;
  const from = Date.UTC(year, 0, 1);
  const to = Date.UTC(year + 1, 0, 1);
  const scanFrom = from - YEAR_SCAN_MARGIN_MS;
  const scanTo = to + YEAR_SCAN_MARGIN_MS;
  // Filtered back to the year on the START instant, so an event belongs to exactly one year and the
  // overlap can never produce a duplicate.
  const events = [...computedEvents(scanFrom, scanTo), ...meteorShowerEvents(scanFrom, scanTo)]
    .filter((e) => {
      const start = Date.parse(e.start);
      return start >= from && start < to;
    })
    .sort(compareEvents);
  if (YEAR_CACHE.size >= MAX_CACHED_YEARS) {
    const oldest = YEAR_CACHE.keys().next();
    if (!oldest.done) YEAR_CACHE.delete(oldest.value);
  }
  YEAR_CACHE.set(year, events);
  return events;
}

/** Computed and forecast events in a window. No network, never fails. */
export function offlineEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const firstYear = new Date(fromMs).getUTCFullYear();
  const lastYear = new Date(toMs).getUTCFullYear();
  const out: AstronomicalEvent[] = [];
  for (let year = firstYear; year <= lastYear; year++) {
    for (const event of eventsForYear(year)) {
      const start = Date.parse(event.start);
      const end = event.end ? Date.parse(event.end) : start;
      if (end >= fromMs && start <= toMs) out.push(event);
    }
  }
  return out.sort(compareEvents);
}

/** Only used by tests and the validator, so a run does not inherit another run's memo. */
export function clearEventCache(): void {
  YEAR_CACHE.clear();
}

export function solarEclipseCatalogue(opts: LoadOptions = {}): Promise<LiveEnvelope<EclipseCatalogue>> {
  return loadProduct("gsfc:solar-eclipses", parseSolarCatalogue, { deadlineMs: renderDeadline(), ...opts });
}

export function lunarEclipseCatalogue(opts: LoadOptions = {}): Promise<LiveEnvelope<EclipseCatalogue>> {
  return loadProduct("gsfc:lunar-eclipses", parseLunarCatalogue, { deadlineMs: renderDeadline(), ...opts });
}

export function upcomingLaunches(opts: LoadOptions = {}): Promise<LiveEnvelope<LaunchFeed>> {
  return loadProduct("ll2:upcoming-launches", parseLaunches, { deadlineMs: renderDeadline(), ...opts });
}

export interface CalendarWindow {
  fromMs: number;
  toMs: number;
}

export interface Calendar {
  window: CalendarWindow;
  /** Everything that could be assembled, in time order. */
  events: AstronomicalEvent[];
  /** The eclipse catalogues, so a page can show why eclipses are missing when they are. */
  solar: LiveEnvelope<EclipseCatalogue>;
  lunar: LiveEnvelope<EclipseCatalogue>;
  /** The launch feed, for the same reason. */
  launches: LiveEnvelope<LaunchFeed>;
  /** Categories the window could not be filled for, with the provider's own reason. */
  gaps: { category: EventCategory; reason: string }[];
}

export interface CalendarOptions extends LoadOptions {
  /** Restrict the result to these categories. Providers for excluded categories are not called. */
  categories?: EventCategory[];
}

/**
 * The full calendar for a window.
 *
 * Providers are fetched concurrently and each failure is contained: `loadProduct` never throws, and
 * a category whose provider produced nothing is reported as a gap with the provider's own error
 * rather than silently omitted. A reader who sees no eclipses learns whether that is because there
 * are none in the window or because NASA did not answer.
 */
export async function buildCalendar(fromMs: number, toMs: number, opts: CalendarOptions = {}): Promise<Calendar> {
  const wanted = opts.categories;
  const include = (category: EventCategory): boolean => !wanted || wanted.includes(category);
  const nowMs = (opts.now ?? new Date()).getTime();

  const [solar, lunar, launches] = await Promise.all([
    include("eclipse") ? solarEclipseCatalogue(opts) : Promise.resolve(unusedEnvelope<EclipseCatalogue>()),
    include("eclipse") ? lunarEclipseCatalogue(opts) : Promise.resolve(unusedEnvelope<EclipseCatalogue>()),
    include("launch") ? upcomingLaunches(opts) : Promise.resolve(unusedEnvelope<LaunchFeed>()),
  ]);

  const events: AstronomicalEvent[] = offlineEvents(fromMs, toMs).filter((e) => include(e.category));
  const gaps: Calendar["gaps"] = [];

  /*
   * Solar and lunar eclipses are TWO products, with separate health records and separate back-off
   * counters, so one failing while the other answers is the ordinary failure — not an exotic one.
   * Reporting a gap only when BOTH fail meant a lunar outage deleted every lunar eclipse from the
   * page, the export and the API while the heading counted the solar ones and `gaps` stayed empty:
   * a reader could not tell an outage from a year with no lunar eclipses. Each product is now
   * accounted for on its own.
   */
  for (const [envelope, what] of [[solar, "Solar eclipses"], [lunar, "Lunar eclipses"]] as const) {
    if (envelope.data) events.push(...eclipseEvents(envelope.data, fromMs, toMs));
    else if (include("eclipse")) {
      gaps.push({
        category: "eclipse",
        reason: `${what} are missing: ${envelope.error ?? "the NASA catalogue could not be read."}`,
      });
    }
  }

  if (launches.data) events.push(...launchEvents(launches.data, fromMs, toMs, nowMs));
  else if (include("launch")) {
    gaps.push({ category: "launch", reason: launches.error ?? "The launch schedule could not be read from the provider." });
  }

  return { window: { fromMs, toMs }, events: events.sort(compareEvents), solar, lunar, launches, gaps };
}

/** A placeholder for a provider a caller deliberately did not ask for. Never rendered as a failure. */
function unusedEnvelope<T>(): LiveEnvelope<T> {
  return {
    provider: "not requested", providerKey: "not-requested", productKey: "not-requested", organization: "",
    sourceUrl: "", sources: [], license: "", providerState: "DISABLED", kind: "forecast", cacheSeconds: 0,
    provenance: "This provider was not called for this view.", status: "unavailable", stale: false,
  };
}


/* ------------------------------------------------------------------ windows */

/** UTC day containing an instant. Local-day framing is a rendering decision, made in the browser. */
export function utcDay(nowMs: number): CalendarWindow {
  const d = new Date(nowMs);
  const from = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return { fromMs: from, toMs: from + 86_400_000 - 1 };
}

/** The next seven days from the start of the current UTC day. */
export function utcWeek(nowMs: number): CalendarWindow {
  const day = utcDay(nowMs);
  return { fromMs: day.fromMs, toMs: day.fromMs + 7 * 86_400_000 - 1 };
}

/** The calendar month containing an instant, in UTC. */
export function utcMonth(nowMs: number): CalendarWindow {
  const d = new Date(nowMs);
  const from = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
  return { fromMs: from, toMs: Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - 1 };
}

/** A rolling window used by the hub and the exports: yesterday to a year ahead. */
export function rollingYear(nowMs: number): CalendarWindow {
  return { fromMs: nowMs - 86_400_000, toMs: nowMs + 365 * 86_400_000 };
}
