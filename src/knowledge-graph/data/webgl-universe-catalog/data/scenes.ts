import type { UniverseSceneRecord } from "@/knowledge-graph/data/webgl-universe-catalog/types";

/** Universe Engine scenes (Program BU). Interactive scenes are rendered only where REAL geometry
 *  exists in the reused catalogues; where it does not, the scene is honestly descriptive and says so.
 *  Every interactive scene draws each object at a measured position — nothing is invented. */
const scene = (r: Omit<UniverseSceneRecord, "id" | "sources"> & { slug: string; sources?: UniverseSceneRecord["sources"] }): UniverseSceneRecord => ({
  sources: ["nasa"],
  ...r,
  id: `universe_scene:${r.slug}`,
});

export const scenes: UniverseSceneRecord[] = [
  scene({
    slug: "solar-system",
    name: "The Solar System in 3D",
    category: "solar-system",
    description:
      "An interactive, to-scale model of the Sun's planetary system. Each orbit ring is drawn at the planet's real semi-major axis, so the true structure of the system — the crowded inner planets and the vast reaches of the outer ones — is genuine. Drag to rotate the system, scroll to zoom.",
    dataSource: "engine.solar",
    coverageMode: "to-scale",
    coordinateBasis: "Real semi-major axes (astronomical units) from the solar-system catalogue; orbit sizes are to scale. Each planet is marked on its orbit at an illustrative angle — the along-orbit phase is schematic, not a computed ephemeris.",
    interactive: true,
    completesAtlasView: "atlas_view:solar-system-explorer",
    layers: ["planets"],
    controls: ["Drag to rotate", "Scroll to zoom", "Reset view"],
    fallback: "A server-rendered static diagram of the orbits and a data table of every body with its real semi-major axis, drawn without JavaScript.",
    limitations:
      "This is a scale diagram of orbital distances, not a live sky ephemeris: the angular position of each planet along its orbit is illustrative. Moons are not placed (their orbits are tiny at this scale) — they are catalogued in the Moon Explorer.",
    relatedKeys: ["atlas_view:solar-system-explorer", "planet:earth", "planet:jupiter", "planet:neptune"],
    highlights: ["Orbit radii are the real semi-major axes, to scale"],
  }),
  scene({
    slug: "stars",
    name: "The Local Stellar Neighbourhood in 3D",
    category: "stellar",
    description:
      "The nearest stars to the Sun, plotted at their true three-dimensional positions from measured parallax distances. This is the view a two-dimensional star chart cannot give: not just where a star lies on the sky, but how far away it truly is. Drag to fly around the neighbourhood; the Sun sits at the centre.",
    dataSource: "engine.star",
    coverageMode: "distance-true",
    coordinateBasis: "Measured right ascension and declination with a measured parallax distance (light-years) for each star, converted to real Cartesian positions. Stars without a measured distance are excluded — never placed.",
    interactive: true,
    completesAtlasView: "atlas_view:all-sky-star-atlas",
    controls: ["Drag to rotate", "Scroll to zoom", "Reset view"],
    fallback: "A server-rendered static projection and a data table of every plotted star with its measured distance, drawn without JavaScript.",
    limitations:
      "Only stars with a measured parallax distance are shown; a small number of catalogued stars have no reliable distance and are omitted rather than placed at a guessed position. Star colour is rendered from the measured B−V colour index; where it is unknown a neutral tone is used.",
    relatedKeys: ["atlas_view:all-sky-star-atlas", "star:sirius", "star:proxima-centauri", "star:vega"],
    highlights: ["Real 3D distances — the depth a flat sky chart cannot show"],
  }),
  scene({
    slug: "constellations",
    name: "Constellations on the Celestial Sphere",
    category: "stellar",
    description:
      "The stars of a constellation shown by their real directions on the celestial sphere — the pattern as it appears from Earth. Turn on the true-distance figures in the table and a striking fact appears: the stars of a constellation lie at wildly different distances and are not physically connected at all. The familiar shape is a line-of-sight illusion.",
    dataSource: "engine.star",
    coverageMode: "direction-only",
    coordinateBasis: "Measured right ascension and declination placed on the unit celestial sphere (direction only — no distance is asserted by the position). Each star's measured distance is shown in the accompanying table.",
    interactive: true,
    completesAtlasView: "atlas_view:constellation-atlas",
    controls: ["Drag to rotate", "Scroll to zoom", "Reset view"],
    fallback: "A server-rendered static sphere projection and a data table of the constellation's stars with their measured distances, drawn without JavaScript.",
    limitations:
      "No star-to-star line topology (the stick-figure joins) exists in the catalogue, so no connecting lines are drawn — nothing about the figure is invented. The scene features the constellation with the most catalogued stars.",
    relatedKeys: ["atlas_view:constellation-atlas", "constellation:centaurus", "constellation:orion"],
    highlights: ["The pattern is a line-of-sight effect — shown honestly, without invented lines"],
  }),
  scene({
    slug: "milky-way",
    name: "The Milky Way",
    category: "galactic",
    description:
      "Our home galaxy and the Sun's place within it. The measured part of this picture — the local stellar neighbourhood — is the real 3D star field; the wider structure of the Galaxy (its disc, bulge, bar, spiral arms, halo, and centre) is presented from the galactic-structure catalogue as described components, because numeric galaxy-scale positions are not part of the data.",
    dataSource: "engine.galacticAstronomy",
    coverageMode: "descriptive",
    coordinateBasis: "The catalogued galactic structures carry descriptive text only — no numeric coordinate or distance — so no galaxy-scale scene is fabricated. The only measured 3D geometry available at this scale is the local stellar neighbourhood, which is linked.",
    interactive: false,
    completesAtlasView: "atlas_view:milky-way-explorer",
    fallback: "The described galactic structures and the Sun's neighbourhood, with a link to the distance-true stellar-neighbourhood scene.",
    limitations:
      "A distance-true map of the whole Galaxy would require numeric positions and distances that are not in the catalogue. Rather than fabricate galactic geometry, this scene stays descriptive and points to the real 3D data that does exist (the stellar neighbourhood).",
    relatedKeys: ["atlas_view:milky-way-explorer", "galaxy:milky-way", "galactic_structure:galactic-center", "galactic_structure:spiral-arms"],
    highlights: ["Honest about scale: descriptive where no numeric geometry exists"],
  }),
  scene({
    slug: "local-group",
    name: "The Local Group",
    category: "extragalactic",
    description:
      "Our galactic neighbourhood — the Milky Way, Andromeda, Triangulum, the Magellanic Clouds, and the dozens of dwarf galaxies bound with them. The members and their relationships are drawn from the graph; their separations are given by the catalogue's descriptive scale labels, because numeric inter-galactic distances and positions are not part of the data.",
    dataSource: "engine.galaxies",
    coverageMode: "descriptive",
    coordinateBasis: "The catalogued galaxies and cosmic structures carry descriptive scale labels only — no numeric distance or coordinate — so no distance-true extragalactic scene is fabricated.",
    interactive: false,
    completesAtlasView: "atlas_view:local-group-explorer",
    fallback: "The Local Group members and structures with their descriptive scale labels, linked into the knowledge graph.",
    limitations:
      "A true 3D map of the Local Group would require numeric distances and positions for each galaxy, which the catalogue does not carry. This scene stays descriptive rather than place galaxies at invented coordinates.",
    relatedKeys: ["atlas_view:local-group-explorer", "cosmic_structure:local-group", "galaxy:andromeda-galaxy", "galaxy:milky-way"],
    highlights: ["Descriptive by necessity — no numeric galaxy distances are fabricated"],
  }),
];
