# Contribution Standards

> No public contribution workflow is implemented yet (see
> [COMMUNITY_ARCHITECTURE.md](./COMMUNITY_ARCHITECTURE.md)). These are the
> standards a contribution must meet to enter the open knowledge graph.

## Principles

1. **Knowledge first.** A contribution must strengthen the graph's accuracy or
   coverage — not engagement.
2. **Cite, don't assert.** Factual claims must reference an authoritative source
   (see [SCIENTIFIC_SOURCES.md](./SCIENTIFIC_SOURCES.md)). No unverified or
   fabricated claims.
3. **Respect the boundary.** Science, culture, and astrology stay separated;
   astrology/mythology is never presented as science.
4. **Reference, never duplicate.** New relations connect existing entities by
   stable id; new entities follow the `type:slug`
   [identifier rules](./ENTITY_IDENTIFIERS.md).

## Contribution types

Observation, photo, correction, translation, additional source, timeline
improvement, new relationship, and new-entity suggestion.

## Standards by type

- **New entity** — correct type, a unique well-formed id, ≥ 1 meaningful
  relation (no isolated nodes), and a source.
- **New relationship** — endpoints exist; correct `domain` + `confidence`
  (astrology → interpretive; science → never interpretive).
- **Correction / source / timeline** — must cite the supporting reference.
- **Photo / observation** — full provenance (license, credit, object) per the
  [image platform](./IMAGE_PLATFORM.md).

## Review & validation

Every change must pass `npm run validate` (graph integrity, stable ids, no
isolated nodes, dataset integrity, citation structure) and is reviewed for
scientific accuracy before it would change the graph. Contributions are
accepted under **CC BY-SA 4.0** (see [LICENSING_POLICY.md](./LICENSING_POLICY.md)).
