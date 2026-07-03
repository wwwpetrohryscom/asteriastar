import type { FamilyRecord } from "@/knowledge-graph/data/constellations-catalog/types";

/**
 * The eight traditional constellation families (after Menzel), which together
 * partition all 88 constellations by mythological/thematic grouping. Membership
 * is derived from each constellation's `family` field in the index, so it can
 * never drift from the constellation records.
 */
export const families: FamilyRecord[] = [
  { slug: "ursa-major", name: "Ursa Major Family", sources: ["britannica"], description: "The circumpolar northern constellations around the Great Bear, including Ursa Minor, Draco, Boötes, Canes Venatici, Coma Berenices, Corona Borealis, Camelopardalis, Lynx, and Leo Minor." },
  { slug: "zodiacal", name: "Zodiacal Family", sources: ["britannica"], description: "The twelve constellations of the zodiac, through which the Sun, Moon, and planets appear to move along the ecliptic." },
  { slug: "perseus", name: "Perseus Family", sources: ["britannica"], description: "The mythological group of the Perseus–Andromeda legend — Cassiopeia, Cepheus, Andromeda, Perseus, Pegasus, Cetus, Auriga, Lacerta, and Triangulum." },
  { slug: "hercules", name: "Hercules Family", sources: ["britannica"], description: "The largest family, centred on Hercules and including the Milky Way constellations Aquila, Lyra, Cygnus, Sagitta, Vulpecula, Ophiuchus, Serpens, Scutum, Hydra, Corvus, Crater, Sextans, Centaurus, Lupus, Corona Australis, Ara, Triangulum Australe, and Crux." },
  { slug: "orion", name: "Orion Family", sources: ["britannica"], description: "The bright winter constellations around the Hunter — Orion, Canis Major, Canis Minor, Lepus, and Monoceros." },
  { slug: "heavenly-waters", name: "Heavenly Waters Family", sources: ["britannica"], description: "A watery grouping including the ship Argo Navis (now Carina, Puppis, Vela, Pyxis) plus Delphinus, Equuleus, Eridanus, Piscis Austrinus, and Columba." },
  { slug: "bayer", name: "Bayer Family", sources: ["britannica"], description: "Southern constellations introduced from Johann Bayer's 1603 Uranometria — Apus, Chamaeleon, Dorado, Grus, Hydrus, Indus, Musca, Pavo, Phoenix, Tucana, and Volans." },
  { slug: "lacaille", name: "La Caille Family", sources: ["britannica"], description: "The far-southern constellations named by Nicolas-Louis de Lacaille in the 1750s, mostly after scientific instruments — Antlia, Caelum, Circinus, Fornax, Horologium, Mensa, Microscopium, Norma, Octans, Pictor, Reticulum, Sculptor, and Telescopium." },
];
