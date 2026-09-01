/*
 * Playwright is deliberately NOT a dependency of this repository — see
 * scripts/ecosystem/browser-qa.mjs, which resolves it the same way and explains why: a browser
 * download on every `npm ci` costs more than a manual QA tool returns. This follows that precedent
 * rather than inventing a second convention.
 */
const PLAYWRIGHT_CANDIDATES = ["@playwright/test", "playwright", "/Users/agent/agricultureid/node_modules/@playwright/test/index.js"];
let chromium;
for (const candidate of PLAYWRIGHT_CANDIDATES) {
  try {
    const mod = await import(candidate);
    chromium = (mod.default ?? mod).chromium;
    if (chromium) break;
  } catch {
    /* try the next candidate */
  }
}
if (!chromium) {
  console.error(
    "Playwright is not installed and could not be resolved from a sibling project.\n" +
      "Install it with `npm i -D @playwright/test && npx playwright install chromium`, then re-run.",
  );
  process.exit(2);
}

/**
 * Responsive QA for the Journal's place in the global navigation.
 *
 * The presence gate reads served HTML, which proves a link exists and is crawlable. It cannot prove
 * a person can SEE it: a link can be in the markup and be clipped, collapsed to zero width, hidden
 * behind a breakpoint, or pushed off the end of a header that no longer fits. Adding an item to a
 * header is exactly the change that causes that, so this measures the rendered layout in a real
 * browser at the widths the site is actually used at.
 *
 * At every width it checks:
 *
 *   · the page does not scroll horizontally
 *   · the Journal is reachable — visibly in the header on desktop, or through the primary menu on
 *     mobile, opened the way a person would open it
 *   · the header's own items do not overlap each other
 *
 *   node scripts/blog/journal-responsive-qa.mjs http://localhost:3210
 */

const origin = (process.argv[2] ?? "").replace(/\/+$/, "");
if (!origin) {
  console.error("usage: journal-responsive-qa <origin>");
  process.exit(2);
}

const WIDTHS = [
  { w: 1440, h: 900 },
  { w: 1280, h: 800 },
  { w: 1024, h: 768 },
  { w: 820, h: 1180 },
  { w: 768, h: 1024 },
  { w: 430, h: 932 },
  { w: 390, h: 844 },
  { w: 360, h: 800 },
];

/**
 * Which navigation is in use at this width?
 *
 * Asked of the page rather than assumed from the number. The site switches to the hamburger below
 * `lg` (1024px), so 820px and 768px are "mobile" as far as navigation goes even though they are
 * tablet-sized — a first version of this script hard-coded them as desktop and reported three
 * failures that were its own mistake, not the site's.
 */
async function navigationMode(page) {
  return page.evaluate(() => {
    const toggle = document.querySelector('button[aria-controls="mobile-menu"]');
    const visible = toggle && toggle.getBoundingClientRect().width > 0;
    return visible ? "menu" : "bar";
  });
}

/** One page per layout family that a reader actually lands on. */
const PAGES = ["/", "/encyclopedia", "/exoplanets"];

const problems = [];
const fail = (m) => problems.push(m);

/**
 * Is the Journal link visible in the header without opening anything?
 *
 * "Visible" is measured, not assumed: a non-zero box, inside the viewport, and not behind
 * `visibility`/`opacity`. The mega-menu panel's copy of the link fails all of this while closed,
 * which is the point — that copy is what the site had before, and it is not discoverability.
 */
async function headerJournalVisible(page) {
  return page.evaluate(() => {
    const header = document.querySelector("header");
    if (!header) return { ok: false, reason: "no <header>" };
    const anchors = [...header.querySelectorAll('a[href="/blog"]')];
    if (anchors.length === 0) return { ok: false, reason: "no /blog anchor in the header" };

    for (const a of anchors) {
      const rect = a.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.right <= 0 || rect.left >= window.innerWidth) continue;
      const style = getComputedStyle(a);
      if (style.visibility === "hidden" || Number(style.opacity) === 0) continue;
      // Not inside a closed panel: every ancestor must be displayed.
      let node = a.parentElement;
      let hidden = false;
      while (node && node !== header) {
        const s = getComputedStyle(node);
        if (s.display === "none" || s.visibility === "hidden") { hidden = true; break; }
        node = node.parentElement;
      }
      if (hidden) continue;
      return { ok: true, text: a.textContent.trim(), width: Math.round(rect.width) };
    }
    return { ok: false, reason: `${anchors.length} /blog anchor(s) in the header, none of them visible` };
  });
}

