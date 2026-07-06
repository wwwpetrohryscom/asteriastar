# Grounded Scientific AI (Program BW)

An assistant that answers from the knowledge graph — and only from the knowledge graph. It makes the
Program BS capabilities **actually work**, as live tools and a public API, and it is honest to the point
of refusing: where the graph has no answer, it says so.

## Deterministic first — no language model required

Every tool is deterministic retrieval over the real graph. There is **no language model** in this
build, and the assistant never generates prose or invents a fact.

- **Explain** (`/assistant/entity`) — an entity's own description, its real relations, and its cited
  sources.
- **Compare** (`/assistant/compare`) — two entities' **shared graph neighbours**: real common ground.
- **Evidence path** (`/assistant/evidence-path`) — the shortest chain of relations linking two
  entities, followable link by link.
- **Learning path** (`/assistant/learning`) — an entity's broader context (from hierarchical relations),
  the nearest related concepts, and any curated platform learning path that features it.
- **Citation summary** — the real, source-backed citations behind an entity (reuses the citation
  engine).

When there is nothing to return, the tool says **"not enough graph evidence"** rather than fill the gap.

This reuses the Program BS retrieval core (`src/lib/assistant/retrieval.ts`) and adds two tools in
`src/lib/assistant/grounded.ts`. It adds **no new entities** — the capabilities are the reused BS
`assistant_capability` nodes.

## The optional language-model layer — architecture-ready, unwired

`src/lib/assistant/llm.ts` defines the seam a language model would fit into, but wires none:

- `AssistantProvider` — the provider interface.
- `buildRagPacket(evidence)` — assembles the grounded context (facts + citations) a model may use.
- `buildCitationForcedPrompt(packet)` — a prompt that forces citation of the provided evidence only.
- `ASSISTANT_GUARDRAILS` — use only the given facts; cite everything; say "not enough graph evidence"
  if insufficient; never speculate; preserve uncertainty.
- `getConfiguredProvider()` — returns **null** in this build. `assistantLlmStatus()` therefore reports
  `llmConfigured: false`, mode `deterministic-grounded`, provider `null`.

If a provider is ever wired, it may only **phrase the grounded facts it is handed** — never add one.
The `/assistant/limitations` page shows the real citation-forced packet an example entity would produce,
proving the architecture is real while no model runs.

## API (deterministic, dynamic)

- `GET /api/v0/assistant/explain?id=<entityId>` → `{ entity, description?, sources?, links[], citations[] }`
- `GET /api/v0/assistant/compare?a=<id>&b=<id>` → `{ a, b, shared[] }`
- `GET /api/v0/assistant/path?from=<id>&to=<id>` → `{ from, to, length, path[] }` (404 when unconnected)

Registered in the open-data endpoint registry, so they appear in `/api/v0/openapi.json`, the developers
pages, and `llms.txt`. Every response carries the standard provenance envelope.

## Honesty guarantees (enforced)

- No chat is persisted — there is no history and no account.
- The build gate (`scripts/validate-entries.ts`) asserts the deterministic tools return real results,
  that `getConfiguredProvider()` is null and `llmStatus()` reports an unconfigured deterministic
  assistant, that the assistant lib wires no live-model network call, and that the 3 API endpoints are
  registered.

## Pages & engine

Tools `/assistant/{entity,compare,evidence-path,learning,limitations}` (surfaced from the existing
`/assistant` hub). Engine `engine.groundedAssistant`.
