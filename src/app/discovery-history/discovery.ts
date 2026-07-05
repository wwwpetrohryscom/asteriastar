import { engine } from "@/platform/data-engine";
import type { HistoryRecord } from "@/knowledge-graph/data/discovery-history-catalog/types";

/** Engine-driven discovery hubs for the History & Philosophy of Astronomical Discovery Encyclopedia. */
export interface BdDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => HistoryRecord[];
}

const e = engine.discoveryHistory;

export const BD_DISCOVERIES: BdDiscovery[] = [
  { slug: "histories", title: "Histories of Discovery", description: "The great arcs of astronomical discovery — the Copernican Revolution and the histories of the telescope, spectroscopy, radio astronomy, cosmology, exoplanets, gravitational waves, and black holes.", get: () => e.themes() },
  { slug: "methodology", title: "How Discovery Works", description: "The ways astronomy makes progress — the scientific method, paradigm shifts and revolutions, instrumentation-driven discovery, bias, theory and observation, Big Science, and the data revolution.", get: () => e.methodology() },
  { slug: "philosophy", title: "Philosophy of Science", description: "How astronomy knows what it knows — scientific realism, falsifiability, the nature of evidence, measurement uncertainty, replication, and open science.", get: () => e.philosophy() },
];

const BY_SLUG = new Map(BD_DISCOVERIES.map((d) => [d.slug, d]));
export function getBdDiscovery(slug: string): BdDiscovery | undefined {
  return BY_SLUG.get(slug);
}
