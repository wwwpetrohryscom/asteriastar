import { socialCard, OG_SIZE, OG_ALT, OG_CONTENT_TYPE } from "@/lib/brand/og-card";

/**
 * Default Twitter / X card, generated at build time — the same AsteriaStar
 * brand card as the Open Graph image.
 */
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TwitterImage() {
  return socialCard();
}
