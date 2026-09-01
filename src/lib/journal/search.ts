import { JOURNAL } from "@/lib/journal/config";
import { journalHrefFromUrl } from "@/lib/journal/url";
import type { SearchDoc } from "@/lib/search/types";

/**
 * Journal articles, as rows in the platform's global search.
 *
 * The Journal publishes a search index at a stable URL for exactly this purpose. This project reads
 * it in the browser, at the moment a visitor engages with search, and merges the rows into the same
 * ranking as everything else. Nothing is read at build time, so publishing an article makes it
 * searchable here without this project rebuilding — which is the same property the homepage feed has
 * and the same reason.
 *
 * TRUST BOUNDARY. This is our publication, but the document arrives over the network from another
 * deployment and is treated as untrusted input. Every row is validated and anything that fails is
 * dropped; in particular a row whose path is not under the Journal's own namespace is discarded, so
 * a misconfigured Journal build cannot inject a link to anywhere else on this site — or to its
 * `*.netlify.app` origin, which must never be a link a reader can follow.
 *
 * CLIENT-SAFE: config constants and a type-only import. Nothing here reaches the data layer.
 */

/**
 * Editorial weight for a Journal article.
 *
 * Deliberately at the bottom of the platform's core band (74–100). An article ABOUT a subject must
 * not outrank the page that IS the subject: someone searching "James Webb Space Telescope" wants the
 * telescope, and reporting that mentions it is a useful second answer, not a better first one. This
 * is not a popularity score — there is no traffic data on this platform, and inventing one would be
 * fabrication.
 */
const JOURNAL_PRIORITY = 76;

/** Longer than any reasonable index of a publication this size. */
const MAX_INDEX_BYTES = 512 * 1024;

const TIMEOUT_MS = 6_000;

interface JournalIndexDoc {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  url?: unknown;
  sectionTitle?: unknown;
  tags?: unknown;
  extract?: unknown;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toSearchDoc(raw: unknown): SearchDoc | null {
  if (typeof raw !== "object" || raw === null) return null;
  const item = raw as JournalIndexDoc;

  const id = text(item.id);
  const title = text(item.title);
  // `url`, not `path`: the Journal's `path` is relative to the publication, so it is missing the
  // /blog prefix and would produce links to platform routes that do not exist. See lib/journal/url.
  const href = journalHrefFromUrl(item.url);
  if (!id || !title || !href) return null;

  const tags = Array.isArray(item.tags) ? item.tags.filter((t): t is string => typeof t === "string" && t.trim() !== "") : [];
  const sectionTitle = text(item.sectionTitle);

  return {
    // Namespaced so a Journal id can never collide with a platform document's.
    i: `journal:${id}`,
    t: title,
    u: href,
    k: sectionTitle ? `Journal · ${sectionTitle}` : "Journal article",
    g: "journal",
    d: text(item.description) ?? text(item.extract) ?? undefined,
    a: tags.length > 0 ? tags : undefined,
    p: JOURNAL_PRIORITY,
  };
}

/**
 * Fetch and map the Journal's index.
 *
 * Returns an empty list on every failure — a non-200, a timeout, invalid JSON, the wrong shape, an
 * oversized body, the Journal being down. Search must keep working when the publication does not;
 * the caller treats an empty result as "no Journal rows", never as an error.
 */
export async function fetchJournalSearchDocs(): Promise<SearchDoc[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(JOURNAL.searchIndexUrl, {
      signal: controller.signal,
      cache: "force-cache",
      headers: { accept: "application/json" },
    });
    if (!response.ok) return [];

    const body = await response.text();
    if (body.length > MAX_INDEX_BYTES) return [];

    const parsed: unknown = JSON.parse(body);
    if (typeof parsed !== "object" || parsed === null) return [];
    const documents = (parsed as Record<string, unknown>).documents;
    if (!Array.isArray(documents)) return [];

    const docs: SearchDoc[] = [];
    for (const document of documents) {
      const doc = toSearchDoc(document);
      if (doc) docs.push(doc);
    }
    return docs;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
