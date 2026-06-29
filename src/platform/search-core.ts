import type { LocaleCode } from "@/platform/localization";

/**
 * Universal Search Core — architecture.
 *
 * Defines the platform search contract: a set of typed providers, every result
 * originating from graph entities. This is the design only — the live search
 * engine is not implemented here. The current static index lives in
 * src/lib/search.ts (buildSearchIndex); these providers describe how that index,
 * and any future backend, is organized.
 */

export type SearchOrigin = "entity" | "relation" | "derived";

export interface SearchProvider {
  id: string;
  label: string;
  description: string;
  /** Every result ultimately originates from graph entities. */
  origin: SearchOrigin;
}

export const SEARCH_PROVIDERS: SearchProvider[] = [
  { id: "entities", label: "Entities", description: "Stars, planets, galaxies, missions, and every other graph entity.", origin: "entity" },
  { id: "relationships", label: "Relationships", description: "Typed connections between entities.", origin: "relation" },
  { id: "datasets", label: "Datasets", description: "Open datasets derived from entities.", origin: "derived" },
  { id: "learning-paths", label: "Learning Paths", description: "Structured journeys across entities.", origin: "derived" },
  { id: "comparisons", label: "Comparisons", description: "Side-by-side entity comparisons.", origin: "derived" },
  { id: "guides", label: "Guides", description: "Editorial content built on entities.", origin: "derived" },
  { id: "images", label: "Images", description: "Provenance-first imagery linked to entities.", origin: "entity" },
  { id: "organizations", label: "Organizations", description: "Agencies and institutions (entities).", origin: "entity" },
  { id: "astronomers", label: "Astronomers", description: "People entities in the graph.", origin: "entity" },
  { id: "missions", label: "Space Missions", description: "Mission entities and their targets.", origin: "entity" },
];

/** A search request (contract; no live handler implemented). */
export interface SearchQuery {
  q: string;
  providers?: string[];
  locale?: LocaleCode;
  limit?: number;
}

/** A single result, always traceable to a graph entity where applicable. */
export interface SearchResultRef {
  providerId: string;
  entityId?: string;
  title: string;
  href: string;
  snippet?: string;
}

export interface SearchResponse {
  query: SearchQuery;
  results: SearchResultRef[];
  total: number;
}

const PROVIDER_IDS = new Set(SEARCH_PROVIDERS.map((p) => p.id));
export function isSearchProvider(id: string): boolean {
  return PROVIDER_IDS.has(id);
}

export function validateSearchCore(items = SEARCH_PROVIDERS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const p of items) {
    if (seen.has(p.id)) issues.push(`duplicate search provider: ${p.id}`);
    seen.add(p.id);
    if (!p.label?.trim()) issues.push(`${p.id}: missing label`);
  }
  return issues;
}

export const SEARCH_STATS = {
  providers: SEARCH_PROVIDERS.length,
} as const;
