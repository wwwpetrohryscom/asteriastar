# ADR — serving `asteriastar.com/blog` from a second Netlify project

**Status:** accepted and **verified in production**. See *Verification* for what was actually proved.
**Date:** 2026-08-30.
**Context:** [`blog-platform-architecture-baseline.md`](./blog-platform-architecture-baseline.md).

## The problem

One public hostname, two deployment units. `asteriastar.com/*` must keep being served by the existing
Next.js application; `asteriastar.com/blog/*` must be served by a separate application with its own
build, its own deploy history and its own failure domain — so that publishing an article does not
rebuild a nine-thousand-page scientific platform, and a scientific change does not rebuild the blog.

DNS cannot do this. DNS resolves hostnames, not paths. The split has to happen at the HTTP layer, in
something that already sits in front of `asteriastar.com`.

## The decision

A **path-prefix proxy rewrite declared in the main site's `netlify.toml`**, pointing at the blog
project's `.netlify.app` hostname, combined with **`basePath: "/blog"`** on the blog application.

```toml
[[redirects]]
  from = "/blog"
  to = "https://asteriastar-blog.netlify.app/blog"
  status = 200
  force = true

[[redirects]]
  from = "/blog/*"
  to = "https://asteriastar-blog.netlify.app/blog/:splat"
  status = 200
  force = true
```

`status = 200` is what makes it a rewrite rather than a redirect: Netlify fetches the response and
returns it under the original URL. The visitor's address bar keeps saying `asteriastar.com/blog/…`
and no `*.netlify.app` hostname is ever exposed to a browser or a crawler.

## Why this is safe, and how that was established

Each of these was read from current Netlify documentation rather than recalled.

**The rule runs before the Next.js server function.** The documented order of evaluation is:

> 1. Redirects and rewrites in the `_redirects` file. …
> 2. Redirects and rewrites in the `netlify.toml` file. …
> 3. At this point, if the request targets a static file, then the static file returns without
>    further evaluation of Next.js redirects or rewrites.
> 4. Any request that does not target a static file will then be passed to Next.js …

and, explicitly: *"Any Netlify redirects or rewrites that you create take precedence over those
created by Next.js Runtime."* The main application never sees a `/blog` request at all.

**It is not the forbidden case.** The same page warns: *"Do not add a rewrite from the site root
(such as `from = "/"`) … Your root-level rewrite would take precedence over Next.js Runtime's
generated rewrites and break routing on your site."* This rewrites a prefix, not the root. `/blog` is
unclaimed by the main application — no route, no sitemap entry, a 404 in production today.

**Cross-project rewrites are permitted here.** *"For security reasons, rewrites between Netlify sites
belonging to different teams are not allowed."* Both projects are on the `hello13hub` team. The
documentation also recommends the form used above: *"If you want to proxy to another Netlify site, we
recommend using the site's `.netlify.app` subdomain instead of the custom domain in your rewrite
rule."*

**One hop, and we use it once.** *"we limit internal rewrites to one 'hop'."* The blog serves its own
responses and proxies nothing, so the budget is spent exactly once.

**The 26-second proxy timeout is irrelevant to a static blog.** *"Proxy rewrite requests will time out
after 26 seconds."* Blog pages are prerendered; there is no per-request rendering to be slow.

`force = true` is set because the documented meaning of `force` is *"whether to override any existing
content in the path"*. Nothing occupies `/blog` today, but the rule should not quietly stop working
if something ever does.

## Asset routing — solved by `basePath`, not by `assetPrefix`

A second Next.js application requests its own chunks from `/_next/static/…`. Proxied only under
`/blog/*`, those requests would fall through to the **main** application and 404 — the classic
failure of this architecture, and the reason the roadmap demands it be solved before any code exists.

`basePath: "/blog"` makes Next emit every internal URL — pages, `/_next/static`, `public/` assets,
route handlers, RSC payloads, prefetches, client-side navigation — already prefixed:

