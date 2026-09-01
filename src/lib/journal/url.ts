import { JOURNAL } from "@/lib/journal/config";

/**
 * Turning something the Journal published into a link this site may render.
 *
 * One parser, used by every consumer of the Journal's documents, because the alternative is three
 * slightly different ideas of what counts as a safe link and one of them eventually being wrong.
 *
 * WHICH FIELD TO READ. The Journal's documents carry both a `url` and a `path`, and they do NOT mean
 * the same thing: `url` is absolute and site-correct, while `path` is relative to the PUBLICATION —
 * `/data/an-article`, not `/blog/data/an-article`. A consumer that reads `path` and treats it as
 * site-relative produces links to platform routes that do not exist. Read `url`.
 *
 * CLIENT-SAFE: one config import, no data layer.
 */

/**
 * A site-relative href inside the Journal, or null.
 *
 * Everything is checked rather than assumed, because these values arrive over the network from
 * another deployment:
 *
 *   · it must parse as a URL, over https
 *   · it must be on this site's public host — never the Journal's `*.netlify.app` origin, which is
 *     infrastructure and must never become a link a reader can follow
 *   · it must be inside the Journal's own namespace, and `/blogger` must not pass for `/blog`
 *
 * The fragment is dropped and the query preserved; neither can smuggle a different destination past
 * the host and prefix checks above.
 */
export function journalHrefFromUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (url.host !== JOURNAL.host) return null;
  if (url.pathname !== JOURNAL.basePath && !url.pathname.startsWith(`${JOURNAL.basePath}/`)) return null;

  return `${url.pathname}${url.search}`;
}
