import { referenceEnvelope } from "@/platform/live-sky/schema";
import type { ObservingEvent } from "@/platform/live-sky/models";
import { METEOR_SHOWERS, meteorShowers } from "@/platform/live-sky/meteorShowers";

const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const monthName = (m: number): string => MONTHS[m] ?? "";

const SUN = "star:sun", EARTH = "planet:earth";

/** The four seasonal markers (Northern-Hemisphere naming), recurring annually. */
const SEASONAL_EVENTS: ObservingEvent[] = [
  { slug: "march-equinox", name: "March Equinox", kind: "equinox", month: 3, monthLabel: "March", relatedEntityIds: [SUN, EARTH], description: "Day and night are nearly equal; the Sun crosses the celestial equator moving north." },
  { slug: "june-solstice", name: "June Solstice", kind: "solstice", month: 6, monthLabel: "June", relatedEntityIds: [SUN, EARTH], description: "The Sun reaches its northernmost point — the longest day in the Northern Hemisphere, the shortest in the Southern." },
  { slug: "september-equinox", name: "September Equinox", kind: "equinox", month: 9, monthLabel: "September", relatedEntityIds: [SUN, EARTH], description: "The Sun crosses the celestial equator moving south; day and night are again nearly equal." },
  { slug: "december-solstice", name: "December Solstice", kind: "solstice", month: 12, monthLabel: "December", relatedEntityIds: [SUN, EARTH], description: "The Sun reaches its southernmost point — the longest night in the Northern Hemisphere." },
];

/** Recurring meteor-shower peaks as calendar events (month-level, not a specific year's date). */
const SHOWER_EVENTS: ObservingEvent[] = METEOR_SHOWERS.map((s) => ({
  slug: `${s.slug}-peak`, name: `${s.name} peak`, kind: "meteor-shower" as const,
  month: s.peakMonth, monthLabel: monthName(s.peakMonth),
  relatedEntityIds: meteorShowers.linkedEntityIds(s),
  description: `The ${s.name} peak (${s.peakLabel}), radiating from ${s.radiantConstellationId.replace("constellation:", "")}.`,
}));

export const OBSERVING_EVENTS: ObservingEvent[] = [...SEASONAL_EVENTS, ...SHOWER_EVENTS].sort((a, b) => (a.month ?? 0) - (b.month ?? 0));

export const observingCalendar = {
  events: OBSERVING_EVENTS,
  envelope: referenceEnvelope({
    source: ["imo", "usno"], provider: "usno", confidence: "established",
    provenance: "A month-by-month guide to recurring sky events (meteor-shower peaks, equinoxes, solstices). These recur annually; exact dates and times for a given year and location require a connected almanac provider and are not shown here.",
  }),
  /** Recurring events in a given month (1-12). */
  forMonth: (month: number): ObservingEvent[] => OBSERVING_EVENTS.filter((e) => e.month === month),
  linkedEntityIds: [SUN, EARTH, ...new Set(SHOWER_EVENTS.flatMap((e) => e.relatedEntityIds))],
};
