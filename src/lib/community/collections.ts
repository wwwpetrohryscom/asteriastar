import type { CollectionId, EntityRef, EntryRef, ProfileId, Visibility } from "@/lib/community/ids";

/**
 * Knowledge collections — ARCHITECTURE ONLY. A collection is an ordered set of
 * references to existing graph entities and/or content entries. It NEVER
 * duplicates graph data — only ids/paths.
 */

export const COLLECTION_KINDS = [
  "stars",
  "planets",
  "galaxies",
  "nebulae",
  "telescopes",
  "missions",
  "observatories",
  "images",
  "articles",
  "mixed",
] as const;
export type CollectionKind = (typeof COLLECTION_KINDS)[number];

export interface Collection {
  id: CollectionId;
  ownerProfileId: ProfileId;
  title: string;
  description?: string;
  kind: CollectionKind;
  /** References to graph entities (e.g. "star:sirius"). */
  entityRefs: EntityRef[];
  /** References to content entries by canonical path. */
  entryRefs: EntryRef[];
  /** Optional ordered media references. */
  mediaIds?: string[];
  visibility: Visibility;
}

/**
 * Suggested system/example collection *templates* (titles only — no data, no
 * users). These illustrate the future shape; they hold no entity references.
 */
export const COLLECTION_TEMPLATES: { title: string; description: string; kind: CollectionKind }[] = [
  { title: "My Winter Sky", description: "Bright stars and constellations of the winter evening sky.", kind: "stars" },
  { title: "James Webb", description: "The mission, the observatory, and what it has studied.", kind: "telescopes" },
  { title: "Apollo Program", description: "The missions of the crewed lunar era.", kind: "missions" },
  { title: "Northern Hemisphere", description: "Objects well placed for northern observers.", kind: "mixed" },
];
