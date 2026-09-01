/**
 * Where the Journal lives, in one place.
 *
 * The publication is a separate Netlify project reached through a same-host proxy rewrite. Its
 * public identity is `asteriastar.com/blog` and only that — the `*.netlify.app` origin behind the
 * proxy is infrastructure and must never appear in a link, a canonical, or anything this project
 * renders. Nothing here is derived from an environment variable for that reason: a preview
 * deployment cannot accidentally publish a preview hostname if there is no way to express one.
 *
 * CLIENT-SAFE: plain constants, no imports. The search integration runs in the browser.
 */

const HOST = "asteriastar.com";
const BASE_PATH = "/blog";
const ORIGIN = `https://${HOST}`;

export const JOURNAL = {
  /** The publication's public name, used wherever it is named in full. */
  name: "AsteriaStar Journal",
  /** The one-word label used in navigation. */
  label: "Journal",
  host: HOST,
  /** Site-relative root. Every Journal link on this site starts here. */
  basePath: BASE_PATH,
  /** The feed of recent articles, regenerated on every Journal deploy. */
  latestFeedUrl: `${ORIGIN}${BASE_PATH}/latest.json`,
  /** The Journal's own search index, published for exactly this purpose. */
  searchIndexUrl: `${ORIGIN}${BASE_PATH}/search-index.json`,
} as const;
