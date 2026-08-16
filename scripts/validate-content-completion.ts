/**
 * Permanent content-completion gate.
 *
 *   npm run validate:completion
 *
 * Wired into `npm run validate`, so an unfinished page cannot silently return.
 *
 * This gate reads the SOURCE registries rather than build output, so it runs in
 * milliseconds and does not require a production build. The deeper
 * rendered-HTML audit (`npm run content:completion-audit`) stays a separate,
 * build-dependent report.
 *
 * DESIGN PRINCIPLE — absence is not a failure.
 * The gate distinguishes three states that a naive validator collapses into one:
 *
 *   BROKEN    a reference that does not resolve, a claim with no support, copy
 *             that admits the page is unfinished. Always a failure.
 *   UNKNOWN   a value that does not exist — no resolved image of an exoplanet,
 *             no measured mass for a catalogue star. Never a failure. Recording
 *             the gap honestly is the correct behaviour.
 *   ASSERTED  a completeness or review claim the registry cannot back. Always a
 *             failure, because a false claim of authority is worse than a gap.
 */
import { SECTIONS, validateCategories } from "@/lib/content/registry";
import { getAllEntries } from "@/content/entries";
import { entities } from "@/knowledge-graph/entities";
import { REVIEWS } from "@/platform/authority/review";
import { getEntityById } from "@/knowledge-graph";

/* ---------------------------------------------------------- lexicons */

const STOPWORDS = new Set([
  "about", "above", "after", "again", "against", "almost", "along", "already", "although",
  "always", "among", "another", "because", "before", "being", "below", "between", "both",
  "cannot", "could", "during", "every", "further", "having", "itself", "least", "might",
  "other", "rather", "shall", "should", "since", "still", "than", "that", "their", "them",
  "then", "there", "these", "they", "this", "those", "through", "under", "until", "using",
  "usually", "were", "what", "when", "where", "which", "while", "with", "within", "without",
  "would", "often", "single", "actually", "simply", "really", "these", "carry", "carries",
]);

const COUNT_WORDS: Record<string, number> = {
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12,
};

type Issue = { kind: "BROKEN" | "ASSERTED"; where: string; detail: string };
type Warning = { where: string; detail: string };

const issues: Issue[] = [];
const warnings: Warning[] = [];
const notes: string[] = [];

const broken = (where: string, detail: string) => issues.push({ kind: "BROKEN", where, detail });
const asserted = (where: string, detail: string) => issues.push({ kind: "ASSERTED", where, detail });
/**
 * Advisory only. Key-point support is checked lexically, and paraphrase is
 * normal in good writing, so this is reported but never fails a build — a
 * heuristic must not be able to block a release on its own false positive.
 */
const warn = (where: string, detail: string) => warnings.push({ where, detail });

/* ------------------------------------------------ 1. placeholder copy */

/**
 * Editorial-incompleteness phrases. Deliberately phrase-level: a telescope that
 * is genuinely "under construction" and a policy page promising "no lorem
 * ipsum" are legitimate and must not trip this.
 */
const PLACEHOLDER = [
  /this is a foundation page/i,
  /what this topic will cover/i,
  /planned material includes/i,
  /upcoming material includes/i,
  /we are building this (topic|page|section)/i,
  /\bcoming soon\b/i,
  /this (page|section|topic) is not yet available/i,
  /check back (soon|later)/i,
  /lorem ipsum/i,
  /\b(TODO|TBD)\b/,
  /\bplaceholder (text|content|copy)\b/i,
  /(this|the) (page|section|topic|site|area) is under construction/i,
  /we (will|plan to) (write|publish|add) this/i,
];

const NEGATED = /\b(no|never|without|avoid|avoids|prohibit|prohibits|free of|zero)\b[^.]{0,60}$/i;

function scanCopy(where: string, text: string) {
  for (const re of PLACEHOLDER) {
    const m = text.match(re);
    if (!m || m.index == null) continue;
    if (NEGATED.test(text.slice(Math.max(0, m.index - 70), m.index))) continue;
    broken(where, `placeholder copy: "${m[0]}"`);
  }
}

/* --------------------------------------- 2. categories: the hard gate */

for (const issue of validateCategories()) broken("category registry", issue);

