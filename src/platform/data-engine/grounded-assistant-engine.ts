import { compareConcepts, evidenceChain, explainEntity, relatedConcepts, scientificSearch } from "@/lib/assistant/retrieval";
import { assembleEvidence, citationSummary, learningPath } from "@/lib/assistant/grounded";
import { assistantLlmStatus, buildCitationForcedPrompt, buildRagPacket, type RagPacket } from "@/lib/assistant/llm";
import { scientificAssistantEngine } from "@/platform/data-engine/scientific-assistant-engine";

/**
 * Grounded Scientific AI Engine (engine.groundedAssistant) — the WORKING, deterministic assistant over
 * the knowledge graph (Program BW). It REUSES the Program BS grounded retrieval (explain, compare,
 * evidence chains, related, search) and adds two grounded tools (citation summary, learning path), plus
 * the architecture-ready RAG / language-model seam. There is no language model wired in this build:
 * `llmStatus()` reports the LLM layer as unavailable and the assistant runs deterministic-grounded — it
 * returns only real facts, relations, evidence chains, and citations, and never fabricates an answer.
 */
export const groundedAssistantEngine = {
  /* deterministic grounded tools (real facts from the graph, no model) */
  explain: explainEntity,
  compare: compareConcepts,
  evidencePath: evidenceChain,
  related: relatedConcepts,
  search: scientificSearch,
  citations: citationSummary,
  learningPath,

  /* the architecture-ready RAG / language-model seam (no model wired) */
  assembleEvidence,
  ragPacket: (id: string, question?: string): RagPacket | null => {
    const ev = assembleEvidence(id, question);
    return ev ? buildRagPacket(ev) : null;
  },
  citationForcedPrompt: (id: string, question?: string): string | null => {
    const ev = assembleEvidence(id, question);
    return ev ? buildCitationForcedPrompt(buildRagPacket(ev)) : null;
  },
  llmStatus: assistantLlmStatus,

  /* the capabilities are the reused Program BS assistant_capability entities — never duplicated */
  capabilities: () => scientificAssistantEngine.all(),
  groundedCapabilities: () => scientificAssistantEngine.grounded(),
};
