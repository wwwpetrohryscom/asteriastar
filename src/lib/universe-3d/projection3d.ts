import { magnitudeToRadius, raHoursToDeg } from "@/lib/sky-atlas/projection";

/**
 * Pure 3D projection helpers for the Universe Engine (Program BU). These transform REAL measured
 * astronomical coordinates — equatorial right ascension / declination and a measured distance — into
 * 3D Cartesian space, and project that space to 2D through a simple orbit camera. They compute
 * geometry ONLY; they never invent a coordinate or a distance.
 *
 * Honesty rule: a star with no measured distance is NEVER placed in a distance-true scene. It can
 * appear only on the unit celestial sphere (every object at radius 1), which encodes direction, not
 * distance — and that is stated wherever the sphere is shown. `equatorialToCartesian` with distance = 1
 * is the celestial sphere; with a real measured distance it is a true position. There is no third mode.
 */

const DEG = Math.PI / 180;

/** A point in real 3D space. Units are the caller's, used consistently (light-years, parsecs, or AU). */
export interface Point3D {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  /** Apparent magnitude, if known — used only for dot size, never for position. */
  magnitude?: number;
  /** Colour index B−V, if known — used only for real star colour. */
  colorIndex?: number;
  /** The original measured distance (for labels/tooltips), if known. */
  distance?: number;
  /** Optional layer tag (e.g. "planets", "dwarf-galaxies") for toggling — a filter, never a position. */
  layer?: string;
  href?: string;
}

export interface ProjectedPoint extends Point3D {
  /** Screen x (pixels). */
  sx: number;
  /** Screen y (pixels). */
  sy: number;
  /** Camera-space depth from the camera; larger = farther (used for painter's-order sorting). */
  depth: number;
  /** Perspective scale factor at this depth (used for dot sizing). */
  scale: number;
  /** Whether the point is in front of the camera. */
  visible: boolean;
}

/** A simple orbit camera looking at a target, described by yaw/pitch/distance and a field of view. */
export interface Camera {
  /** Rotation about the vertical (y) axis, radians. */
  yaw: number;
  /** Rotation about the horizontal (x) axis, radians. */
  pitch: number;
  /** Camera distance from the target (same units as the points). */
  distance: number;
  /** Vertical field of view, radians. */
  fov: number;
  /** Look-at target; defaults to the origin. */
  target?: { x: number; y: number; z: number };
}

/**
 * Equatorial (RA in degrees, Dec in degrees, distance) → Cartesian (x, y, z) in a right-handed
 * equatorial frame: +x toward RA 0h / Dec 0°, +z toward the north celestial pole.
 *   x = d·cos(dec)·cos(ra),  y = d·cos(dec)·sin(ra),  z = d·sin(dec)
 * distance = 1 gives the unit celestial sphere (direction only — NOT a distance claim).
 */
export function equatorialToCartesian(raDeg: number, decDeg: number, distance = 1): { x: number; y: number; z: number } {
  const ra = raDeg * DEG;
  const dec = decDeg * DEG;
  const cd = Math.cos(dec);
  return { x: distance * cd * Math.cos(ra), y: distance * cd * Math.sin(ra), z: distance * Math.sin(dec) };
}

/** Convenience: build a 3D point from a star-like record's measured RA (hours), Dec (deg) and distance. */
export function starToPoint3D(
  r: { id: string; name: string; ra?: number; dec?: number; distanceLy?: number; apparentMagnitude?: number; colorIndex?: number; href?: string },
  mode: "distance-true" | "celestial-sphere",
  sphereRadius = 100,
): Point3D | null {
  if (typeof r.ra !== "number" || typeof r.dec !== "number") return null;
  const raDeg = raHoursToDeg(r.ra);
  if (mode === "distance-true") {
    if (typeof r.distanceLy !== "number" || !Number.isFinite(r.distanceLy) || r.distanceLy <= 0) return null; // honesty: no distance ⇒ not placed
    const c = equatorialToCartesian(raDeg, r.dec, r.distanceLy);
    return { id: r.id, name: r.name, ...c, magnitude: r.apparentMagnitude, colorIndex: r.colorIndex, distance: r.distanceLy, href: r.href };
  }
  const c = equatorialToCartesian(raDeg, r.dec, sphereRadius);
  return { id: r.id, name: r.name, ...c, magnitude: r.apparentMagnitude, colorIndex: r.colorIndex, distance: r.distanceLy, href: r.href };
}

