/**
 * What an astronomical event is, on this platform.
 *
 * The hard part of an events calendar is not producing dates. It is being straight about where each
 * date came from and how much of it to believe, because a calendar mixes four completely different
 * kinds of claim and renders them in identical rows:
 *
 *  - a **computed** instant, derived here from position series, exact to the extent the series are;
 *  - a **source-backed** instant, published by an authority that did the hard work properly;
 *  - a **forecast**, which recurs annually and whose timing for a given year is only approximate;
 *  - a **planned** date, which someone intends and which will move.
 *
 * A launch "on 14 March" and an eclipse "on 12 August" are not the same species of fact. The basis
 * travels with every event, is rendered on every surface, and decides what language is allowed:
 * `confirmed` is false for anything planned or forecast, and nothing without a `method` may claim to
 * have been computed.
 */

import type { SourceKey } from "@/lib/sources";

/** The four kinds of claim a calendar row can make. */
export type EventBasis =
  | "computed" // derived here from position series; `method` names the algorithm and its version
  | "source-backed" // published by an authority; `source` names it and links the exact document
  | "forecast" // recurs annually; the date for this year is approximate and said to be
  | "planned"; // intended by an operator; will move, and is labelled as intent, not fact

export type EventCategory =
  | "moon"
  | "eclipse"
  | "meteor-shower"
  | "conjunction"
  | "opposition"
  | "season"
  | "planet"
  | "launch";

/**
 * How precisely the instant is known — which is not the same as how precisely it is stored.
 *
 * Everything is stored as a UTC instant because a calendar has to sort. `precision` says how much of
 * that instant means anything: a computed full Moon is good to the minute, a meteor shower peak to
 * the night, a launch NET sometimes only to the month. Rendering reads this and refuses to print
 * more digits than the event has earned.
 */
export type EventPrecision = "minute" | "hour" | "day" | "night" | "month" | "quarter" | "year";

/** Where on Earth the event is observable, and how specific that answer is. */
export interface GeographicApplicability {
  scope: "global" | "hemisphere" | "region" | "path" | "site";
  /** Plain words: "visible worldwide where the Moon is above the horizon", "path crosses Iceland…". */
  detail: string;
}

/** The named, versioned calculation behind a computed event. */
export interface EventMethod {
  /** Stable identifier for the algorithm, so a change of method is visible in the data. */
  algorithm: string;
  /** Bumped whenever the algorithm's output could move. */
  version: string;
  /** What it does, in one sentence, including the frame it works in. */
  note: string;
}

/** The publication behind a source-backed event. */
export interface EventSource {
  providerKey: string;
  label: string;
  /** The exact document or endpoint, not the provider's home page. */
  url: string;
  sources?: SourceKey[];
  /**
   * When the provider last confirmed this specific event. For a launch this is the field that
   * matters most: a schedule confirmed three weeks ago is a rumour with a timestamp.
   */
  lastVerifiedAt?: string;
}

export interface AstronomicalEvent {
  /** Deterministic and stable: the same event computed twice has the same id. */
  eventId: string;
  title: string;
  /** One or two sentences. Never sensational, never an instruction to look at the Sun. */
  summary: string;
  category: EventCategory;
  /** Machine-readable subtype, e.g. `full-moon`, `total-solar-eclipse`, `greatest-elongation-east`. */
  eventType: string;
  basis: EventBasis;
  /** The instant, always UTC. Local rendering is a presentation concern, never a stored one. */
  start: string;
  /** Present only for events with a real duration, such as a shower's activity window. */
  end?: string;
  precision: EventPrecision;
  applicability: GeographicApplicability;
  /** Required for `computed`; forbidden otherwise. */
  method?: EventMethod;
  /** Required for `source-backed` and `planned`; the authority behind the date. */
  source?: EventSource;
  /** Honest error bar in words, e.g. "±2 minutes", "the peak may fall a day either side". */
  uncertainty?: string;
  /** Knowledge Graph entities this event is about, when they exist. Never minted here. */
  entityIds?: string[];
  /**
   * True only when the date is settled: a computed instant or a published prediction. False for
   * anything planned or forecast, and read by the renderer and the structured data alike.
   */
  confirmed: boolean;
  /**
   * A real, published point on Earth associated with the event, when one exists.
   *
   * Only eclipses have this: NASA's catalogue publishes the coordinates of greatest eclipse, and
   * they are the only place on Earth this platform can name for any event without inventing one. A
   * full Moon happens to the whole planet at once and has no such point; it therefore has no `geo`,
   * and nothing downstream is allowed to supply a substitute.
   */
  geo?: { latitudeDeg: number; longitudeDeg: number; name: string };
  /** Extra rows for the event's own detail panel. Values only, already normalised. */
  facts?: { label: string; value: string }[];
}

