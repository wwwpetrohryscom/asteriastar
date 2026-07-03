import { engine } from "@/platform/data-engine";
import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";

/**
 * Engine-driven discovery hubs for the Meteors, Meteorites & Fireballs Encyclopedia.
 * Every hub is a pure query over engine.meteorites; filters are honest — a meteorite
 * with an unknown value is simply excluded rather than assigned an invented one.
 */
export interface MeteoriteDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => MeteoriteRecord[];
}

const e = engine.meteorites;

export const METEORITE_DISCOVERIES: MeteoriteDiscovery[] = [
  { slug: "all-meteorites", title: "All Meteorites", description: "Every meteorite modelled in the encyclopedia, across all classes.", view: "table", get: () => e.meteorites() },
  { slug: "falls", title: "Meteorite Falls", description: "Meteorites seen to fall and then recovered — the freshest, least-altered samples.", view: "table", get: () => e.falls() },
  { slug: "finds", title: "Meteorite Finds", description: "Meteorites discovered on the ground without a witnessed fall.", view: "cards", get: () => e.finds() },
  { slug: "recent-falls", title: "Recent Falls", description: "Meteorites recovered from twenty-first-century falls, several traced to their orbits by camera networks.", view: "cards", get: () => e.recentFalls() },
  { slug: "largest", title: "Largest Meteorites", description: "The most massive meteorites ever recovered, led by the ~60-tonne Hoba iron.", view: "table", get: () => e.largestMeteorites() },
  { slug: "carbonaceous", title: "Carbonaceous Chondrites", description: "Primitive, carbon- and water-rich meteorites carrying the organic building blocks of the Solar System.", view: "cards", get: () => e.carbonaceous() },
  { slug: "stony", title: "Stony Meteorites", description: "The chondrites and achondrites — meteorites made mostly of rock.", view: "cards", get: () => e.stonyMeteorites() },
  { slug: "iron", title: "Iron Meteorites", description: "Dense nickel-iron meteorites from the cores of shattered asteroids.", view: "cards", get: () => e.ironMeteorites() },
  { slug: "martian", title: "Martian Meteorites", description: "Rocks blasted off Mars and delivered to Earth, identified by trapped Martian atmosphere.", view: "cards", get: () => e.martianMeteorites() },
  { slug: "lunar", title: "Lunar Meteorites", description: "Pieces of the Moon flung to Earth by impacts, matched to the Apollo samples.", view: "cards", get: () => e.lunarMeteorites() },
  { slug: "vesta-hed", title: "HED Meteorites (from Vesta)", description: "The howardite–eucrite–diogenite meteorites, pieces of the asteroid Vesta's crust.", view: "cards", get: () => e.hedMeteorites() },
  { slug: "fireballs", title: "Fireballs", description: "Exceptionally bright meteors and the bolides that detonate in the atmosphere.", view: "cards", get: () => e.fireballs() },
  { slug: "bolides", title: "Bolides", description: "Fireballs bright enough to explode — the airbursts of Peekskill and the Bering Sea.", view: "cards", get: () => e.bolides() },
  { slug: "impact-structures", title: "Impact Structures", description: "The craters left on Earth by past impacts, from young Meteor Crater to ancient Vredefort.", view: "cards", get: () => e.structures() },
  { slug: "recovery-sites", title: "Recovery Sites", description: "The strewn fields where the fragments of a single fall are recovered.", view: "cards", get: () => e.sites() },
  { slug: "planetary-defense", title: "Planetary Defense", description: "The damaging airbursts and the objects that reached the ground — why near-Earth objects are tracked.", view: "cards", get: () => [...e.bySlugs(["chelyabinsk"]), ...e.fireballs()] },
];

const BY_SLUG = new Map(METEORITE_DISCOVERIES.map((d) => [d.slug, d]));
export function getMeteoriteDiscovery(slug: string): MeteoriteDiscovery | undefined {
  return BY_SLUG.get(slug);
}
