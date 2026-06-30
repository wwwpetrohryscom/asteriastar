import { TIMELINES, getTimeline, type Timeline } from "@/lib/timelines";

/**
 * Timeline Engine — access to curated, sourced chronologies. Delegates to the
 * timeline registry; adds per-path lookup for entity pages.
 */
export const timelineEngine = {
  all: (): Timeline[] => TIMELINES,
  get: (slug: string): Timeline | undefined => getTimeline(slug),
  /** Timelines that reference a given page path. */
  forPath: (path: string): Timeline[] => TIMELINES.filter((t) => t.events.some((e) => e.href === path)),
};
