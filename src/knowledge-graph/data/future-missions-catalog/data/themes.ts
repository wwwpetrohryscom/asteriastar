import type { ConceptRecord } from "@/knowledge-graph/data/future-missions-catalog/types";

/** The themes of future exploration — the groups the mission concepts belong to. */
const theme = (r: Omit<ConceptRecord, "kind" | "id"> & { slug: string }): ConceptRecord => ({ ...r, kind: "theme", id: `exploration_theme:${r.slug}` });

export const themes: ConceptRecord[] = [
  theme({ slug: "lunar-exploration", name: "Lunar Exploration", description: "The return of humans to the Moon and the build-out of a sustained presence — the Artemis crewed missions and the Gateway station in lunar orbit.", definition: "Future human and robotic exploration of the Moon.", sources: ["nasa"] }),
  theme({ slug: "mars-exploration", name: "Mars Exploration", description: "The next steps at Mars — returning the samples now being cached by Perseverance, studying the moons of Mars, and preparing for human missions.", definition: "Future exploration of Mars and its moons.", sources: ["nasa"] }),
  theme({ slug: "venus-exploration", name: "Venus Exploration", description: "A renaissance at Venus — a fleet of new missions to map its surface, sound its atmosphere, and understand why Earth's twin became a hell-world.", definition: "The new wave of missions to Venus.", sources: ["nasa", "esa"] }),
  theme({ slug: "ocean-worlds", name: "Ocean Worlds", description: "The search for habitable environments in the outer Solar System — the subsurface oceans of Europa and the seas and organic chemistry of Titan.", definition: "Missions to the icy ocean-bearing moons.", sources: ["nasa"] }),
  theme({ slug: "small-bodies-and-planetary-defense", name: "Small Bodies & Planetary Defense", description: "Future missions to asteroids and comets — for science and for planetary defence, including surveys to find the hazardous near-Earth objects before they find us.", definition: "Future asteroid, comet, and planetary-defence missions.", sources: ["nasa"] }),
  theme({ slug: "astrophysics-observatories", name: "Astrophysics Observatories", description: "The great observatories of the coming decades — surveying dark energy, imaging habitable worlds, and opening the low-frequency gravitational-wave and X-ray skies.", definition: "The next generation of space observatories.", sources: ["nasa", "esa"] }),
  theme({ slug: "outer-solar-system", name: "Outer Solar System", description: "Reaching the least-explored worlds — an orbiter for an ice giant, and a probe designed to travel deliberately beyond the heliosphere into interstellar space.", definition: "Missions to the ice giants and beyond.", sources: ["nasa"] }),
];
