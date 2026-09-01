/**
 * Is the Journal still findable?
 *
 * The Journal was reachable for months as one row among roughly eighty inside a mega-menu panel.
 * Every automated check passed the whole time: the link was in the HTML, the sitemap listed the
 * publication, the routing gate proved the proxy worked. What none of them asked was whether a
 * person would ever find it. This gate asks that, in the only place the answer is real — the HTML
 * the server actually sends.
 *
 * It reads served HTML, never React source. A component can be edited, a group can be dropped from
 * the navigation model, a layout can be swapped for one that omits the footer, and the source would
 * still contain the word "Journal" somewhere. Only the response says what a reader receives.
 *
 * Three questions per page:
 *
 *   1. Is there a crawlable link to the Journal at all — a real <a href="/blog">, not a button?
 *   2. Is it in the HEADER, outside any panel, so it is visible without opening a menu?
 *   3. Is it in the FOOTER?
 *
 * And once, on the homepage: does the page acknowledge the publication in its own content?
 *
 *   npx tsx scripts/blog/validate-journal-presence.ts https://asteriastar.com
 *   npx tsx scripts/blog/validate-journal-presence.ts http://localhost:3000
 */

const baseOrigin = (process.argv[2] ?? "").replace(/\/+$/, "");
if (!baseOrigin || !/^https?:\/\//.test(baseOrigin)) {
  console.error("usage: validate-journal-presence <origin>");
  process.exit(2);
}

/**
 * A representative page from each layout family.
 *
 * The point of the list is that these do NOT all share one template. A gate that only checked the
 * homepage would not notice a hub, an entity page or a policy page losing the global navigation.
 */
const PAGES = [
  "/",
  "/explore",
  "/encyclopedia",
  "/exoplanets",
  "/data",
  "/live",
  "/search",
  "/platform",
  "/authority",
  "/gallery",
  "/learn",
  "/transparency/evidence-framework",
  "/about",
];

const problems: string[] = [];
const fail = (message: string) => problems.push(message);

interface Page {
  path: string;
  html: string;
}

async function get(path: string): Promise<Page | null> {
  try {
    const response = await fetch(`${baseOrigin}${path}`, { redirect: "follow" });
    if (!response.ok) {
      fail(`${path}: HTTP ${response.status}`);
      return null;
    }
    return { path, html: await response.text() };
  } catch (error) {
    fail(`${path}: request failed — ${error instanceof Error ? error.message : "unknown"}`);
    return null;
  }
}

/** Every anchor whose href is the Journal root, in source order. */
function journalAnchors(html: string): number[] {
  const positions: number[] = [];
  const pattern = /<a\b[^>]*\shref="\/blog"[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) positions.push(match.index);
  return positions;
}

/**
 * The span of the global header, and of the footer.
 *
 * Located by the elements themselves rather than by class names, which are Tailwind soup and change
 * whenever the design does.
 */
function region(html: string, tag: "header" | "footer"): { start: number; end: number } | null {
  const start = html.search(new RegExp(`<${tag}\\b`, "i"));
  if (start === -1) return null;
  const end = html.toLowerCase().indexOf(`</${tag}>`, start);
  if (end === -1) return null;
  return { start, end };
}

async function check(path: string): Promise<void> {
  const page = await get(path);
  if (!page) return;

  const anchors = journalAnchors(page.html);
  if (anchors.length === 0) {
    fail(`${path}: no crawlable <a href="/blog"> anywhere in the served HTML`);
    return;
  }

  const header = region(page.html, "header");
  const footer = region(page.html, "footer");

  if (!header) {
    fail(`${path}: no <header> in the served HTML`);
  } else if (!anchors.some((at) => at > header.start && at < header.end)) {
    fail(`${path}: the header contains no link to the Journal`);
  }

  if (!footer) {
    fail(`${path}: no <footer> in the served HTML`);
  } else if (!anchors.some((at) => at > footer.start && at < footer.end)) {
    fail(`${path}: the footer contains no link to the Journal`);
  }

  /*
   * The header link must not be buried in a mega-menu panel.
   *
   * This is the exact defect the gate exists for, so it is checked structurally rather than trusted:
   * the panels are the only descendants of the header that sit inside a `hidden` container, so a
   * header whose ONLY Journal anchor is inside one is a header where the link cannot be seen without
   * opening a menu.
   */
  if (header) {
    const inHeader = anchors.filter((at) => at > header.start && at < header.end);
    const visible = inHeader.filter((at) => {
      const before = page.html.slice(header.start, at);
      // Count unclosed <div class="… hidden …"> wrappers preceding the anchor.
      const opened = (before.match(/<div\b[^>]*\bclass="[^"]*\bhidden\b[^"]*"[^>]*>/gi) ?? []).length;
      const closed = (before.match(/<\/div>/gi) ?? []).length;
      return opened === 0 || closed >= opened;
    });
    if (inHeader.length > 0 && visible.length === 0) {
      fail(`${path}: the header's only Journal link is inside a hidden panel — it cannot be seen without opening a menu`);
    }
  }
}

async function checkHomepageModule(): Promise<void> {
  const page = await get("/");
  if (!page) return;
  if (!page.html.includes("AsteriaStar Journal")) {
    fail("/: the homepage does not name the publication anywhere in its content");
  }
  const anchors = journalAnchors(page.html);
  // Header, footer, and the homepage module itself — three distinct places, not one link reused.
  if (anchors.length < 3) {
    fail(`/: only ${anchors.length} link(s) to the Journal; expected the header, the footer and the homepage section`);
  }
}

async function run(): Promise<void> {
  console.log(`Journal presence gate — ${baseOrigin}\n`);

  for (const path of PAGES) await check(path);
  await checkHomepageModule();

  if (problems.length > 0) {
    console.error(`\n✗ Journal presence gate failed — ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  • ${problem}`);
    console.error("\nThe Journal is a first-class area of this site. It must be reachable from the header and the footer of every page.");
    process.exit(1);
  }

  console.log(`  · ${PAGES.length} pages across every layout family`);
  console.log("  · each serves a crawlable link to the Journal from both the header and the footer");
  console.log("  · the header link is outside any collapsed panel");
  console.log("\n✓ Journal presence gate passed.");
}

void run();

export {};
