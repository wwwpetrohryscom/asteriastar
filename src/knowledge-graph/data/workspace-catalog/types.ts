import type { SourceKey } from "@/lib/sources";

/**
 * Research Workspace data model (Program BV). Each feature is a first-class entity describing a
 * capability of a PRIVACY-FIRST, local-only research workspace: saving entities, organising them into
 * collections / reading lists / observation projects, taking notes, collecting citations, and exporting
 * to JSON / Markdown / BibTeX / CSV. The workspace holds NO account and NO server data — everything
 * lives in the browser's localStorage, sets no cookie, and is never tracked. These entities are
 * platform-feature meta-nodes (excluded from scientific graph traversal via isMetaNode); they describe
 * the workspace, they are not scientific facts. Nothing is fabricated.
 */

export type WorkspaceCategory = "saving" | "organising" | "notes" | "citations" | "exports" | "privacy";

export const CATEGORY_LABEL: Record<WorkspaceCategory, string> = {
  saving: "Saving",
  organising: "Organising",
  notes: "Notes",
  citations: "Citations",
  exports: "Exports",
  privacy: "Privacy",
};

/** Where a feature's data lives. In this workspace it is always the browser only — never a server. */
export type StorageScope = "local-only";

export interface WorkspaceFeatureRecord {
  /** Stable graph id, "workspace_feature:<slug>". */
  id: string;
  slug: string;
  name: string;
  category: WorkspaceCategory;
  altNames?: string[];
  /** Required plain-language description of the feature. */
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** Short label of the capability, e.g. "Save any entity to a local workspace". */
  capability: string;
  /** Where this feature's data lives — always "local-only" in this privacy-first workspace. */
  storage: StorageScope;

  /* cross-references */
  relatedKeys?: string[]; // full ids of sibling features / reused entities (associated_with)

  /* display */
  highlights?: string[];
}
