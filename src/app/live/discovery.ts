import { engine } from "@/platform/data-engine";
import type { LiveSourceRecord, LiveCategory } from "@/knowledge-graph/data/live-data-catalog/types";

/** Engine-driven discovery hubs for the Live Scientific Data Platform (by category). */
export interface BtDiscovery {
  slug: string;
  title: string;
  description: string;
  category: LiveCategory;
  get: () => LiveSourceRecord[];
}

const e = engine.liveScientificData;

export const BT_DISCOVERIES: BtDiscovery[] = [
  { slug: "space-weather", title: "Space Weather", category: "space-weather", description: "The near-real-time state of the Sun–Earth environment — solar wind, the planetary K-index, the geomagnetic storm scale, and alerts — served by NOAA's Space Weather Prediction Center. Provider-fed only; no value is shown until a live connection is made.", get: () => e.byCategory("space-weather") },
  { slug: "solar-activity", title: "Solar Activity", category: "solar-activity", description: "Solar events — flares, coronal mass ejections, and solar energetic particle events — from NASA's DONKI database. Provider-fed only.", get: () => e.byCategory("solar-activity") },
  { slug: "near-earth-objects", title: "Near-Earth Objects", category: "near-earth-object", description: "Close approaches of asteroids and comets, from the IAU Minor Planet Center and JPL's Center for NEO Studies. Provider-fed only; no approach distance or date is shown until a live connection is made.", get: () => e.byCategory("near-earth-object") },
  { slug: "orbital", title: "Orbital & Satellites", category: "orbital", description: "Orbital elements and satellite passes — the ISS and other satellites via CelesTrak two-line elements and SGP4 propagation. Architecture-ready; the TLE feed and propagation are not yet wired.", get: () => e.byCategory("orbital") },
  { slug: "atmospheric", title: "Atmospheric Conditions", category: "atmospheric", description: "The local conditions that decide an observing night — weather, seeing, transparency, cloud cover, and Bortle sky brightness. Awaiting a licence-safe open provider; no condition is ever fabricated.", get: () => e.byCategory("atmospheric") },
];

const BY_SLUG = new Map(BT_DISCOVERIES.map((d) => [d.slug, d]));
export function getBtDiscovery(slug: string): BtDiscovery | undefined {
  return BY_SLUG.get(slug);
}
