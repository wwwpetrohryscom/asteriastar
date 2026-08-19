# Vercel → Netlify dependency and parity audit

Every Vercel-specific surface the migration brief lists was searched for across
the whole repository (`src/`, `scripts/`, `.github/`, `public/`, root configs).
The finding below is the audit result, not a plan: each row states what was
actually found and how it is classified.

Classification legend:

| Code | Meaning |
| --- | --- |
| `PORTABLE_AS_IS` | works identically on Netlify with no change |
| `NETLIFY_SUPPORTED` | platform feature exists on both, provided by the Netlify Next.js Runtime |
| `CONFIG_CHANGE_REQUIRED` | needs a `netlify.toml` / environment entry, no code change |
| `CODE_CHANGE_REQUIRED` | needs an application change |
| `VERCEL_ONLY` | no Netlify equivalent |
| `DEAD/UNUSED` | referenced but not actually in use |

## Headline result

**The repository contains no Vercel coupling at all.** A case-insensitive search
for `vercel` across all source, scripts, workflows, public files and root configs
returns exactly **two** hits, and neither is a deployment dependency:

```
src/app/api/indexnow/route.ts:8   * ... (a Vercel Deploy Hook, a CI step, ...)   ← comment
src/components/site/WebmasterId.tsx:11  "https://webmasterid-ingest-api.vercel.app/api/events"  ← third-party service
```

There is no `vercel.json`, no `@vercel/*` dependency, no `.vercel` directory, no
Vercel Analytics or Speed Insights, no Vercel Blob or KV, no Edge Config, and no
Vercel-specific GitHub workflow. The platform coupling that existed lived entirely
in the Vercel dashboard (domain, DNS, environment), not in the code.

## Full audit matrix

