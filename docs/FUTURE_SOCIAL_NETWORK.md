# Future Social Network — Architecture Notes

> **Status: planning only.** None of this is built. There is no database, no
> auth, no posting, and no feed in the current codebase. This document records
> the intended direction so today's decisions don't block it.

Asteria Star should be able to grow from a static encyclopedia into a social
platform — profiles, saved charts, posts, follows, and more — without a rewrite.
This document describes how.

## Guiding principle

The **public knowledge site stays static-first and SEO-first forever.** The
social/product layer is additive: it lives in its own routing namespace, behind
its own layout and (later) auth, and must never degrade the crawlability or
performance of the encyclopedia.

## Namespace: the `(product)` route group

`src/app/(product)/` is reserved now (empty route group, no routes, no code).
When the product ships, authenticated routes live there behind their own
layout and middleware:

```
src/app/(product)/
  layout.tsx          product shell (requires session)
  feed/               public activity feed
  u/[username]/       public profile pages (SSR/ISR, indexable where public)
  settings/           account + privacy (private)
  saved/              saved charts & calculators (private)
  collections/        user collections
```

`robots.ts` already disallows `/app/` and `/api/` so nothing leaks into search
before it's ready. Public profile pages, when launched, would be explicitly
allowed and given their own metadata + JSON-LD (`Person`/`ProfilePage`).

## Capabilities to support (later)

User identity & profiles:

- user profiles, public usernames, avatars, bios
- public/private profile settings
- verified expert profiles; astronomer / astrologer / creator pages

Content & activity:

- posts, image posts, sky observations
- saved natal charts, saved calculator results
- collections
- public activity feeds

Social graph & interactions:

- followers / following
- likes, comments

Trust & safety:

- moderation, reporting

## Data model sketch (not implemented)

Tables/collections anticipated, with privacy as a first-class field:

- `users` (id, username, display_name, avatar_url, bio, is_public, role)
- `profiles_expert` (user_id, credential, verification_status)
- `posts` (id, author_id, type: text|image|observation, body, media_ref,
  visibility)
- `charts_saved` (id, owner_id, kind: natal|synastry|…, input, visibility)
- `follows` (follower_id, followee_id)
- `likes` (user_id, target_type, target_id)
- `comments` (id, author_id, target_id, body, visibility)
- `collections` / `collection_items`
- `reports` (reporter_id, target_type, target_id, reason, status)

Astrology-derived artifacts (charts, readings) remain clearly labeled as
interpretive even inside the product, per the editorial policy.

## What keeps the path open today

- **Clean routing.** Public content uses `/[section]/[category]` and
  `/[section]/[category]/[entry]`; the product has its own reserved group. No
  URL collisions.
- **No premature coupling.** The static site has zero dependency on a user
  session, database, or client data layer.
- **Typed content layer.** Calculators and charts will produce typed results
  that can be persisted later without reshaping the public content model.
- **Stable identifiers.** Section/category/**entry** slugs and each entry's
  `canonicalUrl` are stable, so a future "save this entry", "add to collection",
  or "share" feature has a durable reference from day one.

## How the Phase 2 entry layer feeds this

The entry layer (see [PHASE_2_ENTRY_LAYER.md](./PHASE_2_ENTRY_LAYER.md)) is the
unit users will eventually save, collect, and discuss. A future
`charts_saved` / `collection_items` table would reference an entry by its
stable path — no schema dependency on the public site exists yet, and none is
built in this phase. Astrology-derived entries remain clearly labeled as
interpretive wherever they appear, including inside any future product surface.

## Explicitly out of scope for now

Auth, database, feeds, posting, login/registration, comments, likes, and
moderation tooling are **not** to be built in the foundation phase.
