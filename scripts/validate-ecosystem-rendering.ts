/**
 * Server-rendered ecosystem link gate.
 *
 * The whole SEO argument for the ecosystem bar is that its links are in the
 * HTML the server sends, not injected after a click. That property is easy to
 * lose by accident — moving the directory behind a state check, fetching the
 * registry in an effect, turning a link into a button with an onClick — and a
 * browser's DevTools would still show the links afterwards, because by then
 * React has hydrated. Only the raw HTML tells the truth.
 *
 * So this reads the PRERENDERED HTML from the build output and asserts every
 * ecosystem URL is present in it, on ordinary pages, before any JavaScript runs.
 *
 *   tsx scripts/validate-ecosystem-rendering.ts              # .next build output
 *   tsx scripts/validate-ecosystem-rendering.ts --origin URL # a live deployment
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  ECOSYSTEM_WEBSITES,
  ECOSYSTEM_APPS,
  ECOSYSTEM_PATH,
  allEcosystemUrls,
} from "../src/lib/ecosystem/projects";

const ROOT = join(import.meta.dirname, "..");
const failures: string[] = [];

/** Pages that must all carry the bar: the global shell, sampled across families. */
const SAMPLED_PAGES = [
  { label: "homepage", file: "index.html", path: "/" },
  { label: "entity page", file: "astronomy/planets/jupiter.html", path: "/astronomy/planets/jupiter" },
  { label: "editorial page", file: "encyclopedia/timeline.html", path: "/encyclopedia/timeline" },
  { label: "developer page", file: "developers/api.html", path: "/developers/api" },
  { label: "dataset index", file: "datasets.html", path: "/datasets" },
  { label: "calculators", file: "calculators.html", path: "/calculators" },
  { label: "gallery", file: "images.html", path: "/images" },
  { label: "ecosystem directory", file: "ecosystem.html", path: ECOSYSTEM_PATH },
];

/** Routes that must NOT carry it — the bar belongs in the HTML shell only. */
const MUST_NOT_CONTAIN = [
  { label: "robots.txt", file: "robots.txt.body", path: "/robots.txt" },
  { label: "llms.txt", file: "llms.txt.body", path: "/llms.txt" },
  { label: "graph JSON export", file: "data/graph.json.body", path: "/data/graph.json" },
];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const ORIGIN = arg("origin");

async function load(target: { file: string; path: string }): Promise<string | null> {
  if (ORIGIN) {
    try {
      const res = await fetch(`${ORIGIN.replace(/\/$/, "")}${target.path}`, {
        headers: { "user-agent": "asteriastar-ecosystem-render-check/1.0" },
      });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }
  const p = join(ROOT, ".next", "server", "app", target.file);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

/** HTML-escaped ampersands: Play Store URLs contain `&`, which React encodes. */
function containsUrl(html: string, url: string): boolean {
  return html.includes(url) || html.includes(url.replace(/&/g, "&amp;"));
}

async function main() {
  const urls = allEcosystemUrls();
  const unique = [...new Set(urls)];
  console.log(
    `[ecosystem-render] checking ${unique.length} unique outbound URL(s) across ${SAMPLED_PAGES.length} page(s)` +
      (ORIGIN ? ` on ${ORIGIN}` : " in the build output"),
  );

  let checkedPages = 0;
  for (const page of SAMPLED_PAGES) {
    const html = await load(page);
    if (html === null) {
      // A missing sample is a gap in coverage, not a pass.
      failures.push(`${page.label} (${page.path}) could not be read — coverage for it is unverified`);
      continue;
    }
    checkedPages++;

    const missing = unique.filter((u) => !containsUrl(html, u));
    if (missing.length > 0) {
      failures.push(
        `${page.label} (${page.path}) is missing ${missing.length} ecosystem URL(s) from its server-rendered HTML:\n        ` +
          missing.slice(0, 6).join("\n        ") +
          (missing.length > 6 ? `\n        …and ${missing.length - 6} more` : ""),
      );
    }

    // Real anchors, not JS-navigated buttons.
    for (const site of ECOSYSTEM_WEBSITES) {
      if (!new RegExp(`<a[^>]+href="${site.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html)) {
        failures.push(`${page.label}: ${site.name} (${site.url}) is present but not as an <a href> — crawlers need a real link`);
      }
    }

    // The accessible landmark and the crawlable directory link.
    if (!/aria-label="HELPERG Ecosystem"/.test(html)) {
      failures.push(`${page.label}: no navigation landmark named "HELPERG Ecosystem"`);
    }
    if (!new RegExp(`href="${ECOSYSTEM_PATH}"`).test(html)) {
      failures.push(`${page.label}: does not link to ${ECOSYSTEM_PATH}`);
    }
    // Exactly one bar. Two would mean a duplicate was introduced somewhere.
    const barCount = (html.match(/aria-label="HELPERG Ecosystem"/g) ?? []).length;
    if (barCount > 1) failures.push(`${page.label}: ${barCount} ecosystem bars rendered; there must be exactly one`);
  }

  // Non-HTML routes must stay clean.
  for (const target of MUST_NOT_CONTAIN) {
    const body = await load(target);
    if (body === null) continue; // absent locally is fine; only a positive hit is a failure
    if (/aria-label="HELPERG Ecosystem"/.test(body) || ECOSYSTEM_WEBSITES.some((s) => containsUrl(body, s.url) && s.id !== "asteriastar")) {
      failures.push(`${target.label} (${target.path}) contains ecosystem markup or links; it must not`);
    }
  }

  if (failures.length > 0) {
    console.error("✗ Server-rendered ecosystem gate FAILED:\n");
    for (const f of failures) console.error(`  · ${f}`);
    console.error("");
    process.exit(1);
  }

  console.log(
    `✓ Ecosystem links are server-rendered — all ${unique.length} outbound URLs present as real <a href> in ${checkedPages} page(s), ` +
      `one landmark per page, ${ECOSYSTEM_WEBSITES.length} websites and ${ECOSYSTEM_APPS.length} apps, no JavaScript required.`,
  );
}

void main();
