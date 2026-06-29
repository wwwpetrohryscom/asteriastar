import { entities } from "@/knowledge-graph/entities";
import { relations } from "@/knowledge-graph/relations";
import { validateGraph } from "@/knowledge-graph/validate";

/**
 * Knowledge graph entry point.
 *
 * Aggregates the seed entities and relations, validates the graph at import
 * time (throwing on any violation — a hard build gate, like the entry
 * registry), and re-exports the schema, data, and query helpers.
 */
const ISSUES = validateGraph(entities, relations);
if (ISSUES.length > 0) {
  throw new Error(
    `Knowledge graph validation failed (${ISSUES.length} issue${ISSUES.length === 1 ? "" : "s"}):\n` +
      ISSUES.map((i) => `  • ${i}`).join("\n"),
  );
}

export { entities, relations };
export { validateGraph };
export * from "@/knowledge-graph/schema";
export * from "@/knowledge-graph/helpers";
export * from "@/knowledge-graph/version";
