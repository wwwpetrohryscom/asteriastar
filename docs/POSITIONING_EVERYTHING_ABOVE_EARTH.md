# Positioning — "Everything Above Earth"

## The concept

Asteria Star is **not** narrowly an "astronomy + astrology" site. The brand
concept is broader and clearer:

> **Everything Above Earth.**

Asteria Star is a knowledge platform for everything above our planet —
astronomy, space exploration, the night sky, celestial phenomena, mythology,
observation, astrophotography, telescopes, and astrology as a clearly separate
cultural tradition.

This framing is deliberately expansive on **scope** and strict on
**epistemics**.

## What "everything above Earth" includes

- Astronomy and space science: stars, planets, galaxies, constellations,
  black holes, and more.
- Space exploration: missions, spacecraft, telescopes, observatories,
  organizations.
- The night sky and observation: celestial events, sky guides,
  astrophotography.
- The human story of the sky: history of astronomy, mythology of the sky, and
  cultural interpretations.
- Astrology — presented as a cultural, symbolic, historical, and interpretive
  tradition, clearly labeled and never mixed with science.

## The non-negotiable boundary

Broad scope does **not** mean blurred lines. Two realms are kept structurally
separate:

- **Science** (astronomy, space, sky observation): factual, source-ready,
  evidence-based, no unsupported claims.
- **Interpretive tradition** (astrology, mythology, symbolism): cultural,
  historical, interpretive, clearly labeled, never presented as scientifically
  proven astronomy.

This boundary is enforced in three places:
1. The content model — `Section.kind`, `Category.interpretive`, and entry
   `kind` drive the disclaimer (see [CONTENT_MODEL.md](./CONTENT_MODEL.md) and
   [EDITORIAL_POLICY.md](./EDITORIAL_POLICY.md)).
2. The knowledge graph — relations are typed by `domain` and `confidence`;
   astrology and interpretive links can never be confirmed science (see
   [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md)).
3. The UI — knowledge connections are shown in separate, labeled groups and
   never visually mixed.

## Where the positioning appears

The positioning is centralized in `src/lib/site.ts`
(`SITE.tagline`, `SITE.description`, `SITE.positioning`, `SITE.principle`) and
flows to:

- the homepage hero ("Everything Above Earth.");
- site metadata and the default title;
- the footer;
- the about, editorial, and sources pages;
- `llms.txt`.

## Why this matters

The expansive-scope-plus-strict-boundary stance is the platform's core
credibility asset. It lets Asteria Star be a genuinely broad home for celestial
knowledge — appealing to students, hobbyists, and the curious — without ever
becoming a low-quality horoscope site or compromising scientific integrity.
