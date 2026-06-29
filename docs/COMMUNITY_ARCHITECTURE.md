# Community Architecture (Phase 6)

Phase 6 introduces the **first community layer** — as architecture and premium
landing pages only. **No authentication, no database, no persistence, no real
or fabricated users, and no real social features are implemented.**

## Principles

1. **Knowledge first.** Every community feature must strengthen the knowledge
   platform. The knowledge graph is the source of truth.
2. **Community second.** People are contributors. User-generated content
   *attaches to* graph entities — never the reverse.
3. **Algorithms last.** No addictive feed, no infinite scroll, no engagement
   algorithm, no follower/reaction counts.

## The core invariant

Every community object references existing graph entities (by stable id, e.g.
`planet:jupiter`) or content entries (by canonical path). **Community objects
never duplicate graph data.** `validateCommunity()`
([`src/lib/community/index.ts`](../src/lib/community/index.ts)) enforces this:
every reference must resolve to an existing entity/entry. It runs in
`npm run validate` (a no-op today since there is no data — it proves the gate).

## Models (`src/lib/community/`)

| File | Model |
| --- | --- |
| `identity.ts` | Identity types (person, organization, observatory, university, museum, space agency, amateur astronomer, astrophotographer, educator, student, science communicator) + verification (designed-for, not implemented). |
| `ids.ts` | Stable, versioned, branded ids (Profile/Collection/Observation/Media/Contribution) + `EntityRef`/`EntryRef` + visibility. API version `v0`. |
| `profiles.ts` | Profile (display name, username, avatar, bio, location, languages, interests, favorite entities, observations, collections, achievements, verification, contribution summary). |
| `collections.ts` | Collections of `EntityRef`/`EntryRef` (references, never copies) + example templates. |
| `observations.ts` | Observation — **requires** an `objectEntity` graph reference (no isolated observations); date, location, equipment refs, sky conditions, media. |
| `astrophotography.ts` | Astrophoto with capture details, license + credit, object entity, and optional observation link. |
| `contributions.ts` | Contribution types (observation, photo, correction, translation, source, timeline, new relationship, new entity suggestion) + review states. No editing workflow yet. |
| `reputation.ts` | Reputation dimensions (verified sources, accepted contributions, observation/reference quality, graph contributions, educational content, scientific accuracy, community trust). Explicitly **excludes** likes/followers/reactions/views/trending. |

## Graph integration

Every future user object connects into the graph. Example:

```
Profile (observer)
  └─ Observation → objectEntity: planet:jupiter
                     └─ part_of → location:solar-system
                   → equipment:  (a telescope entity)
                   → media: Astrophoto → objectEntity: planet:jupiter
```

Community discovery (people interested in Orion, observing Jupiter, …) is
designed to be derived from these graph references — never from engagement
metrics.

## Pages

Premium, honest landing pages (each marked "architecture preview", no fake
users): `/community` (hub + Knowledge Feed), `/community/observations`,
`/astrophotography`, `/collections`, `/contributors`, `/learning`,
`/explore-together`.

## Knowledge Feed (not a social feed)

`/community` includes a Knowledge Feed: **real, graph-driven additions** to the
platform (learning paths, comparisons, timelines, connection pages, recently
added entity kinds) — no engagement algorithm, no infinite scroll, no fake
activity or timestamps.

## API preparation

Stable, versioned, branded ids and `EntityRef`/`EntryRef` define how a future
backend/API would attach user data to the graph without duplicating it. No
backend is implemented. See also
[FUTURE_SOCIAL_NETWORK.md](./FUTURE_SOCIAL_NETWORK.md).
