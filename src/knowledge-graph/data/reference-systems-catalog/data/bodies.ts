import { cf, type CfRecord } from "@/knowledge-graph/data/reference-systems-catalog/types";

/**
 * The two defining bodies of astronomical reference systems, added as `organization` anchors — both were
 * previously only source keys, never linkable entities. CF's frames, coordinate systems, and time scales
 * are defined and maintained by these two organisations.
 */
export const bodies: CfRecord[] = [
  cf("body", {
    slug: "iau",
    name: "International Astronomical Union (IAU)",
    altNames: ["IAU"],
    description:
      "The international body, founded in 1919, that is the recognised authority for astronomical nomenclature and standards — it defines constellation boundaries, names celestial bodies and their features, and adopts the reference systems and constants used throughout astronomy, including the International Celestial Reference System.",
    relatedKeys: ["reference_frame:icrs", "coordinate_system:equatorial-coordinate-system", "organization:iers"],
    highlights: ["The authority for astronomical names, boundaries, and reference systems"],
  }),
  cf("body", {
    slug: "iers",
    name: "International Earth Rotation and Reference Systems Service (IERS)",
    altNames: ["IERS"],
    description:
      "The service that maintains the international celestial and terrestrial reference frames and the parameters linking them — the Earth orientation parameters. The IERS monitors the Earth's rotation and axis, publishes UT1−UTC and polar motion, and announces the leap seconds that keep civil time aligned with the turning Earth.",
    relatedKeys: ["reference_frame:icrf3", "astrometric_effect:earth-orientation-parameters", "time_standard:leap-second", "time_standard:ut1"],
    highlights: ["Keeper of the reference frames, Earth orientation, and leap seconds"],
  }),
];
