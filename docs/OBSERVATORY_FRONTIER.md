# Ground-Based Observatories & Instrumentation Frontier Encyclopedia (Program AU)

The modern frontier of professional ground-based astronomy — the giant telescopes of the coming
decade and the instrumentation that makes them see.

This layer **reuses** the ground observatories already in the graph (the ELT, TMT, Rubin, Keck,
Subaru, the VLT, Gemini, ALMA, the SKA, the VLA, MeerKAT, LOFAR, APEX, the JCMT, the SMA, and the
South Pole Telescope), the adaptive-optics, interferometry, spectroscopy, and photometry methods,
the SPHERE, MUSE and HIRES instruments, the direct-imaging exoplanet method, and the wavelength
bands. The new entities are the three next-generation facilities still missing from the graph, plus
the instrumentation techniques, the detector technologies, the interferometry techniques, and the
ground observing techniques.

## Data model

`FrontierRecord` is a discriminated record over `FrontierKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `facility` | `telescope` / `observatory` | a next-generation ground facility — a **new entity of the existing type**, resolved from the record's `facilityType` |
| `instrument` | `instrument_technique` | an instrumentation technique / optical system |
| `detector` | `detector_technology` | a detector technology |
| `interferometry` | `interferometry_technique` | an interferometry technique |
| `technique` | `observing_technique` | a ground observing technique |

Cross-references: `relatedKeys` (→ `associated_with` the reused facilities, methods, instruments,
organisations, and bands, and the sibling AU entities). Facilities carry an honest `statusLabel`
(e.g. "Under construction", "Proposed").

### Facilities reuse the existing types, never a parallel one

The Giant Magellan Telescope and ngVLA are created as `telescope:` entities and the Cherenkov
Telescope Array as an `observatory:` entity — the **same types** as the ELT, TMT, and Gemini they
sit beside. A `facility` record therefore carries its entity type in `facilityType`, and the
validator checks the id against it, rather than against a single kind→type mapping. This adds the
three genuinely-missing facilities without duplicating the facility concept as a new type.

## Contents

- **3 next-generation facilities** — the Giant Magellan Telescope (under construction), the ngVLA
  (proposed), and the Cherenkov Telescope Array (under construction).
- **7 instrumentation techniques** — laser guide star, wavefront sensor, deformable mirror, echelle
  spectrograph, integral-field spectrograph, coronagraph, starshade.
- **5 detector technologies** — CCD, CMOS, MKID, bolometer, cryogenic detector.
- **4 interferometry techniques** — radio interferometry, aperture synthesis, VLBI, optical
  interferometry.
- **4 observing techniques** — lucky imaging, speckle imaging, image stacking, fringe tracking.

## Reuse & the graph

Each entity links to the real facilities and methods it depends on: the laser guide star, wavefront
sensor, and deformable mirror to the adaptive-optics method and the ELT and VLT; the echelle and
integral-field spectrographs to the spectroscopy method and HIRES and MUSE; the coronagraph and
starshade to the direct-imaging method and SPHERE; radio interferometry and aperture synthesis to
the interferometry method and the VLA and ALMA; the detectors to the wavelength bands and the
facilities that use them. Every emitted relation is deduped against `LEGACY_RELATION_IDS`, and any
relation whose endpoint does not resolve is dropped.

## Engine (`engine.observatoryFrontier`)

`ResolvedFrontier` resolves an entry to the reused entities it uses (`related`) and the other AU
entities that reference it (`usedBy`). Query surface: `facilities()`, `instruments()`,
`detectors()`, `interferometry()`, `techniques()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/observatory-frontier` — the hub: the next-generation facilities, discovery hubs, and provenance.
- `/observatory-frontier/{slug}` — an adaptive entry for a facility, instrumentation technique,
  detector, interferometry technique, or observing technique.
- `/observatory-frontier/discover/{slug}` — facilities, instrumentation, detectors, interferometry,
  and observing techniques.

## Provenance

Curated from ESO, NOIRLab, NRAO, and NASA. Facilities under construction or proposed are stated as
such; nothing is fabricated; unknown values are left empty.
