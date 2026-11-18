# Hosting on Cloudflare Workers

Since November 2026 asteriastar.com is served by Cloudflare. Netlify (`asteriastar-production`) served it before that, and Vercel before Netlify.

## Shape

| Path | Served by |
|---|---|
| `asteriastar.com/*` | Worker `asteriastar`: this repository, built with [OpenNext](https://opennext.js.org/cloudflare) |
| `asteriastar.com/blog`, `/blog/*` | Worker `asteriastar-blog`: the Journal's own repository, with more specific zone routes |
| `www.asteriastar.com/*` | zone Redirect Rule, 301 to `https://asteriastar.com/${path}` with the query kept |
| `http://…` | zone setting Always Use HTTPS, 301 to https |

The platform needs a server. It has 45 ISR pages (live space weather, ISS, NEO and events; revalidate from 1 minute to 1 day) and 44 dynamic routes: the Open Data, Live Sky and provenance API handlers, `/assistant/*`, `/authority/data-health/*` and `/events/calendar.ics`.

OpenNext runs the Next.js server inside the Worker:

- **Pages:** the 8,851 prerendered pages and their ISR updates live in the R2 bucket `asteriastar-isr-cache`, behind the regional Cache API.
- **Revalidation:** a Durable Object (`DOQueueHandler`) runs it once in the background while visitors get the stale copy. This is the same stale-while-revalidate behaviour Netlify had.
- **Static files:** `public/` and `/_next/static` are served directly from Workers static assets.

This needs **Workers Paid**. The free plan's 3 MiB Worker, 10 ms CPU per request and 20,000 asset files per version are each too small.

## Deploy (manual, from a clean checkout of `main`)

```sh
npm ci
npm run cf:build     # next build (via OpenNext) + static-file headers
npm run cf:deploy    # uploads the prerendered pages to R2, then deploys the Worker
```

The build writes about 16 GB: `.next` (5.6 GB), Next's standalone copy of the 5.1 GB prerender output, and OpenNext's cache files. Delete `.next`, `.open-next` and `.wrangler` afterwards.

**Run Wrangler from the repository folder, never from the home folder.** Run there, Wrangler creates `~/.wrangler` as a local state folder. From then on it looks for its login in that folder and reports "not authenticated" for every project on the machine. The fix is to move `~/.wrangler` away.

**Expire the previous build's cache after each deploy.** Every deploy uploads the prerendered pages (about 5.5 GB) under a new prefix, `incremental-cache/<BUILD_ID>/`, in the `asteriastar-isr-cache` R2 bucket. The previous prefix is then unused, so expire it:

```sh
npx wrangler r2 bucket lifecycle add asteriastar-isr-cache expire-<OLD_BUILD_ID> "incremental-cache/<OLD_BUILD_ID>/" --expire-days 1 --force
```

**Secret.** `INDEXNOW_KEY` is set once as a Worker secret (`npx wrangler secret put INDEXNOW_KEY`). It has the same value as the committed `public/<key>.txt`. No other environment is read at runtime. `NEXT_PUBLIC_SITE_URL` is fixed to `https://asteriastar.com` by `cf:build`.

## Behaviour that moved out of `netlify.toml`

- **Static-file headers.** HSTS and `Access-Control-Allow-Origin: *` on every static file, and the immutable cache on `/_next/static`. These now live in `cloudflare/_headers`, copied into the assets directory by `scripts/cloudflare/finalize-assets.mjs`. Pages and route handlers keep their own headers from `next.config.ts` and the handlers, as before.
- **www → apex.** A zone Redirect Rule replaces Netlify's primary-domain redirect, with the same 301 status.
- **`/blog` proxy.** Replaced by the Journal Worker's zone routes. There is no proxy hop any more.
- **Preview noindex.** There are no preview deployments on Cloudflare. The `workers.dev` hostname is not linked from anywhere, and every page's canonical points at `https://asteriastar.com`.

## Images

There is no Cloudflare Images binding. `/_next/image?url=…` keeps working at the same URLs and answers with the original file, without resizing. Binding Images (`"images": { "binding": "IMAGES" }` in `wrangler.jsonc`) would restore resizing. It costs nothing up to 5,000 unique transformations a month, then $0.50 per 1,000.

## Rollback

Remove the `asteriastar.com/*` route from the Worker in the dashboard (Workers Routes) and point the apex record back at the previous host.
