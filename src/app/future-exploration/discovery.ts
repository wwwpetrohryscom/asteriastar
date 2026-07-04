import { engine } from "@/platform/data-engine";
import type { ConceptRecord } from "@/knowledge-graph/data/future-missions-catalog/types";

/** Engine-driven discovery hubs for the Future Space Exploration & Mission Concepts Encyclopedia. */
export interface FutureDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => ConceptRecord[];
}

const e = engine.futureMissions;
const byName = (a: ConceptRecord, b: ConceptRecord) => a.name.localeCompare(b.name);

export const FUTURE_DISCOVERIES: FutureDiscovery[] = [
  { slug: "themes", title: "Themes", description: "The themes of future exploration — the Moon, Mars, Venus, the ocean worlds, small bodies, observatories, and the outer Solar System.", get: () => e.themes() },
  { slug: "human-and-lunar", title: "Human & Lunar Exploration", description: "The Artemis missions returning humans to the Moon and building a presence in lunar orbit.", get: () => e.byTheme("lunar-exploration") },
  { slug: "planetary-missions", title: "Planetary Missions", description: "The next robotic missions to Venus, Mars, the ocean worlds, the small bodies, and the ice giants.", get: () => ["mars-exploration", "venus-exploration", "ocean-worlds", "small-bodies-and-planetary-defense", "outer-solar-system"].flatMap((t) => e.byTheme(t)).sort(byName) },
  { slug: "future-observatories", title: "Future Observatories", description: "The great space observatories of the coming decades — dark energy, habitable worlds, gravitational waves, and the X-ray sky.", get: () => e.byTheme("astrophysics-observatories") },
];

const BY_SLUG = new Map(FUTURE_DISCOVERIES.map((d) => [d.slug, d]));
export function getFutureDiscovery(slug: string): FutureDiscovery | undefined {
  return BY_SLUG.get(slug);
}
