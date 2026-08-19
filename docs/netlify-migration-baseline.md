# Netlify migration — production baseline

Recorded before any migration change was made, on branch `migrate/vercel-to-netlify`
cut from `main`. Everything in this file is measured, not assumed: the repository
was audited directly and the live Vercel production deployment was crawled.

## 1. Repository state

| Fact | Value |
| --- | --- |
| Baseline commit | `1b69b9f433d797294c15a783cbf6fb8bbb849934` |
| Commit subject | Global search: deterministic index, ranked matching, header overlay (#121) |
| `origin/main` | identical to local `main` at capture time |
| Working tree | clean except untracked `design-previews/` (pre-existing, not part of the build) |
| Repository | `github.com/wwwpetrohryscom/asteriastar` |

## 2. Toolchain

| Fact | Value |
| --- | --- |
| Framework | Next.js **16.2.9**, App Router, Turbopack build |
| React | 19.2.4 |
| Package manager | npm (`package-lock.json`, lockfileVersion 3) |
| Node (local build host) | v25.9.0 |
| Node (GitHub Actions) | 20 |
| Node pinned for Netlify | 22 (see `netlify.toml`; no `.nvmrc`/`engines` existed before) |
| Build command | `npm run build` (with `prebuild` → IndexNow key file + search index) |
| Output architecture | default Next.js server output — **not** `output: "export"`, **not** `output: "standalone"` in `next.config.ts` |
| `next.config.ts` | only `turbopack.root` is set. No custom `images`, `headers`, `redirects`, `rewrites`, or `env`. |

## 3. Application shape

Measured from the baseline `npm run build` route table.

| Class | Count |
| --- | --- |
| Route entries in the route table | **367** |
| Static (`○`) | 147 |
| Prerendered with `generateStaticParams` (`●`) | 190 |
| Server-rendered on demand (`ƒ`) | 30 |
| **Pages actually prerendered** | **9,234** |
| Prerendered HTML files in `.next/server/app` | 8,811 |
| RSC / segment payload files | 71,925 |
| `page.tsx` files | 326 |
| `route.ts` handlers | 33 |
| API routes total | 27 under `/api` (19 dynamic, 8 `force-static`) |
| Non-API dynamic pages | 11 (`/assistant/*` ×4, `/authority/data-health/*` ×7) |
| `middleware.ts` | **none** |
| `export const runtime` declarations | 1, and it is `"nodejs"` (`/api/indexnow`). **No `runtime = "edge"` anywhere.** |
| `dynamicParams` declarations | 184, **all `= false`** — no fallback rendering |
| `revalidate` declarations | 1 (`/` → 86400) |
| Server Actions | none |
| `revalidatePath` / `revalidateTag` / cache tags | none |
| Public assets | 1,520 files, 216 MB (`public/media` alone is 201 MB / 1,402 files) |
| Sitemap URLs (live production) | **8,671**, with 1,567 `<image:loc>` entries |

Build output size (baseline build, local):

| Path | Size |
| --- | --- |
| `.next/server/chunks` excluding source maps | 151.3 MB (1,235 files) |
| `.next/server/chunks` source maps | 350.2 MB |
| `.next/server/app` (prerendered HTML + RSC) | 3.8 GB |
| `.next/static` | 1.3 MB |

The dominant server chunk is the knowledge graph (`src_knowledge-graph_*`,
3.45 MB for the shared copy plus ~2.33 MB per SSR entry). This is the figure that
determines whether the Netlify server function fits inside the serverless bundle
limit, and it is checked explicitly in the Netlify build section of the parity audit.

## 4. Baseline gates — all green

Run on the baseline commit before any change:

| Gate | Result |
| --- | --- |
| `npm run validate` | **exit 0** — 93 categories, 87 entries, 7,351 entities; 34,232 values across 6 snapshots; 7,723 search documents, checksum `ed68c307`; 0 placeholder pages, 0 unbacked review claims |
| `npx tsc --noEmit` | **exit 0** |
| `npm run lint` | **exit 0** — 1 pre-existing warning (`GlobalSearch.tsx:249` unused `indexLoading`) |
| `npm run build` | **exit 0** — 9,234 static pages generated in 23.3 s, compile 11.4 s |

The lint warning predates this work and is left untouched: fixing it would be an
unrelated change inside a migration PR.

## 5. Live Vercel production — as it actually behaves

Captured by crawling the deployment, not from configuration.

| Fact | Value |
| --- | --- |
| Serving host | `www.asteriastar.com` → **HTTP 200** |
| Apex | `asteriastar.com` → **HTTP 308** to `https://www.asteriastar.com/` |
| Server | Vercel (`server: Vercel`, `x-vercel-id`, `x-vercel-cache: HIT`) |
| Prerender marker | `x-nextjs-prerender: 1`, `x-nextjs-stale-time: 300` |
| TLS | valid, HTTP/2 |
| Emitted canonical | `https://asteriastar.com` — the **apex**, i.e. `NEXT_PUBLIC_SITE_URL` was unset and the in-code fallback applied |
| Sitemap URLs | all 8,671 on `https://asteriastar.com` (apex) |
| Analytics | WebmasterID `wm_knpkrkxcizuzoa0s`, tracker from `webmasterid.com`, ingest at `webmasterid-ingest-api.vercel.app` |
| `*.vercel.app` in HTML | none, other than the third-party WebmasterID ingest endpoint |

### Response headers present in production

Measured across the 69-target parity corpus:

| Header | Coverage | Value(s) |
| --- | --- | --- |
| `strict-transport-security` | 69/69 | `max-age=63072000` |
| `cache-control` | 69/69 | see table below |
| `access-control-allow-origin` | 46/69 | `*` (the Open Data API surface) |
| `link` | 3/69 | Next.js asset preload hints |

**No** `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`,
`Permissions-Policy` or `X-Frame-Options` is served in production. The migration
preserves this exactly — adding headers here would be an unrequested security
change shipped inside a hosting migration, and a new CSP in particular could break
the WebmasterID tracker, `next/image`, and the generated OG images. It is recorded
in the final report as a separate recommendation.

`strict-transport-security` is the one header Vercel contributed that the
application does not emit itself, so it is the one header the Netlify config has to
reproduce explicitly.

### Cache-Control distribution (69-target corpus)

| Count | Value | What it covers |
| --- | --- | --- |
| 44 | `public, max-age=0, must-revalidate` | prerendered HTML and Next-managed responses |
| 8 | `public, max-age=3600` | static-ish API responses |
| 8 | `public, max-age=3600, stale-while-revalidate=86400` | cached Open Data endpoints |
| 4 | `public, max-age=86400` | long-lived exports/assets |
| 3 | `private, no-cache, no-store, max-age=0, must-revalidate` | Live Sky / time-dependent endpoints |

The three `no-store` responses are the freshness contract for computed,
time-dependent data. They are asserted in the parity suite and must not become
cacheable on Netlify.

## 6. Pre-existing condition found during baseline (not introduced, not fixed here)

**The production canonical URL points at a host that redirects.** Every page emits
`<link rel="canonical" href="https://asteriastar.com…">` and every one of the 8,671
sitemap URLs uses the apex — but the apex answers `308 → https://www.asteriastar.com`.
Search engines resolve this by following the redirect and consolidating on `www`,
so it has not broken indexing, but the canonical is not self-referential.

This is **out of scope for the migration** and is deliberately reproduced as-is:
changing it would alter SEO behaviour inside a hosting-migration PR, which the
migration brief explicitly forbids. It is carried into the final report as a
recommendation to be decided and executed separately, once the platform move has
settled.

## 7. Parity baseline artefact

`scripts/netlify/parity-corpus.ts` defines 69 targets spanning every functional
class: home, hub, index, 12 entity families, the editorial `[section]/[category]/[entry]`
tree, calculators, Live Sky, search, developer, datasets, gallery, data-health,
assistant, 20 API endpoints, deliberate 400/404 contracts, the four protocol files,
public exports, and the six brand/generated assets.

`scripts/netlify/parity-check.ts` captured the Vercel production snapshot used as
the comparison baseline:

```
[parity] capturing baseline from https://www.asteriastar.com (69 targets)
[parity] status distribution: { '200': 65, '400': 2, '404': 2 }
```

The two 400s and two 404s are the intended error contracts, not failures.
