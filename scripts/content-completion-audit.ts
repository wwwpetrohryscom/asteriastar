/**
 * Platform-wide content-completion audit.
 *
 *   npm run content:completion-audit
 *
 * Deterministically audits EVERY prerendered public page by reading the real
 * rendered HTML in `.next/server/app` — not the data model, not a stored
 * completeness flag. What a visitor actually sees is what gets measured.
 *
 * Requires a production build first (`npm run build`). The audit never
 * fabricates coverage: it reports what exists and honestly flags what does not.
 *
 * Output: docs/platform-content-completion-baseline.md (+ a JSON side-car for
 * the permanent gate in scripts/validate-content-completion.ts).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const APP_DIR = join(ROOT, ".next/server/app");

/* ------------------------------------------------------------------ types */

export type PageClass =
  | "editorial" // prose-led topic/guide pages — must read as written content
  | "entity" // a catalogued object/person/mission — structured data led
  | "hub" // index/listing pages — navigation is the content
  | "tool" // calculators, workspace, assistant — interaction is the content
  | "data" // datasets, APIs, exports — the payload is the content
  | "reference" // dictionary/glossary genre — a definition, deliberately short
  | "system"; // policy, about, health dashboards — short by design

export type CompletionStatus =
  | "COMPLETE"
  | "SUBSTANTIAL"
  | "THIN"
  | "PLACEHOLDER"
  | "NON_CONTENT_ROUTE";

export type GapFlag = "DATA_GAP" | "SOURCE_GAP" | "IMAGE_GAP" | "REVIEW_GAP";

export interface PageAudit {
  url: string;
  family: string;
  pageClass: PageClass;
  indexable: boolean;
  title: string;
  words: number;
  sections: number;
  sources: number;
  images: number;
  internalLinks: number;
  dataPoints: number;
  faqs: number;
  reviewed: boolean;
  provenance: boolean;
  placeholders: string[];
  honestDataState: string[];
  status: CompletionStatus;
  gaps: GapFlag[];
}

/* ------------------------------------------------- placeholder detection */

/**
 * Phrases that mean "this page is not written yet". These are editorial
 * incompleteness markers, matched as whole phrases so that legitimate
 * scientific usage ("planned launch", "a planned mission") never trips them.
 */
const HARD_PLACEHOLDERS: { id: string; re: RegExp }[] = [
  { id: "foundation-page", re: /this is a foundation page/i },
  { id: "what-this-will-cover", re: /what this topic will cover/i },
  { id: "planned-material", re: /planned material includes/i },
  { id: "we-are-building", re: /we are building this (topic|page|section)/i },
  { id: "upcoming-material", re: /upcoming material includes/i },
  { id: "coming-soon", re: /\bcoming soon\b/i },
  { id: "content-coming", re: /content (is )?coming\b/i },
  { id: "not-yet-available", re: /this (page|section|topic) is not yet available/i },
  { id: "check-back", re: /check back (soon|later)/i },
  { id: "lorem", re: /lorem ipsum/i },
  { id: "todo", re: /\b(TODO|TBD)\b/ },
  { id: "placeholder", re: /\bplaceholder (text|content|copy)\b/i },
  // Only the *page* being under construction is a defect. A telescope that is
  // genuinely under construction (ELT, GMT, CTA) is a scientific fact.
  { id: "under-construction", re: /(this|the) (page|section|topic|site|area) is under construction/i },
  { id: "we-will-write", re: /we (will|plan to) (write|publish|add) this/i },
];

/**
 * Negation windows: an editorial-policy page that promises "no placeholder
 * lorem ipsum in published copy" is stating a standard, not breaking one.
 */
const NEGATION = /\b(no|never|without|avoid|avoids|prohibit|prohibits|free of|zero)\b[^.]{0,60}$/i;

/**
 * Softer markers: "in progress" signalling that is an admission of editorial
 * incompleteness on a published page.
 */
const SOFT_PLACEHOLDERS: { id: string; re: RegExp }[] = [
  { id: "in-progress-badge", re: />In progress</ },
  { id: "also-planned", re: /\bAlso planned\b/ },
  { id: "we-continue-to-expand", re: /we continue to expand this/i },
  { id: "facts-will-be-cited", re: /facts on this topic will be cited/i },
];