```
/blog                      /blog/_next/static/chunks/…
/blog/news                 /blog/_next/static/css/…
/blog/news/some-article    /blog/opengraph-image.png
/blog/rss.xml              /blog/sitemap.xml
```

Every one of those matches the single `/blog/*` proxy rule and is forwarded to the blog project,
which serves them because *its* basePath is `/blog` too. The paths line up on both sides of the proxy
with no rewriting of the path itself.

**`assetPrefix` is deliberately NOT set.** It exists to serve assets from a *different origin*, which
is the opposite of what is wanted: assets must stay same-origin under `asteriastar.com/blog` so that
no `*.netlify.app` hostname appears in the HTML. Setting both is a known source of double-prefixed
URLs, and the roadmap's instruction — *"Do not blindly configure both"* — is followed.

The historic `basePath` bugs in the Netlify adapter (opennextjs-netlify #131, #1849) date from 2022
and were fixed in the release stream long before the pinned `^5.15.13`. That is a reason to *verify*,
not a reason to assume; see *Verification*.

## Alternatives considered and rejected

**A subdomain, `blog.asteriastar.com`.** Trivially achievable — a second Netlify site with its own
custom domain, no proxy at all. Rejected because the requirement is explicitly `asteriastar.com/blog`,
and because a subdomain is a separate site for ranking purposes: the blog would build authority
somewhere the scientific platform does not benefit from, and link equity between the two would be
cross-domain.

**A `/blog` directory inside the main application.** The simplest thing that could work, and the
reason this whole ADR exists: it would mean every published article rebuilds ~9,200 prerendered pages
and redeploys the entire scientific platform. That is the one outcome the mission forbids.

**A monorepo with Netlify build-ignore rules.** Two Netlify projects pointed at one repository, each
with an `ignore` command that skips the build when its own paths did not change. Workable, and
genuinely used elsewhere — but the isolation is a *script that must keep being right*. A single
mistaken path glob silently reintroduces the coupling this design exists to remove. A separate
repository gives the same property by construction, with nothing to maintain.

**Netlify Edge Functions doing the proxying.** More expressive than a redirect rule, and unnecessary:
this is a static prefix with no conditional logic. An edge function would add a runtime component,
a cold start, and a failure mode to a problem a declarative rule already solves. Rejected on
simplicity, and available as a fallback if the redirect engine ever proves insufficient.

**Netlify's own multi-project routing constructs.** Considered; the supported, documented mechanism
for path-based routing between two Netlify projects is the proxy rewrite above.

## Responsibilities

| | Main project (`asteriastar-production`) | Blog project (`asteriastar-blog`) |
| --- | --- | --- |
| Owns | the apex hostname, TLS, `www` → apex, `/*` except `/blog` | everything under `/blog` |
| Routing role | entry point; forwards `/blog/*` unchanged | serves `/blog/*` directly |
| Rebuilt when | scientific code or data changes | an article changes |
| robots.txt | serves the host's `robots.txt`, names both sitemaps | serves a disallow-all robots.txt on its own `.netlify.app` host only |
| Sitemap | `/sitemap.xml`, ~8,700 URLs | `/blog/sitemap.xml`, independent |

## Canonical identity

Every blog page, feed entry and sitemap URL is built from a production origin constant that is always
`https://asteriastar.com` — the `.netlify.app` hostname appears **only** inside the main project's
proxy rule, which is routing configuration and is never rendered. A permanent validator fails the
build if that hostname reaches any canonical, `og:url`, JSON-LD URL, feed link or sitemap entry.

The blog's own `.netlify.app` host is protected differently, and deliberately **not** with
`X-Robots-Tag`: the proxy forwards origin response headers, so a blanket `noindex` on the blog
project would arrive at the visitor and deindex production. Instead the blog project serves a
disallow-all `robots.txt` **at its own host root** — a path the proxy never requests, because the
proxy only ever asks for `/blog/*` — and every page carries a canonical pointing at the apex.
`X-Robots-Tag: noindex` remains set for deploy-preview and branch-deploy contexts, which the main
site never proxies.

## Caching

Two cache layers exist and they are configured to agree:

- **HTML** — short shared cache with revalidation, so a blog deploy is visible promptly. A blog
  deployment invalidates the blog project's own cache; the main project's proxy must not hold stale
  HTML beyond that window.
- **`/blog/_next/static/*`** — content-hashed filenames, `immutable`, cached for a year. Safe by
  construction: a new build produces new filenames.
- **Feeds and sitemap** — short shared cache, because they change on every publication.

## Failure mode

If the blog project is down, unreachable, or mid-deploy, the proxy fails and `/blog/*` returns an
error. **Nothing else is affected**: `/`, entity pages, the Open Data API, Live, Search and the
sitemap are served by the main function and never touch the proxy. That containment is a feature of
this architecture rather than an accident of it, and it is the strongest argument for the split.

## Rollback

Delete the two `[[redirects]]` blocks from the main project's `netlify.toml` and redeploy. `/blog`
returns to 404 and the main site is byte-identical to its state at `a2f5cd1`. The blog project keeps
running on its own hostname, losing nothing. Full procedure in
[`blog-routing-rollback.md`](./blog-routing-rollback.md).

## Verification — what was proved, and where

The documentation supports every step above, and this repository already carried a warning that
Netlify configuration can report success and do nothing. So the architecture was proved on real
deploys, in this order, before production was touched.

**1. The publication standalone.** Deployed to its own project and checked on its own hostname: every
route 200, `/blog/nonexistent` a real 404, feeds and sitemap correct, and canonicals already saying
`asteriastar.com` on a host that is not it.

**2. The proxy, on a pull-request deploy preview** of this platform — previews evaluate
`netlify.toml` redirects exactly as production does. This is where the architecture was actually
proved, and it is where a defect would have been cheap.

**3. Production**, after merge.

The gate passes at all three. What it establishes:

- The browser-visible host never changes, and no response is reached by a redirect. A rewrite that
  had silently become a redirect would be caught here and nowhere else.
- CSS and JavaScript load through the proxy, with correct content types, and are not HTML — the
  symptom of an asset falling through to the platform's catch-all.
- The article's canonical, JSON-LD, headings, prose and references are all in the **first** HTTP
  response. 121 KB of HTML, 16.8 KB over the wire.
- `/blog/nonexistent` is a real 404 **from the publication**, not a soft 200 and not the platform's.
- No `netlify.app` string appears in any page, feed, sitemap or structured-data URL.
- `/`, `/sitemap.xml`, `/robots.txt`, `/events`, `/neo` and the API are untouched, and the platform's
  sitemap contains no blog URLs.

### Deployment isolation, measured

The property the whole design exists for, with deploy IDs:

| | Blog project | Platform project |
| --- | --- | --- |
| Article-only change pushed 20:30:13Z | **built** `6a9735da…` at 20:30:18Z, commit `5640063e` | **did not build** — newest production deploy still `6a9399f3…` from 2026-08-30T02:48Z |
| Platform routing PR merged 20:32:36Z | **did not build** — deploy count unchanged at 7 | **built** `6a973666…` at 20:32:38Z, commit `27b126d5` |

### Two things the verification changed

**The header-rule finding.** Probing a real deploy with a throwaway header established that a
`[[headers]]` rule reaches static files in the publish directory and does **not** reach pages, which
the Next.js Runtime serves through its function even when prerendered — confirming this repository's
own migration-era warning for the second project. It also established that Netlify forces its own
HSTS on the blog project, overriding both config locations, so `/blog` carries a one-year max-age
against the platform's two. Both are strong; there is no configuration that reconciles them, so the
blog's `netlify.toml` records the finding rather than carrying a rule that looks effective and is not.

**The gate's own rules were wrong twice.** It rejected any final URL containing `netlify.app` — which
is every URL when running against a deploy preview, the only place the proxy can be proved before
production — and it decided the platform homepage had been captured because a navigation entry
mentioned the publication by name. Both now test the property rather than a string. A gate that fails
on correct behaviour gets ignored, which is worse than not having one.
