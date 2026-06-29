import type {
  Category,
  CategoryWithSection,
  Section,
  SectionSlug,
} from "@/lib/content/types";
import { astronomy } from "@/lib/content/sections/astronomy";
import { skyGuide } from "@/lib/content/sections/sky-guide";
import { astrology } from "@/lib/content/sections/astrology";
import { calculators } from "@/lib/content/sections/calculators";
import { encyclopedia } from "@/lib/content/sections/encyclopedia";
import { observatory } from "@/lib/content/sections/observatory";
import { guides } from "@/lib/content/sections/guides";

/**
 * The content registry: the single, ordered source of truth for the site's
 * taxonomy. Navigation, hub pages, category pages, the sitemap, and llms.txt
 * are all derived from this array — add a section or category here and it
 * propagates everywhere.
 */
export const SECTIONS: readonly Section[] = [
  astronomy,
  skyGuide,
  astrology,
  calculators,
  encyclopedia,
  observatory,
  guides,
];

const SECTION_BY_SLUG = new Map<string, Section>(
  SECTIONS.map((section) => [section.slug, section]),
);

/** All sections, in canonical order. */
export function getAllSections(): readonly Section[] {
  return SECTIONS;
}

/** Look up a section by slug. Returns undefined for unknown slugs. */
export function getSection(slug: string): Section | undefined {
  return SECTION_BY_SLUG.get(slug);
}

/** Look up a category within a section. Returns undefined if either is unknown. */
export function getCategory(
  sectionSlug: string,
  categorySlug: string,
): CategoryWithSection | undefined {
  const section = getSection(sectionSlug);
  if (!section) return undefined;
  const category = section.categories.find((c) => c.slug === categorySlug);
  if (!category) return undefined;
  return { section, category };
}

/** Every category, flattened, each paired with its parent section. */
export function getAllCategories(): CategoryWithSection[] {
  return SECTIONS.flatMap((section) =>
    section.categories.map((category) => ({ section, category })),
  );
}

/** Params for statically generating every category route. */
export function getAllCategoryParams(): { section: string; category: string }[] {
  return getAllCategories().map(({ section, category }) => ({
    section: section.slug,
    category: category.slug,
  }));
}

/** Sibling categories within the same section (excludes the given one). */
export function getSiblingCategories(
  section: Section,
  current: Category,
  limit = 4,
): Category[] {
  return section.categories
    .filter((c) => c.slug !== current.slug)
    .slice(0, limit);
}

/** A small, curated set of cross-hub links for the homepage and footers. */
export function getOtherSections(slug: SectionSlug): Section[] {
  return SECTIONS.filter((s) => s.slug !== slug);
}

/** Total counts — used in copy and docs, never fabricated. */
export const REGISTRY_STATS = {
  sectionCount: SECTIONS.length,
  categoryCount: SECTIONS.reduce((n, s) => n + s.categories.length, 0),
} as const;
