import {
  resolveEntry,
  kindRequiresSources,
  kindRequiresDisclaimer,
  type Entry,
  type EntryInput,
  type EntryRef,
} from "@/lib/content/entry-types";
import { getCategory, getSection } from "@/lib/content/registry";

import { astronomyStars } from "./astronomy-stars";
import { astronomyPlanets } from "./astronomy-planets";
import { astronomyDwarfPlanets } from "./astronomy-dwarf-planets";
import { astronomySpaceMissions } from "./astronomy-space-missions";
import { astronomySpaceTelescopes } from "./astronomy-space-telescopes";
import { astrologyZodiacSigns } from "./astrology-zodiac-signs";
import { astrologyPlanetMeanings } from "./astrology-planet-meanings";
import { encyclopediaGlossary } from "./encyclopedia-glossary";
import { encyclopediaMythology } from "./encyclopedia-mythology";
import { calculatorsPhysics } from "./calculators-physics";

/**
 * The entry registry — the third level of the content taxonomy.
 *
 * All data modules are aggregated, normalized, and validated here. Validation
 * runs at import time and THROWS on any violation, which fails `next build` and
 * `npm run validate` — a hard quality gate. See validateEntries() for the rules
 * and docs/PHASE_2_ENTRY_LAYER.md for the rationale.
 */
const INPUTS: EntryInput[] = [
  ...astronomyStars,
  ...astronomyPlanets,
  ...astronomyDwarfPlanets,
  ...astronomySpaceMissions,
  ...astronomySpaceTelescopes,
  ...astrologyZodiacSigns,
  ...astrologyPlanetMeanings,
  ...encyclopediaGlossary,
  ...encyclopediaMythology,
  ...calculatorsPhysics,
];

export const ENTRIES: Entry[] = INPUTS.map(resolveEntry);

const BY_PATH = new Map<string, Entry>(ENTRIES.map((e) => [e.path, e]));

function refToPath([section, category, entry]: EntryRef): string {
  return `/${section}/${category}/${entry}`;
}

const LOREM = /lorem ipsum/i;

/**
 * Validate the entire registry. Returns a list of human-readable issues
 * (empty when valid). Enforces the science/tradition boundary, source slots,
 * uniqueness, link integrity, and non-thin content.
 */
export function validateEntries(): string[] {
  const issues: string[] = [];
  const seenPaths = new Map<string, number>();
  const seenSeoTitles = new Map<string, string>();
  const seenSeoDescriptions = new Map<string, string>();

  for (const e of ENTRIES) {
    const id = e.path;

    // 1. Section + category must exist in the taxonomy.
    if (!getSection(e.section)) {
      issues.push(`${id}: unknown section "${e.section}"`);
    } else if (!getCategory(e.section, e.category)) {
      issues.push(`${id}: unknown category "${e.section}/${e.category}"`);
    }

    // 2. Duplicate slug / canonical URL (path is unique per entry).
    seenPaths.set(id, (seenPaths.get(id) ?? 0) + 1);

    // 3. Duplicate SEO titles / descriptions.
    const titleKey = e.seoTitle.trim().toLowerCase();
    if (seenSeoTitles.has(titleKey)) {
      issues.push(`${id}: duplicate SEO title "${e.seoTitle}" (also ${seenSeoTitles.get(titleKey)})`);
    } else {
      seenSeoTitles.set(titleKey, id);
    }
    const descKey = e.seoDescription.trim().toLowerCase();
    if (seenSeoDescriptions.has(descKey)) {
      issues.push(`${id}: duplicate SEO description (also ${seenSeoDescriptions.get(descKey)})`);
    } else {
      seenSeoDescriptions.set(descKey, id);
    }

    // 4. Science / factual entries must declare source slots.
    if (kindRequiresSources(e.kind) && e.sources.length === 0) {
      issues.push(`${id}: ${e.kind} entry must declare at least one source`);
    }

    // 5. Science/tradition boundary via the disclaimer flag.
    if (kindRequiresDisclaimer(e.kind) && !e.disclaimerRequired) {
      issues.push(`${id}: interpretive entry must require the disclaimer`);
    }
    if (
      !kindRequiresDisclaimer(e.kind) &&
      e.section !== "astrology" &&
      e.disclaimerRequired
    ) {
      issues.push(`${id}: ${e.kind} entry must NOT carry the astrology disclaimer`);
    }

    // 6. Non-thin content: at least three real body sections.
    if (e.body.length < 3) {
      issues.push(`${id}: body must have at least 3 sections (has ${e.body.length})`);
    }
    for (const section of e.body) {
      if (!section.heading?.trim()) issues.push(`${id}: a body section is missing a heading`);
      const hasProse = (section.paragraphs?.length ?? 0) > 0 || (section.list?.length ?? 0) > 0;
      if (!hasProse) issues.push(`${id}: body section "${section.heading}" has no content`);
    }

    // 7. Related links must resolve.
    for (const ref of e.relatedEntries) {
      if (!BY_PATH.has(refToPath(ref))) {
        issues.push(`${id}: related entry not found → ${refToPath(ref)}`);
      }
    }
    for (const [s, c] of e.relatedCategories) {
      if (!getCategory(s, c)) {
        issues.push(`${id}: related category not found → ${s}/${c}`);
      }
    }

    // 8. No placeholder text.
    const text = [
      e.title,
      e.description,
      e.excerpt,
      e.heroSummary,
      ...e.body.flatMap((b) => [b.heading, ...(b.paragraphs ?? []), ...(b.list ?? [])]),
    ].join(" ");
    if (LOREM.test(text)) issues.push(`${id}: contains placeholder lorem ipsum text`);
  }

  for (const [path, count] of seenPaths) {
    if (count > 1) issues.push(`${path}: duplicate entry path / canonical URL (${count}×)`);
  }

  return issues;
}

