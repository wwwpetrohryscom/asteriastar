# Space Agencies, Institutions & Laboratories Encyclopedia (Program AJ)

The institutional layer of the platform: the organizations that fund, build, and operate the
world's spacecraft, and the structure that connects them.

The graph already held 50+ `organization` entities — the space agencies (NASA, ESA, JAXA,
ISRO, Roscosmos, CNSA, and the national agencies), the commercial launch providers (SpaceX,
Blue Origin, Rocket Lab, the aerospace primes), and the observatory operators (ESO, NOIRLab,
NRAO, and the national observatories) — but they were a **flat list with no structure**.
Program AJ adds that structure:

- **`institution_type`** (new grouping entity) — six classes of institution: space agency,
  field center, research laboratory, science institute, commercial space company, and
  observatory operator.
- **New field centers and laboratories** — the specialised centres and labs that were
  missing entirely: NASA's Goddard, Johnson, Marshall, Kennedy, Ames, Langley, Glenn,
  Stennis, Armstrong, and Wallops; ESA's ESTEC, ESRIN, ESAC, and EAC; JAXA's Tsukuba; and
  the Johns Hopkins Applied Physics Laboratory, Southwest Research Institute, and the SETI
  Institute.
- **Enrichment, never duplication** — every existing agency, company, and observatory
  operator is linked `member_of_group` its institution type, and every field center is
  linked `part_of` its parent agency (Goddard → NASA, ESTEC → ESA, Tsukuba → JAXA; Wallops →
  Goddard; JPL → NASA). No existing organization is duplicated.

## Data model

`InstRecord` is a discriminated record over `InstKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `type` | `institution_type` | a class of institution (space agency, field center, …) |
| `org` | `organization` | an organization — a **new** field center/laboratory, or an **existing** one enriched |

Cross-references on an org: `typeSlug` (→ `member_of_group` its institution type),
`parentKey` (→ `part_of` a reused parent agency), and optional `relatedKeys`.

## Reuse

- **`REUSED_INSTITUTION_TYPE`** links each existing organization (NASA, ESA, JPL, SpaceX,
  ESO, …) to its institution type without creating a new entity.
- **`REUSED_PARENT`** links an existing organization to a reused parent (JPL `part_of` NASA).
- New field centers set `parentKey` to a reused agency id, so the whole hierarchy resolves
  against organizations that already exist.

Every emitted relation is deduped against `LEGACY_RELATION_IDS` (every relation defined by
every other catalog), so the catalog enriches the graph without ever duplicating an edge.

## Engine (`engine.institutions`)

`ResolvedInstitution` resolves an entry to its type, parent agency, child centers, members,
and graph connections. Query surface: `types()`, `orgs()`, `byType(slug)`,
`memberSet(typeSlugs)` (new field centers/labs **plus** the reused orgs of those types), and
`resolveEntry(slug)`.

## Pages

- `/institutions` — the hub: institution types, field centers & laboratories, discovery hubs.
- `/institutions/{slug}` — an adaptive entry for a type or a new organization.
- `/institutions/discover/{slug}` — space agencies, field centers, laboratories, commercial,
  observatories — each listing the new records as cards and the reused organizations as
  chips linking to their graph pages.

## Provenance

Curated from NASA, ESA, and JAXA. Only well-established locations and roles are recorded;
founding years and figures are omitted when uncertain. Nothing is fabricated.