/**
 * Honest data-state notices. A page that says "no forecast is shown until a
 * provider is connected — none are invented" is doing exactly what this
 * platform's editorial policy requires. These are reported separately so they
 * are visible, but they are NOT counted as editorial incompleteness: removing
 * them would mean either fabricating data or hiding its absence.
 */
const HONEST_DATA_STATE: { id: string; re: RegExp }[] = [
  { id: "prepared-for-integration", re: /prepared for (official )?(integration|live data|NOAA|NASA|ESA)/i },
  { id: "no-live-data-shown", re: /no (live )?(data|forecast|value|schedule)[^.]{0,60}(is|are) shown/i },
  { id: "empty-not-fabricated", re: /(empty|no [a-z ]+) (today|yet)[^.]{0,40}no fabricated/i },
  { id: "will-appear-here", re: /will appear here\b/i },
];

/* ------------------------------------------------------ HTML extraction */

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mainOf(html: string): string {
  const m = html.match(/<main[^>]*id="main"[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : "";
}

function count(re: RegExp, s: string): number {
  return (s.match(re) ?? []).length;
}

/* -------------------------------------------------------- route mapping */

/** Route families whose pages are tools/data/system rather than prose. */
const CLASS_BY_FAMILY: Record<string, PageClass> = {
  workspace: "tool",
  assistant: "tool",
  calculators: "tool",
  search: "tool",
  "universe-3d": "tool",
  graph: "tool",
  compare: "tool",
  datasets: "data",
  data: "data",
  "open-data": "data",
  developers: "data",
  "open-platform": "data",
  registry: "data",
  "entity-index": "hub",
  "topic-index": "hub",
  discover: "hub",
  explore: "hub",
  connections: "hub",
  gallery: "hub",
  images: "hub",
  about: "system",
  platform: "system",
  authority: "system",
  transparency: "system",
  "editorial-policy": "system",
  "sources-policy": "system",
  community: "system",
  contribute: "system",
  live: "system",
};

/**
 * Sub-paths that are index/listing pages regardless of family.
 *
 * NOTE ON THE `reference` CLASS: a glossary entry is a dictionary definition,
 * not an essay. `/encyclopedia/glossary/light-year` publishes a definition, the
 * context the term is used in, the related ideas, and links to neighbouring
 * terms — and is finished at ~320 words. Scoring it against an editorial
 * threshold of 450 would report a genre difference as a defect. This is a
 * narrow, explicit carve-out for one route prefix, not a general relaxation:
 * every other editorial page is still held to the full threshold.
 */
function classify(url: string, family: string, depth: number): PageClass {
  if (url === "/") return "hub";
  if (url.startsWith("/encyclopedia/glossary/")) return "reference";
  // A learning-path page is a curated sequence of lesson links: the navigation
  // IS the content, which is what the `hub` thresholds already model.
  if (family === "learn" && depth >= 2) return "hub";
  const byFamily = CLASS_BY_FAMILY[family];
  if (byFamily) return byFamily;
  // `/family` and `/family/<facet>` index pages are hubs; leaves are entities.
  if (depth === 1) return "hub";
  // Editorial route families: the taxonomy sections and learning material.
  if (["astronomy", "sky-guide", "astrology", "encyclopedia", "observatory", "guides"].includes(family)) {
    return "editorial";
  }
  // /methods and /observing are bespoke CATALOGUE families — their pages render
  // a definition, typed relations, sources and a quality panel, exactly like
  // /instruments or /celestial-mechanics. They were previously carved out into
  // `editorial` here for no principled reason, which held structured concept
  // records to prose-essay thresholds. `editorial` now means precisely the
  // taxonomy sections and guides — pages whose content IS the writing.
  return "entity";
}

/* ------------------------------------------------------- thresholds */

/**
 * Minimum substance per page class. Deliberately conservative: a catalogue
 * object page is legitimately short, an editorial topic page is not.
 */
const THRESHOLDS: Record<PageClass, { thin: number; substantial: number; complete: number; minSections: number }> = {
  editorial: { thin: 250, substantial: 450, complete: 800, minSections: 4 },
  entity: { thin: 120, substantial: 220, complete: 400, minSections: 3 },
  hub: { thin: 80, substantial: 150, complete: 250, minSections: 2 },
  reference: { thin: 120, substantial: 200, complete: 280, minSections: 3 },
  tool: { thin: 60, substantial: 120, complete: 200, minSections: 1 },
  data: { thin: 60, substantial: 120, complete: 200, minSections: 1 },
  system: { thin: 80, substantial: 150, complete: 250, minSections: 2 },
};

/* --------------------------------------------------------------- audit */

function walkHtml(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkHtml(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

function urlForFile(file: string): string {
  const rel = relative(APP_DIR, file).split(sep).join("/").replace(/\.html$/, "");
  if (rel === "index") return "/";
  return `/${rel}`;
}

export function auditPage(file: string, indexable: Set<string>): PageAudit | null {
  const html = readFileSync(file, "utf8");
  const url = urlForFile(file);
  if (url.startsWith("/_")) return null; // _not-found, _global-error

  const main = mainOf(html);
  if (!main) return null;

  const text = stripTags(main);
  const words = text ? text.split(/\s+/).length : 0;
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s*·\s*Asteria Star\s*$/, "").trim() : url;

  const segs = url === "/" ? [] : url.slice(1).split("/");
  const family = segs[0] ?? "/";
  const depth = segs.length;
  const pageClass = classify(url, family, depth);

  const placeholders: string[] = [];
  for (const p of HARD_PLACEHOLDERS) {
    const m = text.match(p.re);
    if (!m || m.index == null) continue;
    // Skip a hit that sits inside a negation ("no placeholder lorem ipsum").
    if (NEGATION.test(text.slice(Math.max(0, m.index - 70), m.index))) continue;
    placeholders.push(p.id);
  }
  for (const p of SOFT_PLACEHOLDERS) if (p.re.test(main) || p.re.test(text)) placeholders.push(`soft:${p.id}`);
  const honestDataState = HONEST_DATA_STATE.filter((p) => p.re.test(text)).map((p) => p.id);

  const sections = count(/<h2[\s>]/gi, main);
  const sources = count(/rel="noreferrer nofollow"/g, main);
  const images = count(/<img[\s>]/gi, main);
  const internalLinks = count(/href="\/[^"]*"/g, main);
  // Structured data points: definition lists and table cells carrying values.
  const dataPoints = count(/<dt[\s>]/gi, main) + count(/<td[\s>]/gi, main);
  const faqs = count(/<dt[\s>]/gi, main);
  const reviewed = /title="Review status"[^>]*>(?:(?!<\/span>)[\s\S])*?(Reviewed|Verified)/.test(main);
  const provenance = /Provenance|Field-level provenance|bibcode/i.test(text);

  const t = THRESHOLDS[pageClass];
  const hardPlaceholder = placeholders.some((p) => !p.startsWith("soft:"));

  let status: CompletionStatus;
  if (hardPlaceholder) status = "PLACEHOLDER";
  else if (pageClass === "tool" || pageClass === "data" || pageClass === "system") {
    status = words < t.thin ? "THIN" : "NON_CONTENT_ROUTE";
  } else if (words < t.thin || sections < Math.max(1, t.minSections - 2)) status = "THIN";
  else if (words >= t.complete && sections >= t.minSections) status = "COMPLETE";
  else if (words >= t.substantial) status = "SUBSTANTIAL";
  else status = "THIN";

  const gaps: GapFlag[] = [];
  if ((pageClass === "editorial" || pageClass === "entity") && sources === 0) gaps.push("SOURCE_GAP");
  if (pageClass === "entity" && images === 0) gaps.push("IMAGE_GAP");
  if (pageClass === "entity" && !reviewed) gaps.push("REVIEW_GAP");
  if (pageClass === "entity" && dataPoints < 4) gaps.push("DATA_GAP");

  return {
    url, family, pageClass, indexable: indexable.has(url), title,
    words, sections, sources, images, internalLinks, dataPoints, faqs,
    reviewed, provenance, placeholders, honestDataState, status, gaps,
  };
}

/* --------------------------------------------- template-repetition scan */

/** Normalize a sentence so that per-page names/numbers do not hide boilerplate. */
function normalizeSentence(s: string): string {
  return s
    .toLowerCase()
    .replace(/\d+(\.\d+)?/g, "#")
    .replace(/[^a-z#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** UI chrome that legitimately repeats across pages — never a spam signal. */
const UI_LABEL_ALLOW = new Set([
  "sources references", "frequently asked", "overview", "related", "explore",
  "on this page", "in this section", "learn next", "primary sources",
  "skip to content", "quick facts", "characteristics", "data provenance",
]);

function repetitionScan(pages: { url: string; text: string }[]) {
  const bySentence = new Map<string, string[]>();
  for (const p of pages) {
    const seen = new Set<string>();
    for (const raw of p.text.split(/(?<=[.!?])\s+/)) {
      const n = normalizeSentence(raw);
      // Only sentences long enough to be prose, not labels.
      if (n.split(" ").length < 8) continue;
      if (UI_LABEL_ALLOW.has(n)) continue;
      if (seen.has(n)) continue;
      seen.add(n);
      const arr = bySentence.get(n) ?? [];
      arr.push(p.url);
      bySentence.set(n, arr);
    }
  }
  return [...bySentence.entries()]
    .filter(([, urls]) => urls.length >= 25)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([sentence, urls]) => ({ sentence, pages: urls.length, sample: urls.slice(0, 3) }));
}

/* ---------------------------------------------------------------- main */

async function main() {
  if (!existsSync(APP_DIR)) {
    console.error("[content:completion-audit] No build output. Run `npm run build` first.");
    process.exit(1);
  }

  const { default: sitemap } = await import("../src/app/sitemap");
  const indexable = new Set<string>(
    sitemap().map((r: { url: string }) => {
      const p = new URL(r.url).pathname;
      return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
    }),
  );

  const files = walkHtml(APP_DIR);
  const audits: PageAudit[] = [];
  const texts: { url: string; text: string }[] = [];

  for (const f of files) {
    const a = auditPage(f, indexable);
    if (!a) continue;
    audits.push(a);
    if (a.pageClass === "editorial" || a.pageClass === "entity") {
      texts.push({ url: a.url, text: stripTags(mainOf(readFileSync(f, "utf8"))) });
    }
  }

  audits.sort((a, b) => a.url.localeCompare(b.url));
  const repeats = repetitionScan(texts);

  /* -------------------------------------------------------- aggregation */

  const byStatus = new Map<CompletionStatus, number>();
  const byClass = new Map<PageClass, number>();
  const byFamily = new Map<string, { total: number; placeholder: number; thin: number; ok: number; indexable: number }>();
  for (const a of audits) {
    byStatus.set(a.status, (byStatus.get(a.status) ?? 0) + 1);
    byClass.set(a.pageClass, (byClass.get(a.pageClass) ?? 0) + 1);
    const f = byFamily.get(a.family) ?? { total: 0, placeholder: 0, thin: 0, ok: 0, indexable: 0 };
    f.total++;
    if (a.indexable) f.indexable++;
    if (a.status === "PLACEHOLDER") f.placeholder++;
    else if (a.status === "THIN") f.thin++;
    else f.ok++;
    byFamily.set(a.family, f);
  }

  const placeholderPages = audits.filter((a) => a.status === "PLACEHOLDER");
  const thinPages = audits.filter((a) => a.status === "THIN");
  const softOnly = audits.filter((a) => a.status !== "PLACEHOLDER" && a.placeholders.length > 0);

  /* ------------------------------------------------------------- report */

  const L: string[] = [];
  const pct = (a: number, b: number) => (b === 0 ? "—" : `${((a / b) * 100).toFixed(1)}%`);
  L.push("# AsteriaStar — Platform Content Completion Baseline");
  L.push("");
  L.push("_Generated by `npm run content:completion-audit` from the **real rendered HTML** of a production build (`.next/server/app`). Nothing here is derived from a stored completeness flag; every number is measured from what a visitor actually receives._");
  L.push("");
  L.push("## 1. Totals");
  L.push("");
  L.push("| Metric | Count |");
  L.push("| --- | ---: |");
  L.push(`| Prerendered public pages audited | ${audits.length} |`);
  L.push(`| …in the sitemap (indexable) | ${audits.filter((a) => a.indexable).length} |`);
  L.push(`| Route families | ${byFamily.size} |`);
  L.push(`| **PLACEHOLDER** (unfinished editorial copy) | ${byStatus.get("PLACEHOLDER") ?? 0} (${pct(byStatus.get("PLACEHOLDER") ?? 0, audits.length)}) |`);
  L.push(`| **THIN** | ${byStatus.get("THIN") ?? 0} (${pct(byStatus.get("THIN") ?? 0, audits.length)}) |`);
  L.push(`| **SUBSTANTIAL** | ${byStatus.get("SUBSTANTIAL") ?? 0} |`);
  L.push(`| **COMPLETE** | ${byStatus.get("COMPLETE") ?? 0} |`);
  L.push(`| **NON_CONTENT_ROUTE** (tool/data/system) | ${byStatus.get("NON_CONTENT_ROUTE") ?? 0} |`);
  L.push(`| Pages carrying a soft "in progress" marker | ${softOnly.length} |`);
  L.push(`| Pages carrying an honest data-state notice (not a defect) | ${audits.filter((a) => a.honestDataState.length > 0).length} |`);
  L.push("");

  L.push("## 2. By page class");
  L.push("");
  L.push("| Class | Pages | Placeholder | Thin | Substantial | Complete | Non-content |");
  L.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const cls of ["editorial", "entity", "reference", "hub", "tool", "data", "system"] as PageClass[]) {
    const rows = audits.filter((a) => a.pageClass === cls);
    if (rows.length === 0) continue;
    const c = (s: CompletionStatus) => rows.filter((r) => r.status === s).length;
    L.push(`| \`${cls}\` | ${rows.length} | ${c("PLACEHOLDER")} | ${c("THIN")} | ${c("SUBSTANTIAL")} | ${c("COMPLETE")} | ${c("NON_CONTENT_ROUTE")} |`);
  }
  L.push("");

  L.push("## 3. By route family");
  L.push("");
  L.push("| Family | Pages | Indexable | Placeholder | Thin | OK |");
  L.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  for (const [fam, f] of [...byFamily.entries()].sort((a, b) => (b[1].placeholder + b[1].thin) - (a[1].placeholder + a[1].thin) || b[1].total - a[1].total)) {
    L.push(`| \`/${fam}\` | ${f.total} | ${f.indexable} | ${f.placeholder} | ${f.thin} | ${f.ok} |`);
  }
  L.push("");

  L.push("## 4. Placeholder pages (highest priority)");
  L.push("");
  if (placeholderPages.length === 0) {
    L.push("**None.** No prerendered page contains unfinished-editorial placeholder copy.");
  } else {
    const markerCounts = new Map<string, number>();
    for (const p of placeholderPages) for (const m of p.placeholders) if (!m.startsWith("soft:")) markerCounts.set(m, (markerCounts.get(m) ?? 0) + 1);
    L.push("| Marker | Pages |");
    L.push("| --- | ---: |");
    for (const [m, n] of [...markerCounts.entries()].sort((a, b) => b[1] - a[1])) L.push(`| \`${m}\` | ${n} |`);
    L.push("");
    L.push("<details><summary>All placeholder URLs</summary>");
    L.push("");
    L.push("| URL | Class | Words | Markers |");
    L.push("| --- | --- | ---: | --- |");
    for (const p of placeholderPages) L.push(`| ${p.url} | ${p.pageClass} | ${p.words} | ${p.placeholders.filter((m) => !m.startsWith("soft:")).join(", ")} |`);
    L.push("");
    L.push("</details>");
  }
  L.push("");

  L.push("## 5. Thin pages by family");
  L.push("");
  const thinByFamily = new Map<string, PageAudit[]>();
  for (const t of thinPages) thinByFamily.set(t.family, [...(thinByFamily.get(t.family) ?? []), t]);
  L.push("| Family | Thin pages | Median words | Example |");
  L.push("| --- | ---: | ---: | --- |");
  for (const [fam, rows] of [...thinByFamily.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const med = [...rows].sort((a, b) => a.words - b.words)[Math.floor(rows.length / 2)].words;
    L.push(`| \`/${fam}\` | ${rows.length} | ${med} | ${rows[0].url} |`);
  }
  L.push("");

  L.push("## 6. Coverage gaps");
  L.push("");
  const gapCount = (g: GapFlag) => audits.filter((a) => a.gaps.includes(g)).length;
  const entityPages = audits.filter((a) => a.pageClass === "entity").length;
  const editorialPages = audits.filter((a) => a.pageClass === "editorial").length;
  L.push("| Gap | Pages | Scope |");
  L.push("| --- | ---: | --- |");
  L.push(`| SOURCE_GAP | ${gapCount("SOURCE_GAP")} | of ${entityPages + editorialPages} editorial+entity pages |`);
  L.push(`| IMAGE_GAP | ${gapCount("IMAGE_GAP")} | of ${entityPages} entity pages |`);
  L.push(`| REVIEW_GAP | ${gapCount("REVIEW_GAP")} | of ${entityPages} entity pages |`);
  L.push(`| DATA_GAP | ${gapCount("DATA_GAP")} | of ${entityPages} entity pages (<4 structured values) |`);
  L.push("");
  L.push("> Gap flags are **honest observations, not defects to paper over**. An entity with no resolved photograph in existence legitimately carries IMAGE_GAP forever; the fix is never to invent an image.");
  L.push("");

  L.push("## 7. Template repetition");
  L.push("");
  L.push(`Sentences of ≥8 words appearing on ≥25 distinct editorial/entity pages (numbers normalised). UI chrome is allow-listed.`);
  L.push("");
  if (repeats.length === 0) {
    L.push("**None detected.**");
  } else {
    L.push("| Pages | Repeated sentence (normalised) | Sample |");
    L.push("| ---: | --- | --- |");
    for (const r of repeats.slice(0, 40)) {
      L.push(`| ${r.pages} | ${r.sentence.slice(0, 130)}${r.sentence.length > 130 ? "…" : ""} | ${r.sample[0]} |`);
    }
  }
  L.push("");

  L.push("## 8. Highest-impact unfinished templates");
  L.push("");
  L.push("Ranked by how many pages a single template fix would repair.");
  L.push("");
  const templateImpact = new Map<string, number>();
  for (const p of [...placeholderPages, ...softOnly]) {
    for (const m of p.placeholders) templateImpact.set(m, (templateImpact.get(m) ?? 0) + 1);
  }
  L.push("| Marker | Pages affected |");
  L.push("| --- | ---: |");
  for (const [m, n] of [...templateImpact.entries()].sort((a, b) => b[1] - a[1])) L.push(`| \`${m}\` | ${n} |`);
  L.push("");

  const outMd = join(ROOT, "docs/platform-content-completion-baseline.md");
  writeFileSync(outMd, L.join("\n") + "\n");

  const jsonDir = join(ROOT, "docs/audit");
  if (!existsSync(jsonDir)) mkdirSync(jsonDir, { recursive: true });
  writeFileSync(
    join(jsonDir, "content-completion.json"),
    JSON.stringify(
      {
        generatedFrom: ".next/server/app",
        totals: {
          pages: audits.length,
          indexable: audits.filter((a) => a.indexable).length,
          placeholder: byStatus.get("PLACEHOLDER") ?? 0,
          thin: byStatus.get("THIN") ?? 0,
          substantial: byStatus.get("SUBSTANTIAL") ?? 0,
          complete: byStatus.get("COMPLETE") ?? 0,
          nonContent: byStatus.get("NON_CONTENT_ROUTE") ?? 0,
          softMarkers: softOnly.length,
        },
        placeholders: placeholderPages.map((p) => ({ url: p.url, markers: p.placeholders })),
        thin: thinPages.map((p) => ({ url: p.url, class: p.pageClass, words: p.words, sections: p.sections })),
        repeats: repeats.slice(0, 60),
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`[content:completion-audit] ${audits.length} pages audited (${audits.filter((a) => a.indexable).length} indexable)`);
  console.log(`[content:completion-audit] PLACEHOLDER ${byStatus.get("PLACEHOLDER") ?? 0} · THIN ${byStatus.get("THIN") ?? 0} · SUBSTANTIAL ${byStatus.get("SUBSTANTIAL") ?? 0} · COMPLETE ${byStatus.get("COMPLETE") ?? 0} · NON_CONTENT ${byStatus.get("NON_CONTENT_ROUTE") ?? 0}`);
  console.log(`[content:completion-audit] soft in-progress markers on ${softOnly.length} pages · honest data-state notices on ${audits.filter((a) => a.honestDataState.length > 0).length} · ${repeats.length} repeated-sentence clusters`);
  console.log(`[content:completion-audit] wrote docs/platform-content-completion-baseline.md`);
}

main();
