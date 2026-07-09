import { cf, type CfRecord } from "@/knowledge-graph/data/reference-systems-catalog/types";

/**
 * The reference frames and the time representation that were missing, added into the existing
 * `reference_frame` and `time_standard` types (ICRS/BCRS/GCRS/J2000/B1950/the-ecliptic and
 * TAI/UTC/UT1/TT/TDB/GPS/sidereal/leap-second already exist and are reused, not duplicated).
 */
export const frames: CfRecord[] = [
  cf("frame", {
    slug: "icrf3",
    name: "The International Celestial Reference Frame (ICRF3)",
    altNames: ["ICRF", "ICRF3"],
    description:
      "The practical realisation of the International Celestial Reference System — a catalogue of precise positions for several thousand extragalactic radio sources, mostly quasars, measured by very-long-baseline interferometry. Its third realisation, ICRF3, was adopted in 2018; because quasars are effectively fixed, it provides the quasi-inertial grid to which optical frames such as Gaia's are aligned.",
    relatedKeys: ["reference_frame:icrs", "space_telescope:gaia", "organization:iers", "astronomy_method:space-astrometry"],
    highlights: ["Quasar positions by VLBI — the fixed grid behind ICRS"],
  }),
  cf("frame", {
    slug: "fk5",
    name: "The Fifth Fundamental Catalogue (FK5)",
    altNames: ["FK5"],
    description:
      "A fundamental reference frame published in 1988, giving precise positions and proper motions for 1,535 bright stars on the equinox and epoch J2000. FK5 was the optical standard of its era, but it rested on a limited number of stars; it was superseded when the ICRS, realised by Hipparcos and later Gaia, replaced star-based frames with an extragalactic one.",
    relatedKeys: ["reference_frame:icrs", "reference_frame:fk4", "reference_frame:j2000", "catalog:hipparcos-catalogue"],
    highlights: ["The J2000 bright-star standard, superseded by ICRS"],
  }),
  cf("frame", {
    slug: "fk4",
    name: "The Fourth Fundamental Catalogue (FK4)",
    altNames: ["FK4"],
    description:
      "The predecessor of FK5, a fundamental star frame referred to the equinox and epoch B1950. Positions given in the FK4 (B1950) system must be precessed and rotated to be compared with modern J2000/ICRS coordinates — a common source of small errors when working with older catalogues and charts.",
    relatedKeys: ["reference_frame:fk5", "reference_frame:b1950"],
    highlights: ["The B1950 bright-star frame that FK5 replaced"],
  }),
  cf("timescale", {
    slug: "julian-date",
    name: "Julian Date",
    symbolLabel: "JD",
    altNames: ["JD"],
    description:
      "A continuous count of days (and fractions) since noon Universal Time on 1 January 4713 BC in the proleptic Julian calendar, used throughout astronomy to timestamp observations without the awkwardness of calendar months and leap years. The Modified Julian Date (MJD = JD − 2400000.5) shifts the origin to a recent midnight for convenience.",
    relatedKeys: ["time_standard:terrestrial-time", "time_standard:utc", "reference_frame:j2000"],
    highlights: ["A single running day-count for timestamping observations"],
  }),
];
