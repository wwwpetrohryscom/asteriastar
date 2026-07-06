import type { SourceKey } from "@/lib/sources";

/**
 * Scientific AI Research Assistant data model (Program BS). Each capability is a first-class entity of
 * an explainable, GROUNDED assistant. The grounded capabilities are backed by real retrieval over the
 * knowledge graph today (src/lib/assistant/retrieval.ts) — scientific search, concept comparison,
 * evidence chains, related concepts, grounded explanations — and surface ONLY facts already in the
 * graph, with their provenance. There is no language model in this layer: nothing is generated or
 * invented (the "no-hallucination" guarantee). The architecture capabilities — the answer modes,
 * RAG-ready interfaces, prompt orchestration, conversation memory, and LLM integration — are prepared
 * as interfaces for a future language-model layer that would phrase these grounded facts, never add
 * to them. Unknown values are left empty.
 */

export type Grounding =
  | "grounded" // backed by real graph retrieval today; surfaces only real facts
  | "architecture"; // an interface prepared for a future LLM layer

export interface AssistantRecord {
  id: string;
  slug: string;
  name: string;
  grounding: Grounding;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** Short label of the capability, e.g. "Grounded concept comparison". */
  capability: string;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED example entities and sibling capabilities

  /* display */
  highlights?: string[];
}
