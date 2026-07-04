import { engine } from "@/platform/data-engine";
import type { ConceptRecord } from "@/knowledge-graph/data/future-missions-catalog/types";

type Ref = { id: string; name: string; href?: string };

/** Engine-driven discovery hubs for the Future Space Exploration & Mission Concepts Encyclopedia. */
export interface FutureDiscovery {
  slug: string;
  title: string;
  description: string;
  /** New mission-concept records shown as cards. */
  get: () => ConceptRecord[];
  /** Themes whose reused (in-development / en-route) missions this hub also surfaces. */
  themeSlugs?: string[];
}

const e = engine.futureMissions;
const byName = (a: ConceptRecord, b: ConceptRecord) => a.name.localeCompare(b.name);
const PLANETARY = ["mars-exploration", "venus-exploration", "ocean-worlds", "small-bodies-and-planetary-defense", "outer-solar-system"];

export const FUTURE_DISCOVERIES: FutureDiscovery[] = [
  { slug: "themes", title: "Themes", description: "The themes of future exploration — the Moon, Mars, Venus, the ocean worlds, small bodies, observatories, and the outer Solar System.", get: () => e.themes() },
  { slug: "human-and-lunar", title: "Human & Lunar Exploration", description: "The Artemis missions returning humans to the Moon and building a presence in lunar orbit.", get: () => e.byTheme("lunar-exploration"), themeSlugs: ["lunar-exploration"] },
  { slug: "planetary-missions", title: "Planetary Missions", description: "The next robotic missions to Mars, Venus, the ocean worlds, the small bodies, and the ice giants.", get: () => PLANETARY.flatMap((t) => e.byTheme(t)).sort(byName), themeSlugs: PLANETARY },
  { slug: "future-observatories", title: "Future Observatories", description: "The great space observatories of the coming decades — dark energy, habitable worlds, gravitational waves, and the X-ray sky.", get: () => e.byTheme("astrophysics-observatories"), themeSlugs: ["astrophysics-observatories"] },
];

/** The reused in-development / en-route missions surfaced by a hub (deduped across its themes). */
export function reusedForDiscovery(d: FutureDiscovery): Ref[] {
  const seen = new Set<string>();
  const out: Ref[] = [];
  for (const t of d.themeSlugs ?? []) {
    for (const ref of e.memberSet(t).reused) {
      if (!seen.has(ref.id)) { seen.add(ref.id); out.push(ref); }
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

const BY_SLUG = new Map(FUTURE_DISCOVERIES.map((d) => [d.slug, d]));
export function getFutureDiscovery(slug: string): FutureDiscovery | undefined {
  return BY_SLUG.get(slug);
}
