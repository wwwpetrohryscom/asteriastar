# Post-cutover observation window

What to watch after DNS moves, for how long, and what each signal would mean.
Rollback stays available throughout — see `docs/netlify-rollback.md`.

## Do not decommission anything yet

For the whole window, leave intact:

- the Vercel project `wwwpetrohryscoms-projects/asteriastar` and its production deployment
- its domain configuration for `asteriastar.com` and `www.asteriastar.com`
- its environment variables and Git integration

They cost nothing and they are the difference between a five-minute recovery and
a rebuild under pressure.

## Suggested window

**Seven days**, covering at least one full weekly cycle of the scientific-refresh
workflows (the Monday `refresh-weekly` run) so a refresh PR is observed opening,
validating and merging under the new hosting before anything is removed.

## What to monitor

| Signal | Where | What "healthy" looks like | What a problem looks like |
| --- | --- | --- | --- |
| Deploy status | Netlify → Deploys | every `main` deploy `ready` | a failed production deploy leaves the previous one serving — investigate before pushing again |
| Function errors | Netlify → Functions → `___netlify-server-handler` | errors only from genuine 400/404 contract responses | 5xx on any `/api/v0/*` path is a rollback trigger |
| Function duration | Netlify → Functions | steady; the 30 dynamic routes are compute-only, no external I/O | growth suggests cold starts dominating — see the bundle-size note below |
| Bandwidth | Netlify → Usage | in line with the previous Vercel egress | a step change usually means the CDN stopped caching something it used to |
| Image behaviour | spot-check `/_next/image?...` | 200, `image/webp` | a 400 means the Image CDN rejected a source path |
| 404 rate | Netlify → Analytics if enabled, else the crawl below | flat | a spike right after cutover means a routing rule is wrong |
| WebmasterID traffic | WebmasterID dashboard, site `wm_knpkrkxcizuzoa0s` | continuous across the cutover with no gap | a gap means the tracker stopped loading — check for a CSP or script-loading change |
| IndexNow | run of `.github/workflows/indexnow.yml` | HTTP 200/202 from the IndexNow endpoint | 403 means the key file is no longer byte-correct on the canonical host |
| Core Web Vitals | Search Console → Core Web Vitals, and CrUX | unchanged trend | field data lags ~28 days, so judge it at the end of the window, not on day one |

## Scheduled re-checks

Run these against the live production domain — day 1, day 3, and day 7:

```sh
npm run netlify:smoke  -- --origin https://www.asteriastar.com --expect-canonical-host asteriastar.com
npm run netlify:parity -- --compare docs/parity-baseline-vercel.json --candidate https://www.asteriastar.com
npm run netlify:crawl  -- --origin https://www.asteriastar.com --out /tmp/crawl-dayN.json
```

## Known operational note: server function size

The Netlify server handler bundles at **195.8 MB unzipped / 56.2 MB zipped**,
against AWS Lambda's 250 MB unzipped limit — about 22% headroom.

**125.8 MB of that is 67 near-identical copies of the knowledge-graph chunk**,
emitted once per SSR entry by Turbopack's chunking. It is not a Netlify problem
(the same duplication exists in the Vercel build); it is simply closer to a hard
limit on Netlify because the whole `.next/server` tree ships inside one function.

Watch it: if the knowledge graph grows substantially, the bundle can cross 250 MB
and deploys will start failing at the function-packaging step. Check it after any
large data addition with:

```sh
npm run netlify:build
find .netlify/functions-internal/___netlify-server-handler -type f -exec ls -l {} \; \
  | awk '{s+=$5} END {printf "%.1f MB\n", s/1048576}'
```

Building with webpack instead of Turbopack was tested as a way to dedupe those
chunks and **it does not currently build**: webpack's stricter page-export
validation rejects `src/app/sky/eclipses/page.tsx`, which exports a local helper
component `Types` alongside the page. That is a one-line source change, but it is
out of scope for a hosting migration and is recorded here rather than guessed at.
Whether webpack would actually dedupe the chunk therefore remains **unverified**.

## Decommissioning Vercel

Only after the window closes with no rollback trigger observed, and only as a
separate, explicitly-approved change. Before removing anything, confirm:

- [ ] seven days of green Netlify production deploys
- [ ] no unresolved rollback trigger
- [ ] at least one scientific-refresh workflow has opened and merged a PR
- [ ] WebmasterID shows continuous traffic across the cutover
- [ ] Search Console shows no crawl-error or coverage regression
- [ ] DNS TTLs raised back to 1800

Even then, removing the Vercel *project* is a decision to take deliberately —
this migration does not do it, and nothing in the repository depends on it.
