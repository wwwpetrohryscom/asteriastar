import { engine } from "@/platform/data-engine";
import type { FrontierRecord } from "@/knowledge-graph/data/observatory-frontier-catalog/types";

/** Engine-driven discovery hubs for the Ground-Based Observatories & Instrumentation Frontier Encyclopedia. */
export interface AuDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => FrontierRecord[];
}

const e = engine.observatoryFrontier;

export const AU_DISCOVERIES: AuDiscovery[] = [
  { slug: "next-generation-facilities", title: "Next-Generation Facilities", description: "The giant ground observatories of the coming decade — the Giant Magellan Telescope, the ngVLA, and the Cherenkov Telescope Array.", get: () => e.facilities() },
  { slug: "instrumentation", title: "Instrumentation", description: "The optical systems telescopes are built around — the adaptive-optics chain, spectrographs, coronagraphs, and starshades.", get: () => e.instruments() },
  { slug: "detectors", title: "Detector Technologies", description: "How photons become signal — from the optical CCD to the superconducting detectors of the millimetre sky.", get: () => e.detectors() },
  { slug: "interferometry", title: "Interferometry", description: "Combining separated apertures to see with the resolution of a far larger telescope — radio, optical, and continent-spanning VLBI.", get: () => e.interferometry() },
  { slug: "observing-techniques", title: "Observing Techniques", description: "Beating the atmosphere and the detector — lucky imaging, speckle imaging, stacking, and fringe tracking.", get: () => e.techniques() },
];

const BY_SLUG = new Map(AU_DISCOVERIES.map((d) => [d.slug, d]));
export function getAuDiscovery(slug: string): AuDiscovery | undefined {
  return BY_SLUG.get(slug);
}