export const BASIS_LABEL: Record<EventBasis, string> = {
  computed: "Computed",
  "source-backed": "Published prediction",
  forecast: "Annual forecast",
  planned: "Planned",
};

export const BASIS_MEANING: Record<EventBasis, string> = {
  computed:
    "Derived on this platform from published position series. The algorithm and its version are recorded, and the stated uncertainty is the real one.",
  "source-backed":
    "Taken from an authority's own published prediction. AsteriaStar reproduces it and links the document; it does not recompute it.",
  forecast:
    "Recurs every year at approximately the same point in Earth's orbit. The date shown is the expected one; the exact hour and the strength vary from year to year.",
  planned:
    "A date somebody intends to meet. Planned dates move, often by months. The timestamp of the last confirmation is shown so you can judge how much the date is worth.",
};

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  moon: "Moon",
  eclipse: "Eclipses",
  "meteor-shower": "Meteor showers",
  conjunction: "Conjunctions",
  opposition: "Oppositions",
  season: "Seasons",
  planet: "Planets",
  launch: "Launches",
};

/** Sort key: chronological, then by title so equal instants are stable across builds. */
export function compareEvents(a: AstronomicalEvent, b: AstronomicalEvent): number {
  return Date.parse(a.start) - Date.parse(b.start) || a.title.localeCompare(b.title);
}

/**
 * The structural rules every event obeys, in one place so the permanent gate and the runtime check
 * exactly the same thing. Returns the problems found, empty when the event is well formed.
 */
export function eventProblems(event: AstronomicalEvent): string[] {
  const problems: string[] = [];
  const start = Date.parse(event.start);
  if (!Number.isFinite(start)) problems.push(`${event.eventId}: start "${event.start}" is not a valid instant`);
  if (event.end !== undefined) {
    const end = Date.parse(event.end);
    if (!Number.isFinite(end)) problems.push(`${event.eventId}: end "${event.end}" is not a valid instant`);
    else if (end < start) problems.push(`${event.eventId}: end precedes start`);
  }
  if (event.basis === "computed" && !event.method) problems.push(`${event.eventId}: computed events must record the algorithm and version`);
  if (event.basis !== "computed" && event.method) problems.push(`${event.eventId}: only computed events may carry a method`);
  if ((event.basis === "source-backed" || event.basis === "planned") && !event.source) {
    problems.push(`${event.eventId}: ${event.basis} events must name their source`);
  }
  if (event.basis === "planned" && event.confirmed) problems.push(`${event.eventId}: a planned event must not be marked confirmed`);
  if (event.basis === "forecast" && event.confirmed) problems.push(`${event.eventId}: an annual forecast must not be marked confirmed`);
  if (event.basis === "planned" && !event.source?.lastVerifiedAt) {
    problems.push(`${event.eventId}: a planned event must carry the time its source last confirmed it`);
  }
  if (!event.uncertainty) problems.push(`${event.eventId}: every event states its uncertainty`);
  if (event.source && !/^https:\/\//.test(event.source.url)) problems.push(`${event.eventId}: source URL must be https`);
  return problems;
}
