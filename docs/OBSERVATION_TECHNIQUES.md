# Professional Observation Techniques (Program CG)

The practical craft of observing — how the sky is turned into data and images. Built on the platform's
honesty envelope: only well-established observing practice is stated, image processing is described as
representing real signal rather than inventing it, and nothing is fabricated.

## Reuse-first

The technique layer is already partly built, so CG reuses it and adds only the missing capture-to-image
techniques:

- The **frontier techniques** (`observing_technique:lucky-imaging`, `speckle-imaging`, `image-stacking`,
  `fringe-tracking`), the **AO chain and instrument techniques** (`instrument_technique:*` — coronagraph,
  laser guide star, wavefront sensor, deformable mirror, spectrographs), the **detectors**
  (`detector_technology:ccd`, `cmos`), the **measurement methods** (`astronomy_method:*` — photometry,
  spectroscopy, polarimetry, adaptive optics, astrometry, stellar occultations, calibration), the
  **amateur equipment and activities** (`observing_equipment:*`, `amateur_activity:*`), and the
  **observing planners** (`observing_planner:*`) — all referenced via `relatedKeys`, none duplicated.

## New entities (no new EntityType)

All 11 new entities are `observing_technique` (the existing type from observatory-frontier); CG groups
them by a catalog-local kind:

- **Visual observing** (1) — visual astronomy.
- **Imaging techniques** (5) — astrophotography, planetary imaging, deep-sky imaging, narrowband imaging,
  autoguiding.
- **Processing techniques** (4) — calibration frames (bias/dark/flat), image processing, drizzle, plate
  solving.
- **Observing workflow** (1) — the end-to-end imaging workflow (the equipment chain).

Each technique links to the frontier techniques, detectors, methods, and equipment it depends on,
producing `associated_with` edges deduped against every existing relation.

## Surfaces

- Hub `/observation-techniques`, entry pages `/observation-techniques/[slug]`, and three discovery hubs
  (`imaging-techniques`, `processing-techniques`, `visual-and-workflow`).
- Resolved through the Scientific Data Engine (`engine.observationTechniques`), reusing the shared
  quality, review, provenance, connections, breadcrumb, and JSON-LD (`DefinedTerm`) infrastructure.
  Accent: aurora.
- An `observation-techniques` dataset and a "From Telescope to Image" learning path surface the layer in
  `/datasets`, `/learn`, and `/llms.txt`.

## Honesty

Techniques are described as established practice, and image processing is explicitly framed as
representing real signal, not inventing it. Techniques already in the graph (lucky/speckle imaging, image
stacking, adaptive optics, the detectors) are reused rather than re-created. Nothing is fabricated.
