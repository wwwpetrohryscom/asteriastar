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

/* ------------------------------------------------ publication hard gate */

/** Editorial-incompleteness phrases that must never reach a published page. */
const PLACEHOLDER_COPY =
  /(this is a foundation page|what this topic will cover|planned material includes|we are building this|coming soon|lorem ipsum|\bTBD\b|\bTODO\b)/i;

/**
 * Validate every category in the taxonomy. A category is a *published page*:
 * it must carry real body content and real questions, not a promise of future
 * material. Returns human-readable issues (empty when valid).
 */
export function validateCategories(): string[] {
  const issues: string[] = [];
  const seenSummaries = new Map<string, string>();

  for (const section of SECTIONS) {
    for (const c of section.categories) {
      const id = `${section.slug}/${c.slug}`;

      if (!c.body || c.body.length < 3) {
        issues.push(`${id}: body must have at least 3 published sections (has ${c.body?.length ?? 0})`);
      }
      for (const b of c.body ?? []) {
        if (!b.heading?.trim()) issues.push(`${id}: a body section is missing a heading`);
        const words =
          (b.paragraphs ?? []).join(" ").split(/\s+/).filter(Boolean).length +
          (b.list ?? []).join(" ").split(/\s+/).filter(Boolean).length;
        if (words < 25) {
          issues.push(`${id}: body section "${b.heading}" is too thin (${words} words)`);
        }
      }

      if (!c.faqs || c.faqs.length < 2) {
        issues.push(`${id}: must publish at least 2 real FAQs (has ${c.faqs?.length ?? 0})`);
      }
      for (const f of c.faqs ?? []) {
        if (!f.question.trim().endsWith("?")) issues.push(`${id}: FAQ "${f.question}" is not a question`);
        if (f.answer.split(/\s+/).length < 20) issues.push(`${id}: FAQ "${f.question}" has a stub answer`);
        // "What is <title>?" is only acceptable when the title is a single
        // singular term, where the question reads naturally ("What is
        // synastry?"). Templating it onto a clause or a plural produces the
        // ungrammatical filler this gate exists to prevent ("What is How Stars
        // Form?", "What is Zodiac Signs?").
        if (f.question.trim().toLowerCase() === `what is ${c.name.toLowerCase()}?`) {
          const words = c.name.trim().split(/\s+/);
          const plural = /(?<!s)s$/i.test(c.name.trim());
          if (words.length > 1 || plural) {
            issues.push(`${id}: FAQ "${f.question}" is templated from the page title`);
          }
        }
      }

      // Science and reference categories make factual claims — they must
      // declare where those claims come from.
      if ((section.kind === "science" || section.kind === "reference" || section.kind === "learning") &&
          (c.sources?.length ?? 0) === 0) {
        issues.push(`${id}: ${section.kind} category must declare at least one source`);
      }

      const prose = [
        c.summary, c.overview,
        ...(c.keyPoints ?? []),
        ...(c.body ?? []).flatMap((b) => [b.heading, ...(b.paragraphs ?? []), ...(b.list ?? [])]),
        ...(c.faqs ?? []).flatMap((f) => [f.question, f.answer]),
      ].join(" ");
      const hit = prose.match(PLACEHOLDER_COPY);
      if (hit) issues.push(`${id}: contains placeholder copy "${hit[0]}"`);

      const sumKey = c.summary.trim().toLowerCase();
      if (seenSummaries.has(sumKey)) {
        issues.push(`${id}: duplicate summary (also ${seenSummaries.get(sumKey)})`);
      } else {
        seenSummaries.set(sumKey, id);
      }
    }
  }
  return issues;
}

// Hard gate: an unfinished category fails `next build` and `npm run validate`.
const CATEGORY_ISSUES = validateCategories();
if (CATEGORY_ISSUES.length > 0) {
  throw new Error(
    `Category registry validation failed (${CATEGORY_ISSUES.length} issue${CATEGORY_ISSUES.length === 1 ? "" : "s"}):\n` +
      CATEGORY_ISSUES.map((i) => `  • ${i}`).join("\n"),
  );
}

/** Total counts — used in copy and docs, never fabricated. */
export const REGISTRY_STATS = {
  sectionCount: SECTIONS.length,
  categoryCount: SECTIONS.reduce((n, s) => n + s.categories.length, 0),
  categoryBodySections: SECTIONS.reduce(
    (n, s) => n + s.categories.reduce((m, c) => m + c.body.length, 0),
    0,
  ),
  categoryFaqs: SECTIONS.reduce(
    (n, s) => n + s.categories.reduce((m, c) => m + c.faqs.length, 0),
    0,
  ),
} as const;