for (const section of SECTIONS) {
  for (const c of section.categories) {
    const where = `/${section.slug}/${c.slug}`;
    scanCopy(
      where,
      [c.summary, c.overview, ...(c.keyPoints ?? []),
        ...c.body.flatMap((b) => [b.heading, ...(b.paragraphs ?? []), ...(b.list ?? [])]),
        ...c.faqs.flatMap((f) => [f.question, f.answer]),
        ...(c.explore ?? []).flatMap((e) => [e.label, e.blurb]),
      ].join(" "),
    );

    // Every key point must be supported somewhere in the published body — a
    // claim in the summary panel that the page never substantiates is an
    // unsupported assertion, not a stylistic choice.
    // Support may come from the body OR from an FAQ answer — both are published
    // on the same page, so either substantiates a key point.
    const bodyText = [
      ...c.body.flatMap((b) => [b.heading, ...(b.paragraphs ?? []), ...(b.list ?? [])]),
      ...c.faqs.flatMap((f) => [f.question, f.answer]),
      c.overview,
    ]
      .join(" ")
      .toLowerCase();
    for (const point of c.keyPoints ?? []) {
      // Match on the point's distinctive content words rather than the whole
      // sentence, which would never recur verbatim.
      const words = point
        .toLowerCase()
        .replace(/[^a-z0-9\s—-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 4 && !STOPWORDS.has(w));
      if (words.length === 0) continue;
      // Prefix match, so "predictable" is supported by "predict".
      const hits = words.filter((w) => bodyText.includes(w.slice(0, Math.max(5, w.length - 3)))).length;
      if (hits / words.length < 0.3) {
        warn(where, `key point may be unsupported by the page: "${point.slice(0, 90)}"`);
      }
    }

    // Headings that count their own list must count it correctly.
    for (const b of c.body) {
      const n = COUNT_WORDS[b.heading.toLowerCase().split(/\s+/).find((w) => COUNT_WORDS[w]) ?? ""];
      if (n && b.list && b.list.length !== n) {
        broken(where, `heading "${b.heading}" states ${n} but its list has ${b.list.length}`);
      }
    }
  }
}

/* ----------------------------------------------- 3. entries: the same */

for (const e of getAllEntries()) {
  scanCopy(
    e.path,
    [e.title, e.description, e.excerpt, e.heroSummary, ...e.keyPoints,
      ...e.body.flatMap((b) => [b.heading, ...(b.paragraphs ?? []), ...(b.list ?? [])]),
    ].join(" "),
  );
}

/* ------------------------------- 4. review status must be earned */

for (const r of REVIEWS) {
  if (!getEntityById(r.entityId)) {
    broken("review registry", `review record for unknown entity ${r.entityId}`);
    continue;
  }
  if ((r.status === "reviewed" || r.status === "verified") && !r.reviewedBy?.trim()) {
    asserted("review registry", `${r.entityId} claims "${r.status}" with no named reviewer`);
  }
  // A review must be TRACEABLE, not necessarily dated. flagship-reviews.ts
  // deliberately carries a deterministic batch version instead of a per-entity
  // date, precisely so that no date is invented — that is more honest than a
  // fabricated timestamp, and the gate must not push it the other way.
  if (
    (r.status === "reviewed" || r.status === "verified") &&
    !r.reviewDate?.trim() &&
    !r.reviewVersion?.trim()
  ) {
    asserted("review registry", `${r.entityId} claims "${r.status}" with neither a review date nor a review version — the claim is untraceable`);
  }
}

/* ---------------------------------------------------------- report */

const reviewed = REVIEWS.filter((r) => r.status === "reviewed" || r.status === "verified").length;
notes.push(`${SECTIONS.reduce((n, s) => n + s.categories.length, 0)} categories · ${getAllEntries().length} entries · ${entities.length} entities scanned`);
notes.push(`${reviewed} entities carry an earned review record (${((reviewed / entities.length) * 100).toFixed(1)}%) — the rest are honestly unreviewed`);

if (issues.length > 0) {
  console.error(`\n✗ Content completion gate failed — ${issues.length} issue${issues.length === 1 ? "" : "s"}:\n`);
  for (const i of issues) console.error(`  [${i.kind}] ${i.where}: ${i.detail}`);
  console.error("");
  console.error("  BROKEN   = a reference, claim, or piece of copy that is wrong or unfinished.");
  console.error("  ASSERTED = a completeness or review claim the registry cannot back.");
  console.error("  Absent data is NOT an error here. Never silence one of these by inventing content.");
  process.exit(1);
}

console.log(`\n✓ Content completion gate passed — 0 placeholder pages, 0 unbacked review claims`);
for (const n of notes) console.log(`    ${n}`);
if (warnings.length > 0) {
  console.log(`    ${warnings.length} advisory key-point notice${warnings.length === 1 ? "" : "s"} (lexical heuristic, non-blocking):`);
  for (const w of warnings.slice(0, 10)) console.log(`      · ${w.where}: ${w.detail}`);
  if (warnings.length > 10) console.log(`      · …and ${warnings.length - 10} more`);
}
