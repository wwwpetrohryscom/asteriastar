# The Universe in 3D (Program BU)

A flat star chart tells you where a star is on the sky. It cannot tell you how far away it is. This
program adds AsteriaStar's interactive **3D/Canvas universe** — the depth a two-dimensional map cannot
show — built with the platform's honesty-first discipline.

**Honesty first.** Every point sits at a **measured** position. A star with no measured parallax
distance is never placed in a distance-true scene; a galaxy with only a descriptive scale label is
never given invented coordinates. Where the catalogue carries no numeric geometry, the scene is
**descriptive** and says so — it does not fabricate a scene. No position, distance, or coordinate is
invented.

**Build-safe rendering.** There is no WebGL/Three.js dependency (adding one to an 8,800-page static
build is not build-safe). Scenes render on a **2D canvas** (universally supported) from a pure
projection library, with a **server-rendered static SVG** and a **data table** as the no-JavaScript /
accessibility fallback. Rotation is manual, so there is nothing for reduced-motion to suppress.

## Reuse — completing the Sky Atlas

BU does not build a parallel atlas. It **completes the Sky Atlas's "3D-ready" views** (Program BO), which
were architecture-ready placeholders, by rendering real scenes from the same measured coordinates. It
reuses `engine.star`, `engine.solar`, `engine.constellations`, `engine.galaxies`, and
`engine.galacticAstronomy`.

## The projection library — `src/lib/universe-3d/projection3d.ts`

Pure, framework-free real math (reuses the Sky Atlas's `magnitudeToRadius` / `raHoursToDeg`):

- `equatorialToCartesian(raDeg, decDeg, distance)` — RA/Dec + distance → real Cartesian `(x, y, z)`.
  `distance = 1` is the unit celestial sphere (direction only; **not** a distance claim).
- `starToPoint3D(record, mode)` — `distance-true` returns `null` when a star has no measured distance,
  so an undistanced star can never be fabricated into a distance-true scene.
- `projectPerspective` / `projectScene` — orbit-camera perspective projection, painter's-order sort.
- `bvToColor(bv)` — real star colour from the measured B−V colour index.

Scene data is built server-side by `src/lib/universe-3d/scene-data.ts`; the client viewer imports only
the pure projection math, never the graph.

## Coverage modes (the honesty envelope for geometry)

- **to-scale** — real relative distances (Solar System orbit radii).
- **distance-true** — real measured 3D positions (stellar neighbourhood).
- **direction-only** — real directions on the celestial sphere (constellations).
- **descriptive** — no numeric geometry exists, so no scene is fabricated (Milky Way, Local Group).

## Scenes (`engine.webglUniverse`, entity type `universe_scene`)

- **The Solar System in 3D** (`/universe-3d/solar-system`) — orbit rings at the real semi-major axes,
  to scale; the along-orbit angle is schematic (stated), not a computed ephemeris.
- **The Local Stellar Neighbourhood** (`/universe-3d/stars`) — the nearest stars at true parallax
  distances (light-years); undistanced stars omitted, not placed.
- **Constellations on the Celestial Sphere** (`/universe-3d/constellations`) — real directions; the
  familiar pattern is shown to be a line-of-sight illusion, with no invented connecting lines.
- **The Milky Way** (`/universe-3d/milky-way`) — descriptive (no numeric galactic geometry).
- **The Local Group** (`/universe-3d/local-group`) — descriptive (no numeric galaxy distances).
- **Data coverage** (`/universe-3d/data-coverage`) — the honest accounting of what can and cannot be
  placed in true 3D, with real counts.

## Provenance

Coordinates are the measured values already in the star, solar-system, and constellation catalogues
(HYG, NASA/JPL, IAU). The validator checks that every scene reference resolves to a real entity, that
every interactive scene's builder produces real finite-coordinate points, and that a descriptive scene
is never marked interactive.
