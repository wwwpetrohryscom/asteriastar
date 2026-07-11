import type { SourceKey } from "@/lib/sources";

/**
 * Content model types for Asteria Star.
 *
 * The site is organized as a two-level taxonomy: top-level **sections** (the
 * knowledge hubs) each contain a set of **categories** (topic areas). This
 * model is intentionally simple but is designed to scale to thousands and
 * eventually hundreds of thousands of pages: individual entries (a specific
 * star, mission, or zodiac sign) will live *under* a category as a third level
 * without changing the section/category structure.
 *
 * See docs/CONTENT_MODEL.md for the full rationale.
 */

/** Stable slugs for the seven top-level knowledge hubs. */
export type SectionSlug =
  | "astronomy"
  | "sky-guide"
  | "astrology"
  | "calculators"
  | "encyclopedia"
  | "observatory"
  | "guides";

/**
 * The editorial nature of a section. This drives styling and, critically,
 * whether the astrology disclaimer is shown. The science / interpretive split
 * is a first-class part of the type system, not an afterthought.
 */
export type SectionKind =
  | "science" // astronomy, sky-guide — evidence-based, sourced
  | "interpretive" // astrology — cultural, symbolic, traditional
  | "tools" // calculators
  | "reference" // encyclopedia
  | "media" // observatory
  | "learning"; // guides

export interface Category {
  /** URL slug, unique within its section. */
  slug: string;
  /** Display name. */
  name: string;
  /** One-sentence summary — used on cards and as a meta-description seed. */
  summary: string;
  /**
   * A short, accurate, definitional overview shown at the top of the category
   * page. Astronomy overviews state textbook-level facts only; astrology
   * overviews are framed as cultural/interpretive. No statistics or specific
   * measurements are asserted here without a cited source.
   */
  overview: string;
  /** Subtopics we plan to publish under this category. Clearly future-facing. */
  plannedTopics: string[];
  /** Source slots this category will draw on. */
  sources?: SourceKey[];
  /**
   * Marks a category as interpretive even when it sits outside the astrology
   * hub (e.g. astrology-based calculators). Forces the interpretive disclaimer.
   */
  interpretive?: boolean;
  /**
   * Optional override for the disclaimer text on an interpretive category.
   * Used for non-astrology traditions such as numerology. Defaults to the
   * standard astrology disclaimer when omitted.
   */
  disclaimer?: string;
  /**
   * Marks a category as a live-data module (Observatory / Sky Guide). The page
   * shows an honest "prepared for integration — no fake live data" notice.
   */
  dataModule?: boolean;
  /** Extra SEO keywords beyond the obvious name. */
  keywords?: string[];
}

export interface Section {
  slug: SectionSlug;
  name: string;
  kind: SectionKind;
  /** Short tagline shown under the hub title. */
  tagline: string;
  /** Meta description for the hub page. */
  description: string;
  /** Longer intro paragraph shown on the hub page. */
  intro: string;
  /** Theme accent token used for badges, borders, and editorial highlights. */
  accent: AccentToken;
  categories: Category[];
}

export type AccentToken =
  | "nebula" // NASA blue — astronomy
  | "aurora" // legacy alias mapped to white/neutral
  | "ember" // legacy alias mapped to editorial red
  | "plasma" // legacy alias mapped to silver/neutral
  | "stone" // legacy alias mapped to silver/neutral
  | "halo" // sky blue — observatory
  | "comet"; // green/teal — guides

/** A resolved category together with its parent section — handy for pages. */
export interface CategoryWithSection {
  section: Section;
  category: Category;
}
