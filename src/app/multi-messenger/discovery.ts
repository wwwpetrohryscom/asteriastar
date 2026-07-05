import { engine } from "@/platform/data-engine";
import type { MmRecord } from "@/knowledge-graph/data/multi-messenger-catalog/types";

/** Engine-driven discovery hubs for the Multi-Messenger & Gravitational-Wave Operations Encyclopedia. */
export interface AzDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => MmRecord[];
}

const e = engine.multiMessenger;

export const AZ_DISCOVERIES: AzDiscovery[] = [
  { slug: "observatories", title: "GW Observatories", description: "The gravitational-wave detectors new to the graph — the operating GEO600 testbed, the proposed next-generation Einstein Telescope and Cosmic Explorer, and the space missions DECIGO, Taiji, and TianQin.", get: () => e.facilities() },
  { slug: "detection-methods", title: "Detection Methods", description: "How gravitational waves are caught, from ground and space laser interferometry to galaxy-sized pulsar timing arrays.", get: () => e.detectionMethods() },
  { slug: "source-classes", title: "Source Classes", description: "The compact-binary mergers that ring spacetime — binary black holes, binary neutron stars, and black hole–neutron star mergers.", get: () => e.sources() },
  { slug: "multi-messenger", title: "Multi-Messenger Channels", description: "Observing a source in more than one messenger at once — gravitational waves with light, neutrinos, gamma rays, radio, and optical.", get: () => e.channels() },
  { slug: "follow-up", title: "Follow-Up & Data Products", description: "The race from alert to counterpart — localization, counterpart search, rapid response — and the skymaps, waveforms, and catalogs it yields.", get: () => [...e.followupStages(), ...e.dataProducts()] },
  { slug: "alert-systems", title: "Alert Systems", description: "How gravitational-wave candidates reach the world in seconds — the LVK public alerts and SCiMMA.", get: () => e.alerts() },
];

const BY_SLUG = new Map(AZ_DISCOVERIES.map((d) => [d.slug, d]));
export function getAzDiscovery(slug: string): AzDiscovery | undefined {
  return BY_SLUG.get(slug);
}
