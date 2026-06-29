# Reserved: authenticated product area

This `(product)` route group is **reserved** for Asteria Star's future
authenticated product — user profiles, saved charts, collections, and the
social features described in [`docs/FUTURE_SOCIAL_NETWORK.md`](../../../docs/FUTURE_SOCIAL_NETWORK.md).

It is intentionally **empty**: a route group with no `page.tsx` adds no routes
and ships no code. It exists only to claim the namespace and make the intended
separation explicit.

## Why a route group, not `/app`?

In the Next.js App Router, `src/app` *is* the routing root, so a literal `/app`
segment would be confusing. Instead we reserve the **`(product)`** route group.
Route groups (parentheses) organize files without affecting the URL, so when
the product ships its routes can live here behind their own layout (and, later,
auth middleware) without disturbing the public, statically-generated knowledge
site.

## Rules for this phase

- **No** auth, database, login, or registration is implemented now.
- **No** routes are added here yet.
- The public site under `src/app/**` stays static-first and SEO-first.
- `/app/` is disallowed in `robots.ts` so nothing here is ever indexed early.

See the docs for the full plan.