| # | Audited surface | Found in repository | Classification | Action taken |
| --- | --- | --- | --- | --- |
| 1 | `vercel.json` | **absent** | `DEAD/UNUSED` | none — nothing to migrate or delete |
| 2 | `@vercel/*` packages | **absent** from `package.json` and lockfile | `DEAD/UNUSED` | none |
| 3 | Vercel Analytics | **absent** | `DEAD/UNUSED` | none. Analytics is WebmasterID only (row 22) |
| 4 | Vercel Speed Insights | **absent** | `DEAD/UNUSED` | none |
| 5 | Vercel Blob | **absent** | `DEAD/UNUSED` | none — all media is committed under `public/` |
| 6 | Vercel KV | **absent** | `DEAD/UNUSED` | none — no runtime datastore; data is compiled in |
| 7 | Edge Runtime (`runtime = "edge"`) | **absent**. The only `runtime` export in the codebase is `runtime = "nodejs"` in `/api/indexnow` | `PORTABLE_AS_IS` | none. This is the single most important finding: there is no Edge→Node semantic gap to bridge |
| 8 | Edge Config | **absent** | `DEAD/UNUSED` | none |
| 9 | `process.env.VERCEL_*` | **absent** — no `VERCEL_URL`, `VERCEL_ENV`, `VERCEL_REGION` reads anywhere | `PORTABLE_AS_IS` | none. Site origin comes from `NEXT_PUBLIC_SITE_URL` alone |
| 10 | `x-vercel-*` headers | never read or set by the application; only observed on live responses as Vercel's own | `PORTABLE_AS_IS` | none |
| 11 | Vercel deploy hooks | referenced in one **comment** in `/api/indexnow`; no hook is configured or called from the repo | `DEAD/UNUSED` | comment reworded to be platform-neutral |
| 12 | Build scripts | `prebuild` → `generate-indexnow-key.ts` + `build-search-index.ts`; `build` → `next build`. Plain Node/tsx, no platform APIs | `PORTABLE_AS_IS` | none |
| 13 | GitHub Actions | 5 workflows: `indexnow.yml` and 4 scientific-refresh workflows. **None** references Vercel, a deployment provider, or a deploy URL | `PORTABLE_AS_IS` | none — see `docs/netlify-environment-matrix.md` §4 for why the refresh jobs stay on GitHub |
| 14 | Production URL assumptions | `SITE_URL` in `src/lib/site.ts` reads `NEXT_PUBLIC_SITE_URL` and falls back to `https://asteriastar.com`. No deployment hostname is hard-coded | `CONFIG_CHANGE_REQUIRED` | `NEXT_PUBLIC_SITE_URL` pinned per deploy context in `netlify.toml` |
| 15 | Preview URL assumptions | **none existed** — a Vercel preview emitted production canonicals, because the fallback applied | `CONFIG_CHANGE_REQUIRED` | Netlify previews now build with `NEXT_PUBLIC_SITE_URL="$DEPLOY_PRIME_URL"` plus `X-Robots-Tag: noindex`. Strictly safer than the previous behaviour, and it cannot affect production |
| 16 | ISR / revalidation | one `export const revalidate = 86400` on `/`. Everything else is fully prerendered (`dynamicParams = false` in all 184 declarations) or `force-dynamic` | `NETLIFY_SUPPORTED` | none. Netlify Runtime v5 implements the Next full-route cache with tag/path revalidation |
| 17 | On-demand revalidation | `revalidatePath` / `revalidateTag` / cache tags: **absent** | `DEAD/UNUSED` | none |
| 18 | Middleware runtime | **no `middleware.ts` exists** | `PORTABLE_AS_IS` | none. This avoids the known Netlify Edge-bundling failure mode for Next 16 middleware entirely |
| 19 | Cron configuration | no `crons` config (there is no `vercel.json`). Scheduling is GitHub Actions `schedule:` only | `PORTABLE_AS_IS` | none — deliberately **not** moved to Netlify scheduled functions |
| 20 | Serverless function assumptions | handlers use only the Web `Request`/`Response` API and Node built-ins | `PORTABLE_AS_IS` | none |
| 21 | Generated image routes | `opengraph-image.tsx`, `twitter-image.tsx`, both via `ImageResponse` (Satori) in `src/lib/brand/og-card.tsx`; plus `icon.svg`, `apple-icon.png`, `manifest.ts` | `NETLIFY_SUPPORTED` | none. Generated at build time, so they ship as static assets |
| 22 | Analytics / WebmasterID | `src/components/site/WebmasterId.tsx`, mounted **once** in `src/app/layout.tsx:76` via `next/script` (`id="webmasterid-tracker"`, `afterInteractive`). Its ingest endpoint is `webmasterid-ingest-api.vercel.app` | `PORTABLE_AS_IS` | **none — deliberately unchanged.** That hostname is WebmasterID's own hosting, a third-party SaaS endpoint. It is not this project's deployment and must not be rewritten because it contains the word "vercel" |
| 23 | Streaming responses | no `ReadableStream` route handlers; all responses are complete bodies | `PORTABLE_AS_IS` | none |
| 24 | Server Actions | **absent** (`server-reference-manifest` is empty) | `DEAD/UNUSED` | none |
| 25 | Route handlers | 33 (`27` under `/api`, plus `/llms.txt`, `/data/graph.json`, `/data/graph.jsonld`, `/datasets/[slug]/csv`, `/datasets/[slug]/json`) | `NETLIFY_SUPPORTED` | none — all covered by the parity corpus |
| 26 | Redirects | **no `redirects()` in `next.config.ts`**. The only production redirect is apex → www, which was Vercel domain configuration, not code | `CONFIG_CHANGE_REQUIRED` | reproduced as an explicit `308` rule in `netlify.toml` |
| 27 | Rewrites | none in `next.config.ts` | `PORTABLE_AS_IS` | none |
| 28 | Custom headers | **no `headers()` in `next.config.ts`**. Production served `strict-transport-security: max-age=63072000`, added by Vercel itself | `CONFIG_CHANGE_REQUIRED` | HSTS declared explicitly in `netlify.toml` with the identical `max-age` |
| 29 | Public asset behaviour | 1,520 files / 216 MB under `public/`, served as plain static files | `PORTABLE_AS_IS` | none |
| 30 | `next/image` | used in 12 components; **every** source is a local path under `public/`. `next.config.ts` declares no `images` config, so no `remotePatterns` are relied on | `NETLIFY_SUPPORTED` | none. Netlify's Image CDN backs `next/image`; no remote-origin allow-list to port |
| 31 | Cookies / headers APIs | not used for request-scoped behaviour | `PORTABLE_AS_IS` | none |
| 32 | IndexNow | key from `INDEXNOW_KEY`; verification file materialised at prebuild and committed; submission via `scripts/indexnow-submit.ts` driven by `.github/workflows/indexnow.yml`, which reads the **live sitemap** rather than any deploy URL | `PORTABLE_AS_IS` | comment reworded; a regression test added. No Vercel dependency existed to remove |

