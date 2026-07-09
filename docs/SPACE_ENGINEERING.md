# Space Engineering & Launch Systems Deep Dive (Program CB)

The concept-and-method layer that unifies the engineering hardware already in the graph. Built on the
platform's honesty envelope: only well-established engineering is stated, technologies that have not yet
flown are flagged as such, standard equations appear only where firmly established, and nothing is
fabricated.

## Reuse-first

CB adds no hardware. It reuses the large engineering base already in the graph and adds only the
concepts and methods that the hardware embodies but that were not modelled:

- **Rocket engines, stages & propellants** (`rocket_engine`, `rocket_stage`, `propellant` — e.g. RS-25,
  Raptor, F-1, Merlin 1D; the Saturn V S-IC and Falcon 9 first stage; LH2/LOX and MMH/N2O4);
  **spacecraft subsystems & components** (`spacecraft_subsystem`, `spacecraft_component` — propulsion,
  EDL, ADCS/GNC, the ion and Hall thrusters, nuclear-thermal propulsion, the RCS, the heat shield);
  **docking & navigation systems** (`docking_system`, `navigation_system` — IDSS, AutoNav);
  **operations functions** (`operations_function` — flight dynamics); and the **crewed deep-space
  propulsion architecture** — all referenced via `relatedKeys`, none duplicated. The full-graph name
  scan found no duplication of an existing concept.

## New entities (one new type, grouped by kind for discovery)

All new entities share a single new `space_engineering_concept` type; `kind` groups them for discovery.

- **Propulsion methods** (9) — electric propulsion; nuclear-electric propulsion; VASIMR; the arcjet and
  resistojet electrothermal thrusters; the solar sail; monopropellant and bipropellant chemical systems;
  and the staged-combustion engine cycle.
- **Rocketry principles** (6) — the Tsiolkovsky rocket equation, specific impulse, the thrust-to-weight
  ratio, the delta-v budget, rocket staging, and thrust vector control.
- **Flight maneuvers** (5) — orbital rendezvous, station-keeping, aerobraking, aerocapture, and the
  gravity-turn ascent.

Each concept links to the reused engines, stages, subsystems, and systems that embody it, producing
`associated_with` edges that are deduped against every existing relation.

## Surfaces

- Hub `/space-engineering`, entry pages `/space-engineering/[slug]`, and three discovery hubs
  `/space-engineering/discover/{propulsion-methods,rocketry-principles,flight-maneuvers}`.
- Resolved through the Scientific Data Engine (`engine.spaceEngineering`), reusing the shared quality,
  review, provenance, connections, breadcrumb, and JSON-LD (`DefinedTerm`) infrastructure. Accent: stone.

## Honesty

Technologies that have not flown are stated as such — nuclear-electric propulsion, VASIMR, and
aerocapture are all flagged as design or ground-test-stage rather than operational. Standard equations
(the rocket equation, specific impulse) are given only in their established form. Nothing is fabricated.
