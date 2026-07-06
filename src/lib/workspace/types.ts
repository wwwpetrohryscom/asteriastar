/**
 * Research Workspace data model (Program BV). Everything here lives ONLY in the browser's
 * localStorage — there is no account, no server persistence, no cookie, and no tracking. The types
 * describe what a researcher collects locally: saved entities, collections (including reading lists and
 * observation projects), notes, and a citation folder. Ids and timestamps are generated in the browser
 * on user action; nothing is sent anywhere.
 */

/** A bookmarked knowledge-graph entity (reused by reference — id/name/type/href only). */
export interface SavedEntity {
  id: string;
  name: string;
  type: string;
  href: string;
  addedAt: number;
}

/** A named group of saved entities. `kind` distinguishes a plain collection, an ordered reading list,
 *  and an observation project (a collection of observing targets). */
export type CollectionKind = "collection" | "reading-list" | "observation-project";

export interface Collection {
  id: string;
  name: string;
  kind: CollectionKind;
  description?: string;
  /** Ordered entity ids (order is meaningful for reading lists). */
  entityIds: string[];
  createdAt: number;
  updatedAt: number;
}

/** A free-text note, optionally attached to a saved entity. */
export interface WorkspaceNote {
  id: string;
  title: string;
  body: string;
  /** Entity id this note is attached to, if any. */
  entityId?: string;
  createdAt: number;
  updatedAt: number;
}

/** An item in the citation folder — a reference to a real citation record or a saved entity's sources. */
export interface CitationRef {
  id: string;
  /** A citation-registry id (from src/lib/citations), if this references a specific citation. */
  citationId?: string;
  /** An entity id whose sources/citations are collected, if this references an entity. */
  entityId?: string;
  label: string;
  addedAt: number;
}

/** The entire workspace — the single object serialised to localStorage. */
export interface WorkspaceState {
  version: number;
  savedEntities: SavedEntity[];
  collections: Collection[];
  notes: WorkspaceNote[];
  citations: CitationRef[];
}

/** A slim entity descriptor the server passes to the client entity picker (no graph in the bundle). */
export interface WorkspacePickItem {
  id: string;
  name: string;
  type: string;
  href: string;
}

export const EMPTY_WORKSPACE: WorkspaceState = {
  version: 1,
  savedEntities: [],
  collections: [],
  notes: [],
  citations: [],
};

export const COLLECTION_KIND_LABELS: Record<CollectionKind, string> = {
  collection: "Collection",
  "reading-list": "Reading list",
  "observation-project": "Observation project",
};
