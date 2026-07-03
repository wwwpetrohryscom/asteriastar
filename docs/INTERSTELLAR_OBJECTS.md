# Interstellar & Hyperbolic Objects Encyclopedia (Program AB)

The coda to the small-body arc — **Program Y (Asteroids)** → **Program Z (Comets)** →
**Program AA (Meteorites)** → **Program AB (Interstellar)** — a compact, source-backed,
graph-driven encyclopedia of the objects that visit the Solar System from beyond it, the
Solar-System comets that merely resemble them, and the methods used to tell the two apart.

This is a **compact authority program**, not a mass-page domain: a small number of
carefully-sourced entities whose value is accuracy and honest status, not volume.

See also: [ASTEROIDS](./ASTEROIDS.md), [COMETS](./COMETS.md), [METEORITES](./METEORITES.md),
[SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md).

## Data & sourcing — no fabrication
Every field is curated from authoritative public sources — the IAU Minor Planet Center
(which assigns the interstellar "I" designations), the NASA/JPL Small-Body Database and
CNEOS, ESO/observatory reports, and the peer-reviewed discovery literature. **Every
technical field is optional and omitted when not reliably known**: eccentricities,
discovery dates, discoverers, trajectories, and compositions are NEVER invented.

## The governing rule — honest status
A confirmed interstellar object, an unconfirmed candidate, a debated claim, and a
Solar-System comet on a (weakly) hyperbolic orbit are **different things**. They are typed
separately (`interstellar_object`, `interstellar_candidate`, `hyperbolic_comet`), carry an
explicit scientific `status`, and are displayed with distinct colours and in separate
sections — confirmed and candidate objects are never mixed visually. An interstellar
origin is asserted in the graph (`has_trajectory_class → trajectory_class:interstellar-hyperbolic`)
**only for the confirmed objects**.

| Status | Meaning | Example |
| --- | --- | --- |
| `confirmed_interstellar` | Strongly hyperbolic orbit + IAU "I" designation | 1I/ʻOumuamua, 2I/Borisov, 3I/ATLAS |
| `candidate_interstellar` | Proposed interstellar, not confirmed | — |
| `debated_origin` | Interstellar claimed but the data are disputed | CNEOS 2014-01-08 |
| `hyperbolic_solar_system_object` | Solar-System origin; hyperbolic/near-parabolic orbit | C/1980 E1 (Bowell) |
| `rejected_or_uncertain` | Interstellar origin proposed and unsupported | — |

## Catalogue policy — confirmed vs candidate
- **Confirmed** requires an unambiguous, strongly hyperbolic orbit (large excess velocity)
  **and** an IAU interstellar designation. As of this writing there are three: 1I/ʻOumuamua,
  2I/Borisov, and 3I/ATLAS.
- **Candidate / debated** objects (e.g. the CNEOS 2014-01-08 bolide) are included only when
  source-backed, are always labelled as unconfirmed, carry a required `uncertaintyNote`, and
  are **never** given the interstellar-hyperbolic trajectory class. The validator enforces
  this: a candidate that were classified as `interstellar-hyperbolic`, or that carried the
  `confirmed_interstellar` status, or that lacked an uncertainty note, fails the build.

## Hyperbolic-object policy
"Hyperbolic comet" here means a **Solar-System** comet on a hyperbolic or near-parabolic
orbit — a small eccentricity above 1 caused by planetary perturbations (a Jupiter
slingshot, for C/1980 E1), **not** an interstellar origin. These are `hyperbolic_comet`
entities with status `hyperbolic_solar_system_object`. Eccentricities are stated only where
a value above 1 is well established (C/1980 E1 ≈ 1.06); otherwise the orbit is described as
near-parabolic without a fabricated figure. Comet Hyakutake, sometimes cited in discussions
of eccentricity ≈ 1, is a long-period bound comet and is deliberately **not** modelled as
hyperbolic; it is linked by its existing `/comets/hyakutake` page in prose, not reclassified.

## Uncertainty handling
- Candidate/debated objects carry a prominent, required uncertainty note (rendered in an
  amber callout) and do not state an eccentricity where the underlying data are disputed.
- 3I/ATLAS (discovered 2025) is flagged as having preliminary physical parameters; its
  interstellar origin rests on the strongly hyperbolic orbit, not on any physical claim.
- No **"alien object"**, **"alien spacecraft"**, or artificial-origin framing is used
  anywhere. The unusual features of 1I/ʻOumuamua are described with the scientific consensus
  (a natural body) and the speculation is explicitly noted as unsupported.

## Source hierarchy
1. **IAU Minor Planet Center** — designations, astrometry, orbits (`mpc`).
2. **NASA/JPL Small-Body Database & CNEOS** — orbital elements, fireball data (`jpl`, `nasa`).
3. **ESO / observatory reports** — spectroscopy and imaging (`eso`, `esa`).
4. **Peer-reviewed literature** — for characterisation and the (debated) candidate claims (`ads`).

