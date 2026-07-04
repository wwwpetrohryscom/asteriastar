# Space Manufacturing & In-Space Infrastructure Encyclopedia (Program AM)

The future engineering layer — making and building things in space rather than launching them.

This layer **reuses** the Moon, Mars, the metal asteroid Psyche and the water-bearing
carbonaceous asteroid Bennu, the commercial and
inflatable space stations (Gateway, Axiom, Genesis), the propellants, and the
solar-array/robotic-arm components already in the graph. The new entities are the
*infrastructure domains*, the *ISRU techniques*, the *manufacturing processes*, and the
*infrastructure systems*.

## Data model

`InfraRecord` is a discriminated record over `InfraKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `domain` | `infrastructure_domain` | a domain of space infrastructure (the grouping) |
| `isru` | `isru_technique` | an in-situ resource-utilisation technique |
| `manufacturing` | `space_manufacturing_process` | an in-space manufacturing or construction process |
| `infrastructure` | `space_infrastructure` | an infrastructure system or facility |

Cross-references: `domainSlug` (→ `member_of_group` its domain) and `relatedKeys`
(→ `associated_with` the reused worlds, stations, propellants, and components).

## Honesty: technology maturity

Every non-domain entity carries a `maturity` — `operational`, `demonstrated`,
`in-development`, `planned`, `concept`, or `theoretical` — surfaced as a badge and stated in
its description. This is a deliberate anti-hype measure: 3D printing on the ISS and MOXIE's
oxygen production on Mars are **operational/demonstrated**; propellant depots and solar-power
satellites are **concepts**; the space elevator is **theoretical** (no known material is
strong enough). Nothing is presented as more real than it is.

## Reuse

Water/oxygen/regolith techniques link to `moon:the-moon`, `planet:mars`, and the
water-bearing `asteroid:bennu`; metal extraction links to the M-type `asteroid:psyche`;
habitats link to the existing
`space_station:axiom-station`, `space_station:genesis-i/ii`, and `space_station:lunar-gateway`;
depots and refuelling link to the reused `propellant:*` entities. Nothing is duplicated, and
every emitted relation is deduped against `LEGACY_RELATION_IDS`.

## Engine (`engine.spaceInfrastructure`)

`ResolvedInfra` resolves an entry to its domain, the reused entities it concerns, and (for a
domain) its members. Query surface: `domains()`, `isru()`, `manufacturing()`,
`infrastructure()`, `byDomain(slug)`, `byMaturity(m)`, and `resolveEntry(slug)`.

## Pages

- `/space-infrastructure` — the hub: domains, discovery hubs, and provenance.
- `/space-infrastructure/{slug}` — an adaptive entry for a domain, ISRU technique,
  manufacturing process, or infrastructure system (with its maturity).
- `/space-infrastructure/discover/{slug}` — domains, resource utilisation, manufacturing &
  construction, and infrastructure systems.

## Provenance

Curated from NASA and ESA. Technology maturity is stated honestly; nothing is fabricated.
