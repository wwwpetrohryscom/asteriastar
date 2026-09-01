# Rolling back the `/blog` routing

The blog is attached to this platform by **two `[[redirects]]` blocks in `netlify.toml` and nothing
else**. That is the whole integration surface, and it is why the rollback is short.

## The state before the change

`netlify.toml` at commit `a2f5cd1` contained exactly two redirect rules, both `www` → apex:

```toml
[[redirects]]
  from = "https://www.asteriastar.com/*"
  to = "https://asteriastar.com/:splat"
  status = 308
  force = true

[[redirects]]
  from = "http://www.asteriastar.com/*"
  to = "https://asteriastar.com/:splat"
  status = 308
  force = true
```

`https://asteriastar.com/blog` returned **404**. No `src/app/blog` directory existed, and `/blog`
appeared in neither `src/lib/routes.ts` nor `src/app/sitemap.ts`.

## To roll back

1. Delete the two `[[redirects]]` blocks whose `to` is `https://asteriastar-blog.netlify.app/…`.
2. Commit and push to `main`.
3. Netlify rebuilds and redeploys this project.

`/blog` returns to 404. Everything else on the platform is unchanged — the rules never matched
anything else, and nothing else in the application reads them.

## Optional, and separate

Two further changes were made for the blog. Neither breaks anything if left in place after a
rollback, and each can be reverted independently:

- **`src/app/robots.ts`** names two sitemaps. After a rollback the second would 404. A crawler
  treats an unreachable sitemap as absent rather than as an error, so this is cosmetic — revert it
  when convenient.
- **The "Blog" entry in `src/lib/navigation.ts`**, and the `NavItem` component that renders
  `external` links as plain anchors. Leaving the entry would link to a 404, so remove it in the same
  commit if the rollback is meant to be complete.

## What is NOT affected

The blog project keeps running. It is a separate Netlify project on a separate repository, and
`https://asteriastar-blog.netlify.app/blog` continues to serve the publication exactly as before —
its content, its feeds and its sitemap are all still generated, and nothing about it depends on this
platform. A rollback disconnects the two; it destroys nothing.

Reversing a rollback is the same two blocks again.

## The failure this is for

If the blog project is down, `/blog/*` fails and **nothing else does**. Entity pages, the Open Data
API, Live, Search, the sitemap and the homepage are served by this platform's own function and never
touch the proxy. A rollback is therefore for a *routing* problem — a rule capturing more than it
should, an unexpected interaction with the Next.js runtime — not for a blog outage, which is already
contained.

## Verifying either direction

```
npm run blog:routing https://asteriastar.com
```

After a rollback it fails at `/blog`, which is the expected result and confirms the rules are gone.
Before and after, its last section checks that `/`, `/sitemap.xml` and `/robots.txt` are still served
by this platform — the regression the proxy could plausibly cause.
