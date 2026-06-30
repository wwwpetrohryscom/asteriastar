import { engine } from "@/platform/data-engine";
import type { ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";

/** Discovery lists — each generated from the exploration engine over real data. */
export interface ExplorationDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "missions" | "cards";
  get: () => ExplorationRecord[];
}

const e = engine.exploration;
const outer = ["planet:jupiter", "planet:saturn", "planet:uranus", "planet:neptune", "dwarf_planet:pluto"];

export const EXPLORATION_DISCOVERIES: ExplorationDiscovery[] = [
  { slug: "all-missions", title: "All Missions", description: "Every space mission in the encyclopedia, by launch date.", view: "missions", get: () => e.missionTimeline() },
  { slug: "human-spaceflight", title: "Human Spaceflight", description: "Crewed missions, from the first flights to the Moon landings.", view: "missions", get: () => e.crewedMissions() },
  { slug: "moon-missions", title: "Moon Missions", description: "Missions that have explored Earth's Moon.", view: "missions", get: () => e.missionsByTarget("moon:the-moon") },
  { slug: "mars-missions", title: "Mars Missions", description: "Orbiters, landers, and rovers that have explored Mars.", view: "missions", get: () => e.missionsByTarget("planet:mars") },
  { slug: "jupiter-missions", title: "Jupiter Missions", description: "Spacecraft that have explored Jupiter and its moons.", view: "missions", get: () => e.missionsByTarget("planet:jupiter") },
  { slug: "saturn-missions", title: "Saturn Missions", description: "Missions to Saturn, its rings, and its moons.", view: "missions", get: () => e.missionsByTarget("planet:saturn") },
  { slug: "solar-missions", title: "Solar Missions", description: "Spacecraft that study the Sun up close.", view: "missions", get: () => e.missionsByTarget("star:sun") },
  { slug: "deep-space-missions", title: "Deep Space Missions", description: "Missions to the outer planets, dwarf planets, and beyond.", view: "missions", get: () => e.missionTimeline().filter((m) => m.targetKeys?.some((t) => outer.includes(t)) || /interstellar/i.test(m.missionType ?? "")) },
  { slug: "planetary-orbiters", title: "Planetary Orbiters", description: "Missions that entered orbit around another world.", view: "missions", get: () => e.missionsByType((t) => /orbiter/i.test(t)) },
  { slug: "planetary-landers", title: "Planetary Landers", description: "Missions that touched down on another world.", view: "missions", get: () => e.missionsByType((t) => /lander/i.test(t)) },
  { slug: "planetary-rovers", title: "Planetary Rovers", description: "Robotic rovers that have driven across other worlds.", view: "missions", get: () => e.missionsByType((t) => /rover/i.test(t)) },
  { slug: "sample-return-missions", title: "Sample Return Missions", description: "Missions that brought pieces of other worlds back to Earth.", view: "missions", get: () => e.missionsByType((t) => /sample return/i.test(t)) },
  { slug: "historic-missions", title: "Historic Missions", description: "The pioneering missions of the early Space Age (pre-1980).", view: "missions", get: () => e.missionTimeline().filter((m) => (e.yearOf(m.launchDate) ?? 9999) < 1980) },
  { slug: "mission-programs", title: "Mission Programs", description: "The great programs of human and robotic exploration.", view: "cards", get: () => e.byKind("program") },
  { slug: "launch-vehicles", title: "Launch Vehicles", description: "The rockets that carry missions to space.", view: "cards", get: () => e.byKind("vehicle") },
  { slug: "launch-sites", title: "Launch Sites", description: "The spaceports of the world.", view: "cards", get: () => e.byKind("site") },
  { slug: "space-agencies", title: "Space Agencies", description: "National and intergovernmental space agencies and providers.", view: "cards", get: () => e.byKind("agency") },
  { slug: "astronauts", title: "Astronauts & Cosmonauts", description: "The people who have flown into space.", view: "cards", get: () => e.byKind("astronaut") },
  { slug: "spacecraft", title: "Spacecraft", description: "The rovers, landers, and probes that do the exploring.", view: "cards", get: () => e.byKind("spacecraft") },
  { slug: "scientific-instruments", title: "Scientific Instruments", description: "The cameras, spectrometers, and sensors that gather the data.", view: "cards", get: () => e.byKind("instrument") },
];

const BY_SLUG = new Map(EXPLORATION_DISCOVERIES.map((d) => [d.slug, d]));
export function getExplorationDiscovery(slug: string): ExplorationDiscovery | undefined {
  return BY_SLUG.get(slug);
}
