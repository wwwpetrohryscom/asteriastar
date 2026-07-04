import { engine } from "@/platform/data-engine";
import type { MedRecord } from "@/knowledge-graph/data/space-medicine-catalog/types";

/** Engine-driven discovery hubs for the Life Support, Space Biology & Space Medicine Encyclopedia. */
export interface MedDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => MedRecord[];
}

const e = engine.spaceMedicine;

export const MED_DISCOVERIES: MedDiscovery[] = [
  { slug: "disciplines", title: "Disciplines", description: "The fields of space life science — space medicine, radiation biology, psychology and human factors, and life support.", get: () => e.topics() },
  { slug: "physiological-effects", title: "Physiological Effects", description: "How spaceflight changes the body — bone and muscle loss, fluid shift, vision changes, and more.", get: () => e.effects() },
  { slug: "countermeasures", title: "Countermeasures", description: "How crew health is protected — exercise, nutrition, shielding, lighting, and psychological support.", get: () => e.countermeasuresList() },
  { slug: "life-support-technologies", title: "Life-Support Technologies", description: "The technologies that keep a crew alive — oxygen, carbon-dioxide removal, water recovery, food, and closed ecosystems.", get: () => e.technologies() },
];

const BY_SLUG = new Map(MED_DISCOVERIES.map((d) => [d.slug, d]));
export function getMedDiscovery(slug: string): MedDiscovery | undefined {
  return BY_SLUG.get(slug);
}
