/**
 * Stable, versioned identifiers for the future community API — ARCHITECTURE
 * ONLY. No backend, no persistence. These define the *shape* of stable ids so
 * future user data attaches cleanly to the knowledge graph.
 *
 * Every community object references graph entities by their stable id (e.g.
 * "planet:jupiter") or a content entry by its canonical path. Community objects
 * never store a copy of graph data.
 */

/** The API version these models target. */
export const COMMUNITY_API_VERSION = "v0" as const;

/** A reference to a knowledge-graph entity by its stable id. */
export type EntityRef = string;
/** A reference to a content entry by its canonical path. */
export type EntryRef = string;

/** Branded id types so references can't be mixed up. */
type Brand<K, T> = K & { readonly __brand: T };
export type ProfileId = Brand<string, "ProfileId">;
export type CollectionId = Brand<string, "CollectionId">;
export type ObservationId = Brand<string, "ObservationId">;
export type MediaId = Brand<string, "MediaId">;
export type ContributionId = Brand<string, "ContributionId">;

/** id format conventions (documented; no generation/persistence here). */
export const ID_FORMATS = {
  profile: "profile_<ulid>",
  collection: "collection_<ulid>",
  observation: "observation_<ulid>",
  media: "media_<ulid>",
  contribution: "contribution_<ulid>",
} as const;

/** Common visibility setting for future user objects (privacy-first default). */
export type Visibility = "private" | "unlisted" | "public";
