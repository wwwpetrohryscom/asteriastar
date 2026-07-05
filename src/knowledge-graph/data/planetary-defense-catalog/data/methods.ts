import type { DefenseRecord } from "@/knowledge-graph/data/planetary-defense-catalog/types";

/** Deflection methods and concepts. Each carries an honest maturity and is associated_with the
 *  REUSED missions and objects it involves. */
const me = (maturity: DefenseRecord["maturity"]) => (r: Omit<DefenseRecord, "kind" | "id" | "maturity" | "sources"> & { slug: string; sources?: DefenseRecord["sources"] }): DefenseRecord => ({ sources: ["nasa"], ...r, kind: "method", id: `deflection_method:${r.slug}`, maturity });

export const methods: DefenseRecord[] = [
  me("demonstrated")({ slug: "kinetic-impactor", name: "Kinetic Impactor", relatedKeys: ["space_mission:dart", "space_mission:hera"], description: "Crashing a spacecraft into an asteroid at high speed to nudge its orbit — and getting an extra push from the plume of debris thrown off. NASA's DART did exactly this to the moonlet Dimorphos in 2022, measurably shortening its orbit; ESA's Hera is now studying the result.", sources: ["nasa"], highlights: ["Demonstrated by DART on Dimorphos in 2022"] }),
  me("concept")({ slug: "gravity-tractor", name: "Gravity Tractor", relatedKeys: ["asteroid:bennu"], description: "A spacecraft that hovers near an asteroid for years, its own tiny gravity slowly towing the asteroid onto a new path. Very slow, but precise and controllable — best used with decades of warning, and often after a kinetic impact to fine-tune the result.", sources: ["nasa"] }),
  me("concept")({ slug: "ion-beam-deflection", name: "Ion-Beam Deflection", altNames: ["Ion beam shepherd"], description: "A spacecraft that points a stream of ions at an asteroid, the gentle continuous thrust pushing it aside over a long time — a slow, controllable method related to the gravity tractor, still at the concept stage.", sources: ["nasa"] }),
  me("theoretical")({ slug: "nuclear-deflection", name: "Nuclear Deflection", relatedKeys: ["space_mission:dart"], description: "Detonating a nuclear device near an asteroid — not to blow it apart, but to vaporise a layer of its surface, the escaping material shoving it onto a new course. Studied only as a last resort for the largest objects or the shortest warning times; it has never been tested and remains theoretical.", sources: ["nasa"], highlights: ["A theoretical last resort — never tested"] }),
];
