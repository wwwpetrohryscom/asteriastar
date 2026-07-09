import { eng, type EngRecord } from "@/knowledge-graph/data/space-engineering-catalog/types";

/** Rocketry principles & performance metrics (space_engineering_concept), reusing engine/stage hardware. */
export const performance: EngRecord[] = [
  eng("performance", {
    slug: "tsiolkovsky-rocket-equation",
    name: "The Tsiolkovsky Rocket Equation",
    altNames: ["The ideal rocket equation"],
    symbolLabel: "Δv = vₑ ln(m₀ / m_f)",
    description:
      "The founding relation of astronautics, derived by Konstantin Tsiolkovsky in 1903: the velocity change a rocket can achieve equals its exhaust velocity times the natural logarithm of the ratio of its starting mass to its empty mass. Because the mass ratio enters logarithmically, reaching high Δv demands either very high exhaust velocity or an impractically large fraction of propellant — the 'tyranny' that shapes every mission design.",
    relatedKeys: ["space_engineering_concept:delta-v-budget", "space_engineering_concept:specific-impulse", "space_engineering_concept:rocket-staging"],
    highlights: ["Δv = vₑ ln(m₀/m_f) — the equation behind every launch"],
  }),
  eng("performance", {
    slug: "specific-impulse",
    name: "Specific Impulse",
    altNames: ["Isp"],
    symbolLabel: "Iₛₚ = F / (ṁ · g₀)",
    description:
      "The standard measure of a rocket's fuel efficiency: the thrust produced per unit weight-flow of propellant, expressed in seconds. Higher specific impulse means more velocity change from the same propellant. Chemical engines reach roughly 300–450 seconds; electric thrusters, trading thrust for efficiency, reach thousands.",
    relatedKeys: ["space_engineering_concept:tsiolkovsky-rocket-equation", "propellant:lh2-lox", "spacecraft_component:ion-thruster"],
    highlights: ["Fuel efficiency in seconds — chemical ~450 s, electric thousands"],
  }),
  eng("performance", {
    slug: "thrust-to-weight-ratio",
    name: "Thrust-to-Weight Ratio",
    description:
      "The ratio of an engine's or vehicle's thrust to its weight. To lift off, a launch vehicle's thrust must exceed its weight — a thrust-to-weight ratio above one — while efficient upper-stage and in-space engines can operate well below one. It is the counterpoint to specific impulse: high-thrust engines often trade away efficiency, and vice versa.",
    relatedKeys: ["rocket_engine:f-1", "rocket_engine:merlin-1d", "space_engineering_concept:specific-impulse"],
    highlights: ["Must exceed one to lift off the pad"],
  }),
  eng("performance", {
    slug: "delta-v-budget",
    name: "The Delta-v Budget",
    altNames: ["Δv budget"],
    description:
      "An accounting of every velocity change a mission requires — launch to orbit, orbital transfers, planetary capture, landing, and margins — summed into a total 'delta-v budget' that the propulsion system must deliver. Comparing the budget against what the rocket equation allows is the central feasibility check of mission design.",
    relatedKeys: ["space_engineering_concept:tsiolkovsky-rocket-equation", "space_engineering_concept:rocket-staging"],
    highlights: ["The velocity-change ledger a mission must pay"],
  }),
  eng("performance", {
    slug: "rocket-staging",
    name: "Rocket Staging",
    altNames: ["Multistage rocket"],
    description:
      "The practice of discarding spent tanks and engines during ascent so the rocket no longer has to accelerate empty mass. Staging sidesteps the rocket equation's steep penalty on mass ratio and is how essentially every orbital launch vehicle reaches space — from the Saturn V's three stages to the Falcon 9's two.",
    relatedKeys: ["space_engineering_concept:tsiolkovsky-rocket-equation", "rocket_stage:s-ic", "rocket_stage:falcon-9-first-stage"],
    highlights: ["Shedding dead weight to beat the rocket equation"],
  }),
  eng("performance", {
    slug: "thrust-vector-control",
    name: "Thrust Vector Control",
    altNames: ["TVC", "Engine gimballing"],
    description:
      "Steering a rocket by aiming its thrust — most often by gimballing the engines on hydraulic or electric actuators, and sometimes with vanes or differential throttling. Because a climbing rocket is aerodynamically unstable, thrust vector control is what keeps it pointed and on course from liftoff through staging.",
    relatedKeys: ["space_engineering_concept:rocket-staging", "rocket_engine:merlin-1d", "spacecraft_component:reaction-control-system"],
    highlights: ["Steering by aiming the engines"],
  }),
];
