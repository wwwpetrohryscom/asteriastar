# Editorial Policy (Contributor Guide)

The public-facing version lives at [`/editorial-policy`](../src/app/editorial-policy/page.tsx).
This is the contributor-facing companion: how to apply the policy when writing
content for the registry.

**Scope.** Asteria Star covers *everything above Earth* — astronomy, space, the
night sky, observation, the history and mythology of the sky, and astrology as
a separate cultural tradition (see
[POSITIONING_EVERYTHING_ABOVE_EARTH.md](./POSITIONING_EVERYTHING_ABOVE_EARTH.md)).
Broad scope, strict boundary.

## The non-negotiables

1. **No fabrication.** Never invent statistics, ratings, counts, distances,
   dates, measurements, quotes, or sources. If a number needs a citation and you
   don't have one, leave it out.
2. **Astronomy is science.** Write the consensus understanding, keep it
   definitional at the foundation level, and make it source-ready (declare
   `sources`).
3. **Astrology is tradition.** Frame it as cultural/interpretive ("in astrology
   tradition…", "is traditionally associated with…"). Never state astrological
   claims as fact, and never put them on a science page.
4. **Label interpretive content.** Astrology categories (`kind: "interpretive"`)
   and any `interpretive: true` category render the `DisclaimerBox`
   automatically. For non-astrology traditions (e.g. numerology) set a
   `disclaimer` override.
5. **No lorem ipsum.** Every published string is real, accurate copy.

## Writing a category

For each `Category` provide:

- **`summary`** — one accurate sentence (card + meta description).
- **`overview`** — 2–3 sentences, definitional and citation-safe. Avoid
  specific figures unless cited.
- **`plannedTopics`** — honest, future-facing subtopics (shown as "in
  progress").
- **`sources`** — for any factual (science/reference) topic.

## The science / tradition test

Before publishing, ask:

- Could a reader mistake an astrology statement for a scientific claim? If so,
  reframe and ensure the disclaimer is present.
- Does any astronomy page imply astrological meaning? Remove it.
- Is every asserted fact either textbook-definitional or backed by a source in
  `sources.ts`?

## Corrections

Fix errors promptly and note material corrections. Accuracy outranks the
appearance of authority.

## Automation

Tooling may assist drafting and structuring, but a person is responsible for
verifying facts against real sources. Automation never overrides these rules.
