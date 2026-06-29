/**
 * Entry registry + knowledge graph quality gate (run with `npm run validate`).
 *
 * Both the registry and the graph self-validate at import time and throw on any
 * violation, so a load failure here means the data is invalid. This script
 * surfaces the issues readably and prints a summary of the boundary invariants.
 *
 * Entry checks (enforced in validateEntries()):
 *  - section/category existence, duplicate slugs / canonical URLs
 *  - duplicate SEO titles and descriptions
 *  - science/historical/tool entries declare source slots
 *  - interpretive entries carry the disclaimer; factual ones never do
 *  - related entries/categories resolve (no broken internal links)
 *  - non-thin content (>= 3 body sections) and no lorem ipsum
 *  - graph-linked entries point to existing entities/relations
 *
 * Graph checks (enforced in validateGraph()):
 *  - no duplicate entity/relation ids; relation endpoints exist
 *  - valid domains/confidences
 *  - astrology relations are never science; interpretive links are never
 *    confirmed science
 */

async function main() {
  let reg: typeof import("../src/content/entries");
  let graph: typeof import("../src/knowledge-graph");
  try {
    graph = await import("../src/knowledge-graph");
    reg = await import("../src/content/entries");
  } catch (error) {
    console.error("\n✗ Registry/graph failed to load (validation threw):\n");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Knowledge graph.
  const graphIssues = graph.validateGraph(graph.entities, graph.relations);
  if (graphIssues.length > 0) {
    console.error(`\n✗ ${graphIssues.length} knowledge-graph issue(s):\n`);
    for (const issue of graphIssues) console.error(`  • ${issue}`);
    process.exit(1);
  }
  const astrologyAsScience = graph.relations.filter(
    (r) => r.type === "astrologically_associated_with" && r.domain !== "astrology",
  );
  if (astrologyAsScience.length > 0) {
    console.error("\n✗ astrology relations marked as non-astrology — boundary violated");
    process.exit(1);
  }

  // Image registry (Observatory image platform).
  const media = await import("../src/lib/media/registry");
  const imageIssues = media.validateImages();
  if (imageIssues.length > 0) {
    console.error(`\n✗ ${imageIssues.length} image issue(s):`);
    for (const i of imageIssues) console.error(`  • ${i}`);
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
  console.log(
    `✓ Knowledge graph valid — ${graph.GRAPH_STATS.entityCount} entities, ${graph.GRAPH_STATS.relationCount} relations`,
  );
  console.log(`    entities by domain: ${JSON.stringify(graph.GRAPH_STATS.entitiesByDomain)}`);
  console.log(`    relations by domain: ${JSON.stringify(graph.GRAPH_STATS.relationsByDomain)}`);
  console.log("");
}

main();
