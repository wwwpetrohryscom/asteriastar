import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * The four top-level meteorite classes. Each is connected by the groups that are
 * part_of it (and, for the iron class, directly by its member meteorites).
 */
type K = { slug: string; name: string; definition: string; sources?: SourceKey[]; description: string };
const mk = (k: K): MeteoriteRecord => ({
  id: `meteorite_class:${k.slug}`,
  slug: k.slug,
  name: k.name,
  kind: "class",
  description: k.description,
  sources: k.sources ?? ["nasa"],
  definition: k.definition,
});

export const classes: MeteoriteRecord[] = [
  mk({ slug: "chondrite", name: "Chondrites", definition: "Undifferentiated stony meteorites containing chondrules — millimetre-sized spheres of once-molten silicate.", description: "The most common meteorites: primitive, undifferentiated stony rocks that preserve material from the birth of the Solar System, subdivided into carbonaceous, ordinary, and enstatite groups." }),
  mk({ slug: "achondrite", name: "Achondrites", definition: "Differentiated stony meteorites lacking chondrules, formed from melted and re-crystallised rock.", description: "Stony meteorites from bodies that melted and differentiated — including basalts from the asteroid Vesta and rocks blasted off Mars and the Moon." }),
  mk({ slug: "iron", name: "Iron Meteorites", definition: "Meteorites made largely of nickel-iron metal, from the cores of differentiated asteroids.", description: "Dense meteorites of nickel-iron alloy, thought to be fragments of the metallic cores of asteroids that were shattered by collisions — the source of the largest meteorites found on Earth." }),
  mk({ slug: "stony-iron", name: "Stony-Iron Meteorites", definition: "Meteorites containing roughly equal parts silicate and nickel-iron metal.", description: "Rare meteorites blending rock and metal in roughly equal measure — the pallasites (olivine in metal) and mesosiderites (breccias of metal and silicate)." }),
];
