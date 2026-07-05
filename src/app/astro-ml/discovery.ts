import { engine } from "@/platform/data-engine";
import type { MlRecord } from "@/knowledge-graph/data/astro-ml-catalog/types";

/** Engine-driven discovery hubs for the Data Science, AI & Machine Learning in Astronomy Encyclopedia. */
export interface AxDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => MlRecord[];
}

const e = engine.astroMl;

export const AX_DISCOVERIES: AxDiscovery[] = [
  { slug: "ml-methods", title: "Machine-Learning Methods", description: "The techniques astronomy borrows and adapts — classification, regression, clustering, representation and self-supervised learning, foundation models, and anomaly detection.", get: () => e.methods() },
  { slug: "applications", title: "Astronomical Applications", description: "Where ML meets the sky — galaxy morphology, supernova classification, photometric redshifts, transit and lens finding, source extraction, and real-time alerts.", get: () => e.applications() },
  { slug: "alert-brokers", title: "Alert Brokers", description: "The community systems that classify the survey alert stream in real time — ALeRCE, ANTARES, Fink, and Lasair.", get: () => e.brokers() },
  { slug: "data-engineering", title: "Data Engineering", description: "What makes ML work and stay trustworthy — training and benchmark datasets, feature extraction, and honest model evaluation.", get: () => e.workflows() },
];

const BY_SLUG = new Map(AX_DISCOVERIES.map((d) => [d.slug, d]));
export function getAxDiscovery(slug: string): AxDiscovery | undefined {
  return BY_SLUG.get(slug);
}
