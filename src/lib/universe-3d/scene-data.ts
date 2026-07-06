import { engine } from "@/platform/data-engine";
import { solarBodyPath, starPath } from "@/lib/routes";
import { bodySlug } from "@/knowledge-graph/data/solar-system-catalog";
import { raHoursToDeg } from "@/lib/sky-atlas/projection";
import { defaultCamera, equatorialToCartesian, starToPoint3D, type Point3D, type Scene3D } from "@/lib/universe-3d/projection3d";

/**
 * Real-data scene builders for the Universe Engine (Program BU). Each reads ONLY measured fields from
 * the reused catalog engines (engine.star orbital distances, engine.solar orbital elements) and hands
 * the projection library real coordinates. A scene is built only where real geometry exists; where it
 * does not (galaxy-scale distances, constellation line topology) no scene is fabricated — the page
 * shows the honest descriptive content and the data-coverage accounting instead.
 *
 * These builders import the data engines and therefore run on the server; the client viewer receives
 * only the plain Scene3D data and imports nothing from the graph.
 */

type StarRec = {
  id: string;
  slug: string;
  name: string;
  ra?: number;
  dec?: number;
  distanceLy?: number;
  apparentMagnitude?: number;
  colorIndex?: number;
  constellation: string;
};

/** The local stellar neighbourhood: the nearest stars at their TRUE positions from measured parallax. */
export function buildStellarNeighborhoodScene(limit = 160): Scene3D {
  const stars = engine.star.nearest(limit) as StarRec[];
  const points: Point3D[] = [];
  // The Sun sits at the origin of this heliocentric map — a real anchor, not an invented object.
  points.push({ id: "star:sun", name: "Sun", x: 0, y: 0, z: 0, colorIndex: 0.63, magnitude: 1, distance: 0 });
  for (const s of stars) {
    const p = starToPoint3D(
      { id: s.id, name: s.name, ra: s.ra, dec: s.dec, distanceLy: s.distanceLy, apparentMagnitude: s.apparentMagnitude, colorIndex: s.colorIndex, href: starPath(s.slug) },
      "distance-true",
    );
    if (p) points.push(p);
  }
  const maxD = Math.max(1, ...points.map((p) => p.distance ?? 0));
  const rings = [10, 20, 30, 40, 50].filter((r) => r <= maxD * 1.15).map((r) => ({ radius: r, label: `${r} ly` }));
  return {
    points,
    rings,
    camera: defaultCamera(maxD),
    unit: "light-years",
    coverageNote: `The ${points.length - 1} nearest stars with a measured parallax distance, plotted at their true three-dimensional positions in light-years (the Sun at the centre). Stars without a measured distance are not shown — no position is invented. Rings mark distance from the Sun.`,
  };
}

/** The Solar System to scale: orbit rings at each body's real semi-major axis (astronomical units). */
export function buildSolarSystemScene(): Scene3D {
  type Body = { id: string; name: string; semiMajorAxisAu?: number };
  const planets = (engine.solar.planets() as Body[]).filter((b) => typeof b.semiMajorAxisAu === "number" && b.semiMajorAxisAu! > 0);
  const points: Point3D[] = [{ id: "body:the-sun", name: "Sun", x: 0, y: 0, z: 0, colorIndex: 0.63, magnitude: 0 }];
  const rings = planets.map((p) => ({ radius: p.semiMajorAxisAu!, label: p.name }));
  const golden = Math.PI * (3 - Math.sqrt(5)); // spread the markers so they do not overlap on one ray
  planets.forEach((p, i) => {
    const a = p.semiMajorAxisAu!;
    const ang = i * golden;
    points.push({ id: p.id, name: p.name, x: a * Math.cos(ang), y: 0, z: a * Math.sin(ang), distance: a, layer: "planets", href: solarBodyPath(bodySlug(p.id)) });
  });
  const maxA = Math.max(1, ...planets.map((p) => p.semiMajorAxisAu!));
  return {
    points,
    rings,
    camera: { ...defaultCamera(maxA), pitch: 0.95 },
    unit: "AU",
    coverageNote:
      "Orbit radii are the real semi-major axes (astronomical units), drawn to scale — so the vast spacing of the outer planets is genuine. Each planet is marked on its orbit at an illustrative angle; the angle is schematic (this is a scale diagram of orbital distances, not a computed ephemeris of where the planets are tonight).",
  };
}

/** The catalogued constellation with the most stars, plotted by real direction on the celestial sphere. */
export function buildFeaturedConstellationScene(): { scene: Scene3D; constellationId: string; starCount: number } {
  const all = engine.star.all() as StarRec[];
  const counts = new Map<string, number>();
  for (const s of all) if (typeof s.ra === "number" && typeof s.dec === "number") counts.set(s.constellation, (counts.get(s.constellation) ?? 0) + 1);
  let best = ""; let bestN = -1;
  for (const [c, n] of counts) if (n > bestN) { best = c; bestN = n; }
  const stars = (engine.star.byConstellation(best) as StarRec[]).filter((s) => typeof s.ra === "number" && typeof s.dec === "number");
  const R = 100;
  const points: Point3D[] = stars.map((s) => {
    const c = equatorialToCartesian(raHoursToDeg(s.ra as number), s.dec as number, R);
    return { id: s.id, name: s.name, ...c, magnitude: s.apparentMagnitude, colorIndex: s.colorIndex, distance: s.distanceLy, href: starPath(s.slug) };
  });
  const scene: Scene3D = {
    points,
    camera: { yaw: 0.2, pitch: 0.1, distance: R * 2.4, fov: (55 * Math.PI) / 180 },
    unit: "direction (unit celestial sphere)",
    coverageNote:
      "Stars shown by their real right ascension and declination on the celestial sphere — the directions you see from Earth. Their true distances (in the table) vary enormously, so the familiar pattern is a line-of-sight effect, not a physical grouping. Star-to-star line topology is not part of the catalogue, so no stick figure is drawn — nothing is invented.",
  };
  return { scene, constellationId: best, starCount: stars.length };
}

/** Honest coverage accounting for the data-coverage page: what can be placed in true 3D, and what cannot. */
export function computeUniverseCoverage() {
  const stars = engine.star.all() as StarRec[];
  const starsWithDistance = stars.filter((s) => typeof s.distanceLy === "number").length;
  const starsWithDirection = stars.filter((s) => typeof s.ra === "number" && typeof s.dec === "number").length;
  const deepSky = engine.deepSky.all() as { raHours?: number; decDeg?: number }[];
  const deepSkyWithDirection = deepSky.filter((d) => typeof d.raHours === "number" && typeof d.decDeg === "number").length;
  const planets = (engine.solar.planets() as { semiMajorAxisAu?: number }[]).filter((b) => typeof b.semiMajorAxisAu === "number").length;
  const galaxyStructures = engine.galaxies.structures().length;
  const galacticStructures = engine.galacticAstronomy.structure().length;
  return {
    starsTotal: stars.length,
    starsWithDistance,
    starsWithoutDistance: stars.length - starsWithDistance,
    starsWithDirection,
    deepSkyTotal: deepSky.length,
    deepSkyWithDirection,
    deepSkyWithDistance: 0, // the deep-sky catalogue carries angular position and size only — no line-of-sight distance
    planetsWithOrbit: planets,
    galaxyStructures,
    galacticStructures,
  };
}
