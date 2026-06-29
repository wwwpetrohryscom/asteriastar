import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

/**
 * Notable Solar System small bodies — asteroids and comets. Each is part_of the
 * Solar System (a true, connecting relationship). Well-documented objects only.
 */
export const entities: GraphEntity[] = [
  // Asteroids
  { id: "asteroid:vesta", type: "asteroid", name: "4 Vesta", domain: "science", description: "One of the largest objects in the asteroid belt, visited by NASA's Dawn.", sources: ["nasa", "jpl"] },
  { id: "asteroid:pallas", type: "asteroid", name: "2 Pallas", domain: "science", description: "One of the most massive asteroids in the main belt.", sources: ["jpl"] },
  { id: "asteroid:hygiea", type: "asteroid", name: "10 Hygiea", domain: "science", description: "A large, dark asteroid in the outer main belt.", sources: ["jpl"] },
  { id: "asteroid:bennu", type: "asteroid", name: "101955 Bennu", domain: "science", description: "A near-Earth asteroid sampled by NASA's OSIRIS-REx.", sources: ["nasa", "jpl"] },
  { id: "asteroid:ryugu", type: "asteroid", name: "162173 Ryugu", domain: "science", description: "A near-Earth asteroid sampled by Japan's Hayabusa2.", sources: ["jpl"] },
  { id: "asteroid:eros", type: "asteroid", name: "433 Eros", domain: "science", description: "A near-Earth asteroid orbited by NASA's NEAR Shoemaker.", sources: ["nasa", "jpl"] },
  { id: "asteroid:itokawa", type: "asteroid", name: "25143 Itokawa", domain: "science", description: "A near-Earth asteroid sampled by Japan's Hayabusa.", sources: ["jpl"] },
  { id: "asteroid:psyche", type: "asteroid", name: "16 Psyche", domain: "science", description: "A metal-rich main-belt asteroid and NASA mission target.", sources: ["nasa", "jpl"] },
  { id: "asteroid:apophis", type: "asteroid", name: "99942 Apophis", domain: "science", description: "A near-Earth asteroid studied for its close approaches to Earth.", sources: ["jpl"] },

  // Comets
  { id: "comet:hale-bopp", type: "comet", name: "Comet Hale–Bopp", domain: "science", description: "A long-period comet that was widely visible to the naked eye in 1997.", sources: ["nasa"] },
  { id: "comet:hyakutake", type: "comet", name: "Comet Hyakutake", domain: "science", description: "A comet that passed very close to Earth in 1996.", sources: ["nasa"] },
  { id: "comet:churyumov-gerasimenko", type: "comet", name: "67P/Churyumov–Gerasimenko", domain: "science", description: "A periodic comet orbited and landed on by ESA's Rosetta mission.", sources: ["esa"] },
  { id: "comet:shoemaker-levy-9", type: "comet", name: "Comet Shoemaker–Levy 9", domain: "science", description: "A comet that broke apart and collided with Jupiter in 1994.", sources: ["nasa"] },
];

export const relations: GraphRelation[] = entities.map((e) =>
  rel(e.id, "part_of", "location:solar-system", "confirmed", "science"),
);