## Next.js / OpenNext compatibility (Phase 2)

Adapter: **`@netlify/plugin-nextjs` v5.15.13** — the official Netlify Next.js
Runtime, developed as `opennextjs/opennextjs-netlify`. It is installed as a
devDependency (`^5.15.13`) and declared in `netlify.toml`, so local, Deploy
Preview and production builds all resolve the same adapter version rather than
whatever Netlify's auto-install happens to pick that day. No legacy v4 runtime is
used: v4 is only required for Next.js 10–13.4 or Node < 18, and this project is
Next 16.2.9 on Node 22.

Next.js 16 support was verified against the adapter's own history rather than
assumed — the runtime carries explicit Next 16 work (`fix: next 16 adjustments`,
`ci: adjustments after next@16 stable release`, `fix: handle PPR shells for fully
dynamic segments on Next.js 16.1.0+`, and the resolved `ENOENT for .prefetch.rsc
with cacheComponents` issue) — and then confirmed by running a real Netlify
production build locally.

| Capability | Used here? | Netlify status |
| --- | --- | --- |
| App Router | yes, exclusively | supported |
| React Server Components | yes | supported |
| Server Actions | no | n/a |
| Route handlers | yes, 33 | supported |
| Dynamic routes | yes, 190 prerendered families | supported |
| `force-static` | yes, 18 routes | supported |
| `force-dynamic` | yes, 10 routes | supported |
| SSR | yes, 30 routes | supported |
| SSG | yes, 9,234 pages | supported |
| ISR | one route (`/`, 86400 s) | supported |
| On-demand revalidation | not used | n/a |
| Streaming | not used | n/a |
| Middleware | **none** | n/a — and this removes the main Next 16-on-Netlify failure mode |
| `next/image` | yes, local sources only | supported via Netlify Image CDN |
| Remote images | not used | n/a |
| Generated OG / Twitter images | yes, build-time | supported |
| Cookies / headers | not used for behaviour | supported |
| Redirects / rewrites | none in code | handled in `netlify.toml` |
| API routes | yes | supported |
| Node runtime dependencies | `sharp` (build-time only, devDependency) | supported |

**No incompatible surface was found, so no functionality had to be downgraded and
no Edge→Node substitution was required.** The `runtime = "edge"` search that the
brief calls for returned zero results.

## Changes this migration actually makes to the repository

Deliberately minimal — three files touched outside of new documentation and tests:

1. `netlify.toml` (new) — build, contexts, HSTS parity header, apex→www 308.
2. `package.json` / `package-lock.json` — adds `@netlify/plugin-nextjs` devDependency and the `netlify:*` scripts.
3. `.gitignore` — ignores `.netlify`.
4. `src/app/api/indexnow/route.ts` — one comment reworded from "a Vercel Deploy Hook" to platform-neutral wording. No behaviour change.

No scientific data, page content, route, canonical, schema, or API contract was
modified.
