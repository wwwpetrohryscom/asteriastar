import type { MeteoriteCategory, MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Individual meteorites. Curated from the Meteoritical Bulletin Database. Fall dates
 * and recovery locations are given only for well-documented meteorites; masses only
 * where iconic. Parent-body links point at REUSED graph entities (Vesta for the HED
 * meteorites, Mars, the Moon) and are asserted only where the linkage is scientifically
 * established.
 */
type M = {
  slug: string;
  name: string;
  category: MeteoriteCategory;
  classification?: string;
  fallType?: "fall" | "find";
  fallDate?: string;
  location?: string;
  country?: string;
  mass?: string;
  discoveryYear?: string;
  group?: string;
  klass?: string; // direct class (irons)
  parentBody?: string[];
  recoverySite?: string;
  fireballs?: string[];
  related?: string[];
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (m: M): MeteoriteRecord => ({
  id: `meteorite:${m.slug}`,
  slug: m.slug,
  name: m.name,
  kind: "meteorite",
  altNames: m.alt,
  description: m.description,
  sources: m.sources ?? ["nasa"],
  category: m.category,
  classificationLabel: m.classification,
  fallType: m.fallType,
  fallDate: m.fallDate,
  location: m.location,
  country: m.country,
  massLabel: m.mass,
  discoveryYear: m.discoveryYear,
  groupSlug: m.group,
  classSlug: m.klass,
  parentBodyKeys: m.parentBody,
  recoverySiteSlug: m.recoverySite,
  fireballKeys: m.fireballs,
  relatedKeys: m.related,
});

export const meteorites: MeteoriteRecord[] = [
  /* ---------------- Carbonaceous chondrites ---------------- */
  mk({ slug: "allende", name: "Allende", category: "chondrite", classification: "CV3 carbonaceous chondrite", fallType: "fall", fallDate: "1969-02-08", location: "Chihuahua", country: "Mexico", group: "carbonaceous-chondrite", sources: ["nasa"], description: "The largest carbonaceous chondrite found on Earth, which fell in 1969 and became the most-studied meteorite in history — its calcium–aluminium inclusions are among the oldest solid material in the Solar System." }),
  mk({ slug: "murchison", name: "Murchison", category: "chondrite", classification: "CM2 carbonaceous chondrite", fallType: "fall", fallDate: "1969-09-28", location: "Victoria", country: "Australia", group: "carbonaceous-chondrite", sources: ["nasa"], description: "A carbonaceous chondrite that fell in 1969 and was found to contain a rich suite of amino acids and other organic compounds — key evidence that the building blocks of life exist in space." }),
  mk({ slug: "orgueil", name: "Orgueil", category: "chondrite", classification: "CI1 carbonaceous chondrite", fallType: "fall", fallDate: "1864-05-14", location: "Tarn-et-Garonne", country: "France", group: "carbonaceous-chondrite", sources: ["nasa"], description: "A rare, extremely primitive CI carbonaceous chondrite whose composition closely matches that of the Sun — a benchmark for the bulk composition of the Solar System." }),
  mk({ slug: "tagish-lake", name: "Tagish Lake", category: "chondrite", classification: "C2 (ungrouped) carbonaceous chondrite", fallType: "fall", fallDate: "2000-01-18", location: "British Columbia", country: "Canada", group: "carbonaceous-chondrite", sources: ["nasa"], description: "An exceptionally pristine carbonaceous meteorite recovered frozen from a lake in 2000, preserving organic material with minimal terrestrial contamination." }),
  mk({ slug: "aguas-zarcas", name: "Aguas Zarcas", category: "chondrite", classification: "CM2 carbonaceous chondrite", fallType: "fall", fallDate: "2019-04-23", location: "Alajuela", country: "Costa Rica", group: "carbonaceous-chondrite", sources: ["nasa"], description: "A CM2 carbonaceous chondrite that fell in 2019, rapidly recovered and rich in organic compounds — sometimes called a 'second Murchison'." }),
  mk({ slug: "winchcombe", name: "Winchcombe", category: "chondrite", classification: "CM2 carbonaceous chondrite", fallType: "fall", fallDate: "2021-02-28", location: "Gloucestershire", country: "United Kingdom", group: "carbonaceous-chondrite", sources: ["nasa"], description: "A carbonaceous chondrite whose 2021 fall was captured by camera networks, allowing its orbit to be traced and the sample to be recovered within days — one of the most pristine falls ever studied." }),

  /* ---------------- Ordinary chondrites ---------------- */
  mk({ slug: "chelyabinsk", name: "Chelyabinsk", category: "chondrite", classification: "LL5 ordinary chondrite", fallType: "fall", fallDate: "2013-02-15", location: "Chelyabinsk Oblast", country: "Russia", group: "ordinary-chondrite", related: ["impact_event:chelyabinsk"], sources: ["nasa"], description: "The recovered stones from the 2013 Chelyabinsk airburst, an ordinary chondrite whose spectacular entry — filmed by countless dashcams — was the most damaging meteor event in modern history." }),
  mk({ slug: "peekskill", name: "Peekskill", category: "chondrite", classification: "H6 ordinary chondrite", fallType: "fall", fallDate: "1992-10-09", location: "New York", country: "United States", group: "ordinary-chondrite", fireballs: ["fireball:peekskill-fireball"], sources: ["nasa"], description: "An ordinary chondrite whose 1992 fall was videotaped as a brilliant fireball across the eastern United States before it struck and damaged a parked car in Peekskill, New York." }),
  mk({ slug: "abee", name: "Abee", category: "chondrite", classification: "EH4 enstatite chondrite", fallType: "fall", fallDate: "1952-06-09", location: "Alberta", country: "Canada", group: "enstatite-chondrite", sources: ["nasa"], description: "A large enstatite chondrite that fell in 1952 — a rare, highly reduced meteorite type thought to have formed in the innermost, oxygen-poor part of the solar nebula." }),

  /* ---------------- Iron meteorites ---------------- */
  mk({ slug: "hoba", name: "Hoba", category: "iron", classification: "IVB iron", fallType: "find", location: "Otjozondjupa", country: "Namibia", mass: "~ 60 t (the largest single meteorite known)", discoveryYear: "1920", klass: "iron", sources: ["nasa"], description: "The largest known intact meteorite and the largest naturally-occurring piece of iron near the Earth's surface, an ~60-tonne slab still lying where it was found in Namibia." }),
  mk({ slug: "sikhote-alin", name: "Sikhote-Alin", category: "iron", classification: "IIAB iron", fallType: "fall", fallDate: "1947-02-12", location: "Primorsky Krai", country: "Russia", klass: "iron", recoverySite: "sikhote-alin-field", sources: ["nasa"], description: "One of the largest observed iron meteorite falls, which broke apart over the Sikhote-Alin mountains in 1947 and scattered thousands of fragments, many with dramatic regmaglypt thumbprint textures, across a strewn field." }),
  mk({ slug: "campo-del-cielo", name: "Campo del Cielo", category: "iron", classification: "IAB iron", fallType: "find", location: "Chaco", country: "Argentina", klass: "iron", recoverySite: "campo-del-cielo-field", sources: ["nasa"], description: "An ancient field of large iron meteorites in Argentina, known to indigenous peoples for millennia, whose fragments include some of the heaviest single meteorite masses ever recovered." }),
  mk({ slug: "willamette", name: "Willamette", category: "iron", classification: "IIIAB iron", fallType: "find", location: "Oregon", country: "United States", mass: "~ 15 t (largest found in the US)", klass: "iron", sources: ["nasa"], description: "The largest meteorite ever found in the United States, an ~15-tonne iron sacred to the Clackamas people of the Willamette Valley." }),
  mk({ slug: "canyon-diablo", name: "Canyon Diablo", category: "iron", classification: "IAB iron", fallType: "find", location: "Arizona", country: "United States", klass: "iron", related: ["impact_structure:barringer-crater"], sources: ["nasa"], description: "The iron meteorite responsible for Barringer Crater (Meteor Crater) in Arizona; fragments are scattered around the rim of the crater it formed some 50,000 years ago." }),

  /* ---------------- Stony-iron meteorites ---------------- */
  mk({ slug: "brenham", name: "Brenham", category: "stony-iron", classification: "Pallasite", fallType: "find", location: "Kansas", country: "United States", group: "pallasite", discoveryYear: "1882", sources: ["nasa"], description: "A pallasite strewn field in Kansas — pallasites are among the most beautiful meteorites, with olive-green olivine crystals suspended in a matrix of nickel-iron." }),
  mk({ slug: "estherville", name: "Estherville", category: "stony-iron", classification: "Mesosiderite", fallType: "fall", fallDate: "1879-05-10", location: "Iowa", country: "United States", group: "mesosiderite", sources: ["nasa"], description: "A large mesosiderite that fell in 1879 — a stony-iron meteorite mixing metal with silicate fragments, thought to record a violent collision between differentiated asteroids." }),

  /* ---------------- Achondrites: HED / Martian / Lunar ---------------- */
  mk({ slug: "millbillillie", name: "Millbillillie", category: "achondrite", classification: "Eucrite (HED)", fallType: "fall", fallDate: "1960 (October)", location: "Western Australia", country: "Australia", group: "hed", parentBody: ["asteroid:vesta"], sources: ["nasa"], description: "A eucrite whose fall was witnessed in October 1960 (the stones recovered in the following years) — one of the HED meteorites, basaltic rocks blasted from the surface of the asteroid Vesta, whose spectra they match." }),
  mk({ slug: "nwa-7034", name: "NWA 7034", category: "achondrite", classification: "Martian (polymict breccia)", fallType: "find", location: "Sahara", country: "Morocco", discoveryYear: "2011", group: "martian", parentBody: ["planet:mars"], sources: ["nasa"], alt: ["Black Beauty"], description: "Nicknamed 'Black Beauty', a Martian breccia containing the most water of any Mars meteorite and some of the oldest Martian crust yet sampled." }),
  mk({ slug: "alh-84001", name: "ALH 84001", category: "achondrite", classification: "Martian (orthopyroxenite)", fallType: "find", location: "Allan Hills, Antarctica", discoveryYear: "1984", group: "martian", parentBody: ["planet:mars"], sources: ["nasa"], description: "A Martian meteorite recovered from Antarctica in 1984 and made famous in 1996 by a disputed claim that microscopic structures within it might be evidence of ancient Martian microbial life." }),
  mk({ slug: "alha-81005", name: "ALHA 81005", category: "achondrite", classification: "Lunar (anorthositic breccia)", fallType: "find", location: "Allan Hills, Antarctica", discoveryYear: "1982", group: "lunar", parentBody: ["moon:the-moon"], sources: ["nasa"], description: "The first meteorite recognised as a piece of the Moon, recovered from Antarctica in 1982 — its match to Apollo samples proved that lunar rocks can be delivered to Earth as meteorites." }),
];
