/**
 * Mobile overflow check.
 *
 *   npm run check:mobile
 *
 * Scans the real rendered HTML of a production build for the layout defects
 * that actually break a narrow viewport, and fails on them.
 *
 * SCOPE, STATED HONESTLY: this is static analysis of markup, not a rendered
 * viewport test. It cannot measure a computed layout, catch a CSS regression in
 * a stylesheet it does not evaluate, or judge whether something merely looks
 * cramped. It catches the structural causes of horizontal scroll — which is the
 * class of defect that is both most common and least visible in code review.
 * A real device or headless-browser pass is still required for visual QA.
 *
 * What it fails on:
 *   • a table with an explicit min-width that is NOT inside a scroll container
 *     (guaranteed horizontal page scroll on a narrow screen)
 *   • an inline fixed pixel width of three digits or more
 *   • an unbroken 40+ character token (checksum, bibcode, identifier) rendered
 *     without a break-all / break-words / font-mono class to wrap it
 *
 * What it deliberately does NOT fail on:
 *   • fluid tables with no min-width — they shrink to fit, which is correct
 *   • Next.js `fill` images, which carry no width/height by design and are
 *     positioned inside an explicitly sized parent
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const APP = join(ROOT, ".next/server/app");

if (!existsSync(APP)) {
  console.error("[check:mobile] No build output. Run `npm run build` first.");
  process.exit(1);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

type Failure = { url: string; kind: string; detail: string };
const failures: Failure[] = [];

let pages = 0;
let tablesFluid = 0;
let tablesScrollable = 0;
let fillImages = 0;

for (const file of walk(APP)) {
  const html = readFileSync(file, "utf8");
  const m = html.match(/<main[^>]*id="main"[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) continue;
  const main = m[1];
  const url = "/" + relative(APP, file).split(sep).join("/").replace(/\.html$/, "");
  pages++;

  // 1. Wide tables must be able to scroll independently of the page.
  const tableRe = /<table[^>]*class="([^"]*)"/gi;
  let t: RegExpExecArray | null;
  while ((t = tableRe.exec(main))) {
    const hasMinWidth = /min-w-/.test(t[1]);
    if (!hasMinWidth) { tablesFluid++; continue; }
    const container = main.slice(Math.max(0, t.index - 300), t.index);
    if (/overflow-(x-)?(auto|scroll)/.test(container)) tablesScrollable++;
    else failures.push({ url, kind: "clipped-table", detail: `table.${t[1].slice(0, 60)} has a min-width but no scroll container` });
  }

  // 2. Inline fixed pixel widths do not respond to the viewport.
  for (const w of main.match(/style="[^"]*width:\s*\d{3,}px[^"]*"/g) ?? []) {
    failures.push({ url, kind: "fixed-px-width", detail: w.slice(0, 70) });
  }

  // 3. Long unbroken identifiers need an explicit break opportunity.
  const tokRe = /<(span|code|td|div|p|dd)([^>]*)>([^<]{40,})</gi;
  let k: RegExpExecArray | null;
  while ((k = tokRe.exec(main))) {
    const text = k[3].trim();
    if (!/^[A-Za-z0-9]{40,}$/.test(text)) continue;
    if (/break-all|break-words|wrap-anywhere|truncate|font-mono/.test(k[2])) continue;
    failures.push({ url, kind: "unbreakable-token", detail: `${text.length}-char token "${text.slice(0, 24)}…" with no break class` });
  }

  fillImages += (main.match(/data-nimg="fill"/g) ?? []).length;
}

console.log(`[check:mobile] ${pages} prerendered pages scanned`);
console.log(`[check:mobile] tables: ${tablesFluid} fluid (shrink to fit) · ${tablesScrollable} wide-and-scrollable`);
console.log(`[check:mobile] ${fillImages} Next.js fill images (sized by their container — not a CLS risk)`);

if (failures.length > 0) {
  console.error(`\n✗ Mobile overflow check failed — ${failures.length} issue${failures.length === 1 ? "" : "s"}:\n`);
  for (const f of failures.slice(0, 40)) console.error(`  [${f.kind}] ${f.url}: ${f.detail}`);
  if (failures.length > 40) console.error(`  …and ${failures.length - 40} more`);
  process.exit(1);
}

console.log(`\n✓ Mobile overflow check passed — no clipped tables, fixed widths, or unbreakable tokens`);
console.log(`  (static markup analysis only — visual QA on a real viewport is still required)`);
