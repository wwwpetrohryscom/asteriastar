import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Meteorite groups within the classes. Each is part_of its class, and the achondrite
 * groups whose parent body is known link to it via parent_body — reusing the asteroid
 * Vesta (Program Y), Mars, and the Moon, never duplicating them.
 */
type G = { slug: string; name: string; klass: string; parentBody?: string[]; definition: string; sources?: SourceKey[]; description: string };
const mk = (g: G): MeteoriteRecord => ({
  id: `meteorite_group:${g.slug}`,
  slug: g.slug,
  name: g.name,
  kind: "group",
  description: g.description,
  sources: g.sources ?? ["nasa"],
  partOfClassSlug: g.klass,
  parentBodyKeys: g.parentBody,
  definition: g.definition,
});

export const groups: MeteoriteRecord[] = [
  mk({ slug: "carbonaceous-chondrite", name: "Carbonaceous Chondrites", klass: "chondrite", definition: "The most primitive chondrites, rich in carbon, water, and organic compounds.", description: "Dark, primitive chondrites carrying carbon, water-bearing minerals, and complex organics — the closest samples we have to the raw ingredients of the Solar System, and to what asteroids like Bennu and Ryugu are made of." }),
  mk({ slug: "ordinary-chondrite", name: "Ordinary Chondrites", klass: "chondrite", definition: "The most abundant chondrites (H, L, and LL types), from stony asteroids.", description: "By far the most common meteorites to fall, these stony chondrites come from ordinary silicate asteroids in the inner belt." }),
  mk({ slug: "enstatite-chondrite", name: "Enstatite Chondrites", klass: "chondrite", definition: "Highly reduced chondrites (E-type) rich in the mineral enstatite, formed in oxygen-poor conditions.", description: "Rare, chemically reduced chondrites that formed in the innermost, oxygen-starved region of the solar nebula — a possible source of much of Earth's own building material." }),
  mk({ slug: "hed", name: "HED Meteorites", klass: "achondrite", parentBody: ["asteroid:vesta"], definition: "Howardites, eucrites, and diogenites — basaltic achondrites from the asteroid Vesta.", description: "The howardite–eucrite–diogenite clan of basaltic achondrites, whose spectra match the asteroid Vesta so closely that they are considered pieces of its crust, delivered to Earth after impacts." }),
  mk({ slug: "martian", name: "Martian Meteorites", klass: "achondrite", parentBody: ["planet:mars"], definition: "Igneous rocks blasted off Mars by impacts, identified by trapped gas matching the Martian atmosphere.", description: "Rocks ejected from Mars by large impacts and later swept up by Earth — identified by trapped gases matching the composition measured in the Martian atmosphere by landers." }),
  mk({ slug: "lunar", name: "Lunar Meteorites", klass: "achondrite", parentBody: ["moon:the-moon"], definition: "Rocks blasted off the Moon by impacts, matched to Apollo samples.", description: "Pieces of the Moon flung to Earth by impacts, whose mineralogy matches the samples returned by the Apollo and Luna missions — a free supply of lunar rock from unsampled regions." }),
  mk({ slug: "pallasite", name: "Pallasites", klass: "stony-iron", definition: "Stony-irons of olivine crystals embedded in a nickel-iron matrix.", description: "The most striking meteorites, in which gem-quality green olivine crystals are suspended in a lattice of nickel-iron — probably formed at the core–mantle boundary of a shattered asteroid." }),
  mk({ slug: "mesosiderite", name: "Mesosiderites", klass: "stony-iron", definition: "Stony-irons that are breccias of silicate and metal fragments.", description: "Chaotic stony-iron breccias mixing crustal silicates with metallic core material — thought to record the catastrophic disruption and re-assembly of a differentiated asteroid." }),
];
