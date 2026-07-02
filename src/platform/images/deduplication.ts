import { IMAGES, dedupeKey } from "@/knowledge-graph/data/image-catalog";
import type { ImageRecord } from "@/knowledge-graph/data/image-catalog/types";

/**
 * Duplicate detection. Because the platform holds provenance records rather than
 * image binaries, deduplication works on a deterministic catalogue key
 * (object + source + title + year), NOT a fabricated pixel/perceptual hash. This
 * catches accidental duplicate catalogue entries.
 */
export function findDuplicateGroups(records: ImageRecord[] = IMAGES): ImageRecord[][] {
  const byKey = new Map<string, ImageRecord[]>();
  for (const r of records) {
    const k = dedupeKey(r);
    (byKey.get(k) ?? byKey.set(k, []).get(k)!).push(r);
  }
  return [...byKey.values()].filter((g) => g.length > 1);
}

export function hasDuplicates(records: ImageRecord[] = IMAGES): boolean {
  return findDuplicateGroups(records).length > 0;
}
