# SEO migration gate

The check run immediately before DNS cutover. A hosting migration must be
invisible to search engines: same URLs, same canonicals, same structured data,
same sitemap, same redirects. This file records what "unchanged" means in
concrete, checkable terms so the gate can be re-run rather than re-remembered.

## What is compared, and against what

`docs/parity-baseline-vercel.json` is the snapshot of live Vercel production
taken before any change (69 targets). Every claim below is checked by

```sh
npm run netlify:parity -- --compare docs/parity-baseline-vercel.json --candidate <origin>
npm run netlify:crawl  -- --origin <origin>
npm run netlify:smoke  -- --origin <origin> --expect-canonical-host asteriastar.com
```

## The gate

| # | Requirement | How it is proven |
| --- | --- | --- |
| 1 | Canonical domain unchanged | parity compares the `canonical` of every page target; smoke asserts the canonical host and fails on any `*.netlify.app` / `*.vercel.app` host; crawl asserts it across the entire sitemap |
| 2 | Route paths unchanged | the crawl is driven by the **production** sitemap, so every URL search engines know about is requested by path against the candidate. Any renamed or dropped route shows up as a non-200 |
| 3 | Sitemap semantically unchanged | parity compares `<loc>` count, the set digest (`locSetSha256`), host set, and `<image:loc>` count. Baseline: **8,671 URLs**, 1,567 image entries, single host |
| 4 | robots.txt unchanged | parity compares the exact body (SHA-256 + bytes) |
| 5 | llms.txt unchanged | parity compares the exact body (SHA-256 + bytes) |
| 6 | Structured data unchanged | parity compares the sorted list of JSON-LD `@type` values and the count of `application/ld+json` blocks, per page target |
| 7 | Titles and descriptions unchanged | parity compares `<title>`, `meta description`, `og:title`, `og:url` and `meta robots` per page target |
| 8 | Headings unchanged | parity compares every `<h1>` text and the `<h2>` count |
| 9 | Redirects preserved | parity compares the redirect target of redirect targets without following them; smoke walks the redirect chain from `/` and fails on a loop or on more than one hop |
| 10 | apex/www policy correct | smoke requires `asteriastar.com` → **308** → `https://www.asteriastar.com/`, the status Vercel served (Netlify's own primary-domain redirect would be 301, which is why the 308 is declared explicitly in `netlify.toml`) |
| 11 | Image sitemap intact | parity compares the `<image:loc>` count in `sitemap.xml` |
| 12 | HTTPS available | verified on the wire with `openssl s_client`, checking the certificate covers both apex and `www` (`docs/netlify-dns-cutover.md` §5) |
| 13 | IndexNow verification intact | smoke requires `/c292fa58c74f45f9ad982e152b4f7c1c.txt` to be **exactly** the key — no trailing newline, no HTML error page |
| 14 | No preview URL can be indexed or submitted | previews build with their own `DEPLOY_PRIME_URL` as site origin, serve `X-Robots-Tag: noindex, nofollow`, and have no `INDEXNOW_KEY` |

## What deliberately is *not* changed

Production canonical URLs — and all 8,671 sitemap entries — use the **apex**,
`https://asteriastar.com`, while the apex answers `308 → https://www.asteriastar.com`.
The canonical is therefore not self-referential.

This predates the migration. It is reproduced exactly rather than corrected,
because changing which hostname the site declares as canonical is an SEO change,
and making one inside a hosting migration would mean that if rankings moved
afterwards there would be no way to tell which change caused it. It is raised as
a separate recommendation instead.

If it is fixed later, the change is a one-line environment edit —
`NEXT_PUBLIC_SITE_URL=https://www.asteriastar.com` in `netlify.toml` — plus a
re-submission to IndexNow and a Search Console property check. It needs no code
change, which is precisely why it can wait until the platform move has settled.
