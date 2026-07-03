import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * TRAJECTORY CLASSES — the orbital-trajectory categories defined by eccentricity, from
 * bound elliptical orbits through the parabolic boundary to the strongly hyperbolic
 * trajectories of interstellar objects. They form an "eccentricity ladder" (each class
 * relates to the next), which is what makes the interstellar case legible: an object is
 * interstellar not merely because e > 1, but because e is large enough — with a
 * measurable excess velocity — that a Solar-System origin is excluded. Pure orbital
 * mechanics; nothing is fabricated.
 */

const mk = (r: Omit<InterstellarRecord, "kind" | "id"> & { slug: string }): InterstellarRecord => ({
  ...r,
  kind: "trajectory-class",
  id: `trajectory_class:${r.slug}`,
  category: r.category ?? "trajectory",
});

export const trajectoryClasses: InterstellarRecord[] = [
  mk({
    slug: "bound-orbit",
    name: "Bound (Elliptical) Orbit",
    altNames: ["Elliptical orbit", "Closed orbit"],
    description:
      "An orbit with eccentricity below 1: the object is gravitationally bound to the Sun and returns. Planets, asteroids, and periodic comets all follow bound elliptical orbits. A bound orbit is the baseline against which unbound, hyperbolic trajectories are recognised.",
    eccentricityRangeLabel: "e < 1",
    definition: "Eccentricity below 1 — a closed, repeating orbit; the object is bound to the Sun.",
    relatedClassSlugs: ["near-parabolic"],
    sources: ["jpl", "nasa"],
  }),
  mk({
    slug: "near-parabolic",
    name: "Near-Parabolic Orbit",
    altNames: ["Parabolic orbit"],
    description:
      "An orbit with eccentricity very close to 1 — the boundary between bound and unbound. Long-period comets falling in from the Oort cloud on their first passage follow near-parabolic orbits. A near-parabolic orbit signals a distant Solar-System origin, not an interstellar one.",
    eccentricityRangeLabel: "e ≈ 1",
    definition: "Eccentricity near 1 — right at the escape boundary; typical of first-time Oort-cloud comets.",
    relatedClassSlugs: ["hyperbolic-ejection"],
    sources: ["jpl", "nasa"],
  }),
  mk({
    slug: "hyperbolic-ejection",
    name: "Hyperbolic Orbit (Solar-System Origin)",
    altNames: ["Weakly hyperbolic orbit"],
    description:
      "An orbit with eccentricity just above 1, produced when a Solar-System comet is perturbed by a planet (usually Jupiter) onto an escape trajectory. The object is leaving the Solar System, but it formed here — the small excess over e = 1 is a slingshot effect, not evidence of an interstellar origin.",
    eccentricityRangeLabel: "e ≳ 1",
    definition: "Eccentricity slightly above 1 from planetary perturbation — an ejected Solar-System body.",
    relatedClassSlugs: ["interstellar-hyperbolic"],
    sources: ["jpl", "nasa"],
  }),
  mk({
    slug: "interstellar-hyperbolic",
    name: "Interstellar Hyperbolic Trajectory",
    altNames: ["Strongly hyperbolic trajectory"],
    description:
      "A strongly hyperbolic trajectory — eccentricity well above 1 with a large excess velocity relative to the Sun — that cannot be produced by planetary perturbations. This is the signature of an interstellar object: a body that entered the Solar System already unbound, from another star system, and will leave on the same path. 1I/ʻOumuamua, 2I/Borisov, and 3I/ATLAS all follow such trajectories.",
    eccentricityRangeLabel: "e ≫ 1",
    definition: "Eccentricity well above 1 with excess velocity — an unbound, interstellar trajectory.",
    sources: ["jpl", "nasa", "ads"],
  }),
];
