import { IMAGES, IMAGE_BY_SLUG } from "@/knowledge-graph/data/image-catalog";
import type { ImageRecord } from "@/knowledge-graph/data/image-catalog/types";

/**
 * Related-image recommendations: images sharing a collection, the same depicted
 * object, or the same capturing telescope/mission. Pure and deterministic.
 */
export function relatedImages(slug: string, limit = 6): ImageRecord[] {
  const img = IMAGE_BY_SLUG.get(slug);
  if (!img) return [];
  const collections = new Set(img.collections);
  const scored = IMAGES.filter((o) => o.slug !== slug).map((o) => {
    let score = 0;
    if (o.objectEntityId && o.objectEntityId === img.objectEntityId) score += 3;
    for (const c of o.collections) if (collections.has(c)) score += 2;
    if (o.telescopeId && o.telescopeId === img.telescopeId) score += 1;
    if (o.missionId && o.missionId === img.missionId) score += 1;
    return { o, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.o);
}
