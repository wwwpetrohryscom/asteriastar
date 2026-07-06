import type { Ref } from "@/lib/assistant/retrieval";
import type { Citation } from "@/lib/citations";

/**
 * The optional language-model layer for the Grounded Scientific AI (Program BW). This is ARCHITECTURE,
 * not a wired model: it defines the provider seam, the retrieval-augmented-generation packet, the
 * citation-forced prompt, and the guardrails a model would have to obey. No provider is configured in
 * this build, so `getConfiguredProvider()` returns null and the assistant honestly reports the LLM
 * layer as unavailable — it NEVER fabricates an answer. When a provider is wired, it may only phrase the
 * grounded facts supplied to it, constrained by the guardrails; it can never add a fact of its own.
 */

/** Evidence assembled for a grounded answer — real entities, statements, and citations from the graph. */
export interface GroundedEvidence {
  question: string;
  facts: { statement: string; source: Ref }[];
  entities: Ref[];
  citations: Citation[];
}

/** A retrieval-augmented-generation packet: the grounded context a model would be constrained to. */
export interface RagPacket {
  question: string;
  context: string;
  evidenceCount: number;
  citationCount: number;
}

/** The seam where a language model would join — phrasing grounded facts, never adding to them. */
export interface AssistantProvider {
  readonly name: string;
  generate(packet: RagPacket): Promise<string>;
}

/** Guardrails every provider answer must satisfy — enforced by the architecture, obeyed by any model. */
export const ASSISTANT_GUARDRAILS: string[] = [
  "Use ONLY the facts in the provided grounded context; never introduce a fact that is not there.",
  "Cite the evidence for every claim, by the [F#] fact or [C#] citation it comes from.",
  "If the context does not contain enough to answer, reply 'Not enough graph evidence to answer.' — do not guess.",
  "Do not speculate, extrapolate, or add numbers, dates, or names beyond the context.",
  "Preserve uncertainty: if the graph marks something debated or unconfirmed, keep that qualification.",
];

/** Assemble a citation-forced RAG packet from grounded evidence. Pure; no model involved. */
export function buildRagPacket(evidence: GroundedEvidence): RagPacket {
  const factLines = evidence.facts.map((f, i) => `[F${i + 1}] ${f.statement} (source: ${f.source.name})`);
  const citeLines = evidence.citations.map((c, i) => `[C${i + 1}] ${c.title} — ${c.organization}. ${c.url}`);
  const context = [
    `QUESTION: ${evidence.question}`,
    "",
    "GROUNDED FACTS (use only these):",
    ...(factLines.length ? factLines : ["(none — the graph has no facts for this question)"]),
    "",
    "CITATIONS:",
    ...(citeLines.length ? citeLines : ["(none)"]),
  ].join("\n");
  return { question: evidence.question, context, evidenceCount: evidence.facts.length, citationCount: evidence.citations.length };
}

/** The citation-forced prompt a provider would receive — the guardrails plus the grounded packet. */
export function buildCitationForcedPrompt(packet: RagPacket): string {
  return [
    "You are a grounded scientific assistant. Answer using ONLY the grounded context below.",
    "Rules:",
    ...ASSISTANT_GUARDRAILS.map((g) => `- ${g}`),
    "",
    packet.context,
    "",
    "Answer, citing [F#]/[C#] for every claim. If the facts are insufficient, reply exactly: 'Not enough graph evidence to answer.'",
  ].join("\n");
}

/** The configured provider, or null when none is wired — read from the environment, never faked. */
export function getConfiguredProvider(): AssistantProvider | null {
  // A real deployment would construct a provider here from a configured API key. None is configured in
  // this build, so we return null: the assistant honestly reports the LLM layer as unavailable and runs
  // deterministic-grounded, never fabricating an answer.
  return null;
}

export type AssistantMode = "deterministic-grounded" | "llm-grounded";

export interface AssistantLlmStatus {
  llmConfigured: boolean;
  provider: string | null;
  mode: AssistantMode;
  guardrails: string[];
  note: string;
}

/** The honest status of the assistant's language-model layer. */
export function assistantLlmStatus(): AssistantLlmStatus {
  const provider = getConfiguredProvider();
  return {
    llmConfigured: provider !== null,
    provider: provider?.name ?? null,
    mode: provider ? "llm-grounded" : "deterministic-grounded",
    guardrails: ASSISTANT_GUARDRAILS,
    note: provider
      ? "A language-model provider is configured; it phrases the grounded facts under the guardrails, never adding to them."
      : "No language-model provider is configured in this deployment. The assistant runs in deterministic-grounded mode: it returns real facts, relations, evidence chains, and citations from the graph, and does not generate prose. No answer is ever fabricated.",
  };
}
