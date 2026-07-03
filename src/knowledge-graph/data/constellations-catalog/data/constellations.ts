import { CONSTELLATIONS } from "@/knowledge-graph/data/star-catalog/constellations";
import type { ConstellationRecord } from "@/knowledge-graph/data/constellations-catalog/types";

/**
 * The 88 IAU constellations. Baseline identity (abbr / name / genitive / slug) is
 * taken from the canonical star-catalogue source so it can never drift; the RICH
 * map below layers standard IAU reference data (official area, hemisphere, family,
 * observing season, mythology, neighbours). Every rich field is optional — a
 * constellation with no reliably-known value for a field is simply left without
 * it. Rank-by-area is DERIVED from areaSqDeg in the index (single source of
 * truth). Areas are the official IAU values (square degrees, rounded).
 */
type Rich = Partial<Omit<ConstellationRecord, "id" | "slug" | "name" | "abbr" | "genitive" | "sources">>;

// Menzel's eight traditional constellation families cover all 88 (family slugs
// resolve to the family entities in families.ts).
const RICH: Record<string, Rich> = {
  andromeda: { areaSqDeg: 722, hemisphere: "northern", season: "autumn", ptolemaic: true, family: "perseus", brightestStarId: "star:alpheratz", mythologyFigureId: "mythology_figure:andromeda", meaning: "The Chained Princess", neighborSlugs: ["perseus", "cassiopeia", "lacerta", "pegasus", "pisces", "triangulum"], highlights: ["The Andromeda Galaxy (M31) — the most distant object easily visible to the naked eye"] },
  antlia: { areaSqDeg: 239, hemisphere: "southern", family: "lacaille", meaning: "The Air Pump" },
  apus: { areaSqDeg: 206, hemisphere: "southern", circumpolarSouth: true, family: "bayer", meaning: "The Bird of Paradise" },
  aquarius: { areaSqDeg: 980, hemisphere: "equatorial", season: "autumn", zodiac: true, ptolemaic: true, family: "zodiacal", meaning: "The Water Bearer", neighborSlugs: ["pisces", "pegasus", "equuleus", "delphinus", "aquila", "capricornus", "piscis-austrinus", "sculptor", "cetus-constellation"] },
  aquila: { areaSqDeg: 652, hemisphere: "equatorial", season: "summer", ptolemaic: true, family: "hercules", brightestStarId: "star:altair", meaning: "The Eagle", neighborSlugs: ["sagitta", "hercules", "ophiuchus", "serpens", "scutum", "sagittarius", "capricornus", "aquarius", "delphinus"] },
  ara: { areaSqDeg: 237, hemisphere: "southern", family: "hercules", ptolemaic: true, meaning: "The Altar" },
  aries: { areaSqDeg: 441, hemisphere: "northern", season: "autumn", zodiac: true, ptolemaic: true, family: "zodiacal", brightestStarId: "star:hamal", meaning: "The Ram", neighborSlugs: ["perseus", "triangulum", "pisces", "cetus-constellation", "taurus"] },
  auriga: { areaSqDeg: 657, hemisphere: "northern", season: "winter", ptolemaic: true, family: "perseus", brightestStarId: "star:capella", meaning: "The Charioteer", neighborSlugs: ["camelopardalis", "perseus", "taurus", "gemini", "lynx"], highlights: ["The open clusters M36, M37, and M38"] },
  bootes: { areaSqDeg: 907, hemisphere: "northern", season: "spring", ptolemaic: true, family: "ursa-major", brightestStarId: "star:arcturus", meaning: "The Herdsman", neighborSlugs: ["draco", "ursa-major", "canes-venatici", "coma-berenices", "virgo", "serpens", "corona-borealis", "hercules"] },
  caelum: { areaSqDeg: 125, hemisphere: "southern", family: "lacaille", meaning: "The Chisel" },
  camelopardalis: { areaSqDeg: 757, hemisphere: "northern", circumpolarNorth: true, family: "ursa-major", meaning: "The Giraffe" },
  cancer: { areaSqDeg: 506, hemisphere: "northern", season: "spring", zodiac: true, ptolemaic: true, family: "zodiacal", meaning: "The Crab", neighborSlugs: ["lynx", "gemini", "canis-minor", "hydra", "leo", "leo-minor"], highlights: ["The Beehive Cluster (M44, Praesepe)"] },
  "canes-venatici": { areaSqDeg: 465, hemisphere: "northern", season: "spring", family: "ursa-major", brightestStarId: "star:cor-caroli", meaning: "The Hunting Dogs", highlights: ["The Whirlpool Galaxy (M51)"] },
  "canis-major": { areaSqDeg: 380, hemisphere: "southern", season: "winter", ptolemaic: true, family: "orion", brightestStarId: "star:sirius", meaning: "The Greater Dog", neighborSlugs: ["monoceros", "lepus", "columba", "puppis"], highlights: ["Sirius, the brightest star in the night sky", "The open cluster M41"] },
  "canis-minor": { areaSqDeg: 183, hemisphere: "equatorial", season: "winter", ptolemaic: true, family: "orion", brightestStarId: "star:procyon", meaning: "The Lesser Dog", neighborSlugs: ["gemini", "monoceros", "hydra", "cancer"] },
  capricornus: { areaSqDeg: 414, hemisphere: "southern", season: "autumn", zodiac: true, ptolemaic: true, family: "zodiacal", meaning: "The Sea Goat", neighborSlugs: ["aquila", "sagittarius", "microscopium", "piscis-austrinus", "aquarius"] },
  carina: { areaSqDeg: 494, hemisphere: "southern", family: "heavenly-waters", brightestStarId: "star:canopus", meaning: "The Keel (of Argo Navis)", highlights: ["Canopus, the second-brightest star", "The Carina Nebula (NGC 3372)"] },
  cassiopeia: { areaSqDeg: 598, hemisphere: "northern", season: "autumn", circumpolarNorth: true, ptolemaic: true, family: "perseus", mythologyFigureId: "mythology_figure:cassiopeia", meaning: "The Seated Queen", neighborSlugs: ["cepheus", "camelopardalis", "perseus", "andromeda", "lacerta"], highlights: ["Its distinctive W/M shape", "The open clusters M52 and M103"] },
  centaurus: { areaSqDeg: 1060, hemisphere: "southern", family: "hercules", ptolemaic: true, brightestStarId: "star:alpha-centauri", meaning: "The Centaur", highlights: ["Alpha Centauri, the closest star system to the Sun", "The globular cluster Omega Centauri (NGC 5139)"] },
  cepheus: { areaSqDeg: 588, hemisphere: "northern", circumpolarNorth: true, ptolemaic: true, family: "perseus", mythologyFigureId: "mythology_figure:cepheus", meaning: "The King", neighborSlugs: ["draco", "ursa-minor", "camelopardalis", "cassiopeia", "lacerta", "cygnus"] },
  "cetus-constellation": { areaSqDeg: 1231, hemisphere: "equatorial", season: "autumn", ptolemaic: true, family: "perseus", mythologyFigureId: "mythology_figure:cetus", meaning: "The Sea Monster / Whale", neighborSlugs: ["aries", "pisces", "aquarius", "sculptor", "fornax", "eridanus", "taurus"], highlights: ["Mira (Omicron Ceti), a famous long-period variable star"] },
  chamaeleon: { areaSqDeg: 131.6, hemisphere: "southern", circumpolarSouth: true, family: "bayer", meaning: "The Chameleon" },
  circinus: { areaSqDeg: 93, hemisphere: "southern", family: "lacaille", meaning: "The Compasses" },
  columba: { areaSqDeg: 270, hemisphere: "southern", family: "heavenly-waters", meaning: "The Dove" },
  "coma-berenices": { areaSqDeg: 386, hemisphere: "northern", season: "spring", family: "ursa-major", meaning: "Berenice's Hair", highlights: ["The Coma Star Cluster", "Many galaxies of the Coma and Virgo clusters, incl. the Black Eye Galaxy (M64)"] },
  "corona-australis": { areaSqDeg: 128, hemisphere: "southern", ptolemaic: true, family: "hercules", meaning: "The Southern Crown" },
  "corona-borealis": { areaSqDeg: 178.7, hemisphere: "northern", season: "summer", ptolemaic: true, family: "ursa-major", meaning: "The Northern Crown", highlights: ["Its distinctive semicircular arc of stars"] },
  corvus: { areaSqDeg: 184, hemisphere: "southern", season: "spring", ptolemaic: true, family: "hercules", meaning: "The Crow" },
  crater: { areaSqDeg: 282, hemisphere: "southern", season: "spring", ptolemaic: true, family: "hercules", meaning: "The Cup" },
  crux: { areaSqDeg: 68, rankByArea: 88, hemisphere: "southern", circumpolarSouth: true, family: "hercules", brightestStarId: "star:acrux", meaning: "The Southern Cross", highlights: ["The smallest constellation", "The Jewel Box cluster (NGC 4755)"] },
  cygnus: { areaSqDeg: 804, hemisphere: "northern", season: "summer", ptolemaic: true, family: "hercules", brightestStarId: "star:deneb", meaning: "The Swan", neighborSlugs: ["cepheus", "draco", "lyra", "vulpecula", "pegasus", "lacerta"], highlights: ["The Northern Cross asterism", "Deneb, a vertex of the Summer Triangle", "The North America Nebula (NGC 7000)"] },
  delphinus: { areaSqDeg: 189, hemisphere: "northern", season: "summer", ptolemaic: true, family: "heavenly-waters", meaning: "The Dolphin" },
  dorado: { areaSqDeg: 179.2, hemisphere: "southern", family: "bayer", meaning: "The Dolphinfish", highlights: ["Most of the Large Magellanic Cloud", "The Tarantula Nebula (NGC 2070)"] },
  draco: { areaSqDeg: 1083, hemisphere: "northern", circumpolarNorth: true, ptolemaic: true, family: "ursa-major", meaning: "The Dragon", neighborSlugs: ["ursa-minor", "cepheus", "cygnus", "lyra", "hercules", "bootes", "ursa-major", "camelopardalis"], highlights: ["The Cat's Eye Nebula (NGC 6543)"] },
  equuleus: { areaSqDeg: 72, rankByArea: 87, hemisphere: "northern", ptolemaic: true, family: "heavenly-waters", meaning: "The Little Horse" },
  eridanus: { areaSqDeg: 1138, hemisphere: "southern", ptolemaic: true, family: "heavenly-waters", brightestStarId: "star:achernar", meaning: "The River", highlights: ["Achernar at its southern end", "One of the longest constellations in the sky"] },
  fornax: { areaSqDeg: 398, hemisphere: "southern", family: "lacaille", meaning: "The Furnace", highlights: ["The Fornax galaxy cluster", "The Hubble Ultra-Deep Field lies here"] },
  gemini: { areaSqDeg: 514, hemisphere: "northern", season: "winter", zodiac: true, ptolemaic: true, family: "zodiacal", brightestStarId: "star:pollux", meaning: "The Twins", neighborSlugs: ["lynx", "auriga", "taurus", "orion", "monoceros", "canis-minor", "cancer"], highlights: ["The bright pair Castor and Pollux", "The open cluster M35"] },
  grus: { areaSqDeg: 366, hemisphere: "southern", family: "bayer", meaning: "The Crane" },
  hercules: { areaSqDeg: 1225, hemisphere: "northern", season: "summer", ptolemaic: true, family: "hercules", meaning: "The Hero (Heracles)", neighborSlugs: ["draco", "bootes", "corona-borealis", "serpens", "ophiuchus", "aquila", "sagitta", "vulpecula", "lyra"], highlights: ["The Great Globular Cluster (M13)", "The Keystone asterism"] },
  horologium: { areaSqDeg: 249, hemisphere: "southern", family: "lacaille", meaning: "The Pendulum Clock" },
  hydra: { areaSqDeg: 1303, rankByArea: 1, hemisphere: "equatorial", ptolemaic: true, family: "hercules", brightestStarId: "star:alphard", meaning: "The Water Snake", highlights: ["The largest of the 88 constellations", "The open cluster M48 and the Southern Pinwheel Galaxy (M83)"] },
  hydrus: { areaSqDeg: 243, hemisphere: "southern", circumpolarSouth: true, family: "bayer", meaning: "The Male Water Snake" },
  indus: { areaSqDeg: 294, hemisphere: "southern", family: "bayer", meaning: "The Indian" },
  lacerta: { areaSqDeg: 201, hemisphere: "northern", family: "perseus", meaning: "The Lizard" },
  leo: { areaSqDeg: 947, hemisphere: "northern", season: "spring", zodiac: true, ptolemaic: true, family: "zodiacal", brightestStarId: "star:regulus", meaning: "The Lion", neighborSlugs: ["ursa-major", "leo-minor", "lynx", "cancer", "hydra", "sextans", "crater", "virgo", "coma-berenices"], highlights: ["The Sickle asterism", "The Leo Triplet of galaxies (M65, M66, NGC 3628)"] },
  "leo-minor": { areaSqDeg: 232, hemisphere: "northern", family: "ursa-major", meaning: "The Lesser Lion" },
  lepus: { areaSqDeg: 290, hemisphere: "southern", season: "winter", ptolemaic: true, family: "orion", meaning: "The Hare", highlights: ["The globular cluster M79"] },
  libra: { areaSqDeg: 538, hemisphere: "southern", season: "summer", zodiac: true, ptolemaic: true, family: "zodiacal", meaning: "The Scales", neighborSlugs: ["serpens", "virgo", "hydra", "centaurus", "lupus", "scorpius", "ophiuchus"] },
  lupus: { areaSqDeg: 334, hemisphere: "southern", ptolemaic: true, family: "hercules", meaning: "The Wolf" },
  lynx: { areaSqDeg: 545, hemisphere: "northern", family: "ursa-major", meaning: "The Lynx" },
  lyra: { areaSqDeg: 286, hemisphere: "northern", season: "summer", ptolemaic: true, family: "hercules", brightestStarId: "star:vega", meaning: "The Lyre / Harp", neighborSlugs: ["draco", "hercules", "vulpecula", "cygnus"], highlights: ["Vega, a vertex of the Summer Triangle", "The Ring Nebula (M57)"] },
  mensa: { areaSqDeg: 153, hemisphere: "southern", circumpolarSouth: true, family: "lacaille", meaning: "The Table Mountain", highlights: ["Part of the Large Magellanic Cloud"] },
  microscopium: { areaSqDeg: 210, hemisphere: "southern", family: "lacaille", meaning: "The Microscope" },
  monoceros: { areaSqDeg: 482, hemisphere: "equatorial", season: "winter", family: "orion", meaning: "The Unicorn", highlights: ["The Rosette Nebula (NGC 2237)", "The Christmas Tree Cluster"] },
  musca: { areaSqDeg: 138, hemisphere: "southern", circumpolarSouth: true, family: "bayer", meaning: "The Fly" },
  norma: { areaSqDeg: 165, hemisphere: "southern", family: "lacaille", meaning: "The Carpenter's Level" },
  octans: { areaSqDeg: 291, hemisphere: "southern", circumpolarSouth: true, family: "lacaille", meaning: "The Octant", highlights: ["Contains the south celestial pole"] },
  ophiuchus: { areaSqDeg: 948, hemisphere: "equatorial", season: "summer", ptolemaic: true, family: "hercules", meaning: "The Serpent Bearer", neighborSlugs: ["hercules", "serpens", "libra", "scorpius", "sagittarius", "aquila"], highlights: ["The thirteenth constellation the ecliptic passes through"] },
  orion: { areaSqDeg: 594, hemisphere: "equatorial", season: "winter", ptolemaic: true, family: "orion", brightestStarId: "star:rigel", mythologyFigureId: "mythology_figure:orion", meaning: "The Hunter", neighborSlugs: ["taurus", "eridanus", "lepus", "monoceros", "gemini"], highlights: ["The Orion Nebula (M42)", "The three-star Belt of Orion", "Betelgeuse and Rigel"] },
  pavo: { areaSqDeg: 378, hemisphere: "southern", circumpolarSouth: true, family: "bayer", meaning: "The Peacock" },
  pegasus: { areaSqDeg: 1121, hemisphere: "northern", season: "autumn", ptolemaic: true, family: "perseus", brightestStarId: "star:enif", meaning: "The Winged Horse", neighborSlugs: ["lacerta", "cygnus", "vulpecula", "delphinus", "equuleus", "aquarius", "pisces", "andromeda"], highlights: ["The Great Square of Pegasus", "The globular cluster M15"] },
  perseus: { areaSqDeg: 615, hemisphere: "northern", season: "autumn", circumpolarNorth: true, ptolemaic: true, family: "perseus", brightestStarId: "star:mirfak", mythologyFigureId: "mythology_figure:perseus", meaning: "The Hero", neighborSlugs: ["cassiopeia", "andromeda", "triangulum", "aries", "taurus", "auriga", "camelopardalis"], highlights: ["The Double Cluster (NGC 869 & 884)", "The eclipsing variable Algol", "Radiant of the Perseid meteor shower"] },
  phoenix: { areaSqDeg: 469, hemisphere: "southern", family: "bayer", meaning: "The Phoenix" },
  pictor: { areaSqDeg: 247, hemisphere: "southern", family: "lacaille", meaning: "The Painter's Easel" },
  pisces: { areaSqDeg: 889, hemisphere: "northern", season: "autumn", zodiac: true, ptolemaic: true, family: "zodiacal", meaning: "The Fishes", neighborSlugs: ["andromeda", "triangulum", "aries", "cetus-constellation", "aquarius", "pegasus"], highlights: ["The Circlet asterism", "Contains the vernal equinox point"] },
  "piscis-austrinus": { areaSqDeg: 245, hemisphere: "southern", season: "autumn", ptolemaic: true, family: "heavenly-waters", brightestStarId: "star:fomalhaut", meaning: "The Southern Fish", highlights: ["Fomalhaut, a bright first-magnitude star with a famous debris disk"] },
  puppis: { areaSqDeg: 673, hemisphere: "southern", family: "heavenly-waters", meaning: "The Stern (of Argo Navis)", highlights: ["Rich Milky Way star clouds", "The open clusters M46, M47, and M93"] },
  pyxis: { areaSqDeg: 221, hemisphere: "southern", family: "heavenly-waters", meaning: "The Compass (of Argo Navis)" },
  reticulum: { areaSqDeg: 114, hemisphere: "southern", family: "lacaille", meaning: "The Reticle" },
  sagitta: { areaSqDeg: 80, rankByArea: 86, hemisphere: "northern", season: "summer", ptolemaic: true, family: "hercules", meaning: "The Arrow" },
  sagittarius: { areaSqDeg: 867, hemisphere: "southern", season: "summer", zodiac: true, ptolemaic: true, family: "zodiacal", meaning: "The Archer", neighborSlugs: ["aquila", "scutum", "serpens", "ophiuchus", "scorpius", "corona-australis", "telescopium", "microscopium", "capricornus"], highlights: ["The Teapot asterism", "The direction of the Galactic Center", "The Lagoon (M8) and Trifid (M20) Nebulae"] },
  scorpius: { areaSqDeg: 497, hemisphere: "southern", season: "summer", zodiac: true, ptolemaic: true, family: "zodiacal", brightestStarId: "star:antares", meaning: "The Scorpion", neighborSlugs: ["libra", "ophiuchus", "sagittarius", "corona-australis", "ara", "norma", "lupus"], highlights: ["The red supergiant Antares", "The clusters M6 and M7"] },
  sculptor: { areaSqDeg: 475, hemisphere: "southern", family: "lacaille", meaning: "The Sculptor's Studio", highlights: ["The South Galactic Pole", "The Sculptor Galaxy (NGC 253)"] },
  scutum: { areaSqDeg: 109, rankByArea: 84, hemisphere: "southern", season: "summer", family: "hercules", meaning: "The Shield", highlights: ["The Wild Duck Cluster (M11)", "The Scutum Star Cloud"] },
  serpens: { areaSqDeg: 637, hemisphere: "equatorial", season: "summer", ptolemaic: true, family: "hercules", meaning: "The Serpent", neighborSlugs: ["ophiuchus", "hercules", "corona-borealis", "bootes", "virgo", "libra", "scorpius", "aquila", "sagittarius", "scutum"], highlights: ["The globular cluster M5", "The Eagle Nebula (M16), home of the Pillars of Creation", "The only constellation split into two separate parts by Ophiuchus"] },
  sextans: { areaSqDeg: 314, hemisphere: "equatorial", family: "hercules", meaning: "The Sextant" },
  taurus: { areaSqDeg: 797, hemisphere: "northern", season: "winter", zodiac: true, ptolemaic: true, family: "zodiacal", brightestStarId: "star:aldebaran", meaning: "The Bull", neighborSlugs: ["perseus", "aries", "cetus-constellation", "eridanus", "orion", "gemini", "auriga"], highlights: ["The Pleiades (M45) and Hyades open clusters", "The Crab Nebula (M1)", "Radiant of the Taurid meteor shower"] },
  telescopium: { areaSqDeg: 252, hemisphere: "southern", family: "lacaille", meaning: "The Telescope" },
  triangulum: { areaSqDeg: 131.8, hemisphere: "northern", season: "autumn", ptolemaic: true, family: "perseus", meaning: "The Triangle", highlights: ["The Triangulum Galaxy (M33)"] },
  "triangulum-australe": { areaSqDeg: 110, rankByArea: 83, hemisphere: "southern", circumpolarSouth: true, family: "hercules", meaning: "The Southern Triangle" },
  tucana: { areaSqDeg: 295, hemisphere: "southern", circumpolarSouth: true, family: "bayer", meaning: "The Toucan", highlights: ["The Small Magellanic Cloud", "The globular cluster 47 Tucanae"] },
  "ursa-major": { areaSqDeg: 1280, rankByArea: 3, hemisphere: "northern", season: "spring", circumpolarNorth: true, ptolemaic: true, family: "ursa-major", brightestStarId: "star:alioth", meaning: "The Great Bear", neighborSlugs: ["draco", "camelopardalis", "lynx", "leo-minor", "leo", "coma-berenices", "canes-venatici", "bootes"], highlights: ["The Big Dipper / Plough asterism", "The Pinwheel Galaxy (M101) and Bode's Galaxy (M81)"] },
  "ursa-minor": { areaSqDeg: 256, hemisphere: "northern", circumpolarNorth: true, ptolemaic: true, family: "ursa-major", brightestStarId: "star:polaris", meaning: "The Lesser Bear", neighborSlugs: ["draco", "cepheus", "camelopardalis"], highlights: ["Contains Polaris, the North Star", "The Little Dipper asterism"] },
  vela: { areaSqDeg: 500, hemisphere: "southern", family: "heavenly-waters", meaning: "The Sails (of Argo Navis)", highlights: ["The Vela Supernova Remnant", "The Gum Nebula"] },
  virgo: { areaSqDeg: 1294, rankByArea: 2, hemisphere: "equatorial", season: "spring", zodiac: true, ptolemaic: true, family: "zodiacal", brightestStarId: "star:spica", meaning: "The Maiden", neighborSlugs: ["coma-berenices", "bootes", "serpens", "libra", "hydra", "crater", "corvus", "leo"], highlights: ["The Virgo Cluster of galaxies", "The supergiant elliptical M87 and its black hole", "The Sombrero Galaxy (M104)"] },
  volans: { areaSqDeg: 141, hemisphere: "southern", circumpolarSouth: true, family: "bayer", meaning: "The Flying Fish" },
  vulpecula: { areaSqDeg: 268, hemisphere: "northern", season: "summer", family: "hercules", meaning: "The Fox", highlights: ["The Dumbbell Nebula (M27)", "The Coathanger asterism"] },
};

export const constellations: ConstellationRecord[] = CONSTELLATIONS.map((c) => {
  const rich = RICH[c.slug] ?? {};
  return {
    id: `constellation:${c.slug}`,
    slug: c.slug,
    name: c.name,
    abbr: c.abbr,
    genitive: c.genitive,
    sources: ["iau"],
    description:
      rich.description ??
      `${c.name} (${c.genitive})${rich.meaning ? ` — ${rich.meaning}` : ""} is one of the 88 modern constellations recognised by the International Astronomical Union.`,
    ...rich,
  };
});