// Hard gate: a malformed registry fails the build and `npm run validate`.
const ISSUES = validateEntries();
if (ISSUES.length > 0) {
  throw new Error(
    `Entry registry validation failed (${ISSUES.length} issue${ISSUES.length === 1 ? "" : "s"}):\n` +
      ISSUES.map((i) => `  • ${i}`).join("\n"),
  );
}

/* ---------------------------------------------------------------- helpers */

/** All entries, published-only by default. */
export function getAllEntries(includeUnpublished = false): Entry[] {
  return includeUnpublished
    ? ENTRIES
    : ENTRIES.filter((e) => e.status === "published");
}

/** Look up a single published entry. */
export function getEntry(
  section: string,
  category: string,
  entry: string,
): Entry | undefined {
  const found = BY_PATH.get(`/${section}/${category}/${entry}`);
  return found && found.status === "published" ? found : undefined;
}

/** Published entries within a category, in registry order. */
export function getEntriesByCategory(
  section: string,
  category: string,
): Entry[] {
  return getAllEntries().filter(
    (e) => e.section === section && e.category === category,
  );
}

/** Whether a category has any published entries. */
export function categoryHasEntries(section: string, category: string): boolean {
  return getEntriesByCategory(section, category).length > 0;
}

/**
 * Related entries for an entry: explicit references first, then same-category
 * siblings to fill up to `limit`. Published only, deduped, excludes self.
 */
export function getRelatedEntries(entry: Entry, limit = 4): Entry[] {
  const out: Entry[] = [];
  const seen = new Set<string>([entry.path]);

  for (const ref of entry.relatedEntries) {
    const found = BY_PATH.get(refToPath(ref));
    if (found && found.status === "published" && !seen.has(found.path)) {
      out.push(found);
      seen.add(found.path);
    }
  }
  if (out.length < limit) {
    for (const sibling of getEntriesByCategory(entry.section, entry.category)) {
      if (out.length >= limit) break;
      if (!seen.has(sibling.path)) {
        out.push(sibling);
        seen.add(sibling.path);
      }
    }
  }
  return out.slice(0, limit);
}

export function getEntryPath(entry: Entry): string {
  return entry.path;
}

/** Params for generateStaticParams on the entry route (published only). */
export function getAllEntryParams(): {
  section: string;
  category: string;
  entry: string;
}[] {
  return getAllEntries().map((e) => ({
    section: e.section,
    category: e.category,
    entry: e.slug,
  }));
}

export const ENTRY_STATS = {
  total: getAllEntries().length,
  byKind: getAllEntries().reduce<Record<string, number>>((acc, e) => {
    acc[e.kind] = (acc[e.kind] ?? 0) + 1;
    return acc;
  }, {}),
} as const;
