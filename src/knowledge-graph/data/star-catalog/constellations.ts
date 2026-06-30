/**
 * The 88 IAU constellations (real, standard data). `slug` matches the existing
 * graph constellation entity id where one already exists, so stars connect to
 * the canonical constellation entity rather than creating duplicates.
 */
export interface ConstellationDef {
  abbr: string;
  slug: string;
  name: string;
  genitive: string;
}

export const CONSTELLATIONS: ConstellationDef[] = [
  { abbr: "And", slug: "andromeda", name: "Andromeda", genitive: "Andromedae" },
  { abbr: "Ant", slug: "antlia", name: "Antlia", genitive: "Antliae" },
  { abbr: "Aps", slug: "apus", name: "Apus", genitive: "Apodis" },
  { abbr: "Aqr", slug: "aquarius", name: "Aquarius", genitive: "Aquarii" },
  { abbr: "Aql", slug: "aquila", name: "Aquila", genitive: "Aquilae" },
  { abbr: "Ara", slug: "ara", name: "Ara", genitive: "Arae" },
  { abbr: "Ari", slug: "aries", name: "Aries", genitive: "Arietis" },
  { abbr: "Aur", slug: "auriga", name: "Auriga", genitive: "Aurigae" },
  { abbr: "Boo", slug: "bootes", name: "Boötes", genitive: "Boötis" },
  { abbr: "Cae", slug: "caelum", name: "Caelum", genitive: "Caeli" },
  { abbr: "Cam", slug: "camelopardalis", name: "Camelopardalis", genitive: "Camelopardalis" },
  { abbr: "Cnc", slug: "cancer", name: "Cancer", genitive: "Cancri" },
  { abbr: "CVn", slug: "canes-venatici", name: "Canes Venatici", genitive: "Canum Venaticorum" },
  { abbr: "CMa", slug: "canis-major", name: "Canis Major", genitive: "Canis Majoris" },
  { abbr: "CMi", slug: "canis-minor", name: "Canis Minor", genitive: "Canis Minoris" },
  { abbr: "Cap", slug: "capricornus", name: "Capricornus", genitive: "Capricorni" },
  { abbr: "Car", slug: "carina", name: "Carina", genitive: "Carinae" },
  { abbr: "Cas", slug: "cassiopeia", name: "Cassiopeia", genitive: "Cassiopeiae" },
  { abbr: "Cen", slug: "centaurus", name: "Centaurus", genitive: "Centauri" },
  { abbr: "Cep", slug: "cepheus", name: "Cepheus", genitive: "Cephei" },
  { abbr: "Cet", slug: "cetus-constellation", name: "Cetus", genitive: "Ceti" },
  { abbr: "Cha", slug: "chamaeleon", name: "Chamaeleon", genitive: "Chamaeleontis" },
  { abbr: "Cir", slug: "circinus", name: "Circinus", genitive: "Circini" },
  { abbr: "Col", slug: "columba", name: "Columba", genitive: "Columbae" },
  { abbr: "Com", slug: "coma-berenices", name: "Coma Berenices", genitive: "Comae Berenices" },
  { abbr: "CrA", slug: "corona-australis", name: "Corona Australis", genitive: "Coronae Australis" },
  { abbr: "CrB", slug: "corona-borealis", name: "Corona Borealis", genitive: "Coronae Borealis" },
  { abbr: "Crv", slug: "corvus", name: "Corvus", genitive: "Corvi" },
  { abbr: "Crt", slug: "crater", name: "Crater", genitive: "Crateris" },
  { abbr: "Cru", slug: "crux", name: "Crux", genitive: "Crucis" },
  { abbr: "Cyg", slug: "cygnus", name: "Cygnus", genitive: "Cygni" },
  { abbr: "Del", slug: "delphinus", name: "Delphinus", genitive: "Delphini" },
  { abbr: "Dor", slug: "dorado", name: "Dorado", genitive: "Doradus" },
  { abbr: "Dra", slug: "draco", name: "Draco", genitive: "Draconis" },
  { abbr: "Equ", slug: "equuleus", name: "Equuleus", genitive: "Equulei" },
  { abbr: "Eri", slug: "eridanus", name: "Eridanus", genitive: "Eridani" },
  { abbr: "For", slug: "fornax", name: "Fornax", genitive: "Fornacis" },
  { abbr: "Gem", slug: "gemini", name: "Gemini", genitive: "Geminorum" },
  { abbr: "Gru", slug: "grus", name: "Grus", genitive: "Gruis" },
  { abbr: "Her", slug: "hercules", name: "Hercules", genitive: "Herculis" },
  { abbr: "Hor", slug: "horologium", name: "Horologium", genitive: "Horologii" },
  { abbr: "Hya", slug: "hydra", name: "Hydra", genitive: "Hydrae" },
  { abbr: "Hyi", slug: "hydrus", name: "Hydrus", genitive: "Hydri" },
  { abbr: "Ind", slug: "indus", name: "Indus", genitive: "Indi" },
  { abbr: "Lac", slug: "lacerta", name: "Lacerta", genitive: "Lacertae" },
  { abbr: "Leo", slug: "leo", name: "Leo", genitive: "Leonis" },
  { abbr: "LMi", slug: "leo-minor", name: "Leo Minor", genitive: "Leonis Minoris" },
  { abbr: "Lep", slug: "lepus", name: "Lepus", genitive: "Leporis" },
  { abbr: "Lib", slug: "libra", name: "Libra", genitive: "Librae" },
  { abbr: "Lup", slug: "lupus", name: "Lupus", genitive: "Lupi" },
  { abbr: "Lyn", slug: "lynx", name: "Lynx", genitive: "Lyncis" },
  { abbr: "Lyr", slug: "lyra", name: "Lyra", genitive: "Lyrae" },
  { abbr: "Men", slug: "mensa", name: "Mensa", genitive: "Mensae" },
  { abbr: "Mic", slug: "microscopium", name: "Microscopium", genitive: "Microscopii" },
  { abbr: "Mon", slug: "monoceros", name: "Monoceros", genitive: "Monocerotis" },
  { abbr: "Mus", slug: "musca", name: "Musca", genitive: "Muscae" },
  { abbr: "Nor", slug: "norma", name: "Norma", genitive: "Normae" },
  { abbr: "Oct", slug: "octans", name: "Octans", genitive: "Octantis" },
  { abbr: "Oph", slug: "ophiuchus", name: "Ophiuchus", genitive: "Ophiuchi" },
  { abbr: "Ori", slug: "orion", name: "Orion", genitive: "Orionis" },
  { abbr: "Pav", slug: "pavo", name: "Pavo", genitive: "Pavonis" },
  { abbr: "Peg", slug: "pegasus", name: "Pegasus", genitive: "Pegasi" },
  { abbr: "Per", slug: "perseus", name: "Perseus", genitive: "Persei" },
  { abbr: "Phe", slug: "phoenix", name: "Phoenix", genitive: "Phoenicis" },
  { abbr: "Pic", slug: "pictor", name: "Pictor", genitive: "Pictoris" },
  { abbr: "Psc", slug: "pisces", name: "Pisces", genitive: "Piscium" },
  { abbr: "PsA", slug: "piscis-austrinus", name: "Piscis Austrinus", genitive: "Piscis Austrini" },
  { abbr: "Pup", slug: "puppis", name: "Puppis", genitive: "Puppis" },
  { abbr: "Pyx", slug: "pyxis", name: "Pyxis", genitive: "Pyxidis" },
  { abbr: "Ret", slug: "reticulum", name: "Reticulum", genitive: "Reticuli" },
  { abbr: "Sge", slug: "sagitta", name: "Sagitta", genitive: "Sagittae" },
  { abbr: "Sgr", slug: "sagittarius", name: "Sagittarius", genitive: "Sagittarii" },
  { abbr: "Sco", slug: "scorpius", name: "Scorpius", genitive: "Scorpii" },
  { abbr: "Scl", slug: "sculptor", name: "Sculptor", genitive: "Sculptoris" },
  { abbr: "Sct", slug: "scutum", name: "Scutum", genitive: "Scuti" },
  { abbr: "Ser", slug: "serpens", name: "Serpens", genitive: "Serpentis" },
  { abbr: "Sex", slug: "sextans", name: "Sextans", genitive: "Sextantis" },
  { abbr: "Tau", slug: "taurus", name: "Taurus", genitive: "Tauri" },
  { abbr: "Tel", slug: "telescopium", name: "Telescopium", genitive: "Telescopii" },
  { abbr: "Tri", slug: "triangulum", name: "Triangulum", genitive: "Trianguli" },
  { abbr: "TrA", slug: "triangulum-australe", name: "Triangulum Australe", genitive: "Trianguli Australis" },
  { abbr: "Tuc", slug: "tucana", name: "Tucana", genitive: "Tucanae" },
  { abbr: "UMa", slug: "ursa-major", name: "Ursa Major", genitive: "Ursae Majoris" },
  { abbr: "UMi", slug: "ursa-minor", name: "Ursa Minor", genitive: "Ursae Minoris" },
  { abbr: "Vel", slug: "vela", name: "Vela", genitive: "Velorum" },
  { abbr: "Vir", slug: "virgo", name: "Virgo", genitive: "Virginis" },
  { abbr: "Vol", slug: "volans", name: "Volans", genitive: "Volantis" },
  { abbr: "Vul", slug: "vulpecula", name: "Vulpecula", genitive: "Vulpeculae" },
];

const BY_ABBR = new Map(CONSTELLATIONS.map((c) => [c.abbr, c]));
export function constellationByAbbr(abbr: string): ConstellationDef | undefined {
  return BY_ABBR.get(abbr);
}
export function constellationId(abbr: string): string | undefined {
  const c = BY_ABBR.get(abbr);
  return c ? `constellation:${c.slug}` : undefined;
}

/** Constellation slugs that already exist as hand-curated graph entities. */
export const EXISTING_CONSTELLATION_SLUGS = new Set<string>([
  "andromeda", "aquarius", "aquila", "aries", "auriga", "bootes", "cancer",
  "canis-major", "canis-minor", "capricornus", "carina", "cassiopeia",
  "centaurus", "cetus-constellation", "crux", "cygnus", "eridanus", "gemini",
  "leo", "libra", "lyra", "ophiuchus", "orion", "pegasus", "perseus",
  "piscis-austrinus", "scorpius", "taurus", "ursa-major", "ursa-minor", "virgo",
]);
