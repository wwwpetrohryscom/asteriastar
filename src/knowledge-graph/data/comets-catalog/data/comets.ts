import type { CometCategory, CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Individual comets. The ten comets already in the graph are marked `existing: true`
 * and ENRICHED here (linked to classes, families, reservoirs, meteor showers, and
 * missions) — never recreated; their canonical pages stay in the Solar System
 * encyclopedia. New comets are created with `/comets/{slug}` pages. Periods and
 * discovery data come from the NASA/JPL Small-Body Database; perihelion dates are
 * given only where well-documented, and omitted otherwise.
 */
type C = {
  slug: string;
  name: string;
  existing?: boolean;
  category: CometCategory;
  designation?: string;
  discoveredBy?: string;
  discoveryYear?: string;
  typeLabel?: string;
  period?: number;
  perihelionDate?: string;
  nextPerihelion?: string;
  diameterKm?: number;
  great?: boolean;
  sungrazer?: boolean;
  fragmented?: boolean;
  family?: string;
  classes?: string[];
  reservoirs?: string[];
  reusedReservoirs?: string[];
  showers?: string[];
  showerNote?: string;
  visitedBy?: string[];
  sampleReturnBy?: string[];
  observedBy?: string[];
  related?: string[];
  sources?: SourceKey[];
  alt?: string[];
  description: string;
  highlights?: string[];
};

const mk = (c: C): CometRecord => ({
  id: `comet:${c.slug}`,
  slug: c.slug,
  name: c.name,
  kind: "comet",
  existing: c.existing,
  altNames: c.alt,
  description: c.description,
  sources: c.sources ?? ["nasa", "jpl"],
  category: c.category,
  designation: c.designation,
  discoveredBy: c.discoveredBy,
  discoveryYear: c.discoveryYear,
  cometTypeLabel: c.typeLabel,
  orbitalPeriodYears: c.period,
  perihelionDate: c.perihelionDate,
  nextPerihelion: c.nextPerihelion,
  nucleusDiameterKm: c.diameterKm,
  greatComet: c.great,
  sungrazer: c.sungrazer,
  fragmented: c.fragmented,
  familySlug: c.family,
  classSlugs: c.classes,
  reservoirSlugs: c.reservoirs,
  reusedReservoirKeys: c.reusedReservoirs,
  meteorShowerIds: c.showers,
  meteorShowerNote: c.showerNote,
  visitedBySlugs: c.visitedBy,
  sampleReturnBySlugs: c.sampleReturnBy,
  observedBySlugs: c.observedBy,
  relatedKeys: c.related,
  highlights: c.highlights,
});

export const comets: CometRecord[] = [
  /* ---------------- Existing comets (reused; enriched) ---------------- */
  mk({ slug: "halleys-comet", name: "Halley's Comet", existing: true, category: "periodic", designation: "1P/Halley", discoveredBy: "known since antiquity; periodicity by Edmond Halley", typeLabel: "Halley-type comet", period: 76, classes: ["halley-type"], reservoirs: ["oort-cloud"], showers: ["meteor_shower:orionids"], showerNote: "Parent of the Orionids and the Eta Aquariids.", visitedBy: ["giotto"], sources: ["nasa", "jpl"], description: "The most famous comet, visible from Earth every ~76 years, whose return in 1986 was met by an international fleet including ESA's Giotto — and the parent of two annual meteor showers." }),
  mk({ slug: "swift-tuttle", name: "Swift–Tuttle", existing: true, category: "periodic", designation: "109P/Swift–Tuttle", discoveredBy: "Lewis Swift, Horace Tuttle", discoveryYear: "1862", typeLabel: "Halley-type comet", period: 133, classes: ["halley-type"], reservoirs: ["oort-cloud"], showers: ["meteor_shower:perseids"], sources: ["nasa", "jpl"], description: "A large Halley-type comet on a 133-year orbit, the parent body of the reliable Perseid meteor shower each August." }),
  mk({ slug: "churyumov-gerasimenko", name: "67P/Churyumov–Gerasimenko", existing: true, category: "periodic", designation: "67P/Churyumov–Gerasimenko", discoveredBy: "Klim Churyumov, Svetlana Gerasimenko", discoveryYear: "1969", typeLabel: "Jupiter-family comet", period: 6.45, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], visitedBy: ["rosetta"], sources: ["esa", "jpl"], description: "The bilobed Jupiter-family comet orbited and landed on by ESA's Rosetta and Philae in 2014–2016 — the most closely studied comet in history." }),
  mk({ slug: "tempel-1", name: "Tempel 1", existing: true, category: "periodic", designation: "9P/Tempel 1", discoveredBy: "Ernst Wilhelm Tempel", discoveryYear: "1867", typeLabel: "Jupiter-family comet", period: 5.6, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], visitedBy: ["deep-impact", "stardust"], sources: ["nasa", "jpl"], description: "A Jupiter-family comet struck by NASA's Deep Impact probe in 2005 and later revisited by Stardust, revealing the composition beneath a comet's crust." }),
  mk({ slug: "wild-2", name: "Wild 2", existing: true, category: "periodic", designation: "81P/Wild 2", discoveredBy: "Paul Wild", discoveryYear: "1978", typeLabel: "Jupiter-family comet", period: 6.4, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], visitedBy: ["stardust"], sampleReturnBy: ["stardust"], sources: ["nasa", "jpl"], description: "A Jupiter-family comet from which NASA's Stardust captured coma dust and returned it to Earth in 2006 — the first cometary sample return." }),
  mk({ slug: "borrelly", name: "Borrelly", existing: true, category: "periodic", designation: "19P/Borrelly", discoveredBy: "Alphonse Borrelly", discoveryYear: "1904", typeLabel: "Jupiter-family comet", period: 6.8, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], visitedBy: ["deep-space-1"], sources: ["nasa", "jpl"], description: "A Jupiter-family comet whose bowling-pin-shaped nucleus was imaged by NASA's Deep Space 1 in 2001." }),
  mk({ slug: "hale-bopp", name: "Hale–Bopp", existing: true, category: "great-comet", designation: "C/1995 O1 (Hale–Bopp)", discoveredBy: "Alan Hale, Thomas Bopp", discoveryYear: "1995", typeLabel: "Long-period comet", perihelionDate: "1997-04-01", classes: ["long-period"], reservoirs: ["oort-cloud"], great: true, sources: ["nasa", "jpl"], description: "The 'Great Comet of 1997', a long-period comet with an exceptionally large, active nucleus that remained visible to the naked eye for a record 18 months." }),
  mk({ slug: "hyakutake", name: "Hyakutake", existing: true, category: "great-comet", designation: "C/1996 B2 (Hyakutake)", discoveredBy: "Yuji Hyakutake", discoveryYear: "1996", typeLabel: "Long-period comet", perihelionDate: "1996-05-01", classes: ["long-period"], reservoirs: ["oort-cloud"], great: true, sources: ["nasa", "jpl"], description: "The 'Great Comet of 1996', which passed very close to Earth and displayed one of the longest comet tails ever recorded." }),
  mk({ slug: "comet-neowise", name: "NEOWISE", existing: true, category: "great-comet", designation: "C/2020 F3 (NEOWISE)", discoveredBy: "NEOWISE space telescope", discoveryYear: "2020", typeLabel: "Long-period comet", perihelionDate: "2020-07-03", classes: ["long-period"], reservoirs: ["oort-cloud"], great: true, sources: ["nasa", "jpl"], description: "The brightest comet visible from the Northern Hemisphere since Hale–Bopp, a naked-eye spectacle in July 2020 discovered by the NEOWISE space telescope." }),
  mk({ slug: "shoemaker-levy-9", name: "Shoemaker–Levy 9", existing: true, category: "periodic", designation: "D/1993 F2", discoveredBy: "Carolyn & Eugene Shoemaker, David Levy", discoveryYear: "1993", typeLabel: "Jupiter-family comet (destroyed)", fragmented: true, related: ["planet:jupiter"], sources: ["nasa", "jpl"], description: "A comet captured into orbit around Jupiter that was torn into more than 20 fragments by tidal forces and spectacularly impacted the planet in July 1994 — the first collision of Solar System bodies ever observed." }),

  /* ---------------- New periodic comets ---------------- */
  mk({ slug: "encke", name: "Encke", category: "periodic", designation: "2P/Encke", discoveredBy: "Pierre Méchain; period computed by Johann Encke", discoveryYear: "1786", typeLabel: "Jupiter-family comet", period: 3.3, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], showers: ["meteor_shower:taurids"], sources: ["nasa", "jpl"], description: "The comet with the shortest known orbital period (about 3.3 years) and the parent of the Taurid meteor stream." }),
  mk({ slug: "tempel-tuttle", name: "Tempel–Tuttle", category: "periodic", designation: "55P/Tempel–Tuttle", discoveredBy: "Ernst Tempel, Horace Tuttle", discoveryYear: "1865", typeLabel: "Halley-type comet", period: 33, classes: ["halley-type"], reservoirs: ["oort-cloud"], showers: ["meteor_shower:leonids"], sources: ["nasa", "jpl"], description: "The parent comet of the Leonid meteor shower, whose 33-year returns produce the periodic Leonid storms." }),
  mk({ slug: "giacobini-zinner", name: "Giacobini–Zinner", category: "periodic", designation: "21P/Giacobini–Zinner", discoveredBy: "Michel Giacobini, Ernst Zinner", discoveryYear: "1900", typeLabel: "Jupiter-family comet", period: 6.6, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], showerNote: "Parent of the Draconid meteor shower.", sources: ["nasa", "jpl"], description: "A Jupiter-family comet, parent of the Draconid meteor shower, and the first comet ever visited by a spacecraft — NASA's ICE probe flew through its tail in 1985." }),
  mk({ slug: "grigg-skjellerup", name: "Grigg–Skjellerup", category: "periodic", designation: "26P/Grigg–Skjellerup", discoveredBy: "John Grigg, John Skjellerup", discoveryYear: "1902", typeLabel: "Jupiter-family comet", period: 5.3, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], visitedBy: ["giotto"], sources: ["esa", "jpl"], description: "A Jupiter-family comet visited by ESA's Giotto in 1992 during its extended mission, after Giotto's earlier encounter with Halley." }),
  mk({ slug: "schwassmann-wachmann-3", name: "Schwassmann–Wachmann 3", category: "periodic", designation: "73P/Schwassmann–Wachmann 3", discoveredBy: "Arnold Schwassmann, Arno Arthur Wachmann", discoveryYear: "1930", typeLabel: "Jupiter-family comet", period: 5.4, fragmented: true, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], sources: ["nasa", "jpl"], description: "A Jupiter-family comet that began fragmenting in 1995 and has since broken into dozens of pieces — a rare chance to watch a comet disintegrate over successive returns." }),
  mk({ slug: "hartley-2", name: "Hartley 2", category: "periodic", designation: "103P/Hartley 2", discoveredBy: "Malcolm Hartley", discoveryYear: "1986", typeLabel: "Jupiter-family comet", period: 6.5, classes: ["jupiter-family"], reusedReservoirs: ["minor_planet_group:scattered-disc"], visitedBy: ["epoxi"], sources: ["nasa", "jpl"], description: "A small, hyperactive Jupiter-family comet flown past by NASA's EPOXI mission (the repurposed Deep Impact spacecraft) in 2010." }),

  /* ---------------- New long-period / great / sungrazing comets ---------------- */
  mk({ slug: "mcnaught", name: "McNaught", category: "great-comet", designation: "C/2006 P1 (McNaught)", discoveredBy: "Robert McNaught", discoveryYear: "2006", typeLabel: "Long-period comet", perihelionDate: "2007-01-12", classes: ["long-period"], reservoirs: ["oort-cloud"], great: true, sources: ["nasa", "jpl"], description: "The 'Great Comet of 2007', the brightest comet in decades, whose vast fanned dust tail was a spectacular sight from the Southern Hemisphere." }),
  mk({ slug: "lovejoy", name: "Lovejoy", category: "sungrazer", designation: "C/2011 W3 (Lovejoy)", discoveredBy: "Terry Lovejoy", discoveryYear: "2011", typeLabel: "Kreutz sungrazer", perihelionDate: "2011-12-16", sungrazer: true, family: "kreutz-sungrazers", classes: ["sungrazing"], sources: ["nasa", "jpl"], description: "A Kreutz sungrazing comet that unexpectedly survived a passage through the Sun's corona in December 2011, emerging to display a bright tail." }),
  mk({ slug: "ikeya-seki", name: "Ikeya–Seki", category: "sungrazer", designation: "C/1965 S1 (Ikeya–Seki)", discoveredBy: "Kaoru Ikeya, Tsutomu Seki", discoveryYear: "1965", typeLabel: "Kreutz sungrazer", perihelionDate: "1965-10-21", great: true, sungrazer: true, family: "kreutz-sungrazers", classes: ["sungrazing"], sources: ["nasa", "jpl"], description: "One of the brightest comets of the past thousand years — a Kreutz sungrazer that became visible in daylight near the Sun in October 1965." }),
  mk({ slug: "siding-spring", name: "Siding Spring", category: "long-period", designation: "C/2013 A1 (Siding Spring)", discoveredBy: "Robert McNaught (Siding Spring Survey)", discoveryYear: "2013", typeLabel: "Long-period comet", perihelionDate: "2014-10-25", classes: ["long-period"], reservoirs: ["oort-cloud"], related: ["planet:mars"], sources: ["nasa", "jpl"], description: "A long-period comet that made an exceptionally close pass of Mars in October 2014, observed up close by the fleet of Mars orbiters and rovers." }),
  mk({ slug: "thatcher", name: "Thatcher", category: "long-period", designation: "C/1861 G1 (Thatcher)", discoveredBy: "A. E. Thatcher", discoveryYear: "1861", typeLabel: "Long-period comet", period: 415, classes: ["long-period"], reservoirs: ["oort-cloud"], showerNote: "Parent of the annual Lyrid meteor shower.", sources: ["nasa", "jpl"], description: "A long-period comet on a roughly 415-year orbit, the parent body of the Lyrid meteor shower seen each April." }),
];
