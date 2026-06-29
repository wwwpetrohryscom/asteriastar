# Observatory Image Platform

The Observatory image platform is **architecture, not assets**. Asteria Star
bundles **no copyrighted or fabricated imagery**. This document describes the
typed model that lets verified, openly-licensed images plug in later with full
provenance.

## The model

`src/lib/media/types.ts` defines `ImageAsset`:

| Field | Purpose |
| --- | --- |
| `id` | Stable identifier |
| `entityId` / `entryPath` | What the image depicts (graph entity or content entry) |
| `title`, `alt` | Display + accessibility (alt required) |
| `url` | Remote, licensed image URL (absent until cleared) |
| `credit`, `provider`, `sourceUrl` | Attribution + link to the original |
| `license` | `public-domain \| cc-by \| cc-by-sa \| cc0 \| nasa-media \| esa-cc-by-sa` |
| `captureDate`, `instrument`, `mission`, `photographer`, `object` | Provenance |
| `published` | Only `true` assets with a `url` are ever rendered |

Providers: NASA, ESA, Hubble, JWST, Wikimedia, NOIRLab, other.

## The registry

`src/lib/media/registry.ts` holds `IMAGES` (intentionally **empty**) plus:

- `validateImages()` — every published image must have a `url`, `credit`, and
  `sourceUrl`; no duplicate ids. Run by `npm run validate`.
- `getImagesForEntity(id)` / `getImagesForEntryPath(path)` — published assets only.

## Rendering

- `ImageFigure` renders one image with full provenance (credit, license,
  instrument/mission/date, source link).
- `MediaGallery` renders a grid when assets exist, otherwise an **honest
  placeholder** ("Prepared for official NASA / ESA integration") that links to
  the sources policy. It never shows a fabricated photo.
- Entry galleries and the Observatory image-archive modules both render through
  this path, so the moment a licensed asset is added it appears automatically.

## Adding an image (future)

1. Source a verified, openly-licensed image (public domain / CC BY / CC BY-SA,
   or NASA/ESA media terms).
2. Add an `ImageAsset` to `IMAGES` with `published: true`, a `url`, `credit`,
   `sourceUrl`, `license`, and the `entityId`/`entryPath` it depicts.
3. `npm run validate` confirms provenance; it renders automatically.

See also [SOURCES_POLICY.md](./SOURCES_POLICY.md).
