import { engine } from "@/platform/data-engine";
import type { DeepExplorationRecord } from "@/knowledge-graph/data/deep-space-exploration-catalog/types";

/** Engine-driven discovery hubs for the Deep-Space Human Exploration & Habitation Encyclopedia. */
export interface BiDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => DeepExplorationRecord[];
}

const e = engine.deepSpaceExploration;

export const BI_DISCOVERIES: BiDiscovery[] = [
  { slug: "exploration-architecture", title: "Architectures of Exploration", description: "How humans will live and work beyond Earth — the Moon-to-Mars architecture, the Mars surface base, the deep-space transit habitat, surface power and mobility, construction from local resources, deep-space propulsion, and landing on Mars.", get: () => e.architecture() },
  { slug: "deep-space-challenges", title: "The Challenges of Deep Space", description: "The problems that sharpen once a crew leaves Earth's neighbourhood — deep-space radiation, the communication time delay, Earth independence, long-duration life support, behavioural health, planetary protection, and planetary dust.", get: () => e.challenges() },
];

const BY_SLUG = new Map(BI_DISCOVERIES.map((d) => [d.slug, d]));
export function getBiDiscovery(slug: string): BiDiscovery | undefined {
  return BY_SLUG.get(slug);
}
