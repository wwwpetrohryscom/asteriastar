import { engine } from "@/platform/data-engine";
import type { ObservingRecord } from "@/knowledge-graph/data/observing-suite-catalog/types";

/** Engine-driven discovery hubs for the Professional Observatory Planning Suite. */
export interface BqDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => ObservingRecord[];
}

const e = engine.observingSuite;

export const BQ_DISCOVERIES: BqDiscovery[] = [
  { slug: "observing-planners", title: "The Planners", description: "The observing planners — tonight, visibility, target, Moon, planet, deep-sky, season, twilight, darkness, altitude, meridian-transit, equipment, astrophotography, and session — each built on the platform's real computed twilight, Moon, and planet data and its observing equipment, sites, and techniques.", get: () => e.planners() },
  { slug: "data-integrations", title: "Data Integrations", description: "The external conditions observing depends on. CLOUD COVER is connected, from MET Norway, fetched by the reader's own browser; seeing, transparency and Bortle sky brightness are still interfaces awaiting a provider. Cloud cover never stands in for any of them — they are different quantities from different models, and no condition is ever invented.", get: () => e.integrations() },
];

const BY_SLUG = new Map(BQ_DISCOVERIES.map((d) => [d.slug, d]));
export function getBqDiscovery(slug: string): BqDiscovery | undefined {
  return BY_SLUG.get(slug);
}
