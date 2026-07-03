import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Dynamical minor-planet populations — broad orbital groupings from the main belt
 * out to the scattered disc. Each has at least one modelled member linking to it via
 * member_of_group; where a population is defined by a resonance, it is linked to the
 * corresponding orbital_resonance entity.
 */
type G = { slug: string; name: string; region?: string; definition?: string; resonance?: string; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (g: G): MinorBodyRecord => ({
  id: `minor_planet_group:${g.slug}`,
  slug: g.slug,
  name: g.name,
  kind: "group",
  altNames: g.alt,
  description: g.description,
  sources: g.sources ?? ["nasa", "jpl"],
  regionLabel: g.region,
  definition: g.definition,
  resonanceSlug: g.resonance,
});

export const groups: MinorBodyRecord[] = [
  mk({ slug: "main-belt", name: "Main Asteroid Belt", region: "≈ 2.1–3.3 AU", definition: "The reservoir of most asteroids, orbiting the Sun between Mars and Jupiter.", description: "The main asteroid belt between Mars and Jupiter, home to the great majority of known asteroids — from the dwarf planet Ceres down to countless small bodies." }),
  mk({ slug: "mars-crossers", name: "Mars-Crossing Asteroids", definition: "Asteroids whose orbits cross that of Mars.", description: "Asteroids on orbits that cross the path of Mars, dynamically linked to the inner edge of the main belt." }),
  mk({ slug: "hungaria", name: "Hungaria Group", region: "≈ 1.8–2.0 AU", definition: "A dense cluster of high-inclination asteroids at the inner edge of the main belt.", description: "A distinct group of small, high-inclination asteroids just inside the main belt, named for 434 Hungaria." }),
  mk({ slug: "hilda", name: "Hilda Group", region: "≈ 3.7–4.2 AU", definition: "Outer-belt asteroids in a 3:2 mean-motion resonance with Jupiter.", resonance: "jupiter-3-2", description: "A group of outer-belt asteroids held in a 3:2 orbital resonance with Jupiter, tracing a distinctive triangular pattern over time." }),
  mk({ slug: "centaurs", name: "Centaurs", region: "between Jupiter and Neptune", definition: "Small bodies orbiting among the giant planets, with unstable, comet-like orbits.", description: "Icy small bodies orbiting between Jupiter and Neptune on unstable orbits — transitional objects between the Kuiper Belt and the comets, some of which show cometary activity." }),
  mk({ slug: "kuiper-belt", name: "Kuiper Belt", region: "≈ 30–50 AU", definition: "A broad ring of icy bodies beyond Neptune's orbit.", description: "The broad ring of icy bodies beyond Neptune, home to Pluto and the other classical trans-Neptunian objects." }),
  mk({ slug: "scattered-disc", name: "Scattered Disc", region: "beyond ≈ 30 AU", definition: "Distant icy bodies on highly eccentric, inclined orbits scattered by Neptune.", description: "A sparse population of distant icy bodies on eccentric, inclined orbits, gravitationally scattered outward by Neptune — the likely source of many short-period comets." }),
  mk({ slug: "detached", name: "Detached Objects", definition: "Trans-Neptunian objects whose perihelia are too distant to be controlled by Neptune.", description: "Trans-Neptunian objects on distant orbits detached from Neptune's gravitational influence, such as Sedna — the innermost members may belong to the inner Oort cloud." }),
];
