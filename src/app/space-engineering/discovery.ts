import { engine } from "@/platform/data-engine";
import type { EngRecord } from "@/knowledge-graph/data/space-engineering-catalog/types";

/** Engine-driven discovery hubs for the Space Engineering & Launch Systems Deep Dive Encyclopedia. */
export interface CbDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => EngRecord[];
}

const e = engine.spaceEngineering;

export const CB_DISCOVERIES: CbDiscovery[] = [
  { slug: "propulsion-methods", title: "Propulsion Methods", description: "How spacecraft push off from nothing — electric propulsion and its nuclear-electric, VASIMR, arcjet and resistojet variants; the propellant-free solar sail; mono- and bipropellant chemical systems; and the waste-nothing staged-combustion engine cycle.", get: () => e.propulsion() },
  { slug: "rocketry-principles", title: "Rocketry Principles", description: "The physics that governs getting to orbit — the Tsiolkovsky rocket equation, specific impulse and thrust-to-weight, the delta-v budget, multistage rockets, and thrust vector control.", get: () => e.performance() },
  { slug: "flight-maneuvers", title: "Flight Maneuvers", description: "The guided moves of spaceflight — orbital rendezvous and station-keeping, aerobraking and aerocapture at other planets, and the gravity-turn ascent that carries rockets from the pad to orbit.", get: () => e.maneuvers() },
];

const BY_SLUG = new Map(CB_DISCOVERIES.map((d) => [d.slug, d]));
export function getCbDiscovery(slug: string): CbDiscovery | undefined {
  return BY_SLUG.get(slug);
}
