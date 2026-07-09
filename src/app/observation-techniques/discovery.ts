import { engine } from "@/platform/data-engine";
import type { CgRecord } from "@/knowledge-graph/data/observation-techniques-catalog/types";

/** Engine-driven discovery hubs for the Professional Observation Techniques Encyclopedia. */
export interface CgDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CgRecord[];
}

const e = engine.observationTechniques;

export const CG_DISCOVERIES: CgDiscovery[] = [
  { slug: "imaging-techniques", title: "Imaging Techniques", description: "How celestial images are captured — astrophotography and its planetary, deep-sky, and narrowband variants, and the autoguiding that keeps a telescope on target.", get: () => e.imaging() },
  { slug: "processing-techniques", title: "Processing Techniques", description: "How raw exposures become a finished image — calibration frames, image processing, drizzle, and plate solving.", get: () => e.processing() },
  { slug: "visual-and-workflow", title: "Visual & Workflow", description: "Observing by eye and the end-to-end imaging workflow that ties the whole equipment chain together.", get: () => [...e.visual(), ...e.workflow()] },
];

const BY_SLUG = new Map(CG_DISCOVERIES.map((d) => [d.slug, d]));
export function getCgDiscovery(slug: string): CgDiscovery | undefined {
  return BY_SLUG.get(slug);
}
