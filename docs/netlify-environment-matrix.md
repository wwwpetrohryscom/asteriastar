# Environment variable matrix — Netlify

Every environment variable referenced anywhere in the project: application code,
build scripts, validation scripts, API routes, generated assets, Open Data,
search, WebmasterID, IndexNow, and GitHub workflows. Collected by scanning for
`process.env.*` across `src/` and `scripts/`, and for `secrets.*` / `vars.*` /
`env:` across `.github/workflows/`.

## The matrix

| Variable | Required | Build | Functions | Browser | Secret | Source of truth |
| --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | no (has fallback) | ✅ | ✅ | ✅ | no | `netlify.toml` → `[context.production.environment]` |
| `INDEXNOW_KEY` | no (degrades safely) | ✅ | ✅ | ✖ | **no — public by protocol** | Netlify env var, **production context only** |
| `INDEXNOW_TRIGGER_TOKEN` | no | ✖ | ✅ | ✖ | **yes** | unset — optional guard on `/api/indexnow` |
| `NEXT_PUBLIC_WEBMASTERID_SITE_ID` | no | ✅ | ✖ | ✅ | no | unset — code default `wm_knpkrkxcizuzoa0s` |
| `NEXT_PUBLIC_WEBMASTERID_ENDPOINT` | no | ✅ | ✖ | ✅ | no | unset — code default (third-party ingest URL) |
| `NODE_VERSION` | yes (build) | ✅ | ✖ | ✖ | no | `netlify.toml` → `22` |
| `NPM_FLAGS` | no | ✅ | ✖ | ✖ | no | `netlify.toml` |
| `HYG_CSV` / `EXO_CSV` / `NGC_CSV` / `SS_DIR` / `APPEND` | no | ✖ | ✖ | ✖ | no | developer-only ingest script inputs; never set in CI or on the host |
| `GITHUB_OUTPUT` | n/a | ✖ | ✖ | ✖ | no | provided by GitHub Actions |
| `GH_TOKEN` | yes (Actions) | ✖ | ✖ | ✖ | **yes** | `${{ github.token }}` — GitHub-only, never on Netlify |
| `SITE_URL` | no | ✖ | ✖ | ✖ | no | legacy alias read only by `scripts/indexnow-submit.ts` as a fallback |

Columns: **Build** = needed while `npm run build` runs · **Functions** = needed by
the server handler at request time · **Browser** = inlined into the client bundle
(only `NEXT_PUBLIC_*` can be) · **Secret** = must never appear in the repository,
in build logs, or in a `NEXT_PUBLIC_*` name.

## What was actually configured on Netlify

```
INDEXNOW_KEY | contexts: production | secret: false
```

Set with:

```
netlify env:set INDEXNOW_KEY <key> --context production
```

### Why `INDEXNOW_KEY` is *not* marked secret

It was, at first — and that broke every production build, which is how the
mistake was found rather than shipped.

An IndexNow key is a **public verification token**, not a credential. The
protocol requires it to be served at `/<key>.txt` on the site's own domain, so
it has been committed at `public/c292fa58c74f45f9ad982e152b4f7c1c.txt` since
2026-07-09 and is written out in `README.md`. Knowing the key grants nothing:
IndexNow validates a submission against the key file hosted on the host being
submitted for, so it is only usable by whoever already controls that host.

Marking it secret told Netlify's secrets scanner to fail the build if the value
appeared anywhere in the repository or build output — which it always will, in
the file the protocol mandates. The scanner was right; the classification was
wrong. It is now a normal production-scoped variable, and
`SECRETS_SCAN_OMIT_KEYS = "INDEXNOW_KEY"` in `netlify.toml` records the reason
so the mistake is not repeated. Scanning stays **enabled** for everything else.

`NEXT_PUBLIC_SITE_URL` is **not** stored as a Netlify environment variable. It is
declared in `netlify.toml` because it is not a secret and because keeping it in
the repository means the canonical identity of every deploy context is reviewable
in a pull request instead of hidden in a dashboard.

No other variable needs to exist for the site to build and serve correctly. There
is no external secret still outstanding: nothing is blocked on a value this
migration could not obtain.

## Why `INDEXNOW_KEY` is scoped to production only

This is the one variable where a wrong scope has consequences outside the site.
If a Deploy Preview had the key, `/api/indexnow` on a `*.netlify.app` hostname
would be able to submit URLs to Bing, Yandex, Seznam and Naver.

Two independent guards make that impossible:

1. **Scope.** The variable exists only in the production context, so a preview
   build never receives it. `indexNowKey()` returns `""`, `/api/indexnow` returns
   **503**, and `scripts/indexnow-submit.ts` refuses to run.
2. **Host filtering.** Even with a key, `submitUrls()` filters the URL list to the
   host of `SITE_URL`, and previews build with `NEXT_PUBLIC_SITE_URL` set to their
   own `DEPLOY_PRIME_URL`. A preview URL can therefore never be submitted under
   the production host, and a production URL can never be submitted from a preview.

`scripts/netlify/smoke.ts` asserts guard 1 directly when run with `--preview`, and
`scripts/netlify/validate-migration.ts` fails the build if either guard is removed
from the source.

## Site-URL resolution per deploy context

`src/lib/site.ts` is the single source of truth and was **not modified**:

```ts
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, "");
```

| Context | `NEXT_PUBLIC_SITE_URL` | Resulting canonical | Indexable |
| --- | --- | --- | --- |
| Production | `https://asteriastar.com` (from `netlify.toml`) | `https://asteriastar.com/…` | yes |
| Deploy Preview | `$DEPLOY_PRIME_URL` (from the per-context build command) | the preview's own origin | no — `X-Robots-Tag: noindex, nofollow` |
| Branch deploy | `$DEPLOY_PRIME_URL` | the branch deploy's own origin | no — `X-Robots-Tag: noindex, nofollow` |
| Local dev | unset → in-code fallback | `https://asteriastar.com` | n/a |

The interpolation happens in the build **shell**, not in TOML: Netlify does not
expand `$VAR` inside `[*.environment]` tables, so writing
`NEXT_PUBLIC_SITE_URL = "$DEPLOY_PRIME_URL"` there would have produced the literal
string `$DEPLOY_PRIME_URL` as the site origin — a canonical URL of
`$DEPLOY_PRIME_URL/astronomy/planets/jupiter` on every preview page. Expressing it
as `[context.deploy-preview] command = "NEXT_PUBLIC_SITE_URL=\"$DEPLOY_PRIME_URL\" npm run build"`
is what makes it resolve.

Production canonical identity is now **pinned explicitly** rather than relying on
the in-code fallback, which is how it was resolved on Vercel. The value is
identical, so no emitted URL changes; the difference is that it can no longer be
altered silently by an environment change.

## GitHub Actions — deliberately unchanged

The four scientific-refresh workflows and the IndexNow workflow reference **no**
deployment provider, no deploy URL, and no host-specific secret. They needed no
migration and received none.

`.github/workflows/indexnow.yml` reads `secrets.INDEXNOW_KEY` and
`vars.NEXT_PUBLIC_SITE_URL` from GitHub, entirely separately from Netlify's copy.
It works by fetching the **live sitemap** from the configured site URL, so it is
indifferent to which host serves that sitemap — it kept working across the
cutover without a change.

The refresh workflows stay on GitHub Actions rather than moving to Netlify
scheduled functions. Moving them would mean giving the hosting platform write
access to scientific data, and would lose the property that matters most about
them: a refresh opens a **reviewed pull request** and never writes to `main`. That
guarantee lives in the GitHub permission model, not in the scheduler, so there is
no technical reason to move it and a good reason not to.
