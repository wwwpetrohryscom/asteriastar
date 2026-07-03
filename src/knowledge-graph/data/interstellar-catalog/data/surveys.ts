import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * DETECTION SURVEYS & CATALOGUING BODIES that are NEW to the graph. Pan-STARRS, LSST /
 * the Vera C. Rubin Observatory, and NASA/JPL already exist and are REUSED (referenced
 * by id, never duplicated). The four records here — the ATLAS and Catalina sky surveys,
 * the IAU Minor Planet Center, and NASA CNEOS — did not yet exist, so they are created
 * as entities of the existing `sky_survey` / `organization` types WITHOUT a hub page:
 * they resolve to the standalone graph-entity pages under /explore and appear in the
 * Interstellar Object Surveys hub. They are the targets of surveyed_by / catalogued_in /
 * associated_with edges from the objects above.
 */

const survey = (r: Omit<InterstellarRecord, "kind" | "id"> & { slug: string }): InterstellarRecord => ({
  ...r,
  kind: "survey",
  id: `sky_survey:${r.slug}`,
});
const org = (r: Omit<InterstellarRecord, "kind" | "id"> & { slug: string }): InterstellarRecord => ({
  ...r,
  kind: "organization",
  id: `organization:${r.slug}`,
});

export const surveys: InterstellarRecord[] = [
  survey({
    slug: "atlas",
    name: "ATLAS",
    altNames: ["Asteroid Terrestrial-impact Last Alert System"],
    description:
      "The Asteroid Terrestrial-impact Last Alert System — a NASA-funded network of small survey telescopes, operated by the University of Hawaiʻi, that scans the whole visible sky nightly for moving objects and impact hazards. Its Chilean telescope discovered the third interstellar object, 3I/ATLAS, in 2025.",
    sources: ["nasa", "jpl"],
  }),
  survey({
    slug: "catalina-sky-survey",
    name: "Catalina Sky Survey",
    altNames: ["CSS", "Mount Lemmon Survey"],
    description:
      "A NASA-funded near-Earth-object survey based at the University of Arizona, using telescopes on Mount Lemmon and Mount Bigelow. It is a prolific discoverer of comets and near-Earth asteroids, including the hyperbolic long-period comet C/2007 W1 (Boattini).",
    sources: ["nasa", "jpl"],
  }),
  org({
    slug: "minor-planet-center",
    name: "Minor Planet Center",
    altNames: ["MPC", "IAU Minor Planet Center"],
    description:
      "The International Astronomical Union's clearinghouse for the astrometry, orbits, and designations of small Solar-System bodies — and of interstellar objects, to which it assigns the special \"I\" (interstellar) designations such as 1I, 2I, and 3I. It is operated under the auspices of the IAU.",
    sources: ["iau", "mpc"],
  }),
  org({
    slug: "cneos",
    name: "CNEOS",
    altNames: ["Center for Near-Earth Object Studies"],
    description:
      "NASA's Center for Near-Earth Object Studies, at the Jet Propulsion Laboratory, which computes near-Earth-object orbits and impact risk and maintains the public fireball database. Its reported velocity for the 2014-01-08 bolide is the basis of a debated — and unconfirmed — claim of an interstellar meteor.",
    sources: ["nasa", "jpl"],
  }),
];
