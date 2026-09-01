import { JOURNAL } from "@/lib/journal/config";
import { journalHrefFromUrl } from "@/lib/journal/url";

/**
 * The platform's client for the Journal's published feed.
 *
 * The Journal is a separate application with its own repository, build and deploy history. This
 * project must never need to rebuild because an article was published — that constraint is the whole
 * reason the two are split — so the list of latest articles is fetched at request time from a static
 * document the Journal regenerates on every one of its own deploys.
 *
 * TRUST BOUNDARY. The feed is ours, but it arrives over the network from another deployment, and
 * "it's our own service" is how unvalidated data gets rendered. Every field is checked here, and
 * anything that fails a check is dropped rather than repaired: a malformed item is not worth
 * guessing at, and guessing is how a wrong date or a wrong link reaches a reader. Nothing from this
 * module is ever rendered as HTML — the values are text, and React escapes them.
 *
 * FAILS SOFT, ALWAYS. Every failure path returns an empty list: a timeout, a non-200, invalid JSON,
 * the wrong shape, an oversized body, or the Journal project being down entirely. The homepage then
 * renders without article rows and keeps its link to the publication. The separation between the two
 * applications is a reliability boundary, and a boundary that can take down the caller is not one.
 */

export interface JournalArticle {
  id: string;
  title: string;
  description: string;
  /** Site-relative, always under the Journal's public namespace. */
  href: string;
  sectionTitle: string;
  /** ISO date, as published. */
  publishedAt: string;
  /** Pre-formatted for display, so the component does no date arithmetic. */
  publishedLabel: string;
}

/**
 * How long a fetched feed is reused.
 *
 * A `fetch` revalidate lower than the route's own pulls the WHOLE route's revalidation down to it,
 * so this number is not only the feed's freshness — it is how often the homepage regenerates. Thirty
 * minutes is the balance that was chosen: an article is visible on the homepage within half an hour
 * of the Journal deploying, and the homepage regenerates 48 times a day instead of once, which for a
 * single page whose other inputs are build-time constants is a rounding error.
 *
 * It is deliberately not indefinite, and deliberately not per-request.
 */
export const JOURNAL_FEED_REVALIDATE_SECONDS = 1800;

/** Anything larger is not a feed of a handful of articles; it is a mistake or an attack. */
const MAX_FEED_BYTES = 512 * 1024;

/** The feed can list many; the homepage shows a few. Bounded here so a huge feed cannot be rendered. */
const MAX_ITEMS = 5;

const TIMEOUT_MS = 4_000;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** An ISO date the platform can actually format, or null. A wrong date is worse than no date. */
function publishedDate(value: unknown): Date | null {
  if (!isNonEmptyString(value)) return null;
  if (!/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toArticle(raw: unknown): JournalArticle | null {
  if (typeof raw !== "object" || raw === null) return null;
  const item = raw as Record<string, unknown>;

  const href = journalHrefFromUrl(item.url);
  const date = publishedDate(item.publishedAt);
  if (!href || !date) return null;
  if (!isNonEmptyString(item.id) || !isNonEmptyString(item.title)) return null;

  return {
    id: item.id.trim(),
    title: item.title.trim(),
    description: isNonEmptyString(item.description) ? item.description.trim() : "",
    href,
    sectionTitle: isNonEmptyString(item.sectionTitle) ? item.sectionTitle.trim() : "",
    publishedAt: date.toISOString(),
    publishedLabel: date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
  };
}

export async function getLatestJournalArticles(): Promise<JournalArticle[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(JOURNAL.latestFeedUrl, {
      signal: controller.signal,
      next: { revalidate: JOURNAL_FEED_REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });
    if (!response.ok) return [];

    // Read as text first: `response.json()` on a multi-megabyte body would parse it before anything
    // here could object to the size.
    const body = await response.text();
    if (body.length > MAX_FEED_BYTES) return [];

    const parsed: unknown = JSON.parse(body);
    if (typeof parsed !== "object" || parsed === null) return [];
    const items = (parsed as Record<string, unknown>).items;
    if (!Array.isArray(items)) return [];

    const articles: JournalArticle[] = [];
    for (const item of items) {
      const article = toArticle(item);
      if (article) articles.push(article);
      if (articles.length === MAX_ITEMS) break;
    }
    return articles;
  } catch {
    // Timeout, DNS failure, connection reset, invalid JSON — every one of them means the same thing
    // to the caller: render without article rows.
    return [];
  } finally {
    clearTimeout(timer);
  }
}
