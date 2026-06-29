import type { ImageAsset } from "@/lib/media/types";

/**
 * Image asset registry.
 *
 * Intentionally EMPTY: no copyrighted or fabricated imagery is bundled. When
 * verified, openly-licensed assets (NASA, ESA, Hubble, JWST, public domain,
 * CC BY / CC BY-SA) are sourced, they are added here with full provenance and
 * will render automatically. Until then, galleries show an honest placeholder.
 */
export const IMAGES: ImageAsset[] = [];

/** Validate image records (used by `npm run validate`). */
export function validateImages(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const img of IMAGES) {
    if (seen.has(img.id)) issues.push(`duplicate image id: ${img.id}`);
    seen.add(img.id);
    if (img.published) {
      if (!img.url) issues.push(`${img.id}: published image has no url`);
      if (!img.credit) issues.push(`${img.id}: published image has no credit`);
      if (!img.sourceUrl) issues.push(`${img.id}: published image has no sourceUrl`);
    }
  }
  return issues;
}

/** Published, displayable images for a graph entity id. */
export function getImagesForEntity(entityId: string): ImageAsset[] {
  return IMAGES.filter((i) => i.published && i.url && i.entityId === entityId);
}

/** Published, displayable images for a content entry path. */
export function getImagesForEntryPath(path: string): ImageAsset[] {
  return IMAGES.filter((i) => i.published && i.url && i.entryPath === path);
}

export const IMAGE_STATS = {
  total: IMAGES.length,
  published: IMAGES.filter((i) => i.published && i.url).length,
} as const;
