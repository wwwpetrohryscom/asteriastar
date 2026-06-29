import type { SourceKey } from "@/lib/sources";

/**
 * Image metadata model for the Observatory image platform.
 *
 * We bundle NO copyrighted or fabricated imagery. This is the *architecture*:
 * a typed record of where a licensed image lives, who to credit, and under what
 * license. An asset is only ever rendered when it is `published`, has a `url`,
 * and carries a license + credit. The registry ships empty until verified,
 * openly-licensed assets are added.
 */

export type ImageLicense =
  | "public-domain"
  | "cc-by"
  | "cc-by-sa"
  | "cc0"
  | "nasa-media" // NASA media guidelines (generally public domain)
  | "esa-cc-by-sa";

export type ImageProvider =
  | "nasa"
  | "esa"
  | "hubble"
  | "jwst"
  | "wikimedia"
  | "noirlab"
  | "other";

export const IMAGE_LICENSE_LABELS: Record<ImageLicense, string> = {
  "public-domain": "Public domain",
  "cc-by": "CC BY",
  "cc-by-sa": "CC BY-SA",
  cc0: "CC0",
  "nasa-media": "NASA media (public domain)",
  "esa-cc-by-sa": "ESA (CC BY-SA)",
};

export interface ImageAsset {
  id: string;
  /** Graph entity id this image depicts (e.g. "galaxy:andromeda-galaxy"). */
  entityId?: string;
  /** Or the canonical path of a content entry it belongs to. */
  entryPath?: string;
  title: string;
  /** Accessible alt text (required). */
  alt: string;
  /** Remote, licensed image URL. Absent until an asset is cleared. */
  url?: string;
  /** Required attribution string. */
  credit: string;
  provider: ImageProvider;
  /** Link to the original on the provider's site. */
  sourceUrl: string;
  license: ImageLicense;
  /** Optional source key for cross-referencing the source registry. */
  source?: SourceKey;
  captureDate?: string;
  instrument?: string;
  mission?: string;
  photographer?: string;
  /** Human-readable object name depicted. */
  object?: string;
  /** Only `true` assets with a `url` are ever rendered. */
  published?: boolean;
}
