import { engine } from "@/platform/data-engine";
import type { AssistantRecord } from "@/knowledge-graph/data/scientific-assistant-catalog/types";

/** Engine-driven discovery hubs for the Scientific AI Research Assistant Platform. */
export interface BsDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => AssistantRecord[];
}

const e = engine.scientificAssistant;

export const BS_DISCOVERIES: BsDiscovery[] = [
  { slug: "grounded-capabilities", title: "Grounded Capabilities", description: "The capabilities backed by real retrieval over the graph today — scientific search, object explanation, concept comparison, relationship explanation, evidence chains, provenance- and citation-aware answers, related concepts, reading recommendations, scientific summaries, learning-path generation, cross-domain reasoning, and the no-hallucination layer. Each surfaces only real facts.", get: () => e.grounded() },
  { slug: "architecture", title: "Architecture for a Future Model", description: "The interfaces prepared for a future language-model layer — the educational, research, and expert answer modes, the RAG-ready interfaces, prompt orchestration, conversation memory, and LLM integration. Defined and modelled; a model, when added, would phrase the grounded facts and never add to them.", get: () => e.architecture() },
];

const BY_SLUG = new Map(BS_DISCOVERIES.map((d) => [d.slug, d]));
export function getBsDiscovery(slug: string): BsDiscovery | undefined {
  return BY_SLUG.get(slug);
}
