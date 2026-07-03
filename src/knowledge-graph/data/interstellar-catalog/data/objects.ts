import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * CONFIRMED interstellar objects — the three bodies (as of this writing) whose strongly
 * hyperbolic orbits unambiguously establish an origin beyond the Solar System, each
 * carrying an IAU "I" (interstellar) designation. Eccentricities, discovery dates and
 * trajectories are curated from the IAU Minor Planet Center and the NASA/JPL Small-Body
 * Database; uncertain physical properties are left qualitative and never invented. No
 * sensational or "artificial-origin" framing is used — the scientific consensus is a
 * natural origin for all three.
 */

const mk = (r: Omit<InterstellarRecord, "kind" | "id"> & { slug: string }): InterstellarRecord => ({
  ...r,
  kind: "object",
  id: `interstellar_object:${r.slug}`,
  status: r.status ?? "confirmed_interstellar",
  category: r.category ?? "confirmed",
});

export const objects: InterstellarRecord[] = [
  mk({
    slug: "oumuamua",
    name: "1I/ʻOumuamua",
    altNames: ["ʻOumuamua", "1I/2017 U1", "A/2017 U1"],
    designation: "1I/ʻOumuamua",
    description:
      "The first confirmed interstellar object, detected in October 2017 on its way out of the Solar System. Its strongly hyperbolic orbit (eccentricity about 1.2) showed it was never bound to the Sun. It displayed no visible coma, is highly elongated, and showed a slight non-gravitational acceleration — features that drew wide attention, though the scientific consensus is that it is a natural body.",
    status: "confirmed_interstellar",
    discoveredBy: "Robert Weryk (Pan-STARRS)",
    discoveryDate: "2017-10-19",
    discoverySurveyLabel: "Pan-STARRS 1, Haleakalā",
    eccentricity: 1.2,
    perihelionAu: 0.256,
    inclinationDeg: 122.7,
    perihelionDate: "2017-09-09",
    velocityLabel: "≈ 26 km/s (velocity relative to the Sun far from perihelion)",
    trajectoryLabel: "Hyperbolic (e ≈ 1.20) — unbound",
    sizeLabel: "Highly elongated; very roughly 100–400 m on its long axis (uncertain)",
    activityLabel: "No visible coma or tail; a small non-gravitational acceleration was measured",
    compositionLabel: "Dry, reddened surface; no gas or dust detected",
    originLabel: "Approached from the general direction of the constellation Lyra; no specific parent star has been identified",
    trajectoryClassSlug: "interstellar-hyperbolic",
    detectionMethodSlugs: ["excess-hyperbolic-velocity", "incoming-trajectory-analysis"],
    surveyKeys: ["sky_survey:pan-starrs"],
    cataloguedByKeys: ["organization:minor-planet-center", "organization:jpl"],
    uncertaintyNote:
      "The unusual shape and slight non-gravitational acceleration prompted speculation about an artificial origin; that speculation is not supported by the evidence, and the scientific consensus is a natural body (an ejected planetesimal or comet-like fragment).",
    sources: ["mpc", "jpl", "nasa", "ads"],
    highlights: [
      "First interstellar object ever detected (2017)",
      "Eccentricity ≈ 1.2 — a clearly hyperbolic, unbound orbit",
      "No cometary coma; highly elongated shape",
    ],
  }),
  mk({
    slug: "borisov",
    name: "2I/Borisov",
    altNames: ["2I/Borisov", "C/2019 Q4 (Borisov)"],
    designation: "2I/Borisov",
    description:
      "The second confirmed interstellar object and the first that was unmistakably a comet, discovered in August 2019 by amateur astronomer Gennadiy Borisov. Its eccentricity of about 3.4 made its interstellar origin certain. Unlike 1I/ʻOumuamua it showed an active dust coma and tail, letting astronomers study the chemistry of a comet formed around another star; it proved unusually rich in carbon monoxide.",
    status: "confirmed_interstellar",
    discoveredBy: "Gennadiy Borisov",
    discoveryDate: "2019-08-30",
    discoverySurveyLabel: "0.65 m telescope, MARGO observatory, Crimea",
    eccentricity: 3.36,
    perihelionAu: 2.0,
    inclinationDeg: 44.05,
    perihelionDate: "2019-12-08",
    velocityLabel: "≈ 32 km/s (velocity relative to the Sun far from perihelion)",
    trajectoryLabel: "Hyperbolic (e ≈ 3.36) — unbound",
    sizeLabel: "Nucleus below ~1 km across; likely a few hundred metres (uncertain)",
    activityLabel: "An active comet — dust coma and tail; a fragment separated in early 2020",
    compositionLabel: "Cometary ices and dust, with an unusually high carbon-monoxide abundance",
    originLabel: "Unbound hyperbolic trajectory; no specific parent star has been identified",
    trajectoryClassSlug: "interstellar-hyperbolic",
    detectionMethodSlugs: ["excess-hyperbolic-velocity", "spectroscopic-composition"],
    cataloguedByKeys: ["organization:minor-planet-center", "organization:jpl"],
    uncertaintyNote:
      "The first interstellar object with clear cometary activity, allowing spectroscopy of material from another planetary system.",
    sources: ["mpc", "jpl", "nasa", "esa", "eso"],
    highlights: [
      "Second interstellar object; first that was clearly a comet (2019)",
      "Eccentricity ≈ 3.4 — strongly hyperbolic",
      "Carbon-monoxide-rich coma — chemistry of a comet from another star",
    ],
  }),
  mk({
    slug: "atlas-3i",
    name: "3I/ATLAS",
    altNames: ["3I/ATLAS", "C/2025 N1 (ATLAS)"],
    designation: "3I/ATLAS",
    description:
      "The third confirmed interstellar object, discovered on 1 July 2025 by the ATLAS survey in Chile. Its orbit is the most strongly hyperbolic of the three found so far, with an eccentricity of roughly 6, and it showed cometary activity as it passed through the inner Solar System in late 2025. Some physical parameters remain preliminary, but its interstellar origin is established by the trajectory.",
    status: "confirmed_interstellar",
    discoveredBy: "ATLAS survey",
    discoveryDate: "2025-07-01",
    discoverySurveyLabel: "ATLAS, Río Hurtado, Chile",
    eccentricity: 6.1,
    perihelionAu: 1.36,
    inclinationDeg: 175,
    perihelionDate: "2025-10-29",
    velocityLabel: "≈ 58 km/s (velocity relative to the Sun far from perihelion)",
    trajectoryLabel: "Hyperbolic (e ≈ 6.1) — the most strongly hyperbolic yet found",
    sizeLabel: "Nucleus uncertain — early estimates span a few hundred metres to a few kilometres",
    activityLabel: "An active comet — a coma was detected soon after discovery",
    compositionLabel: "Cometary; detailed composition still being studied",
    originLabel: "Unbound; the most strongly hyperbolic interstellar object found to date",
    trajectoryClassSlug: "interstellar-hyperbolic",
    detectionMethodSlugs: ["excess-hyperbolic-velocity", "incoming-trajectory-analysis", "spectroscopic-composition"],
    surveyKeys: ["sky_survey:atlas"],
    cataloguedByKeys: ["organization:minor-planet-center", "organization:jpl"],
    uncertaintyNote:
      "Discovered in mid-2025; some physical parameters remain preliminary. The interstellar origin rests on the strongly hyperbolic orbit, not on any claim of artificial origin.",
    sources: ["mpc", "jpl", "nasa"],
    highlights: [
      "Third confirmed interstellar object (2025)",
      "Eccentricity ≈ 6 — the most strongly hyperbolic of the three",
      "Active comet observed through the inner Solar System",
    ],
  }),
];
