/**
 * Entry registry quality gate (run with `npm run validate`).
 *
 * The registry self-validates at import time and throws on any violation, so a
 * load failure here means the data is invalid. This script surfaces the issues
 * readably and prints a summary of the boundary invariants for review.
 *
 * Checks (most enforced in validateEntries()):
 *  - section/category existence, duplicate slugs / canonical URLs
 *  - duplicate SEO titles and descriptions
 *  - science/historical/tool entries declare source slots
 *  - interpretive entries carry the disclaimer; factual ones never do
 *  - related entries/categories resolve (no broken internal links)
 *  - non-thin content (>= 3 body sections) and no lorem ipsum
 *  - every published entry has a canonical URL for the sitemap
 */

async function main() {
  let reg: typeof import("../src/content/entries");
  try {
    reg = await import("../src/content/entries");
  } catch (error) {
    console.error("\n✗ Entry registry failed to load (validation threw):\n");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const { validateEntries, getAllEntries, ENTRY_STATS } = reg;

  const issues = validateEntries();
  if (issues.length > 0) {
    console.error(`\n✗ ${issues.length} validation issue(s):\n`);
    for (const issue of issues) console.error(`  • ${issue}`);
    process.exit(1);
  }

  const entries = getAllEntries();

  // Boundary invariants (report, and fail if any are violated).
  const factual = entries.filter((e) =>
    ["science", "historical", "tool"].includes(e.kind),
  );
  const interpretive = entries.filter((e) => e.kind === "interpretive");
  const sourcedFactual = factual.filter((e) => e.sources.length > 0);
  const disclaimedInterpretive = interpretive.filter((e) => e.disclaimerRequired);
  const astronomyWithDisclaimer = entries.filter(
    (e) => e.section === "astronomy" && e.disclaimerRequired,
  );
  const missingCanonical = entries.filter((e) => !e.canonicalUrl);

  const hardFailures: string[] = [];
  if (sourcedFactual.length !== factual.length)
    hardFailures.push("some factual entries lack source slots");
  if (disclaimedInterpretive.length !== interpretive.length)
    hardFailures.push("some interpretive entries lack the disclaimer");
  if (astronomyWithDisclaimer.length > 0)
    hardFailures.push("an astronomy entry carries the astrology disclaimer");
  if (missingCanonical.length > 0)
    hardFailures.push("an entry is missing a canonical URL for the sitemap");

  if (hardFailures.length > 0) {
    console.error("\n✗ Boundary invariant failures:\n");
    for (const f of hardFailures) console.error(`  • ${f}`);
    process.exit(1);
  }

  console.log(`\n✓ Entry registry valid — ${ENTRY_STATS.total} published entries\n`);
  console.log("  By kind:");
  for (const [kind, count] of Object.entries(ENTRY_STATS.byKind)) {
    console.log(`    ${kind.padEnd(12)} ${count}`);
  }
  console.log("");
  console.log(`  Factual entries with sources:        ${sourcedFactual.length}/${factual.length}`);
  console.log(`  Interpretive entries with disclaimer: ${disclaimedInterpretive.length}/${interpretive.length}`);
  console.log(`  Astronomy entries with disclaimer:    ${astronomyWithDisclaimer.length} (must be 0)`);
  console.log("");
}

main();
