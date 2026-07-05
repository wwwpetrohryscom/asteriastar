import { engine } from "@/platform/data-engine";
import type { DefenseRecord } from "@/knowledge-graph/data/planetary-defense-catalog/types";

/** Engine-driven discovery hubs for the Planetary Defense & NEO Operations Encyclopedia. */
export interface PdDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => DefenseRecord[];
}

const e = engine.planetaryDefense;

export const PD_DISCOVERIES: PdDiscovery[] = [
  { slug: "the-neo-pipeline", title: "The NEO Pipeline", description: "From discovery to deflection — how a hazardous asteroid is found, tracked, characterised, assessed, and, if necessary, deflected.", get: () => e.stages() },
  { slug: "risk-scales", title: "Impact-Risk Scales", description: "How impact risk is communicated — the Torino and Palermo scales.", get: () => e.scales() },
  { slug: "deflection-methods", title: "Deflection Methods", description: "How an asteroid's orbit could be changed — from the demonstrated kinetic impactor to theoretical nuclear concepts.", get: () => e.methods() },
];

const BY_SLUG = new Map(PD_DISCOVERIES.map((d) => [d.slug, d]));
export function getPdDiscovery(slug: string): PdDiscovery | undefined {
  return BY_SLUG.get(slug);
}
