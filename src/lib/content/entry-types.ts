import type { SourceKey } from "@/lib/sources";
import type { SectionSlug } from "@/lib/content/types";
import type { EntityDomain, EntityType } from "@/knowledge-graph/schema";
import { absoluteUrl, entryPath } from "@/lib/routes";

/**
 * Entry content model — the third level of the taxonomy
 * (`/[section]/[category]/[entry]`).
 *
 * Authors write the lean `EntryInput` shape; the registry normalizes each into
 * a fully-resolved `Entry` (filling canonical URL, SEO fields, and the derived
 * disclaimer requirement). This keeps data files small while guaranteeing
 * every page has complete, consistent metadata. See docs/PHASE_2_ENTRY_LAYER.md.
 */

export type EntryKind =
  | "science" // factual astronomy/astrophysics — must cite sources, never astrology
  | "interpretive" // astrology — cultural/symbolic, must carry the disclaimer
  | "cultural" // mythology, heritage — presented as culture, not science
  | "tool" // calculator landing pages (no fake computation in this phase)
  | "historical"; // missions, instruments, history of science — factual, sourced

export type EntryStatus = "published" | "planned";
export type EntryDifficulty = "beginner" | "intermediate" | "advanced";
export type EntryJsonLdType = "Article" | "CollectionPage";

export interface EntryFact {
  label: string;
  value: string;
}

/** A body block: a heading plus prose paragraphs and/or a bullet list. */
export interface EntrySection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

/** A single dated event for an entry's timeline. */
export interface EntryTimelineItem {
  /** A date or year label, e.g. "1969" or "July 20, 1969". */
  date: string;
  title: string;
  description?: string;
}

/** Reference to another entry, by [section, category, entry] slugs. */
export type EntryRef = readonly [section: string, category: string, entry: string];
/** Reference to a category, by [section, category] slugs. */
export type CategoryRef = readonly [section: string, category: string];

/** Authoring shape provided by each data module. */
export interface EntryInput {
  section: SectionSlug;
  category: string;
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  excerpt?: string;
  kind: EntryKind;
  status?: EntryStatus;
  difficulty?: EntryDifficulty;
  tags?: string[];
  heroSummary?: string;
  facts?: EntryFact[];
  keyPoints?: string[];
  /** The main body — at least three meaningful sections (enforced). */
  body: EntrySection[];
  /** Optional dated timeline (only well-documented events). */
  timeline?: EntryTimelineItem[];
  sources?: SourceKey[];
  relatedEntries?: EntryRef[];
  relatedCategories?: CategoryRef[];
  seoTitle?: string;
  seoDescription?: string;
  jsonLdType?: EntryJsonLdType;
  /** Override the disclaimer message (e.g. numerology). */
  disclaimer?: string;
  /** Force/suppress the disclaimer; defaults to derived from `kind`. */
  disclaimerRequired?: boolean;

  /* --- Knowledge graph links (optional; see src/knowledge-graph) --- */
  /** Explicit graph entity this entry represents. If omitted, the entry is
   *  matched to an entity by its canonical path (entity.entryPath). */
  graphEntityId?: string;
  /** Additional graph entities this entry references. */
  relatedGraphEntityIds?: string[];
  /** Specific graph relation ids this entry highlights. */
  relationIds?: string[];
  /** The entity type/domain this entry represents (mirrors the graph entity). */
  entityType?: EntityType;
  entityDomain?: EntityDomain;
}

/** Fully-resolved entry consumed by pages and helpers. */
export interface Entry {
  section: SectionSlug;
  category: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  excerpt: string;
  kind: EntryKind;
  status: EntryStatus;
  difficulty: EntryDifficulty;
  tags: string[];
  heroSummary: string;
  facts: EntryFact[];
  keyPoints: string[];
  body: EntrySection[];
  timeline: EntryTimelineItem[];
  sources: SourceKey[];
  relatedEntries: EntryRef[];
  relatedCategories: CategoryRef[];
  seoTitle: string;
  seoDescription: string;
  jsonLdType: EntryJsonLdType;
  disclaimer?: string;
  disclaimerRequired: boolean;
  path: string;
  canonicalUrl: string;
  graphEntityId?: string;
  relatedGraphEntityIds: string[];
  relationIds: string[];
  entityType?: EntityType;
  entityDomain?: EntityDomain;
}

/** Identity helper for typed data modules: `defineEntries([...])`. */
export function defineEntries(entries: EntryInput[]): EntryInput[] {
  return entries;
}

/** Whether a kind makes factual claims that require source slots. */
export function kindRequiresSources(kind: EntryKind): boolean {
  return kind === "science" || kind === "historical" || kind === "tool";
}

/** Whether a kind must carry the interpretive (astrology) disclaimer. */
export function kindRequiresDisclaimer(kind: EntryKind): boolean {
  return kind === "interpretive";
}

/** Normalize an authoring input into a fully-resolved entry. */
export function resolveEntry(input: EntryInput): Entry {
  const path = entryPath(input.section, input.category, input.slug);
  const excerpt = input.excerpt ?? input.description;
  const disclaimerRequired =
    input.disclaimerRequired ??
    (kindRequiresDisclaimer(input.kind) || input.section === "astrology");

  return {
    section: input.section,
    category: input.category,
    slug: input.slug,
    title: input.title,
    shortTitle: input.shortTitle ?? input.title,
    description: input.description,
    excerpt,
    kind: input.kind,
    status: input.status ?? "published",
    difficulty: input.difficulty ?? "beginner",
    tags: input.tags ?? [],
    heroSummary: input.heroSummary ?? excerpt,
    facts: input.facts ?? [],
    keyPoints: input.keyPoints ?? [],
    body: input.body,
    timeline: input.timeline ?? [],
    sources: input.sources ?? [],
    relatedEntries: input.relatedEntries ?? [],
    relatedCategories: input.relatedCategories ?? [],
    seoTitle: input.seoTitle ?? input.title,
    seoDescription: input.seoDescription ?? input.description,
    jsonLdType: input.jsonLdType ?? "Article",
    disclaimer: input.disclaimer,
    disclaimerRequired,
    path,
    canonicalUrl: absoluteUrl(path),
    graphEntityId: input.graphEntityId,
    relatedGraphEntityIds: input.relatedGraphEntityIds ?? [],
    relationIds: input.relationIds ?? [],
    entityType: input.entityType,
    entityDomain: input.entityDomain,
  };
}
