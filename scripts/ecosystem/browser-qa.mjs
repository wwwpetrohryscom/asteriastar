/**
 * Ecosystem bar browser QA.
 *
 *   npx next start -p 3112 &
 *   node scripts/ecosystem/browser-qa.mjs                 # http://localhost:3112
 *   ORIGIN=https://asteriastar.com node scripts/ecosystem/browser-qa.mjs
 *
 * A global sticky element cannot be verified by static analysis. The build, the
 * type checker and the markup scanner all passed on a first version of this
 * component that was NOT STICKY AT ALL — `relative` and `[position:sticky]`
 * both compiled to a `position` declaration and the loser was decided by
 * stylesheet order. Only a real viewport, scrolled, catches that.
 *
 * Checks, at 360/390/430/768/1280px across four pages:
 *   • no horizontal overflow, closed or open
 *   • bar pinned at viewport top, header directly below it, content below that
 *   • both bars still visible after scrolling — no auto-hide
 *   • collapsed panel's links are in the DOM but [hidden], so they are not
 *     invisible tab stops
 *   • aria-expanded toggles, Enter opens, Escape closes and returns focus
 *   • open panel caps to the viewport and scrolls internally
 *   • zero console errors
 *   • cumulative layout shift
 *
 * Playwright is not a dependency of this repository — it is resolved from a
 * sibling project if present, and the script exits with a clear message if it
 * is not. This is deliberate: it is a manual QA tool, not a CI gate, and adding
 * a browser download to every `npm ci` would cost more than it returns.
 */
const PLAYWRIGHT_CANDIDATES = [
  "@playwright/test",
  "/Users/agent/agricultureid/node_modules/@playwright/test/index.js",
];
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

const ORIGIN = process.env.ORIGIN || "http://localhost:3111";
const WIDTHS = [360, 390, 430, 768, 1280];
const PAGES = ["/", "/ecosystem", "/astronomy/planets/jupiter", "/encyclopedia/timeline"];
const failures = [];
const notes = [];

