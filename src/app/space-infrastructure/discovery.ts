import { engine } from "@/platform/data-engine";
import type { InfraRecord } from "@/knowledge-graph/data/space-infrastructure-catalog/types";

/** Engine-driven discovery hubs for the Space Manufacturing & In-Space Infrastructure Encyclopedia. */
export interface InfraDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => InfraRecord[];
}

const e = engine.spaceInfrastructure;

export const INFRA_DISCOVERIES: InfraDiscovery[] = [
  { slug: "domains", title: "Domains", description: "The domains of building in space — resource utilisation, manufacturing, infrastructure, power, and logistics.", get: () => e.domains() },
  { slug: "resource-utilisation", title: "In-Situ Resource Utilisation", description: "Living off the land — extracting water, oxygen, metals, and propellant from the Moon, Mars, and asteroids.", get: () => e.isru() },
  { slug: "manufacturing", title: "Manufacturing & Construction", description: "Making and building in space — 3D printing, in-space assembly, servicing, and autonomous construction.", get: () => e.manufacturing() },
  { slug: "infrastructure-systems", title: "Infrastructure Systems", description: "The facilities of a spacefaring economy — depots, habitats, power stations, tugs, and megastructure concepts.", get: () => e.infrastructure() },
];

const BY_SLUG = new Map(INFRA_DISCOVERIES.map((d) => [d.slug, d]));
export function getInfraDiscovery(slug: string): InfraDiscovery | undefined {
  return BY_SLUG.get(slug);
}
