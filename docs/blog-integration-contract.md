# The blog integration contract

How this platform consumes the publication **without either build depending on the other**. That
constraint is the whole point: an article must be publishable without rebuilding nine thousand
scientific pages, and a scientific change must not rebuild the publication.

Everything here is a **URL**, never a build artefact. The platform reads at runtime or on its own
schedule; it never imports.

## What the publication serves

### `https://asteriastar.com/blog/latest.json`

The integration feed. Deliberately minimal and deliberately separate from the public JSON Feed, so
the contract between two applications can change on a different schedule from a subscription format.

```json
{
  "generatedAt": "2026-09-01T20:30:18.000Z",
  "publication": { "name": "AsteriaStar Journal", "url": "https://asteriastar.com/blog" },
  "count": 5,
  "items": [
    {
      "id": "data-and-provenance-on-asteriastar",
      "title": "Data and provenance on AsteriaStar",
      "description": "…",
      "url": "https://asteriastar.com/blog/data/data-and-provenance-on-asteriastar",
      "section": "data",
      "sectionTitle": "Data",
      "publishedAt": "2026-08-30",
      "updatedAt": "2026-08-30",
      "image": "https://…"
    }
  ]
}
```

`Access-Control-Allow-Origin: *`, so a browser may fetch it directly. Cached for fifteen minutes at
the CDN. `updatedAt` and `image` are optional; everything else is always present.

### `https://asteriastar.com/blog/search-index.json`

The search contract, for the platform's global search.

```json
{ "version": 1, "publication": "…", "generatedAt": "…", "count": 5, "documents": [ … ] }
```

Each document carries `id`, `title`, `description`, `url`, `path`, `section`, `sectionTitle`, `tags`,
`publishedAt` and a plain-text `extract` (600 characters, no markup, no citation markers). `version`
exists so the shape can change without breaking a consumer that has not been updated.

### `https://asteriastar.com/blog/sitemap.xml`

Already wired: `src/app/robots.ts` names it alongside the platform's own. That is how a crawler finds
the publication without this platform's sitemap enumerating articles — which would be exactly the
coupling this design removes.

## How the platform should consume them

Two rules, both inherited from how this platform already treats every external provider.

**Never at build time.** Reading `latest.json` during `next build` would make the platform's output a
function of the publication's state, which reintroduces the dependency through the back door — the
page would be stale until the next platform build, and a publication outage would fail a platform
build. Fetch at request time under ISR, or on a schedule.

**Fail closed.** If the fetch fails, times out, or returns something unexpected, the module renders
**nothing** — not a cached value presented as current, not a placeholder, not an empty state that
reads as "no articles". A publication outage must not degrade a scientific page, and it must never
turn "we could not reach it" into "there are none". That is the same rule the live-provider runtime
applies to NOAA and JPL, and it applies here for the same reason.

A "From AsteriaStar Journal" module on entity pages or the homepage is a straightforward application
of this contract and needs no further agreement between the two projects. It is deliberately not
built yet: the contract is the deliverable, and a module that ships before its failure behaviour has
been thought about is how a scientific page ends up broken by a blog.

## What the platform must NOT do

- Enumerate blog URLs in `src/app/sitemap.ts`. The routing gate asserts it does not.
- Import anything from the blog repository.
- Vendor the blog's content, index or feeds into this repository.
- Make the blog's availability a precondition of any page rendering.

## The reverse direction

Articles link INTO this platform through structured `relatedEntities` — a canonical path and a label,
rather than links sprinkled through prose — which the article page renders as an "On AsteriaStar"
section. Those are ordinary same-origin links and need no contract at all.

Articles deliberately do not duplicate encyclopedia prose. Where the two touch, the article links.
That keeps the reference layer canonical and stops the two competing for the same reader or the same
search result.
