import type { RocketRecord, StageRole } from "@/knowledge-graph/data/rockets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Rocket stages (first-class entities) for flagship vehicles. Each is linked to
 * its vehicle via has_stage (authored on the vehicle), powered_by its engine(s),
 * and uses_propellant. Engine counts are given where well-documented.
 */
type St = {
  slug: string;
  name: string;
  role: StageRole;
  number?: number;
  engines: string[]; // engine slugs
  propellant: string; // propellant slug
  engineCount?: number;
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (s: St): RocketRecord => ({
  id: `rocket_stage:${s.slug}`,
  slug: s.slug,
  name: s.name,
  kind: "stage",
  altNames: s.alt,
  description: s.description,
  sources: s.sources ?? ["nasa"],
  engineSlugs: s.engines,
  propellantSlugs: [s.propellant],
  stageRole: s.role,
  stageNumber: s.number,
  engineCount: s.engineCount,
});

export const stages: RocketRecord[] = [
  // Saturn V
  mk({ slug: "s-ic", name: "S-IC (Saturn V first stage)", role: "first", number: 1, engines: ["f-1"], propellant: "rp1-lox", engineCount: 5, sources: ["nasa"], description: "The Saturn V first stage, powered by five F-1 engines burning RP-1 and liquid oxygen — the stage that generated the Saturn V's ~34 MN of liftoff thrust." }),
  mk({ slug: "s-ii", name: "S-II (Saturn V second stage)", role: "second", number: 2, engines: ["j-2"], propellant: "lh2-lox", engineCount: 5, sources: ["nasa"], description: "The Saturn V second stage, powered by five J-2 engines burning liquid hydrogen and liquid oxygen." }),
  mk({ slug: "s-ivb", name: "S-IVB (Saturn upper stage)", role: "upper", number: 3, engines: ["j-2"], propellant: "lh2-lox", engineCount: 1, sources: ["nasa"], description: "The restartable single-J-2 upper stage used as the Saturn V third stage and the Saturn IB second stage; its restart performed trans-lunar injection for Apollo." }),
  // Space Shuttle / SLS solid boosters
  mk({ slug: "shuttle-srb", name: "Space Shuttle Solid Rocket Booster", role: "booster", engines: [], propellant: "solid-apcp", sources: ["nasa"], alt: ["SRB"], description: "The pair of reusable solid rocket boosters that provided most of the Space Shuttle's liftoff thrust before being recovered from the ocean by parachute." }),
  mk({ slug: "sls-core", name: "SLS Core Stage", role: "core", number: 1, engines: ["rs-25"], propellant: "lh2-lox", engineCount: 4, sources: ["nasa"], description: "The SLS core stage, powered by four RS-25 engines (repurposed Space Shuttle main engines) burning liquid hydrogen and liquid oxygen." }),
  mk({ slug: "sls-srb", name: "SLS Solid Rocket Booster", role: "booster", engines: [], propellant: "solid-apcp", sources: ["nasa"], description: "The pair of five-segment solid rocket boosters, derived from the Shuttle SRBs, that provide most of the SLS's liftoff thrust." }),
  // Falcon 9
  mk({ slug: "falcon-9-first-stage", name: "Falcon 9 first stage", role: "first", number: 1, engines: ["merlin-1d"], propellant: "rp1-lox", engineCount: 9, sources: ["spacex"], description: "The reusable Falcon 9 first stage, powered by nine Merlin 1D engines and recovered by propulsive landing on a droneship or landing pad." }),
  mk({ slug: "falcon-9-second-stage", name: "Falcon 9 second stage", role: "upper", number: 2, engines: ["merlin-1d"], propellant: "rp1-lox", engineCount: 1, sources: ["spacex"], description: "The expendable Falcon 9 upper stage, powered by a single vacuum-optimized Merlin engine." }),
  // Ariane 5
  mk({ slug: "ariane5-epc", name: "Ariane 5 core stage (EPC)", role: "core", number: 1, engines: ["vulcain-2"], propellant: "lh2-lox", engineCount: 1, sources: ["arianespace", "esa"], alt: ["EPC"], description: "The Ariane 5 cryogenic main stage (Étage Principal Cryotechnique), powered by a single Vulcain 2 engine burning liquid hydrogen and liquid oxygen." }),
  mk({ slug: "ariane5-eap", name: "Ariane 5 solid boosters (EAP)", role: "booster", engines: [], propellant: "solid-apcp", sources: ["arianespace", "esa"], alt: ["EAP"], description: "The pair of large solid rocket boosters (Étage d'Accélération à Poudre) that provide most of Ariane 5's liftoff thrust." }),
];
