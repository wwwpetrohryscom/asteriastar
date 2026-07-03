import { engine } from "@/platform/data-engine";
import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";

/**
 * Engine-driven discovery hubs for the Rockets & Launch Vehicles encyclopedia.
 * Every hub is a pure query over `engine.launchVehicles`; filters are honest —
 * a vehicle with an unknown payload is simply not classified into a lift-class
 * hub rather than being assigned an invented figure.
 */
export interface RocketDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => RocketRecord[];
}

const e = engine.launchVehicles;
const num = (v: number | undefined) => v ?? -1;
const has = (s: string | undefined, re: RegExp) => re.test(s ?? "");

export const ROCKET_DISCOVERIES: RocketDiscovery[] = [
  { slug: "all-launch-vehicles", title: "All Launch Vehicles", description: "Every rocket in the encyclopedia, ordered by first flight — from the R-7 of 1957 to today's reusable heavy-lift vehicles.", view: "table", get: () => e.vehicles() },
  { slug: "rocket-families", title: "Rocket Families", description: "The great multi-generation lineages — Saturn, Atlas, Delta, Titan, Falcon, Ariane, Long March, and more.", view: "cards", get: () => e.families() },
  { slug: "rocket-stages", title: "Rocket Stages", description: "First-class booster, core, and upper stages of flagship vehicles, with their engines and propellants.", view: "cards", get: () => e.stages() },
  { slug: "rocket-engines", title: "Rocket Engines", description: "The engines that power the world's rockets, by combustion cycle and propellant.", view: "cards", get: () => e.engines() },
  { slug: "propellants", title: "Propellants", description: "The fuel and oxidizer combinations — kerolox, hydrolox, methalox, hypergolics, and solids.", view: "cards", get: () => e.propellants() },
  { slug: "launch-providers", title: "Launch Providers", description: "The agencies and companies that build and fly launch vehicles.", view: "cards", get: () => e.providers() },
  { slug: "launch-programs", title: "Launch Programs", description: "The programs that flagship launch vehicles have served, from Apollo to Artemis.", view: "cards", get: () => e.programs() },
  { slug: "launch-pads", title: "Launch Pads", description: "The pads and complexes where rockets lift off, grouped under their launch sites.", view: "cards", get: () => e.pads() },
  { slug: "reusable-rockets", title: "Reusable Rockets", description: "Launch vehicles designed to recover and re-fly hardware, from the Space Shuttle to Falcon 9 and Starship.", view: "cards", get: () => e.vehicles().filter((r) => r.reusable === true) },
  { slug: "expendable-rockets", title: "Expendable Rockets", description: "Single-use launch vehicles whose stages are not recovered.", view: "cards", get: () => e.vehicles().filter((r) => r.reusable === false) },
  { slug: "super-heavy-lift", title: "Super Heavy-Lift Rockets", description: "The most powerful launch vehicles — 50 tonnes or more to low Earth orbit (where the figure is documented).", view: "table", get: () => e.vehicles().filter((r) => num(r.payloadLeoKg) >= 50000) },
  { slug: "heavy-lift", title: "Heavy-Lift Rockets", description: "Launch vehicles that place 20–50 tonnes into low Earth orbit (where documented).", view: "table", get: () => e.vehicles().filter((r) => num(r.payloadLeoKg) >= 20000 && num(r.payloadLeoKg) < 50000) },
  { slug: "small-lift", title: "Small-Lift Rockets", description: "Dedicated small-satellite launchers placing under 2 tonnes into orbit (where documented).", view: "cards", get: () => e.vehicles().filter((r) => num(r.payloadLeoKg) >= 0 && num(r.payloadLeoKg) < 2000) },
  { slug: "human-rated-rockets", title: "Human-Rated Rockets", description: "Launch vehicles certified to carry crews to space.", view: "cards", get: () => e.vehicles().filter((r) => r.humanRated === true) },
  { slug: "active-rockets", title: "Active Rockets", description: "Launch vehicles currently in operational service.", view: "table", get: () => e.vehicles().filter((r) => has(r.status, /active/i)) },
  { slug: "retired-rockets", title: "Retired Rockets", description: "Historic launch vehicles no longer flying.", view: "cards", get: () => e.vehicles().filter((r) => has(r.status, /retired/i)) },
  { slug: "future-rockets", title: "Future Rockets", description: "Launch vehicles in development or planned.", view: "cards", get: () => e.vehicles().filter((r) => has(r.status, /develop|planned/i)) },
  { slug: "cryogenic-engines", title: "Cryogenic Engines", description: "Engines burning deeply-cold liquid propellants — hydrogen or methane with liquid oxygen.", view: "cards", get: () => e.engines().filter((r) => e.resolve(r.slug)?.propellants.some((p) => /LH2|Methane|CH4/i.test(p.name)) ?? false) },
  { slug: "staged-combustion-engines", title: "Staged-Combustion Engines", description: "High-efficiency engines using a staged-combustion or full-flow cycle.", view: "cards", get: () => e.engines().filter((r) => has(r.engineCycle, /staged combustion|full-flow/i)) },
];

const BY_SLUG = new Map(ROCKET_DISCOVERIES.map((d) => [d.slug, d]));
export function getRocketDiscovery(slug: string): RocketDiscovery | undefined {
  return BY_SLUG.get(slug);
}
