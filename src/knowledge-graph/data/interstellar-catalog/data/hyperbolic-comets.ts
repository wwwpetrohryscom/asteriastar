import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * HYPERBOLIC (and near-parabolic) SOLAR-SYSTEM COMETS — long-period comets whose
 * osculating orbits are marginally hyperbolic or near-parabolic. Crucially, these
 * originate in the Solar System (mostly the Oort cloud): a small eccentricity above 1
 * here comes from planetary perturbations, not from an interstellar origin. They are
 * grouped and labelled separately from the confirmed interstellar objects so the two are
 * never confused. Eccentricities are stated only where a value above 1 is well
 * established (C/1980 E1); otherwise the orbit is described as near-parabolic without a
 * fabricated figure.
 */

const mk = (r: Omit<InterstellarRecord, "kind" | "id"> & { slug: string }): InterstellarRecord => ({
  ...r,
  kind: "hyperbolic-comet",
  id: `hyperbolic_comet:${r.slug}`,
  status: r.status ?? "hyperbolic_solar_system_object",
  category: r.category ?? "hyperbolic-comet",
});

export const hyperbolicComets: InterstellarRecord[] = [
  mk({
    slug: "bowell",
    name: "C/1980 E1 (Bowell)",
    altNames: ["C/1980 E1", "Comet Bowell"],
    designation: "C/1980 E1 (Bowell)",
    description:
      "A long-period comet that a close encounter with Jupiter in 1980 flung onto a clearly hyperbolic orbit (eccentricity about 1.06). It is now leaving the Solar System, but — unlike a true interstellar object — it formed here; the hyperbolic orbit is the result of a planetary slingshot, not an origin around another star.",
    discoveredBy: "Edward Bowell",
    discoveryDate: "1980-02-11",
    eccentricity: 1.057,
    perihelionAu: 3.36,
    inclinationDeg: 1.66,
    perihelionDate: "1982-03-12",
    trajectoryLabel: "Weakly hyperbolic (e ≈ 1.06) after a Jupiter encounter",
    originLabel: "A Solar-System comet perturbed onto an escape trajectory — not interstellar",
    trajectoryClassSlug: "hyperbolic-ejection",
    cometClassKeys: ["comet_class:long-period"],
    cataloguedByKeys: ["organization:minor-planet-center"],
    sources: ["mpc", "jpl", "nasa"],
    highlights: ["A Solar-System comet made hyperbolic by Jupiter", "Eccentricity ≈ 1.06 — leaving the Solar System"],
  }),
  mk({
    slug: "linear-1999-s4",
    name: "C/1999 S4 (LINEAR)",
    altNames: ["C/1999 S4", "Comet LINEAR"],
    designation: "C/1999 S4 (LINEAR)",
    description:
      "A near-parabolic long-period comet from the Oort cloud, famous for disintegrating completely near perihelion in July 2000 — one of the best-observed comet break-ups. Its orbit was close to the parabolic boundary (eccentricity near 1), the hallmark of a first-time visitor from the distant Solar System, not from interstellar space.",
    discoveredBy: "LINEAR survey",
    discoveryDate: "1999-09-27",
    perihelionAu: 0.765,
    perihelionDate: "2000-07-26",
    trajectoryLabel: "Near-parabolic (e ≈ 1) — a long-period comet",
    activityLabel: "Disintegrated near perihelion in July 2000",
    originLabel: "A long-period comet from the Oort cloud — not interstellar",
    trajectoryClassSlug: "near-parabolic",
    cometClassKeys: ["comet_class:long-period"],
    cataloguedByKeys: ["organization:minor-planet-center"],
    sources: ["mpc", "jpl", "nasa"],
    highlights: ["A near-parabolic Oort-cloud comet", "Disintegrated at perihelion in 2000"],
  }),
  mk({
    slug: "boattini",
    name: "C/2007 W1 (Boattini)",
    altNames: ["C/2007 W1", "Comet Boattini"],
    designation: "C/2007 W1 (Boattini)",
    description:
      "A long-period comet discovered by Andrea Boattini through the Mount Lemmon Survey, on a near-parabolic orbit with an eccentricity extremely close to 1. Like the other long-period comets here it is a distant Solar-System visitor, not an interstellar object: its original orbit is bound and it is not being ejected from the Solar System — the tiny excess over a parabola is an epoch-dependent, perturbed value.",
    discoveredBy: "Andrea Boattini (Mount Lemmon Survey)",
    discoveryDate: "2007-11-20",
    perihelionAu: 0.85,
    perihelionDate: "2008-06-24",
    trajectoryLabel: "Near-parabolic (e ≈ 1) — a long-period comet",
    originLabel: "A Solar-System long-period comet — not interstellar",
    trajectoryClassSlug: "near-parabolic",
    surveyKeys: ["sky_survey:catalina-sky-survey"],
    cometClassKeys: ["comet_class:long-period"],
    cataloguedByKeys: ["organization:minor-planet-center"],
    sources: ["mpc", "jpl", "nasa"],
    highlights: ["A near-parabolic long-period comet", "Found through the Catalina/Mount Lemmon Survey"],
  }),
  mk({
    slug: "panstarrs-k2",
    name: "C/2017 K2 (PANSTARRS)",
    altNames: ["C/2017 K2", "Comet PANSTARRS K2"],
    designation: "C/2017 K2 (PANSTARRS)",
    description:
      "A dynamically new, near-parabolic long-period comet discovered by Pan-STARRS in 2017 and notable for showing activity at a record distance — a coma was detected beyond Saturn's orbit, on the comet's first passage in from the Oort cloud. Its near-parabolic orbit marks it as a distant Solar-System visitor, not an interstellar object.",
    discoveredBy: "Pan-STARRS",
    discoveryDate: "2017-05-21",
    perihelionAu: 1.8,
    perihelionDate: "2022-12-19",
    trajectoryLabel: "Near-parabolic (e ≈ 1) — a dynamically new comet",
    activityLabel: "Active at record distance — a coma was seen beyond Saturn's orbit",
    originLabel: "A dynamically new comet from the Oort cloud — not interstellar",
    trajectoryClassSlug: "near-parabolic",
    surveyKeys: ["sky_survey:pan-starrs"],
    cometClassKeys: ["comet_class:long-period"],
    cataloguedByKeys: ["organization:minor-planet-center"],
    sources: ["mpc", "jpl", "nasa"],
    highlights: ["A near-parabolic Oort-cloud comet", "Active beyond Saturn — first inbound passage"],
  }),
];
