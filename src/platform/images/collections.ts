import { ACTIVE_COLLECTIONS, COLLECTION_BY_SLUG, IMAGES_BY_COLLECTION } from "@/knowledge-graph/data/image-catalog";
import type { CollectionDef, ImageRecord } from "@/knowledge-graph/data/image-catalog/types";

/** Collection helpers over the image catalogue. */
export const imageCollections = {
  all: (): CollectionDef[] => ACTIVE_COLLECTIONS,
  get: (slug: string): CollectionDef | undefined => COLLECTION_BY_SLUG.get(slug),
  images: (slug: string): ImageRecord[] => (IMAGES_BY_COLLECTION.get(slug) ?? []).slice(),
  slugs: (): string[] => ACTIVE_COLLECTIONS.map((c) => c.slug),
  withCounts: (): { collection: CollectionDef; count: number }[] =>
    ACTIVE_COLLECTIONS.map((c) => ({ collection: c, count: IMAGES_BY_COLLECTION.get(c.slug)?.length ?? 0 })),
};
