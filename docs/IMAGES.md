# Astrophotography & Scientific Image Platform (Program K)

Program K turns Asteria Star into a scientific image platform where **every image
has verified provenance**. An image here is scientific evidence, not decoration:
each is a first-class Knowledge Graph entity, defined by its source, instrument,
license, and credit.

## The honesty principle

Asteria Star is an **image-provenance catalogue**. It records verified metadata
and links to each image's official source archive. It does **not** re-host or
hotlink image binaries it has not verified, and it **never fabricates** a
photograph, credit, license, capture date, object name, or source URL. Fields
that are not known with confidence are omitted — never estimated. Because no
binaries are held, "duplicate detection" runs on a deterministic catalogue key
(object + source + title + year), not a fabricated pixel hash. Only
openly-licensed (CC BY 4.0) or public-domain images are catalogued.

Pages therefore show a labelled placeholder with a "View at source" link rather
than a fabricated pixel render, alongside a complete provenance record.

## Architecture (layer-clean)

The image DATA lives in the **knowledge layer** so images are first-class graph
entities without a reverse layer dependency; the ENGINE logic lives in the
**platform layer**:

- `src/knowledge-graph/data/image-catalog/` — types (schema), the seeded images,
  licenses, sources, and collections, and `index.ts` which derives graph
  entities + relations, validates, and detects duplicates.
- `src/platform/images/` — the engine modules: `providers`, `metadata`,
  `provenance`, `collections`, `deduplication`, `search`, `recommendations`,
  and `index`.
- Exposed through the Scientific Data Engine as **`engine.images`** (the 27th
  module), which resolves the graph ids that images reference into renderable
  refs.

## Entities & relations

New entity types: `scientific_image`, `image_collection`, `image_license`,
`image_source`. (Observation/processed/raw/historic-plate/mission/diagram are
represented as an `imageType` field on `scientific_image`.)

New relation types: `depicts`, `captured_by`, `taken_with`, `taken_at`,
`processed_by`, `published_by`, `licensed_by`, `documents`, `derived_from_image`,
`part_of_collection` — all science-domain, provenance-bearing, and deduped
against every edge defined by earlier catalogs. `related_discovery` and
`related_to` (existing) link images to discoveries and other entities.

## Seeded images

~21 genuinely famous public-domain / openly-licensed images with well-established
provenance: Webb's First Deep Field, the Cosmic Cliffs, the Southern Ring Nebula,
Stephan's Quintet, the Pillars of Creation, the Hubble Ultra Deep Field, the M87*
and Sagittarius A* black-hole images, Earthrise, the Blue Marble, the Pale Blue
Dot, Cassini's "Day the Earth Smiled", the Sombrero Galaxy, the Crab Nebula,
Perseverance and Curiosity on Mars, the Sun from SDO, Jupiter from Webb, the
Milky Way over Paranal, the ISS, and the Voyager Family Portrait. Each links to
real graph entities (the depicted object, the capturing telescope/mission, and
any related discovery) and carries a full credit, license, and source.

## Providers (planned)

Typed provider interfaces and a registry for future automated ingest from the
NASA Image Library, STScI (Hubble/Webb), ESA/Hubble, ESA/Webb, ESO, the EHT,
NOIRLab, and Wikimedia Commons — all `planned`, none connected. Nothing scrapes,
calls a live API from a page, or ingests anything not openly licensed.

## Pages

- `/images` — the archive hub (featured, collections, galleries, providers).
- `/images/{slug}` — the image page: hero placeholder + caption, scientific
  context, subject & instruments, collections, metadata panel, provenance panel
  (source, institution, license, credit, verification date, "view at source"),
  related images, and ImageObject JSON-LD.
- `/images/collections/{slug}` — curated collections (JWST First Images, Deep
  Fields, Black Holes, Nebulae, Galaxies, Solar System, Mars, Jupiter, Saturn,
  the Sun, Earth from Space, Apollo, Voyager, Cassini).
- `/images/galleries/{slug}` — filtered discovery galleries (Latest, JWST,
  Hubble, Planet, Mars, Solar, Nebula, Galaxy, Black Hole, Earth from Space,
  Historic, Public Domain).
- `/images/astrophotography` and `/images/astrophotography/{slug}` — equipment,
  processing, and observation guides, kept clearly separate from institutional
  imagery (community submissions are prepared, not fabricated).

## SEO

Every image page carries `ImageObject` JSON-LD (name, caption, description,
creditText, creator, license, dates where known, and the source archive as the
license-acquisition page), a canonical URL, and Knowledge Graph links. Image-
sitemap support is prepared: entries can carry an `images` array of verified
public URLs — currently unpopulated, since the platform links to source archives
rather than re-hosting binaries, and no fabricated URL is ever emitted.

## Validation

`validateImages()` checks duplicate ids, `/images` slug uniqueness, that every
image has a credit, alt text, institution, a known **open** license, and a known
source, that every image links to at least one real graph entity (no orphans),
that referenced collections exist, and that no two images share a dedupe key (no
duplicates). The catalog passes the standard graph, architecture, engine, build,
lint, and link gates.
