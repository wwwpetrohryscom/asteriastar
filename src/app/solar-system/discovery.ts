import { engine } from "@/platform/data-engine";
import type { BodyRecord } from "@/knowledge-graph/data/solar-system-catalog/types";

/** Discovery lists — every list is generated from the engine over real data. */
export interface SolarDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => BodyRecord[];
}

const exploration = (): BodyRecord[] => [...engine.solar.missions(), ...engine.solar.spacecraft()];

export const SOLAR_DISCOVERIES: SolarDiscovery[] = [
  { slug: "all-planets", title: "All Planets", description: "The eight planets of the Solar System, in order from the Sun.", get: () => engine.solar.planets() },
  { slug: "dwarf-planets", title: "Dwarf Planets", description: "Recognized dwarf planets — Pluto, Ceres, Eris, Haumea, and Makemake.", get: () => engine.solar.dwarfPlanets() },
  { slug: "inner-planets", title: "Inner Planets", description: "The rocky, terrestrial planets: Mercury, Venus, Earth, and Mars.", get: () => engine.solar.innerPlanets() },
  { slug: "outer-planets", title: "Outer Planets", description: "The giant planets beyond the asteroid belt.", get: () => engine.solar.outerPlanets() },
  { slug: "gas-giants", title: "Gas Giants", description: "Jupiter and Saturn — the largest planets.", get: () => engine.solar.gasGiants() },
  { slug: "ice-giants", title: "Ice Giants", description: "Uranus and Neptune.", get: () => engine.solar.iceGiants() },
  { slug: "natural-satellites", title: "Natural Satellites", description: "Major moons of the planets and dwarf planets.", get: () => engine.solar.moons() },
  { slug: "largest-moons", title: "Largest Moons", description: "The largest natural satellites in the Solar System, by radius.", get: () => engine.solar.largestMoons(30) },
  { slug: "asteroids", title: "Asteroids", description: "Major asteroids and small bodies.", get: () => engine.solar.asteroids() },
  { slug: "comets", title: "Comets", description: "Notable comets — periodic and long-period.", get: () => engine.solar.comets() },
  { slug: "planetary-missions", title: "Planetary Missions", description: "Missions of Solar System exploration.", get: () => engine.solar.missions() },
  { slug: "planetary-orbiters", title: "Planetary Orbiters", description: "Missions that orbited their target.", get: () => exploration().filter((b) => /orbiter/i.test(b.missionType ?? "")) },
  { slug: "planetary-landers", title: "Planetary Landers", description: "Landers and rovers that touched another world.", get: () => exploration().filter((b) => /lander|rover/i.test(b.missionType ?? "")) },
  { slug: "planetary-flybys", title: "Planetary Flybys", description: "Missions that flew past their target.", get: () => exploration().filter((b) => /flyby/i.test(b.missionType ?? "")) },
];

const BY_SLUG = new Map(SOLAR_DISCOVERIES.map((d) => [d.slug, d]));
export function getSolarDiscovery(slug: string): SolarDiscovery | undefined {
  return BY_SLUG.get(slug);
}
