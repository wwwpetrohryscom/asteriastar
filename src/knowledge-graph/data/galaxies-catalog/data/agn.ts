import type { ExtragalacticRecord } from "@/knowledge-graph/data/galaxies-catalog/types";

/** Types of active galactic nucleus. Each is associated_with the REUSED AGN, quasar, blazar,
 *  and supermassive-black-hole object classes, and example galaxies. */
const agn = (r: Omit<ExtragalacticRecord, "kind" | "id" | "sources"> & { slug: string; sources?: ExtragalacticRecord["sources"] }): ExtragalacticRecord => ({ sources: ["nasa"], ...r, kind: "agn", id: `agn_type:${r.slug}` });
const AGN = "astrophysical_object_class:active-galactic-nucleus";
const SMBH = "astrophysical_object_class:supermassive-black-hole";

export const agnTypes: ExtragalacticRecord[] = [
  agn({ slug: "seyfert-galaxy", name: "Seyfert Galaxy", relatedKeys: [AGN, SMBH], description: "A spiral galaxy with a bright, compact active nucleus whose spectrum shows broad or narrow emission lines from gas swirling near the central black hole — a relatively low-luminosity active galactic nucleus in an otherwise normal-looking galaxy.", sources: ["nasa"], highlights: ["Active nuclei in ordinary-looking spirals"] }),
  agn({ slug: "liner", name: "LINER", altNames: ["Low-Ionization Nuclear Emission-line Region"], relatedKeys: [AGN], description: "A galactic nucleus whose spectrum is dominated by emission from weakly-ionized gas. LINERs are the most common type of active nucleus, though whether they are all powered by a black hole or partly by hot old stars is still debated.", sources: ["nasa"] }),
  agn({ slug: "radio-galaxy", name: "Radio Galaxy", relatedKeys: [AGN, SMBH, "galaxy:ngc-5128"], description: "A galaxy — usually a giant elliptical — that pours enormous energy into twin jets and lobes of radio-emitting plasma, launched by its central black hole and reaching far beyond the visible galaxy. Centaurus A is the nearest.", sources: ["nasa"], highlights: ["Jets and lobes larger than the galaxy itself"] }),
  agn({ slug: "bl-lac-object", name: "BL Lac Object", altNames: ["BL Lacertae object"], relatedKeys: ["astrophysical_object_class:blazar", AGN], description: "A blazar seen looking almost straight down its jet, so its light is dominated by the rapidly-variable, featureless glow of the jet itself rather than by emission lines — one of the most extreme, fast-varying kinds of active nucleus.", sources: ["nasa"] }),
  agn({ slug: "unified-agn-model", name: "The Unified AGN Model", relatedKeys: [AGN, "astrophysical_object_class:quasar", "astrophysical_object_class:blazar", SMBH], description: "The idea that the many types of active galactic nucleus — Seyferts, quasars, radio galaxies, blazars — are largely the same underlying object, a supermassive black hole accreting through a disk and torus, seen from different angles and at different luminosities.", sources: ["nasa"], highlights: ["Many AGN types, one object seen from different angles"] }),
];
