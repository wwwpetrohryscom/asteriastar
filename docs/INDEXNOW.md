# IndexNow Integration

Asteria Star uses [IndexNow](https://www.indexnow.org/) to notify search engines
(Bing, Yandex, Seznam, Naver, and their partners) the instant content changes,
instead of waiting to be re-crawled. One submission is shared across all
participating engines.

## Configuration

Everything is driven by one environment variable:

| Variable | Purpose |
| --- | --- |
| `INDEXNOW_KEY` | The IndexNow key. Read everywhere IndexNow is used; **never hardcoded** in application code. |
| `NEXT_PUBLIC_SITE_URL` | The canonical site origin (defaults to `https://asteriastar.com`). Determines the host and key-file location submitted to IndexNow. |
| `INDEXNOW_TRIGGER_TOKEN` | *(optional)* If set, `/api/indexnow` requires a matching `token` to trigger a submission. |

## The key file — `/<key>.txt`

IndexNow requires a file at `https://asteriastar.com/<key>.txt` whose contents are
exactly the key. This is the **only** place the literal key appears, because the
protocol requires the file to be named after, and to contain, the key.

- The file is committed at `public/<key>.txt`.
- `scripts/generate-indexnow-key.ts` runs on **`prebuild`** and (re)writes
  `public/${INDEXNOW_KEY}.txt` from the environment, so the served file always
  matches the configured key. If `INDEXNOW_KEY` is unset it leaves the committed
  file in place.

Because it lives in `public/`, it is served at the site root and returns
`200 text/plain`, ahead of the Next.js router.

## Submitting URLs

- **`src/lib/indexnow.ts`** — the shared submission library. Reads the key from
  the environment, de-duplicates and host-filters URLs, and POSTs them to the
  IndexNow API in protocol-sized batches. No-ops (never throws) when the key is
  absent, so a build or deploy never fails because of IndexNow.
- **`/api/indexnow`** (`src/app/api/indexnow/route.ts`) — a trigger endpoint that
  submits the current sitemap's URLs. Call it from a deploy hook. It is disallowed
  in `robots.txt` and, with `INDEXNOW_TRIGGER_TOKEN` set, token-guarded.
- **`scripts/indexnow-submit.ts`** (`npm run indexnow:submit`) — a standalone,
  dependency-free script that fetches the live sitemap and submits every URL.
  Accepts explicit URLs as arguments to submit only those.

## Automatic submission after production deploys

`.github/workflows/indexnow.yml` runs on pushes to `main` that touch `src/`,
`public/`, or the submit script. It installs dependencies, waits briefly for the
deployment to publish, then runs `npm run indexnow:submit`, which pulls the live
sitemap and submits it. Provide `INDEXNOW_KEY` as a repository secret (and
optionally `NEXT_PUBLIC_SITE_URL` as a repository variable).

If you deploy on Vercel, you can instead add a **Deploy Hook** that `POST`s to
`/api/indexnow` once the deployment is live.

## Validating locally

```bash
INDEXNOW_KEY=<key> npm run build     # prebuild writes public/<key>.txt
INDEXNOW_KEY=<key> npm run start &    # serve the production build
curl -i http://localhost:3000/<key>.txt   # expect HTTP 200 and exactly the key
```
