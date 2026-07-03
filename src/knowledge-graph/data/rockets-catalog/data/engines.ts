import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Rocket engines. Cycle and propellant are well-established; thrust / specific
 * impulse are included ONLY where the value is iconic and unambiguous, and left
 * empty otherwise (versions and operating conditions vary). Never invented.
 */
type E = {
  slug: string;
  name: string;
  cycle: string;
  propellant: string; // propellant slug
  vehicles?: string[]; // launch_vehicle slugs it powers
  builtBy?: string; // organization slug (only when it is a real graph org)
  thrustSl?: number;
  thrustVac?: number;
  ispVac?: number;
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (e: E): RocketRecord => ({
  id: `rocket_engine:${e.slug}`,
  slug: e.slug,
  name: e.name,
  kind: "engine",
  altNames: e.alt,
  description: e.description,
  sources: e.sources ?? ["nasa"],
  engineCycle: e.cycle,
  propellantSlugs: [e.propellant],
  launchVehicleSlugs: e.vehicles,
  builtBySlug: e.builtBy,
  thrustSeaLevelKn: e.thrustSl,
  thrustVacuumKn: e.thrustVac,
  specificImpulseVacuumS: e.ispVac,
});

export const engines: RocketRecord[] = [
  mk({ slug: "f-1", name: "F-1", cycle: "Gas-generator", propellant: "rp1-lox", vehicles: ["saturn-v"], thrustSl: 6770, sources: ["nasa"], description: "The RP-1/LOX engine of the Saturn V first stage — five clustered F-1s remain the most powerful single-chamber liquid engines ever flown, lifting Apollo off the pad." }),
  mk({ slug: "j-2", name: "J-2", cycle: "Gas-generator", propellant: "lh2-lox", vehicles: ["saturn-v", "saturn-ib"], thrustVac: 1033, sources: ["nasa"], description: "The restartable LH2/LOX engine of the Saturn V second and third stages and the Saturn IB second stage; its S-IVB restart sent Apollo crews toward the Moon." }),
  mk({ slug: "rs-25", name: "RS-25", cycle: "Staged combustion", propellant: "lh2-lox", vehicles: ["space-launch-system"], thrustSl: 1860, thrustVac: 2279, ispVac: 452, sources: ["nasa"], alt: ["SSME", "Space Shuttle Main Engine"], description: "A reusable fuel-rich staged-combustion LH2/LOX engine developed for the Space Shuttle (as the SSME) and now expended on the SLS core stage; among the highest-efficiency hydrogen engines flown." }),
  mk({ slug: "rs-68", name: "RS-68", cycle: "Gas-generator", propellant: "lh2-lox", vehicles: ["delta-iv-heavy"], sources: ["nasa"], alt: ["RS-68A"], description: "A large LH2/LOX gas-generator engine developed for the Delta IV; designed for lower cost than the SSME, it powered the Delta IV and Delta IV Heavy cores." }),
  mk({ slug: "rl10", name: "RL10", cycle: "Expander", propellant: "lh2-lox", vehicles: ["atlas-v", "vulcan-centaur"], sources: ["nasa"], description: "A long-serving expander-cycle LH2/LOX upper-stage engine (first flown in the 1960s) that powers the Centaur and DCSS upper stages and continues on Vulcan Centaur." }),
  mk({ slug: "merlin-1d", name: "Merlin 1D", cycle: "Gas-generator", propellant: "rp1-lox", vehicles: ["falcon-9", "falcon-heavy"], builtBy: "spacex", thrustSl: 845, sources: ["spacex"], alt: ["Merlin"], description: "SpaceX's reusable RP-1/LOX gas-generator engine; nine power each Falcon 9 first stage and twenty-seven power the Falcon Heavy, with a vacuum variant on the upper stage." }),
  mk({ slug: "raptor", name: "Raptor", cycle: "Full-flow staged combustion", propellant: "ch4-lox", vehicles: ["starship"], builtBy: "spacex", sources: ["spacex"], description: "SpaceX's methane/LOX full-flow staged-combustion engine for Starship and its Super Heavy booster — one of very few full-flow engines ever flown, designed for rapid reuse. Thrust has risen across versions." }),
  mk({ slug: "rd-180", name: "RD-180", cycle: "Oxidizer-rich staged combustion", propellant: "rp1-lox", vehicles: ["atlas-v"], thrustSl: 3830, sources: ["gunters"], description: "A Russian two-chamber oxidizer-rich staged-combustion RP-1/LOX engine (derived from the RD-170) that powered the Atlas V first stage." }),
  mk({ slug: "rd-170", name: "RD-170 / RD-171", cycle: "Oxidizer-rich staged combustion", propellant: "rp1-lox", thrustSl: 7257, sources: ["gunters"], alt: ["RD-171"], description: "The most powerful liquid-propellant rocket engine ever flown — a four-chamber oxidizer-rich staged-combustion RP-1/LOX engine used on the Energia boosters and (as the RD-171) the Zenit first stage." }),
  mk({ slug: "rd-107", name: "RD-107 / RD-108", cycle: "Gas-generator", propellant: "rp1-lox", vehicles: ["soyuz"], sources: ["gunters"], alt: ["RD-108"], description: "The RP-1/LOX gas-generator engines of the R-7/Soyuz core and strap-on boosters — first flown in 1957 and, in evolved form, still launching crews to orbit." }),
  mk({ slug: "nk-15", name: "NK-15", cycle: "Oxidizer-rich staged combustion", propellant: "rp1-lox", vehicles: ["n1"], sources: ["gunters"], description: "The Kuznetsov oxidizer-rich staged-combustion RP-1/LOX engine that powered the Soviet N1 Moon rocket \u2014 thirty on the first stage alone \u2014 across its four failed launches." }),
  mk({ slug: "nk-33", name: "NK-33", cycle: "Oxidizer-rich staged combustion", propellant: "rp1-lox", sources: ["gunters"], alt: ["AJ-26"], description: "A lightweight high-performance oxidizer-rich staged-combustion RP-1/LOX engine developed in the Soviet N1 program for the upgraded (never-flown) N1F; refurbished units later flew (as the AJ-26) on the first-generation Antares." }),
  mk({ slug: "vulcain-2", name: "Vulcain 2", cycle: "Gas-generator", propellant: "lh2-lox", vehicles: ["ariane-5"], sources: ["arianespace", "esa"], alt: ["Vulcain"], description: "The LH2/LOX gas-generator core engine of Ariane 5 (and, as Vulcain 2.1, of the Ariane 6 core stage)." }),
  mk({ slug: "vinci", name: "Vinci", cycle: "Expander", propellant: "lh2-lox", vehicles: ["ariane-6"], sources: ["arianespace", "esa"], description: "A restartable closed-expander-cycle LH2/LOX upper-stage engine developed for Ariane 6, enabling multiple burns for complex mission profiles." }),
  mk({ slug: "hm7b", name: "HM7B", cycle: "Gas-generator", propellant: "lh2-lox", vehicles: ["ariane-5"], sources: ["arianespace", "esa"], description: "A LH2/LOX upper-stage engine that powered the cryogenic upper stage (ESC-A) of Ariane 5 and earlier Ariane vehicles." }),
  mk({ slug: "rutherford", name: "Rutherford", cycle: "Electric-pump-fed", propellant: "rp1-lox", vehicles: ["electron"], builtBy: "rocket-lab", sources: ["rocketlab"], description: "Rocket Lab's small RP-1/LOX engine — the first electric-pump-fed (battery-driven turbopump) engine to reach orbit; nine power the Electron first stage and one the second stage." }),
  mk({ slug: "be-4", name: "BE-4", cycle: "Oxidizer-rich staged combustion", propellant: "ch4-lox", vehicles: ["vulcan-centaur", "new-glenn"], builtBy: "blue-origin", sources: ["blueorigin"], description: "Blue Origin's methane/LOX oxidizer-rich staged-combustion engine, which powers both the ULA Vulcan Centaur first stage and Blue Origin's own New Glenn booster." }),
  mk({ slug: "be-3", name: "BE-3", cycle: "Tap-off", propellant: "lh2-lox", vehicles: ["new-glenn"], builtBy: "blue-origin", sources: ["blueorigin"], alt: ["BE-3PM", "BE-3U"], description: "Blue Origin's LH2/LOX engine — a combustion-tap-off variant (BE-3PM) powers the reusable New Shepard suborbital vehicle, and an upper-stage variant (BE-3U) flies on New Glenn." }),
  mk({ slug: "yf-100", name: "YF-100", cycle: "Oxidizer-rich staged combustion", propellant: "rp1-lox", vehicles: ["long-march-5"], sources: ["gunters"], description: "China's kerosene/LOX oxidizer-rich staged-combustion engine, used in the boosters of Long March 5 and the cores of Long March 6/7." }),
  mk({ slug: "yf-77", name: "YF-77", cycle: "Gas-generator", propellant: "lh2-lox", vehicles: ["long-march-5"], sources: ["gunters"], description: "China's first large LH2/LOX engine, two of which power the Long March 5 core stage." }),
  mk({ slug: "le-7a", name: "LE-7A", cycle: "Staged combustion", propellant: "lh2-lox", vehicles: ["h-iia"], sources: ["jaxa"], description: "A LH2/LOX staged-combustion engine that powers the first stage of Japan's H-IIA and H-IIB launch vehicles." }),
  mk({ slug: "le-9", name: "LE-9", cycle: "Expander bleed", propellant: "lh2-lox", sources: ["jaxa"], description: "A large LH2/LOX expander-bleed-cycle engine developed for the first stage of Japan's H3 rocket, chosen for reliability and lower cost." }),
  mk({ slug: "vikas", name: "Vikas", cycle: "Gas-generator", propellant: "udmh-n2o4", vehicles: ["pslv", "gslv"], builtBy: "isro", sources: ["isro"], description: "ISRO's storable-propellant (UDMH/N2O4) engine, used across the PSLV, GSLV, and LVM3 liquid stages and strap-on boosters." }),
  mk({ slug: "ce-20", name: "CE-20", cycle: "Gas-generator", propellant: "lh2-lox", builtBy: "isro", sources: ["isro"], description: "ISRO's indigenous LH2/LOX cryogenic upper-stage engine, which powers the C25 upper stage of the LVM3 (GSLV Mk III)." }),
  mk({ slug: "lr-87", name: "LR-87", cycle: "Gas-generator", propellant: "aerozine50-n2o4", vehicles: ["titan-ii", "titan-iv"], sources: ["gunters"], alt: ["LR-91"], description: "The hypergolic (Aerozine 50 / N2O4) first- and second-stage engines (LR-87 / LR-91) of the Titan II, III, and IV families, valued for storable-propellant readiness on ICBM-derived launchers." }),
  mk({ slug: "aestus", name: "Aestus", cycle: "Pressure-fed", propellant: "mmh-n2o4", vehicles: ["ariane-5"], sources: ["arianespace", "esa"], description: "A restartable pressure-fed engine burning the storable hypergolic combination MMH/N2O4, used on the Ariane 5 EPS storable upper stage for precise orbit insertion." }),
];