/** Project one real 3D point through an orbit camera into screen space. Pure perspective; no fabrication. */
export function projectPerspective(p: Point3D, cam: Camera, width: number, height: number): ProjectedPoint {
  const tx = cam.target?.x ?? 0, ty = cam.target?.y ?? 0, tz = cam.target?.z ?? 0;
  const x = p.x - tx, y = p.y - ty, z = p.z - tz;
  // yaw about the y axis
  const cyaw = Math.cos(cam.yaw), syaw = Math.sin(cam.yaw);
  const x1 = cyaw * x + syaw * z;
  const z1 = -syaw * x + cyaw * z;
  // pitch about the x axis
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const y1 = cp * y - sp * z1;
  const z2 = sp * y + cp * z1;
  // depth from the camera sitting `distance` back along the view axis
  const camZ = z2 + cam.distance;
  const f = (height / 2) / Math.tan(cam.fov / 2); // focal length in pixels
  const visible = camZ > 1e-6;
  const scale = visible ? f / camZ : 0;
  return { ...p, sx: width / 2 + x1 * scale, sy: height / 2 - y1 * scale, depth: camZ, scale, visible };
}

/** Project a batch, keeping only points in front of the camera, sorted far→near (painter's order). */
export function projectScene(points: Point3D[], cam: Camera, width: number, height: number): ProjectedPoint[] {
  return points
    .map((p) => projectPerspective(p, cam, width, height))
    .filter((p) => p.visible)
    .sort((a, b) => b.depth - a.depth);
}

/** Perspective dot radius: the object's magnitude-based base size, scaled by perspective depth. */
export function radius3D(p: ProjectedPoint, minR = 0.4, maxR = 2.6): number {
  const base = magnitudeToRadius(p.magnitude, minR, maxR);
  // gentle perspective emphasis, clamped so nothing explodes when very close to the camera
  return Math.max(0.2, Math.min(6, base * Math.min(2.2, Math.max(0.35, p.scale))));
}

/**
 * Real star colour from the colour index B−V, as an approximate sRGB hex. This is a well-known
 * empirical relation (bluer = smaller/negative B−V, redder = larger); it is a visual encoding of a
 * measured value, not a fabricated one. Objects with no B−V get a neutral near-white.
 */
export function bvToColor(bv: number | undefined): string {
  if (typeof bv !== "number" || !Number.isFinite(bv)) return "#eaf0ff";
  const t = Math.max(-0.4, Math.min(2.0, bv));
  // piecewise approximation of blackbody colour across the stellar B−V range
  let r: number, g: number, b: number;
  if (t < 0.0) { r = 0.61 + 0.11 * (t + 0.4) / 0.4; g = 0.70 + 0.18 * (t + 0.4) / 0.4; b = 1.0; }
  else if (t < 0.4) { r = 0.72 + 0.28 * (t / 0.4); g = 0.85 + 0.10 * (t / 0.4); b = 1.0 - 0.10 * (t / 0.4); }
  else if (t < 1.0) { r = 1.0; g = 0.95 - 0.30 * ((t - 0.4) / 0.6); b = 0.90 - 0.45 * ((t - 0.4) / 0.6); }
  else { r = 1.0; g = 0.65 - 0.35 * ((t - 1.0) / 1.0); b = 0.45 - 0.30 * ((t - 1.0) / 1.0); }
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** A sensible default orbit camera for a scene whose points span roughly `span` units from the origin. */
export function defaultCamera(span: number): Camera {
  return { yaw: 0.6, pitch: 0.5, distance: Math.max(1, span) * 2.2, fov: 55 * DEG };
}

/** A straight connector between two real 3D points (constellation line, orbit chord, scale rung). */
export interface Segment3D {
  a: Point3D;
  b: Point3D;
  kind?: string;
}

/** A reference ring of the given radius on the scene's reference plane (z = 0): an orbit or a shell. */
export interface Ring3D {
  radius: number;
  label?: string;
}

/**
 * A complete real-data scene: points at their measured positions, optional connectors, optional
 * reference rings, a camera, and the unit the coordinates are in. `coverageNote` states honestly what
 * the geometry means (true distances vs. the direction-only celestial sphere vs. a schematic layout).
 */
export interface Scene3D {
  points: Point3D[];
  segments?: Segment3D[];
  rings?: Ring3D[];
  camera: Camera;
  unit: string;
  coverageNote?: string;
}

/** Sample a reference ring (radius on the z = 0 plane) into a projected screen-space polyline. */
export function projectRing(ring: Ring3D, cam: Camera, width: number, height: number, steps = 96): { d: string; label?: { x: number; y: number } } {
  const pts: { x: number; y: number; visible: boolean }[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const p = projectPerspective({ id: "", name: "", x: ring.radius * Math.cos(a), y: 0, z: ring.radius * Math.sin(a) }, cam, width, height);
    pts.push({ x: p.sx, y: p.sy, visible: p.visible });
  }
  let d = "";
  pts.forEach((p, i) => {
    if (!p.visible) return;
    d += `${d && pts[i - 1]?.visible ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  });
  // label at the ring's +x edge
  const edge = projectPerspective({ id: "", name: "", x: ring.radius, y: 0, z: 0 }, cam, width, height);
  return { d: d.trim(), label: ring.label && edge.visible ? { x: edge.sx, y: edge.sy } : undefined };
}