## Scale
| Kind | Graph type (new) | Count |
| --- | --- | --- |
| Confirmed interstellar object | `interstellar_object` | 3 |
| Candidate / debated | `interstellar_candidate` | 1 |
| Hyperbolic Solar-System comet | `hyperbolic_comet` | 4 |
| Detection method | `interstellar_detection_method` | 3 |
| Trajectory class | `trajectory_class` | 4 |
| Detection survey / body (new, reused type) | `sky_survey` / `organization` | 4 |

**19 new graph entities and 38 new relations.** One new relation type,
`has_trajectory_class`; everything else reuses existing types (`surveyed_by`,
`catalogued_in`, `associated_with`, `related_to`).

## Reuse first — never duplicate
Relation targets reuse existing graph entities: the comet dynamical class
`comet_class:long-period` (Program Z), `sky_survey:pan-starrs` and `sky_survey:lsst` /
`observatory:vera-rubin-observatory`, `organization:jpl`, and `planet:earth`. Only the
genuinely-missing surveys and bodies — **ATLAS**, the **Catalina Sky Survey**, the **Minor
Planet Center**, and **CNEOS** — are created (as entities of the existing `sky_survey` /
`organization` types, without their own hub page; they resolve to the standalone
`/explore/entity/...` graph pages and appear in the Surveys hub).

## Relations
One new relation type: `has_trajectory_class` (an object → its `trajectory_class`).
Everything else reuses existing types: `surveyed_by` (object → the survey that detected it),
`catalogued_in` (object → the Minor Planet Center / JPL), `associated_with` (object → a
detection method, or → a related comet class; candidate → CNEOS / Earth), and `related_to`
(the trajectory-class "eccentricity ladder": bound → near-parabolic → hyperbolic-ejection →
interstellar-hyperbolic). Cross-references resolve against the map for the target kind;
edges that duplicate an existing graph edge are dropped via `legacy-relations.ts`.

## Pages
`/interstellar-objects` (hub, with the three status groups kept in separate, colour-coded
sections), `/interstellar-objects/{slug}` (each confirmed object, candidate, and hyperbolic
comet — adaptive, status-badged), `/interstellar-objects/detection/{slug}` (detection
methods), `/interstellar-objects/trajectory/{slug}` (trajectory classes), and
`/interstellar-objects/discover/{slug}` (four single-status discovery hubs). Each page emits
BreadcrumbList + a schema.org `Thing` / `DefinedTerm` / `CollectionPage` JSON-LD, a
quick-facts panel, EntityProvenancePanel, a quality/authority panel, and Sources.

## Live Sky — architecture, not fabrication
Interstellar objects pass through the Solar System once and do not return; this encyclopedia
computes **no** live positions or visibility and states no current events. Pages link to the
computed Live Sky tools (`/sky/night-sky-tonight`, `/sky/observing-calendar`) for what is
genuinely observable.

## Open Data
Five new datasets — `interstellar-objects`, `interstellar-candidates`, `hyperbolic-comets`,
`trajectory-classes`, and `interstellar-detection-methods` — each exported as JSON / CSV /
JSON-LD at `/api/v0/datasets/{slug}`.

## Validation
`validateInterstellarObjects()` runs in `npm run validate` and `engine.validation`. Beyond
the usual checks (duplicate ids, per-kind slug uniqueness, id ↔ kind/slug match, sources and
description, numeric ranges, cross-reference resolution, no isolated new entity), it enforces
the honesty rules: a confirmed object **must** be `confirmed_interstellar` **and** carry the
`interstellar-hyperbolic` trajectory class (and, if an eccentricity is stated, e > 1); a
candidate **must not** be confirmed, **must not** be classified interstellar-hyperbolic, and
**must** carry an uncertainty note; a hyperbolic comet **must** be a Solar-System object and
not classified interstellar. The entry gate additionally asserts every emitted relation
endpoint resolves in the assembled graph.

## Learning
The `understanding-interstellar-objects` learning path — 12 lessons across what an
interstellar object is, hyperbolic orbits, eccentricity greater than one, detection, the
three confirmed objects, comets vs asteroids vs interstellar objects, the survey telescopes,
the Minor Planet Center, candidate and debated objects, what they reveal, and future surveys
— every step a real `/interstellar-objects`, `/observatories`, or `/comets` route.

## Future expansion
- More confirmed objects as they are discovered (the Vera C. Rubin Observatory's LSST is
  expected to raise the detection rate sharply) — added as `interstellar_object` entities.
- Additional hyperbolic Solar-System comets as source-backed data allow.
- Deeper reuse: linking each interstellar object's incoming radiant to nearby stars is
  deliberately **not** done, because no specific parent star has been identified for any of
  them — a link the sources do not support is a link this platform does not make.
