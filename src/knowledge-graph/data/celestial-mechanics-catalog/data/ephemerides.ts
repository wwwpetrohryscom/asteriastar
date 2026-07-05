import type { MechanicsRecord } from "@/knowledge-graph/data/celestial-mechanics-catalog/types";

/** Ephemeris systems — the software and data that give the positions of Solar System bodies. Each
 *  links to the REUSED JPL organisation and the n-body-dynamics concept, and to the sibling systems. */
const eph = (r: Omit<MechanicsRecord, "kind" | "id" | "sources"> & { slug: string; sources?: MechanicsRecord["sources"] }): MechanicsRecord => ({ sources: ["jpl"], ...r, kind: "ephemeris", id: `ephemeris_system:${r.slug}` });

export const ephemerides: MechanicsRecord[] = [
  eph({ slug: "jpl-development-ephemeris", name: "JPL Development Ephemeris", altNames: ["JPL DE"], relatedKeys: ["organization:jpl", "orbital_mechanics_concept:n-body-dynamics"], description: "The series of numerically-integrated ephemerides, produced by NASA's Jet Propulsion Laboratory, that give the positions and velocities of the planets, the Moon, and the Sun to high precision over long spans. The DE ephemerides are the standard reference for precise Solar System calculations.", sources: ["jpl"], highlights: ["The standard positions of the planets and Moon"] }),
  eph({ slug: "spice-toolkit", name: "The SPICE Toolkit", altNames: ["SPICE"], relatedKeys: ["organization:jpl", "ephemeris_system:jpl-development-ephemeris"], description: "NASA's information system and software toolkit for computing the geometry of spacecraft and Solar System bodies — where a spacecraft is, where it is pointing, and what it can see. Its shared data files (kernels) are a de facto standard across planetary missions.", sources: ["jpl"] }),
  eph({ slug: "jpl-horizons", name: "JPL Horizons", altNames: ["Horizons"], relatedKeys: ["organization:jpl", "ephemeris_system:jpl-development-ephemeris"], description: "JPL's online ephemeris service, which generates highly accurate positions, distances, and other quantities for Solar System bodies and spacecraft, for any observer and time. It is the go-to tool for planning observations and checking where a body will be.", sources: ["jpl"] }),
];
