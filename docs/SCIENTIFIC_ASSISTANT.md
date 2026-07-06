# Scientific AI Research Assistant Platform (Program BS)

An assistant that never makes things up. It answers from the knowledge graph alone — comparing
concepts by their real connections, tracing evidence chain by chain, and citing the provenance of
every fact — so an answer can always be checked against the graph. This is the capstone of the
interactive platform: the graph made conversational, but grounded.

**Honesty first — the no-hallucination guarantee.** The grounded capabilities are backed by **real
retrieval over the knowledge graph today** (`src/lib/assistant/retrieval.ts`) and surface **only facts
already in the graph**, each with its cited provenance and a traceable chain of relations. **There is
no language model in this layer**: nothing is generated or invented. The architecture capabilities are
interfaces prepared for a future language-model layer that would *phrase* these grounded facts and
never add to them — so even with a model, an answer stays checkable against the graph.

## Data model

`AssistantRecord` (single entity type `assistant_capability`) carries a `grounding`
(`grounded` — real retrieval today, or `architecture` — an interface for a future LLM), a `capability`
label, and `relatedKeys` linking each capability to the example entities it works over and its
sibling capabilities.

## The grounded retrieval (`src/lib/assistant/retrieval.ts`)

Built on the real graph and the graph-explorer algorithms:

- `explainEntity(id)` — an entity, its own description, its real relations, and its cited sources.
- `compareConcepts(a, b)` — the entities that both inputs connect to (real common ground; e.g. Mars
  and Venus share atmospheric escape, climate evolution, and the Solar System).
- `evidenceChain(a, b)` — a real shortest path of relations linking two entities (e.g. Edwin Hubble →
  the expansion of the universe → dark energy).
- `relatedConcepts(id)` — the real neighbours of an entity.
- `scientificSearch(q)` — a grounded name search across the graph.

## Contents — 18 capabilities

- **Grounded (13)** — scientific search, object explanation, concept comparison, relationship
  explanation, evidence chains, provenance-aware answers, citation-aware answers, related concepts,
  reading recommendations, scientific summaries, learning-path generation, cross-domain reasoning,
  and the no-hallucination layer.
- **Architecture (5)** — the answer modes (educational / research / expert), RAG-ready interfaces,
  prompt orchestration, conversation memory, and LLM integration.

## Engine (`engine.scientificAssistant`)

`ResolvedAssistant` resolves a capability to the example entities it works over (`related`) and its
sibling capabilities. The engine also exposes the grounded retrieval directly: `explain(id)`,
`compare(a, b)`, `evidenceChain(a, b)`, `related(id)`, `search(q)`, plus `all()`, `grounded()`,
`architecture()`, and `resolveEntry(slug)`.

## Pages

- `/assistant` — the hub: a real grounded concept-comparison, the discovery hubs, and the grounded
  capabilities.
- `/assistant/{slug}` — a capability; grounded capabilities render a real, live demo (a comparison, an
  evidence chain, related concepts, or a grounded explanation).
- `/assistant/discover/{slug}` — the grounded capabilities and the architecture for a future model.

## Provenance

The assistant adds only the capability definitions; every answer it gives is drawn from the existing
knowledge graph, with all its own provenance. Grounded capabilities surface only real facts; the
language-model layer is future work and, by design, will explain and never invent.
