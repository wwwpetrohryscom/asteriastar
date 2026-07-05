import { engine } from "@/platform/data-engine";
import type { HelioRecord } from "@/knowledge-graph/data/heliophysics-catalog/types";

/** Engine-driven discovery hubs for the Heliophysics & Space Weather Operations Encyclopedia. */
export interface AwDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => HelioRecord[];
}

const e = engine.heliophysics;

export const AW_DISCOVERIES: AwDiscovery[] = [
  { slug: "solar-sources", title: "Solar Sources", description: "Where space weather begins — the solar cycle, sunspots, active regions, coronal holes, and the ionosphere they disturb.", get: () => e.phenomena() },
  { slug: "operational-impacts", title: "Operational Impacts", description: "How solar activity reaches technology and people — satellites, GPS, aviation, human spaceflight, power grids, and radio.", get: () => e.impacts() },
  { slug: "forecasting", title: "Forecasting Services", description: "The operational services that watch the Sun and warn the world — Europe's space-weather service network.", get: () => e.services() },
];

const BY_SLUG = new Map(AW_DISCOVERIES.map((d) => [d.slug, d]));
export function getAwDiscovery(slug: string): AwDiscovery | undefined {
  return BY_SLUG.get(slug);
}
