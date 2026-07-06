# Scientific Calculators & Simulation Platform (Program BP)

Every astronomy calculator, unified under one engine (`engine.scientificCalculators`) — and honest.
Each calculator is a first-class knowledge-graph entity that carries its **published formula** and a
**pure compute function**, and evaluates that formula live from the real physical constants and the
user's inputs.

**Honesty first.** Results are *computed*, not fabricated: the constants are the CODATA 2018
fundamental values and the IAU 2015 nominal solar/planetary values (`src/lib/calculators/constants.ts`,
cited), and the output is derived from them and the inputs. Every calculator ships a **worked example
whose expected value is a known textbook result**, and the validator recomputes it on each build and
fails if the formula does not reproduce it — so the equations are *validated against published
values*, not merely asserted. Genuinely uncertain quantities are inputs, not assertions: the Hubble
constant defaults to 70 km/s/Mpc but is editable (the Hubble tension), and the redshift–velocity
relation is flagged as a low-redshift approximation.

## Data model

`CalculatorRecord` (single entity type `scientific_calculator`) carries: `category`, `formula`
(plain text), `variables` (each with a symbol, label, unit, and default), `resultUnit`/`resultLabel`,
a pure `compute(inputs)` function, an `example` (`{expected, tol, note}`), and `relatedKeys` linking
the calculator to the physics concept it rests on.

## Contents — 30 calculators

- **Orbital mechanics (9)** — escape velocity, circular orbital velocity, orbital period (Kepler III),
  surface gravity, Schwarzschild radius, mean density, Hill sphere, Roche limit (fluid), synodic period.
- **Stellar physics (5)** — Stefan–Boltzmann luminosity, blackbody surface flux, Wien peak
  wavelength, mass–luminosity relation, main-sequence lifetime.
- **Photometry & distance (5)** — absolute magnitude, distance modulus, parallax distance, angular
  diameter, angular separation.
- **Exoplanets & habitability (3)** — planet equilibrium temperature, equal-insolation distance,
  transit probability.
- **Cosmology (2)** — redshift recession velocity (low-z), Hubble distance.
- **Telescopes & instruments (6)** — angular resolution / diffraction limit, magnification, image
  scale, field of view, limiting magnitude, photon shot-noise SNR.

## Architecture

- `src/lib/calculators/constants.ts` — the cited physical constants (CODATA 2018, IAU 2015), SI.
- `src/knowledge-graph/data/scientific-calculators-catalog/data/*.ts` — the calculators, each with an
  inline pure compute function and validated example.
- `src/lib/calculators/registry.ts` — a **client-safe** re-export of the calculator data (imports only
  the pure data + constants, never the graph) so the interactive widget can evaluate on the device.
- `src/components/calculators/CalculatorWidget.tsx` — a `"use client"` widget that reads the variables
  and compute function from the registry and evaluates live as the inputs change.
- The validator (`validateScientificCalculators`) recomputes every worked example against its known
  value; a formula that drifts fails the build.

## Engine (`engine.scientificCalculators`)

`ResolvedCalculator` resolves an entry to the physics concepts it reuses (`related`) and includes the
recomputed worked-example result. Query surface: `all()`, `byCategory(c)`, `categories()`,
`compute(slug, inputs)` (safe evaluation, returns `null` on error), and `resolveEntry(slug)`.

## Pages

- `/calculators` — the hub: the discovery hubs and the full calculator index.
- `/calculators/{slug}` — an interactive calculator page: the live widget, the formula, a worked
  example, and the physics behind it.
- `/calculators/discover/{slug}` — orbits & gravity, stars & the cosmos, telescopes & observing.

## Provenance

Constants from CODATA 2018 (physics.nist.gov) and IAU 2015 Resolution B3; planetary values from the
NASA planetary fact sheets. Nothing is fabricated; every formula is validated against a known value.
