import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Launch vehicles. Existing `launch_vehicle:*` entities are ENRICHED
 * (`existing: true`, never recreated); the rest are created. Payload/dimension
 * figures are included ONLY where well-documented and are otherwise omitted —
 * never invented. Reusability and human-rating are set only where established.
 */
type Ve = {
  slug: string;
  name: string;
  existing?: boolean;
  family?: string;
  provider: string; // organization slug (operator)
  country: string;
  firstFlight?: string;
  lastFlight?: string;
  status: string;
  payloadLeoKg?: number;
  payloadGtoKg?: number;
  heightM?: number;
  stageCount?: number;
  reusable?: boolean;
  humanRated?: boolean;
  liftClass?: string;
  pads?: string[];
  program?: string;
  derivedFrom?: string;
  succeededBy?: string;
  stages?: string[];
  engines?: string[]; // direct vehicle→engine when no stage entities are modeled
  related?: string[]; // existing graph ids (missions/spacecraft) to link
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (v: Ve): RocketRecord => ({
  id: `launch_vehicle:${v.slug}`,
  slug: v.slug,
  name: v.name,
  kind: "vehicle",
  existing: v.existing,
  altNames: v.alt,
  description: v.description,
  sources: v.sources ?? ["nasa"],
  familySlug: v.family,
  providerSlug: v.provider,
  programSlug: v.program,
  padSlugs: v.pads,
  stageSlugs: v.stages,
  engineSlugs: v.engines,
  derivedFromSlug: v.derivedFrom,
  succeededBySlug: v.succeededBy,
  relatedKeys: v.related,
  country: v.country,
  firstFlight: v.firstFlight,
  lastFlight: v.lastFlight,
  status: v.status,
  payloadLeoKg: v.payloadLeoKg,
  payloadGtoKg: v.payloadGtoKg,
  heightM: v.heightM,
  stageCount: v.stageCount,
  reusable: v.reusable,
  humanRated: v.humanRated,
  liftClass: v.liftClass,
});

export const vehicles: RocketRecord[] = [
  /* ---------------- United States ---------------- */
  mk({ slug: "saturn-i", name: "Saturn I", family: "saturn", provider: "nasa", country: "United States", firstFlight: "1961", lastFlight: "1965", status: "Retired", stageCount: 2, reusable: false, liftClass: "Medium-lift", sources: ["nasa"], description: "NASA's first heavy-lift rocket and the first designed for spaceflight rather than as a missile; it flight-tested Apollo hardware and clustered eight engines in its first stage." }),
  mk({ slug: "saturn-ib", name: "Saturn IB", existing: true, family: "saturn", provider: "nasa", country: "United States", firstFlight: "1966", lastFlight: "1975", status: "Retired", stageCount: 2, reusable: false, humanRated: true, liftClass: "Heavy-lift", pads: ["slc-37b"], engines: ["j-2"], program: "apollo", sources: ["nasa"], description: "A NASA heavy-lift launch vehicle used for early Apollo Earth-orbit tests, the Skylab crews, and the Apollo–Soyuz Test Project." }),
  mk({ slug: "saturn-v", name: "Saturn V", existing: true, family: "saturn", provider: "nasa", country: "United States", firstFlight: "1967", lastFlight: "1973", status: "Retired", payloadLeoKg: 140000, heightM: 110.6, stageCount: 3, reusable: false, humanRated: true, liftClass: "Super heavy-lift", pads: ["lc-39a"], stages: ["s-ic", "s-ii", "s-ivb"], program: "apollo", succeededBy: "space-launch-system", related: ["space_mission:apollo-11"], sources: ["nasa"], description: "A NASA super heavy-lift launch vehicle that carried every crewed Apollo mission to the Moon and launched the Skylab station." }),
  mk({ slug: "space-shuttle", name: "Space Shuttle", provider: "nasa", country: "United States", firstFlight: "1981", lastFlight: "2011", status: "Retired", payloadLeoKg: 27500, stageCount: 2, reusable: true, humanRated: true, liftClass: "Heavy-lift", pads: ["lc-39a", "lc-39b"], stages: ["shuttle-srb"], program: "space-shuttle-program", sources: ["nasa"], alt: ["STS", "Space Transportation System"], description: "NASA's partially reusable crewed launch system — a winged orbiter with an external tank and two solid rocket boosters — that flew 135 missions building the ISS and servicing Hubble." }),
  mk({ slug: "space-launch-system", name: "Space Launch System (SLS)", existing: true, family: "sls", provider: "nasa", country: "United States", firstFlight: "2022", status: "Active", payloadLeoKg: 95000, stageCount: 2, reusable: false, humanRated: true, liftClass: "Super heavy-lift", pads: ["lc-39b"], stages: ["sls-core", "sls-srb"], program: "artemis", derivedFrom: "space-shuttle", sources: ["nasa"], alt: ["SLS"], description: "NASA's super heavy-lift rocket for the Artemis program, which launched the uncrewed Artemis I around the Moon in 2022." }),
  mk({ slug: "atlas-v", name: "Atlas V", existing: true, family: "atlas", provider: "ula", country: "United States", firstFlight: "2002", status: "Active", stageCount: 2, reusable: false, liftClass: "Medium-lift", pads: ["slc-41"], engines: ["rd-180", "rl10"], succeededBy: "vulcan-centaur", sources: ["ula"], description: "An expendable launch vehicle by United Launch Alliance that has flown many NASA science and planetary missions." }),
  mk({ slug: "delta-ii", name: "Delta II", family: "delta", provider: "ula", country: "United States", firstFlight: "1989", lastFlight: "2018", status: "Retired", reusable: false, liftClass: "Medium-lift", pads: ["slc-17"], sources: ["ula"], description: "A highly reliable medium-lift workhorse that launched GPS satellites and many NASA planetary missions, including the Mars rovers Spirit and Opportunity and the Kepler telescope." }),
  mk({ slug: "delta-iv-heavy", name: "Delta IV Heavy", existing: true, family: "delta", provider: "ula", country: "United States", firstFlight: "2004", lastFlight: "2024", status: "Retired", payloadLeoKg: 28800, stageCount: 2, reusable: false, liftClass: "Heavy-lift", pads: ["slc-37b"], engines: ["rs-68", "rl10"], sources: ["ula"], description: "A heavy-lift expendable rocket by United Launch Alliance, retired in 2024, used for national-security and high-energy science launches such as Parker Solar Probe." }),
  mk({ slug: "vulcan-centaur", name: "Vulcan Centaur", existing: true, family: "atlas", provider: "ula", country: "United States", firstFlight: "2024", status: "Active", stageCount: 2, reusable: false, liftClass: "Heavy-lift", pads: ["slc-41"], engines: ["be-4", "rl10"], derivedFrom: "atlas-v", sources: ["ula"], alt: ["Vulcan"], description: "United Launch Alliance's successor to the Atlas V and Delta IV families, using BE-4 engines and a Centaur upper stage." }),
  mk({ slug: "titan-ii", name: "Titan II GLV", family: "titan", provider: "lockheed-martin", country: "United States", firstFlight: "1964", lastFlight: "1966", status: "Retired", reusable: false, humanRated: true, liftClass: "Medium-lift", engines: ["lr-87"], program: "gemini", sources: ["gunters"], alt: ["Titan II"], description: "The human-rated Titan II Gemini Launch Vehicle, adapted from an ICBM to carry the two-person Gemini spacecraft into orbit." }),
  mk({ slug: "titan-iv", name: "Titan IV", family: "titan", provider: "lockheed-martin", country: "United States", firstFlight: "1989", lastFlight: "2005", status: "Retired", reusable: false, liftClass: "Heavy-lift", engines: ["lr-87"], sources: ["gunters"], description: "The largest and last of the Titan family — a heavy-lift launcher for large U.S. national-security satellites and the Cassini–Huygens mission to Saturn." }),
  mk({ slug: "falcon-1", name: "Falcon 1", family: "falcon", provider: "spacex", country: "United States", firstFlight: "2006", lastFlight: "2009", status: "Retired", stageCount: 2, reusable: false, liftClass: "Small-lift", sources: ["spacex"], description: "SpaceX's first rocket and the first privately developed liquid-fueled launcher to reach orbit, in 2008 — the proving ground for the Merlin engine." }),
  mk({ slug: "falcon-9", name: "Falcon 9", existing: true, family: "falcon", provider: "spacex", country: "United States", firstFlight: "2010", status: "Active", payloadLeoKg: 22800, heightM: 70, stageCount: 2, reusable: true, humanRated: true, liftClass: "Medium-lift", pads: ["lc-39a", "slc-40", "slc-4e"], stages: ["falcon-9-first-stage", "falcon-9-second-stage"], sources: ["spacex"], description: "A partially reusable two-stage orbital rocket by SpaceX, the most-flown vehicle in the world with a reusable first stage." }),
  mk({ slug: "falcon-heavy", name: "Falcon Heavy", existing: true, family: "falcon", provider: "spacex", country: "United States", firstFlight: "2018", status: "Active", payloadLeoKg: 63800, stageCount: 2, reusable: true, liftClass: "Super heavy-lift", pads: ["lc-39a"], engines: ["merlin-1d"], derivedFrom: "falcon-9", sources: ["spacex"], description: "A heavy-lift rocket by SpaceX built from three Falcon 9 cores, with reusable side boosters." }),
  mk({ slug: "starship", name: "Starship", existing: true, provider: "spacex", country: "United States", firstFlight: "2023", status: "In development", stageCount: 2, reusable: true, liftClass: "Super heavy-lift", pads: ["olp-starbase"], engines: ["raptor"], sources: ["spacex"], description: "A fully reusable super heavy-lift launch system by SpaceX intended for crewed and cargo flights to orbit, the Moon, and Mars." }),
  mk({ slug: "antares", name: "Antares", provider: "northrop-grumman", country: "United States", firstFlight: "2013", lastFlight: "2023", status: "Retired", stageCount: 2, reusable: false, liftClass: "Medium-lift", pads: ["wallops-0a"], sources: ["gunters"], description: "A medium-lift rocket operated by Northrop Grumman that launched Cygnus cargo spacecraft to the ISS; the flown Antares 230+ retired in 2023 after its Russian/Ukrainian first-stage supply was cut, pending the U.S.-built Antares 330." }),
  mk({ slug: "pegasus", name: "Pegasus", provider: "northrop-grumman", country: "United States", firstFlight: "1990", status: "Active", payloadLeoKg: 450, stageCount: 3, reusable: false, liftClass: "Small-lift", sources: ["gunters"], description: "An air-launched, three-stage solid-fueled small rocket dropped from a carrier aircraft to place small satellites into low Earth orbit." }),
  mk({ slug: "minotaur", name: "Minotaur", provider: "northrop-grumman", country: "United States", firstFlight: "2000", status: "Active", reusable: false, liftClass: "Small-lift", sources: ["gunters"], description: "A family of solid-fueled small launchers built from surplus Minuteman and Peacekeeper missile motors for U.S. government payloads." }),
  mk({ slug: "electron", name: "Electron", existing: true, provider: "rocket-lab", country: "United States / New Zealand", firstFlight: "2017", status: "Active", payloadLeoKg: 300, stageCount: 2, reusable: true, liftClass: "Small-lift", engines: ["rutherford"], succeededBy: "neutron", sources: ["rocketlab"], description: "A small-lift orbital rocket by Rocket Lab for dedicated small-satellite launches, with electric-pump-fed engines and recoverable first stages." }),
  mk({ slug: "neutron", name: "Neutron", provider: "rocket-lab", country: "United States", status: "In development", payloadLeoKg: 13000, stageCount: 2, reusable: true, liftClass: "Medium-lift", sources: ["rocketlab"], description: "Rocket Lab's reusable medium-lift methane/LOX rocket in development, with a reusable first stage and integrated fairing." }),
  mk({ slug: "new-glenn", name: "New Glenn", existing: true, provider: "blue-origin", country: "United States", firstFlight: "2025", status: "Active", payloadLeoKg: 45000, stageCount: 2, reusable: true, liftClass: "Heavy-lift", engines: ["be-4", "be-3"], sources: ["blueorigin"], description: "A heavy-lift, partially reusable rocket developed by Blue Origin, with a reusable BE-4-powered first stage." }),
  mk({ slug: "new-shepard", name: "New Shepard", provider: "blue-origin", country: "United States", firstFlight: "2015", status: "Active", reusable: true, humanRated: true, liftClass: "Suborbital", engines: ["be-3"], sources: ["blueorigin"], description: "Blue Origin's fully reusable suborbital vehicle for research payloads and crewed flights above the Kármán line; it lands its booster propulsively." }),
  mk({ slug: "terran-r", name: "Terran R", provider: "relativity-space", country: "United States", status: "In development", stageCount: 2, reusable: true, liftClass: "Heavy-lift", sources: ["gunters"], description: "Relativity Space's reusable heavy-lift methane/LOX rocket, built largely by large-scale additive manufacturing." }),
  mk({ slug: "firefly-alpha", name: "Firefly Alpha", provider: "firefly-aerospace", country: "United States", firstFlight: "2021", status: "Active", payloadLeoKg: 1000, stageCount: 2, reusable: false, liftClass: "Small-lift", sources: ["gunters"], description: "A small-to-medium-lift two-stage rocket operated by Firefly Aerospace for dedicated small-satellite launches." }),

  /* ---------------- Europe ---------------- */
  mk({ slug: "ariane-1", name: "Ariane 1", family: "ariane", provider: "arianespace", country: "Europe", firstFlight: "1979", lastFlight: "1986", status: "Retired", stageCount: 3, reusable: false, liftClass: "Medium-lift", pads: ["ela-1"], succeededBy: "ariane-2", sources: ["esa"], description: "Europe's first launcher, which established independent access to space and orbited the Giotto probe to Halley's Comet." }),
  mk({ slug: "ariane-2", name: "Ariane 2", family: "ariane", provider: "arianespace", country: "Europe", firstFlight: "1986", lastFlight: "1989", status: "Retired", reusable: false, liftClass: "Medium-lift", derivedFrom: "ariane-1", sources: ["esa"], description: "An uprated single-payload development of Ariane 1 with a more powerful third stage." }),
  mk({ slug: "ariane-3", name: "Ariane 3", family: "ariane", provider: "arianespace", country: "Europe", firstFlight: "1984", lastFlight: "1989", status: "Retired", reusable: false, liftClass: "Medium-lift", derivedFrom: "ariane-1", sources: ["esa"], description: "An Ariane variant adding two solid strap-on boosters and dual-payload capability for commercial satellites." }),
  mk({ slug: "ariane-4", name: "Ariane 4", family: "ariane", provider: "arianespace", country: "Europe", firstFlight: "1988", lastFlight: "2003", status: "Retired", stageCount: 3, reusable: false, liftClass: "Medium-lift", derivedFrom: "ariane-3", succeededBy: "ariane-5", sources: ["esa"], description: "A highly successful and flexible Ariane variant with multiple booster configurations that dominated the commercial launch market in the 1990s." }),
  mk({ slug: "ariane-5", name: "Ariane 5", existing: true, family: "ariane", provider: "arianespace", country: "Europe", firstFlight: "1996", lastFlight: "2023", status: "Retired", stageCount: 2, reusable: false, liftClass: "Heavy-lift", pads: ["ela-3"], stages: ["ariane5-epc", "ariane5-eap"], engines: ["vulcain-2", "hm7b", "aestus"], succeededBy: "ariane-6", sources: ["arianespace", "esa"], description: "A European heavy-lift rocket operated by Arianespace, which launched the James Webb Space Telescope in 2021 before retiring in 2023." }),
  mk({ slug: "ariane-6", name: "Ariane 6", existing: true, family: "ariane", provider: "arianespace", country: "Europe", firstFlight: "2024", status: "Active", stageCount: 2, reusable: false, liftClass: "Heavy-lift", pads: ["ela-4"], engines: ["vulcain-2", "vinci"], derivedFrom: "ariane-5", sources: ["arianespace", "esa"], description: "Europe's successor to Ariane 5, designed for greater flexibility and lower cost, with a restartable Vinci upper stage." }),
  mk({ slug: "vega", name: "Vega", provider: "arianespace", country: "Europe", firstFlight: "2012", lastFlight: "2024", status: "Retired", payloadLeoKg: 1500, stageCount: 4, reusable: false, liftClass: "Small-lift", pads: ["slp-kourou"], succeededBy: "vega-c", sources: ["arianespace", "esa"], description: "Europe's small-lift launcher with three solid stages and a liquid upper stage, for small scientific and Earth-observation satellites." }),
  mk({ slug: "vega-c", name: "Vega-C", provider: "arianespace", country: "Europe", firstFlight: "2022", status: "Active", payloadLeoKg: 2300, stageCount: 4, reusable: false, liftClass: "Small-lift", pads: ["slp-kourou"], derivedFrom: "vega", sources: ["arianespace", "esa"], description: "An upgraded, more capable Vega with larger solid motors and a common booster shared with Ariane 6." }),

  /* ---------------- Russia / Soviet Union ---------------- */
  mk({ slug: "r-7-semyorka", name: "R-7 Semyorka", family: "r-7", provider: "roscosmos", country: "Soviet Union", firstFlight: "1957", status: "Retired", reusable: false, liftClass: "Medium-lift", pads: ["gagarins-start"], engines: ["rd-107"], sources: ["gunters"], alt: ["Semyorka"], description: "The world's first intercontinental ballistic missile, which in 1957 launched Sputnik 1 and founded the most prolific rocket lineage in history." }),
  mk({ slug: "soyuz", name: "Soyuz", existing: true, family: "r-7", provider: "roscosmos", country: "Russia", firstFlight: "1966", status: "Active", reusable: false, humanRated: true, liftClass: "Medium-lift", pads: ["gagarins-start"], engines: ["rd-107"], derivedFrom: "r-7-semyorka", sources: ["roscosmos"], description: "A long-serving family of Russian expendable rockets that has carried crews and cargo to orbit for over five decades." }),
  mk({ slug: "proton", name: "Proton", existing: true, provider: "roscosmos", country: "Russia", firstFlight: "1965", status: "Active", payloadLeoKg: 23000, stageCount: 3, reusable: false, liftClass: "Heavy-lift", pads: ["lc-81-baikonur"], sources: ["roscosmos"], alt: ["Proton-M"], description: "A Russian heavy-lift rocket using storable hypergolic propellants, used to launch interplanetary probes, large satellites, and space-station modules." }),
  mk({ slug: "angara", name: "Angara A5", provider: "roscosmos", country: "Russia", firstFlight: "2014", status: "Active", payloadLeoKg: 24000, stageCount: 3, reusable: false, liftClass: "Heavy-lift", pads: ["plesetsk-35"], succeededBy: undefined, sources: ["gunters"], alt: ["Angara"], description: "Russia's modular heavy-lift launcher built from common URM core boosters and burning kerosene/LOX, intended to replace the Proton." }),
  mk({ slug: "energia", name: "Energia", provider: "roscosmos", country: "Soviet Union", firstFlight: "1987", lastFlight: "1988", status: "Retired", payloadLeoKg: 100000, stageCount: 2, reusable: false, liftClass: "Super heavy-lift", engines: ["rd-170"], sources: ["gunters"], description: "The Soviet super heavy-lift rocket that launched the uncrewed Buran shuttle, flying only twice before the program ended." }),
  mk({ slug: "zenit", name: "Zenit", provider: "roscosmos", country: "Ukraine / Russia", firstFlight: "1985", status: "Retired", stageCount: 2, reusable: false, liftClass: "Medium-lift", pads: ["baikonur-45"], engines: ["rd-170"], sources: ["gunters"], description: "A Ukrainian-designed medium-lift kerosene/LOX rocket whose first stage traces to the Energia boosters, flown from Baikonur and the Sea Launch ocean platform." }),
  mk({ slug: "n1", name: "N1", provider: "roscosmos", country: "Soviet Union", firstFlight: "1969", lastFlight: "1972", status: "Retired", stageCount: 5, reusable: false, liftClass: "Super heavy-lift", engines: ["nk-15"], sources: ["gunters"], description: "The Soviet super heavy-lift Moon rocket; all four launch attempts (1969–1972) failed and the program was cancelled. The flown vehicle used Kuznetsov NK-15 engines; the improved NK-33 (for the never-flown N1F) flew decades later on other rockets." }),

  /* ---------------- China ---------------- */
  mk({ slug: "long-march-2f", name: "Long March 2F", family: "long-march", provider: "cnsa", country: "China", firstFlight: "1999", status: "Active", payloadLeoKg: 8400, stageCount: 2, reusable: false, humanRated: true, liftClass: "Medium-lift", pads: ["jiuquan-921"], sources: ["gunters"], alt: ["CZ-2F"], description: "China's only human-rated launch vehicle, which carries the Shenzhou spacecraft with crews to the Tiangong space station." }),
  mk({ slug: "long-march-3b", name: "Long March 3B", existing: true, family: "long-march", provider: "cnsa", country: "China", firstFlight: "1996", status: "Active", reusable: false, liftClass: "Heavy-lift", pads: ["xichang-2"], sources: ["gunters"], alt: ["CZ-3B"], description: "A Chinese launch vehicle widely used for geostationary satellites and several Chang'e lunar missions." }),
  mk({ slug: "long-march-5", name: "Long March 5", existing: true, family: "long-march", provider: "cnsa", country: "China", firstFlight: "2016", status: "Active", payloadLeoKg: 25000, stageCount: 2, reusable: false, liftClass: "Heavy-lift", pads: ["wenchang-101"], engines: ["yf-77", "yf-100"], sources: ["gunters"], alt: ["CZ-5"], description: "China's heavy-lift rocket, used to launch the Tianwen-1 Mars mission, Chang'e lunar sample-return missions, and Tiangong station modules." }),
  mk({ slug: "long-march-7", name: "Long March 7", family: "long-march", provider: "cnsa", country: "China", firstFlight: "2016", status: "Active", stageCount: 2, reusable: false, liftClass: "Medium-lift", pads: ["wenchang-201"], engines: ["yf-100"], sources: ["gunters"], alt: ["CZ-7"], description: "A modern kerosene/LOX medium-lift Long March that launches the Tianzhou cargo spacecraft to the Tiangong station." }),
  mk({ slug: "long-march-9", name: "Long March 9", family: "long-march", provider: "cnsa", country: "China", status: "In development", reusable: false, liftClass: "Super heavy-lift", sources: ["gunters"], alt: ["CZ-9"], description: "A super heavy-lift launch vehicle in development for China's planned crewed lunar and deep-space missions." }),

  /* ---------------- Japan ---------------- */
  mk({ slug: "h-ii", name: "H-II", family: "h-rocket", provider: "jaxa", country: "Japan", firstFlight: "1994", lastFlight: "1999", status: "Retired", stageCount: 2, reusable: false, liftClass: "Medium-lift", pads: ["yoshinobu"], succeededBy: "h-iia", sources: ["jaxa"], description: "Japan's first entirely domestically developed launch vehicle, using cryogenic LH2/LOX stages." }),
  mk({ slug: "h-iia", name: "H-IIA", existing: true, family: "h-rocket", provider: "jaxa", country: "Japan", firstFlight: "2001", lastFlight: "2025", status: "Retired", stageCount: 2, reusable: false, liftClass: "Medium-lift", pads: ["yoshinobu"], engines: ["le-7a"], derivedFrom: "h-ii", succeededBy: "h3", sources: ["jaxa"], description: "A Japanese launch vehicle that flew JAXA science missions including Hayabusa2 and the Akatsuki Venus orbiter." }),
  mk({ slug: "h3", name: "H3", family: "h-rocket", provider: "jaxa", country: "Japan", firstFlight: "2023", status: "Active", stageCount: 2, reusable: false, liftClass: "Medium-lift", pads: ["yoshinobu"], engines: ["le-9"], derivedFrom: "h-iia", sources: ["jaxa"], description: "JAXA's new-generation launch vehicle with the expander-bleed LE-9 engine, designed for lower cost and higher flexibility than the H-IIA." }),
  mk({ slug: "epsilon", name: "Epsilon", provider: "jaxa", country: "Japan", firstFlight: "2013", status: "Active", payloadLeoKg: 1200, stageCount: 3, reusable: false, liftClass: "Small-lift", sources: ["jaxa"], description: "A Japanese solid-fueled small-lift rocket derived from the H-IIA's booster technology, launched from the Uchinoura Space Center for small scientific satellites." }),

  /* ---------------- India ---------------- */
  mk({ slug: "pslv", name: "PSLV", existing: true, provider: "isro", country: "India", firstFlight: "1993", status: "Active", payloadLeoKg: 3800, stageCount: 4, reusable: false, liftClass: "Medium-lift", pads: ["first-launch-pad"], engines: ["vikas"], sources: ["isro"], alt: ["Polar Satellite Launch Vehicle"], description: "ISRO's reliable workhorse rocket, which launched Chandrayaan-1 and the Mars Orbiter Mission (Mangalyaan)." }),
  mk({ slug: "gslv", name: "GSLV", existing: true, provider: "isro", country: "India", firstFlight: "2001", status: "Active", stageCount: 3, reusable: false, liftClass: "Medium-lift", pads: ["second-launch-pad"], engines: ["vikas"], sources: ["isro"], alt: ["Geosynchronous Satellite Launch Vehicle"], description: "ISRO's launcher for heavier payloads to geostationary transfer orbit, used for Chandrayaan-2, with an indigenous cryogenic upper stage." }),
  mk({ slug: "lvm3", name: "LVM3", provider: "isro", country: "India", firstFlight: "2017", status: "Active", payloadLeoKg: 10000, stageCount: 3, reusable: false, humanRated: false, liftClass: "Medium-lift", pads: ["second-launch-pad"], engines: ["vikas", "ce-20"], sources: ["isro"], alt: ["GSLV Mk III", "LVM-3"], description: "ISRO's most powerful operational rocket, which launched Chandrayaan-2 and Chandrayaan-3 and is being human-rated for the Gaganyaan program." }),
  mk({ slug: "sslv", name: "SSLV", provider: "isro", country: "India", firstFlight: "2022", status: "Active", payloadLeoKg: 500, stageCount: 4, reusable: false, liftClass: "Small-lift", pads: ["first-launch-pad"], sources: ["isro"], alt: ["Small Satellite Launch Vehicle"], description: "ISRO's small-satellite launch vehicle, designed for low-cost, on-demand launches of small payloads to low Earth orbit." }),

  /* ---------------- Other commercial ---------------- */
  mk({ slug: "spectrum", name: "Spectrum", provider: "isar-aerospace", country: "Germany", firstFlight: "2025", status: "In development", stageCount: 2, reusable: false, liftClass: "Small-lift", sources: ["gunters"], description: "A small-lift two-stage rocket developed by Germany's Isar Aerospace for the European small-satellite market." }),
  mk({ slug: "miura-5", name: "Miura 5", provider: "pld-space", country: "Spain", status: "In development", stageCount: 2, reusable: true, liftClass: "Small-lift", sources: ["gunters"], alt: ["Miura"], description: "PLD Space's orbital small-lift rocket in development, following the suborbital Miura 1, with plans to recover the first stage." }),
  mk({ slug: "launcherone", name: "LauncherOne", provider: "virgin-orbit", country: "United States", firstFlight: "2020", lastFlight: "2023", status: "Retired", stageCount: 2, reusable: false, liftClass: "Small-lift", sources: ["gunters"], description: "An air-launched, two-stage small rocket released from a modified Boeing 747; it reached orbit before Virgin Orbit ceased operations in 2023." }),
];