/** Open the mobile menu the way a person would, then look for the Journal. */
async function mobileJournalReachable(page) {
  const toggle = page.locator('button[aria-controls="mobile-menu"]');
  if ((await toggle.count()) === 0) return { ok: false, reason: "no mobile menu button" };
  await toggle.first().click();
  await page.waitForSelector("#mobile-menu", { state: "visible", timeout: 5000 });

  const link = page.locator('#mobile-menu a[href="/blog"]').first();
  if ((await link.count()) === 0) return { ok: false, reason: "the mobile menu contains no Journal link" };
  if (!(await link.isVisible())) return { ok: false, reason: "the mobile menu's Journal link is not visible" };

  /*
   * Is the panel itself actually usable?
   *
   * `isVisible()` is not enough and a real defect proved it: the panel is `position: fixed` inside a
   * header that sets `backdrop-filter`, which makes the header the containing block for its fixed
   * descendants — so the panel opened 49px tall, showing one word. Playwright still called the links
   * visible, because they were laid out inside a scrollable box; a person could not use them.
   *
   * So measure the panel against the viewport, and require the link's own box to sit inside it.
   */
  const usable = await page.evaluate(() => {
    const menu = document.querySelector("#mobile-menu");
    if (!menu) return { ok: false, reason: "the menu vanished" };
    const m = menu.getBoundingClientRect();
    const share = m.height / window.innerHeight;
    if (share < 0.5) {
      return { ok: false, reason: `the menu panel is only ${Math.round(m.height)}px tall — ${Math.round(share * 100)}% of the viewport` };
    }
    const a = menu.querySelector('a[href="/blog"]');
    const r = a.getBoundingClientRect();
    if (r.bottom > m.bottom + 1 || r.top < m.top - 1) {
      return { ok: false, reason: "the Journal link is laid out outside the visible panel" };
    }
    if (r.bottom > window.innerHeight) {
      return { ok: false, reason: "the Journal link sits below the fold when the menu opens" };
    }
    return { ok: true };
  });
  if (!usable.ok) return usable;

  /*
   * How far down the menu is it? The whole defect being fixed was a link a reader would never scroll
   * to, so "present in the menu" is not the bar — it has to be near the top.
   */
  const position = await page.evaluate(() => {
    const menu = document.querySelector("#mobile-menu");
    const first = menu?.querySelector('a[href="/blog"]');
    if (!menu || !first) return null;
    const all = [...menu.querySelectorAll("a")];
    return { index: all.indexOf(first) + 1, total: all.length };
  });
  await page.keyboard.press("Escape").catch(() => {});
  return { ok: true, ...position };
}

async function horizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return Math.max(0, doc.scrollWidth - doc.clientWidth);
  });
}

/** Header children must not sit on top of one another after gaining an item. */
async function headerOverlap(page) {
  return page.evaluate(() => {
    const header = document.querySelector("header");
    if (!header) return [];
    const row = header.firstElementChild;
    if (!row) return [];
    const boxes = [...row.children]
      .map((el) => ({ el: el.tagName + (el.className ? `.${String(el.className).split(" ")[0]}` : ""), r: el.getBoundingClientRect() }))
      .filter((b) => b.r.width > 0 && b.r.height > 0);
    const hits = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].r, b = boxes[j].r;
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        // A couple of pixels is antialiasing; a real collision is wider than that.
        if (overlapX > 2 && overlapY > 2) hits.push(`${boxes[i].el} ⨯ ${boxes[j].el} (${Math.round(overlapX)}px)`);
      }
    }
    return hits;
  });
}

const browser = await chromium.launch();
console.log(`Journal responsive QA — ${origin}\n`);

for (const { w, h } of WIDTHS) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  const notes = [];
  let kind = "";

  for (const path of PAGES) {
    /*
     * Retry the navigation until the global header is actually there.
     *
     * Against a REMOTE origin this run makes two dozen navigations in quick succession, and a few of
     * them come back without a rendered document — a throttled or dropped response, not a missing
     * header. A first version reported eleven "no <header>" failures on a deploy preview whose HTML,
     * fetched on its own, contained a header every time. Retrying distinguishes a site that lost its
     * navigation from a request that lost its response; the failure below is only reported when the
     * page genuinely arrives without one.
     */
    let loaded = false;
    for (let attempt = 1; attempt <= 3 && !loaded; attempt++) {
      try {
        await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
        loaded = await page.evaluate(() => Boolean(document.querySelector("header")));
      } catch {
        loaded = false;
      }
      if (!loaded && attempt < 3) await page.waitForTimeout(1500 * attempt);
    }
    if (!loaded) {
      fail(`${w}px ${path}: no <header> after 3 attempts`);
      continue;
    }

    const overflow = await horizontalOverflow(page);
    if (overflow > 0) fail(`${w}px ${path}: ${overflow}px of horizontal overflow`);

    const overlaps = await headerOverlap(page);
    for (const hit of overlaps) fail(`${w}px ${path}: header items overlap — ${hit}`);

    const mode = await navigationMode(page);
    if (path === "/") kind = mode === "menu" ? "menu" : "header bar";

    if (mode === "menu") {
      const reach = await mobileJournalReachable(page);
      if (!reach.ok) fail(`${w}px ${path}: ${reach.reason}`);
      else {
        /*
         * Near the top, not merely present. The defect being fixed was a link nobody would scroll
         * to; a fix that leaves it seventieth in the menu has moved the problem, not solved it.
         */
        if (reach.index > 8) {
          fail(`${w}px ${path}: the Journal is link ${reach.index} of ${reach.total} in the menu — too far down to find`);
        }
        if (path === "/") notes.push(`menu link ${reach.index}/${reach.total}`);
      }
    } else {
      const visible = await headerJournalVisible(page);
      if (!visible.ok) fail(`${w}px ${path}: ${visible.reason}`);
      else if (path === "/") notes.push(`header "${visible.text}" ${visible.width}px`);
    }
  }

  console.log(`  · ${String(w).padStart(4)}px ${kind.padEnd(10)} no overflow, no header collision, Journal reachable${notes.length ? ` — ${notes.join(", ")}` : ""}`);
  await context.close();
}

await browser.close();

if (problems.length > 0) {
  console.error(`\n✗ Responsive QA failed — ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  • ${problem}`);
  process.exit(1);
}
console.log("\n✓ Responsive QA passed — the Journal is reachable at every tested width, with no overflow or collision.");
