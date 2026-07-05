import { engine } from "@/platform/data-engine";
import type { PolicyRecord } from "@/knowledge-graph/data/space-policy-catalog/types";

/** Engine-driven discovery hubs for the Space Policy, Sustainability & Space Economy Encyclopedia. */
export interface BcDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => PolicyRecord[];
}

const e = engine.spacePolicy;

export const BC_DISCOVERIES: BcDiscovery[] = [
  { slug: "space-law", title: "Space Law & Treaties", description: "The framework of international agreements that governs space — the Outer Space Treaty and the conventions and accords built on it.", get: () => e.treaties() },
  { slug: "sustainability", title: "Policy & Sustainability", description: "The challenges of a crowded, contested orbit — orbital debris, the Kessler syndrome, traffic management, mega-constellations, and the rules of resources and protection.", get: () => e.topics() },
  { slug: "space-economy", title: "The Space Economy", description: "The industries and markets of space — commercial launch, the satellite economy, insurance, and the whole space economy.", get: () => e.economy() },
  { slug: "organisations", title: "Governing Bodies", description: "The organisations that coordinate and govern space activity — UNOOSA, COSPAR, the ITU, and the IAF.", get: () => e.organizations() },
];

const BY_SLUG = new Map(BC_DISCOVERIES.map((d) => [d.slug, d]));
export function getBcDiscovery(slug: string): BcDiscovery | undefined {
  return BY_SLUG.get(slug);
}
