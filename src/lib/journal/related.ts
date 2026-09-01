import { JOURNAL } from "@/lib/journal/config";
import { journalHrefFromUrl } from "@/lib/journal/url";

/**
 * "Is there Journal writing about this page?"
 *
 * A deterministic lookup, not a recommendation engine. An article declares the platform pages it is
 * about in its own front matter; the Journal publishes those paths in its search index; this reads
 * them and matches on exact path. Nothing is inferred from titles, nothing is scored, and there is
 * no similarity model to explain or defend — if an editor did not say an article is about a page, it
 * does not appear on that page.
 *
 * Read at request time, cached, so publishing an article surfaces it on the relevant platform pages
 * without this project rebuilding.
 *
 * TRUST BOUNDARY, as with the feed: the index arrives from another deployment and every row is
 * validated. A row whose path escapes the Journal's namespace is dropped rather than rendered.
 */

export interface RelatedJournalArticle {
  id: string;
  title: string;
  description: string;
  href: string;
  sectionTitle: string;
  publishedAt: string;
  publishedLabel: string;
}

/**
 * How long the index is reused.
 *
 * Longer than the homepage feed's: a page's related articles change only when an editor points a new
 * article at it, which is rarer than publishing. Any page that renders this component inherits the
 * period as its own revalidation frequency, so it is deliberately not aggressive.
 */
export const JOURNAL_RELATED_REVALIDATE_SECONDS = 3600;

const MAX_INDEX_BYTES = 512 * 1024;
const TIMEOUT_MS = 4_000;

/** More than this on one page stops being context and starts being a feed. */
const MAX_RELATED = 3;

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

/**
 * Normalises a platform path for comparison.
 *
 * Trailing slashes and case are not meaningful distinctions between `/exoplanets` and `/Exoplanets/`,
 * and an article that named one form should match a page served at the other. A query string is
 * dropped: it never identifies a different page here.
 */
function normalisePath(value: string): string {
  const withoutQuery = value.split(/[?#]/)[0];
  const trimmed = withoutQuery.length > 1 ? withoutQuery.replace(/\/+$/, "") : withoutQuery;
  return trimmed.toLowerCase();
}

function publishedDate(value: unknown): Date | null {
  const raw = text(value);
  if (!raw || !/^\d{4}-\d{2}-\d{2}(T|$)/.test(raw)) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

interface IndexDoc {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  url?: unknown;
  sectionTitle?: unknown;
  publishedAt?: unknown;
  relatedPaths?: unknown;
}

/**
 * Articles that name `path` among the platform pages they are about.
 *
 * Returns an empty list on every failure, and on the ordinary case of nothing matching. The caller
 * renders nothing at all for an empty list — an empty "From the Journal" box is worse than no box.
 */
export async function getRelatedJournalArticles(path: string): Promise<RelatedJournalArticle[]> {
  const wanted = normalisePath(path);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(JOURNAL.searchIndexUrl, {
      signal: controller.signal,
      next: { revalidate: JOURNAL_RELATED_REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });
    if (!response.ok) return [];

    const body = await response.text();
    if (body.length > MAX_INDEX_BYTES) return [];

    const parsed: unknown = JSON.parse(body);
    if (typeof parsed !== "object" || parsed === null) return [];
    const documents = (parsed as Record<string, unknown>).documents;
    if (!Array.isArray(documents)) return [];

    const matches: RelatedJournalArticle[] = [];
    for (const raw of documents) {
      if (typeof raw !== "object" || raw === null) continue;
      const doc = raw as IndexDoc;

      const related = Array.isArray(doc.relatedPaths) ? doc.relatedPaths : [];
      const names = related.some((candidate) => typeof candidate === "string" && normalisePath(candidate) === wanted);
      if (!names) continue;

      const id = text(doc.id);
      const title = text(doc.title);
      // `url`, not `path` — see lib/journal/url for why the difference matters.
      const href = journalHrefFromUrl(doc.url);
      const date = publishedDate(doc.publishedAt);
      if (!id || !title || !href || !date) continue;

      matches.push({
        id,
        title,
        description: text(doc.description) ?? "",
        href,
        sectionTitle: text(doc.sectionTitle) ?? "",
        publishedAt: date.toISOString(),
        publishedLabel: date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
      });
    }

    // Newest first, then bounded. Stable regardless of the order the Journal happens to publish in.
    matches.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return matches.slice(0, MAX_RELATED);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
