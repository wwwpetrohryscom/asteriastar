/**
 * Deterministic star & constellation data for the decorative cosmic layers.
 *
 * Everything here is computed from a fixed seed so the server and client render
 * byte-identical markup (no hydration mismatch, no `Math.random()`), and it is
 * pure geometry — original vector art, not any third-party image.
 */

export type Star = { x: number; y: number; r: number; o: number };

/** Small deterministic PRNG (mulberry32) — stable across server/client. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A field of `count` stars over a `w`×`h` viewBox. A few are brighter/larger to
 * give the field depth. Coordinates are rounded so the SVG string is compact.
 */
export function starField(count: number, w = 1000, h = 600, seed = 20260709): Star[] {
  const rand = mulberry32(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const bright = rand() > 0.9;
    stars.push({
      x: Math.round(rand() * w),
      y: Math.round(rand() * h),
      r: bright ? Math.round((0.8 + rand() * 1.4) * 10) / 10 : Math.round((0.3 + rand() * 0.7) * 10) / 10,
      o: bright ? Math.round((0.55 + rand() * 0.4) * 100) / 100 : Math.round((0.22 + rand() * 0.4) * 100) / 100,
    });
  }
  return stars;
}

/**
 * A handful of real constellations as normalised line figures (0..1 in x and y),
 * to be scaled into a background. Stick figures only — the recognisable joins.
 */
export type Constellation = { name: string; stars: [number, number][]; lines: [number, number][] };

export const CONSTELLATIONS: Constellation[] = [
  {
    // Orion — belt, shoulders, feet, sword.
    name: "Orion",
    stars: [
      [0.12, 0.06], // Betelgeuse (shoulder)
      [0.02, 0.02], // Bellatrix (shoulder)
      [0.09, 0.30], // Alnitak (belt)
      [0.07, 0.31], // Alnilam (belt)
      [0.05, 0.32], // Mintaka (belt)
      [0.15, 0.56], // Saiph (foot)
      [0.0, 0.58], // Rigel (foot)
      [0.08, 0.44], // sword
    ],
    lines: [
      [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1], [3, 7],
    ],
  },
  {
    // Ursa Major — the Big Dipper.
    name: "Ursa Major",
    stars: [
      [0.0, 0.1], [0.09, 0.08], [0.17, 0.13], [0.24, 0.11], [0.30, 0.02], [0.33, 0.09], [0.27, 0.16],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    // Cassiopeia — the W.
    name: "Cassiopeia",
    stars: [[0.0, 0.1], [0.07, 0.02], [0.14, 0.11], [0.21, 0.03], [0.28, 0.12]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
];