const browser = await chromium.launch({ args: ["--no-sandbox"] });

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 780 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

  for (const path of PAGES) {
    await page.goto(`${ORIGIN}${path}`, { waitUntil: "networkidle" });

    // 1. No horizontal overflow anywhere on the page.
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    if (overflow.scrollW > overflow.clientW + 1) {
      failures.push(`${width}px ${path}: horizontal overflow (scrollWidth ${overflow.scrollW} > ${overflow.clientW})`);
    }

    // 2. The bar exists, is at the very top, and the header sits directly below.
    const geom = await page.evaluate(() => {
      const bar = document.querySelector('nav[aria-label="HELPERG Ecosystem"]');
      const header = document.querySelector("header");
      const main = document.querySelector("main");
      if (!bar || !header || !main) return null;
      const b = bar.getBoundingClientRect();
      const h = header.getBoundingClientRect();
      const m = main.getBoundingClientRect();
      return { bTop: b.top, bBottom: b.bottom, bH: b.height, hTop: h.top, hBottom: h.bottom, mTop: m.top };
    });
    if (!geom) { failures.push(`${width}px ${path}: bar, header or main missing`); continue; }
    if (Math.abs(geom.bTop) > 1) failures.push(`${width}px ${path}: bar not at viewport top (top=${geom.bTop})`);
    if (geom.hTop < geom.bBottom - 1) failures.push(`${width}px ${path}: header overlaps the bar (headerTop ${geom.hTop} < barBottom ${geom.bBottom})`);
    if (geom.mTop < geom.hBottom - 1) failures.push(`${width}px ${path}: content starts under the header (mainTop ${geom.mTop} < headerBottom ${geom.hBottom})`);
    if (geom.bH > 56) failures.push(`${width}px ${path}: bar is ${geom.bH}px tall — too much viewport for a secondary bar`);

    // 3. Both stay visible after scrolling — no auto-hide.
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(150);
    const afterScroll = await page.evaluate(() => {
      const bar = document.querySelector('nav[aria-label="HELPERG Ecosystem"]');
      const header = document.querySelector("header");
      const b = bar.getBoundingClientRect(); const h = header.getBoundingClientRect();
      return { bTop: b.top, bVisible: b.bottom > 0 && b.top < innerHeight, hVisible: h.bottom > 0 && h.top < innerHeight, hTop: h.top, bBottom: b.bottom };
    });
    if (!afterScroll.bVisible) failures.push(`${width}px ${path}: ecosystem bar disappeared after scrolling`);
    if (!afterScroll.hVisible) failures.push(`${width}px ${path}: site header disappeared after scrolling`);
    if (Math.abs(afterScroll.bTop) > 1) failures.push(`${width}px ${path}: bar not pinned to top after scroll (top=${afterScroll.bTop})`);
    if (afterScroll.hTop < afterScroll.bBottom - 1) failures.push(`${width}px ${path}: after scroll the header overlaps the bar`);
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // 4. Disclosure behaviour + accessibility, once per width.
  await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
  const trigger = page.locator('nav[aria-label="HELPERG Ecosystem"] button[aria-expanded]');
  if (await trigger.count() !== 1) {
    failures.push(`${width}px: expected exactly one disclosure trigger, found ${await trigger.count()}`);
  } else {
    if (await trigger.getAttribute("aria-expanded") !== "false") failures.push(`${width}px: trigger does not start aria-expanded="false"`);
    const panelId = await trigger.getAttribute("aria-controls");
    if (!panelId) failures.push(`${width}px: trigger has no aria-controls`);
    const panel = page.locator(`[id="${panelId}"]`);

    // Collapsed: links must be in the DOM but not focusable.
    const collapsed = await page.evaluate((id) => {
      const p = document.getElementById(id);
      return { inDom: !!p, linkCount: p ? p.querySelectorAll("a[href]").length : 0, hidden: p ? p.hasAttribute("hidden") : null };
    }, panelId);
    if (collapsed.linkCount < 30) failures.push(`${width}px: collapsed panel holds only ${collapsed.linkCount} links in the DOM`);
    if (!collapsed.hidden) failures.push(`${width}px: collapsed panel is not [hidden] — its links would be tab stops`);

    await trigger.click();
    await page.waitForTimeout(200);
    if (await trigger.getAttribute("aria-expanded") !== "true") failures.push(`${width}px: aria-expanded did not become true on click`);
    const openVisible = await panel.isVisible().catch(() => false);
    if (!openVisible) failures.push(`${width}px: panel not visible after opening`);

    // Panel must fit the viewport and scroll internally, not overflow the page.
    const panelBox = await page.evaluate((id) => {
      const p = document.getElementById(id); if (!p) return null;
      const r = p.getBoundingClientRect();
      return { right: r.right, left: r.left, height: r.height, scrollable: p.scrollHeight > p.clientHeight, clientH: p.clientHeight, innerH: innerHeight };
    }, panelId);
    if (panelBox && (panelBox.left < -1 || panelBox.right > width + 1)) failures.push(`${width}px: open panel overflows horizontally (${panelBox.left}..${panelBox.right})`);
    if (panelBox && panelBox.clientH > panelBox.innerH) failures.push(`${width}px: open panel is taller than the viewport and does not cap`);

    const ofAfterOpen = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (ofAfterOpen) failures.push(`${width}px: opening the panel introduced horizontal page overflow`);

    // Escape closes and focus returns to the trigger.
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    if (await trigger.getAttribute("aria-expanded") !== "false") failures.push(`${width}px: Escape did not close the panel`);
    const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("aria-expanded") === "false");
    if (!focusBack) failures.push(`${width}px: focus did not return to the trigger after Escape`);

    // Keyboard open (Enter) — it must be a real button, not a div.
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    if (await trigger.getAttribute("aria-expanded") !== "true") failures.push(`${width}px: Enter did not open the panel`);
    await page.keyboard.press("Escape");
  }

  if (consoleErrors.length) {
    for (const e of [...new Set(consoleErrors)].slice(0, 5)) failures.push(`${width}px: console error — ${e}`);
  } else {
    notes.push(`${width}px: no console errors`);
  }
  await ctx.close();
}

// 5. Layout shift attributable to the bar.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}/`, { waitUntil: "load" });
  const cls = await page.evaluate(() => new Promise((resolve) => {
    let total = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) total += e.value; }).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => resolve(total), 3000);
  }));
  notes.push(`CLS on homepage @390px: ${Number(cls).toFixed(4)}`);
  if (Number(cls) > 0.1) failures.push(`CLS ${Number(cls).toFixed(4)} exceeds 0.1`);
  await ctx.close();
}

await browser.close();

console.log(`\n${notes.length} note(s):`);
for (const n of notes) console.log(`  · ${n}`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} browser QA failure(s):`);
  for (const f of failures) console.error(`  · ${f}`);
  process.exit(1);
}
console.log(`\n✓ Browser QA passed across ${WIDTHS.join(", ")}px on ${PAGES.length} pages`);
