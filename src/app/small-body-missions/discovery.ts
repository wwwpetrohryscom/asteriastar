import { engine } from "@/platform/data-engine";
import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/**
 * Engine-driven discovery hubs for the Small-Body Missions & Sample Return Encyclopedia.
 * Every hub is a pure query over engine.smallBodyMissions; filters are honest — a mission
 * with an unknown value is excluded rather than assigned an invented one, and agency hubs
 * read the curated agency label so concepts appear without asserting an operated_by edge.
 */
export interface MissionDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => SmallBodyRecord[];
}

const e = engine.smallBodyMissions;
const agency = (label: string) => e.missions().filter((m) => (m.agencyLabel ?? "").includes(label));

export const MISSION_DISCOVERIES: MissionDiscovery[] = [
  { slug: "sample-return", title: "Sample-Return Missions", description: "Missions that brought material from an asteroid or comet back to Earth — Hayabusa, Hayabusa2, OSIRIS-REx, and Stardust.", view: "cards", get: () => e.sampleReturnMissions() },
  { slug: "comet-missions", title: "Comet Missions", description: "Flybys, orbiters, and impactors that explored comets — from Giotto at Halley to Rosetta at 67P.", view: "cards", get: () => e.cometMissions() },
  { slug: "asteroid-missions", title: "Asteroid Missions", description: "Missions to the asteroids — main-belt giants, near-Earth rubble piles, metal worlds, and the Jupiter Trojans.", view: "cards", get: () => e.asteroidMissions() },
  { slug: "planetary-defense", title: "Planetary-Defense Missions", description: "Missions that test or study how to deflect a hazardous asteroid — DART, Hera, and their forerunners.", view: "cards", get: () => e.planetaryDefenseMissions() },
  { slug: "future-missions", title: "Future & Planned Missions", description: "Missions in cruise, planned, or proposed — MMX, Comet Interceptor, DESTINY+, and studied concepts.", view: "cards", get: () => e.futureMissions() },
  { slug: "historic-missions", title: "Historic Missions", description: "The completed missions that opened up small-body exploration.", view: "table", get: () => e.historicMissions() },
  { slug: "active-missions", title: "Active Missions", description: "Small-body missions currently in flight — Hera, Lucy, and Psyche.", view: "cards", get: () => e.activeSmallBodyMissions() },
  { slug: "mission-timeline", title: "Mission Timeline", description: "Every small-body mission with a known launch date, in chronological order.", view: "table", get: () => e.missionTimeline() },
  { slug: "nasa-missions", title: "NASA Missions", description: "The small-body missions of NASA and its centers (JPL, APL).", view: "cards", get: () => agency("NASA") },
  { slug: "esa-missions", title: "ESA Missions", description: "The European Space Agency's small-body missions — Giotto, Rosetta, Hera, and Comet Interceptor.", view: "cards", get: () => agency("ESA") },
  { slug: "japanese-missions", title: "Japanese (JAXA) Missions", description: "JAXA's small-body missions — the Hayabusa sample-return line, MMX, and DESTINY+.", view: "cards", get: () => agency("JAXA") },
];

const BY_SLUG = new Map(MISSION_DISCOVERIES.map((d) => [d.slug, d]));
export function getMissionDiscovery(slug: string): MissionDiscovery | undefined {
  return BY_SLUG.get(slug);
}
