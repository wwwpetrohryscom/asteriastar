# Citation Coverage (Program O)

Program O is a trust, citation, and authority sprint. It expands Asteria Star's
citation registry to **151 real, source-backed citations** across the platform's
flagship knowledge areas, each connected to entities, datasets, and/or provenance
records. Nothing is fabricated: no fake citations, no invented DOIs, no invented
metadata, no fake URLs, and no weak source cited where a primary source exists.

See also: `SOURCES_POLICY.md`, `SCIENTIFIC_AUTHORITY.md`, `PROVENANCE_MODEL.md`,
`PROVENANCE_SEEDING.md`, `OPEN_DATA.md`.

## The citation model

`src/lib/citations.ts` defines the `Citation` record and the Citation Engine;
`src/lib/citations/records.ts` holds the real registry. Each citation carries:

`id`, `title`, `authors?`, `organization`, `publication?`, `url`, `date?`,
`doi?` (verified only), `license?`, `notes?`, `type`, `source?`, `entityIds?`,
`datasetIds?`, `provenanceIds?`.

**Citation types** (`CitationType`): `institutional_page`, `dataset`,
`mission_page`, `archive_page`, `peer_reviewed_paper`, `catalogue`,
`technical_report`, `press_release`, `historical_reference`, `image_archive`,
`standards_reference`.

## Citation selection policy

1. **Primary and institutional first.** Prefer NASA / JPL / ESA / ESO / IAU /
   STScI / LIGO / EHT / NASA Exoplanet Archive / Planck / SIMBAD / NED / Gaia /
   Minor Planet Center / peer-reviewed papers over any weaker source.
2. **A citation must connect to something real.** Every record links at least
   one source, entity, dataset, or provenance record — there are no orphans
   (enforced by validation).
3. **Quality over quantity.** We would rather have fewer, verifiable citations
   than a larger count of low-confidence ones.
4. **The object is named and pinned.** Where a citation points at an
   organization's canonical database/section URL, the title names the object and
   `entityIds` pin it, so the reference is specific even when the URL is a
   section root.

## Source hierarchy

Primary (space agencies, observatories, unions, databases, peer-reviewed
literature) → institutional pages / datasets / catalogues → **secondary**
(Encyclopaedia Britannica) only as background for historical figures where no
better concise source is used. Britannica citations are always typed
`historical_reference` and are never the sole primary source for a scientific
value. Full hierarchy in `SOURCES_POLICY.md`.

## DOI policy

- A DOI is included **only where it is known and verified**. The registry has
  15 DOIs, all on `peer_reviewed_paper` records (Planck 2018 VI, GW150914,
  GW170817, EHT M87 I, EHT Sgr A* I, Mayor & Queloz 1995, Charbonneau 2000,
  Anglada-Escudé 2016, Gillon 2017, Hubble 1929, Penzias & Wilson 1965, Riess
  1998, Perlmutter 1999, Rubin & Ford 1970, Hewish 1968).
- Data resources (fact sheets, archives, catalogues, institutional pages) are
  cited **without a DOI** — none is invented.
- Validation: a DOI must be syntactically valid (`DOI_RE`) and, when the URL is a
  `doi.org` link, must match the record's `doi` field.

## Institutional-source policy

Data resources and mission/observatory pages are cited with the organization's
**verified canonical URL** (NASA fact sheet per body, NASA/ESA mission pages,
code repositories for HYG/OpenNGC, database roots for SIMBAD/NED/Exoplanet
Archive/Gaia/ADS). No fabricated deep link is ever added; where a specific
document is not a stable public URL, the citation uses the verified section root
and names the object in the title.

## When secondary sources are allowed

Only for historical/biographical background (Britannica), and only as
`historical_reference`. A secondary source never replaces an available primary
source for a factual claim; flagship figures with a Nobel Prize also carry the
primary `nobelprize.org` citation.

## How coverage is measured

Coverage is **derived from the real registry**, never a fabricated score:

- `CITATION_STATS` — total, `withDoi`, `peerReviewed`, `entitiesWithCitations`,
  `datasetsWithCitations`, and a per-type breakdown.
- The `/authority` dashboard shows total citations, peer-reviewed count, DOI
  count, entities cited, datasets cited, primary/secondary split, coverage by
  domain, and top source organizations — all computed from the registry.
- The read-only API exposes the registry at `GET /api/v0/citations` and
  `GET /api/v0/citations/{id}` (filterable by type, source, entity, dataset).

## Known gaps

- Coverage is a **first batch** (151) concentrated on flagship entities; the vast
  majority of the ~5,800 graph entities remain uncited, and the dashboard says so
  honestly.
- Many institutional citations point to an organization's verified section root
  rather than a per-object deep link, because stable public deep links could not
  be verified for every object; specificity comes from the title + entity links.
- Some famous historical papers are cited without a DOI where a verified DOI was
  not available.

## Extending

Add real records to `records.ts` with a verified URL and a DOI only where
verified. Every record must link an entity, dataset, or provenance. Prefer the
primary source; never invent a field.
