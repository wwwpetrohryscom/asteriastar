import { eng, type EngRecord } from "@/knowledge-graph/data/space-engineering-catalog/types";

/** Propulsion-method concepts (space_engineering_concept), reusing the engine/thruster/propellant hardware. */
export const propulsion: EngRecord[] = [
  eng("propulsion", {
    slug: "electric-propulsion",
    name: "Electric Propulsion",
    description:
      "A family of thrusters that accelerate propellant using electrical energy rather than combustion, reaching exhaust velocities several times higher than chemical rockets. The trade is thrust: forces are gentle — millinewtons to newtons — so electric propulsion excels at station-keeping and patient deep-space cruises, as NASA's Dawn demonstrated in reaching both Vesta and Ceres.",
    relatedKeys: ["space_engineering_concept:specific-impulse", "spacecraft_component:ion-thruster", "spacecraft_component:hall-effect-thruster"],
    highlights: ["High exhaust velocity, gentle thrust — ideal for deep-space cruise"],
  }),
  eng("propulsion", {
    slug: "nuclear-electric-propulsion",
    name: "Nuclear Electric Propulsion",
    altNames: ["NEP"],
    description:
      "An architecture that pairs a space nuclear reactor with electric thrusters: the reactor generates electricity, which drives ion or Hall thrusters. Unlike solar-electric propulsion it is independent of distance from the Sun, making it a candidate for crewed missions to Mars and the outer Solar System. No nuclear-electric system has yet flown; it remains a design and technology-development goal.",
    relatedKeys: ["space_engineering_concept:electric-propulsion", "spacecraft_component:nuclear-thermal-propulsion", "exploration_architecture:crewed-deep-space-propulsion"],
    highlights: ["A reactor powering electric thrusters — not yet flown"],
  }),
  eng("propulsion", {
    slug: "vasimr",
    name: "VASIMR",
    altNames: ["Variable Specific Impulse Magnetoplasma Rocket"],
    description:
      "An electric-propulsion concept that heats propellant to a plasma with radio waves and confines and exhausts it with magnetic fields, in principle allowing the exhaust velocity to be tuned in flight. It has been tested on the ground but has not flown in space, and operating it at useful power levels would require an electrical source far beyond today's spacecraft.",
    relatedKeys: ["space_engineering_concept:electric-propulsion", "space_engineering_concept:nuclear-electric-propulsion"],
    highlights: ["Plasma heated by radio waves — ground-tested, not yet flown"],
  }),
  eng("propulsion", {
    slug: "arcjet",
    name: "Arcjet Thruster",
    description:
      "An electrothermal thruster that passes propellant through an electric arc, heating it far beyond what a chemical reaction alone allows before it expands through a nozzle. Arcjets have flown operationally for satellite station-keeping, offering higher exhaust velocity than cold-gas or simple resistojet systems.",
    relatedKeys: ["space_engineering_concept:electric-propulsion", "space_engineering_concept:resistojet"],
    highlights: ["Propellant superheated by an electric arc"],
  }),
  eng("propulsion", {
    slug: "resistojet",
    name: "Resistojet Thruster",
    description:
      "The simplest electric thruster: propellant is warmed by flowing over an electrically heated element and then expelled through a nozzle. Modest but reliable, resistojets have long been used for satellite attitude control and station-keeping, bridging cold-gas systems and higher-performance electric propulsion.",
    relatedKeys: ["space_engineering_concept:electric-propulsion", "spacecraft_component:cold-gas-thruster"],
    highlights: ["Propellant warmed by a heated element — simple and reliable"],
  }),
  eng("propulsion", {
    slug: "solar-sail",
    name: "Solar Sail",
    description:
      "Propulsion with no propellant at all: a large, lightweight reflective sail is pushed by the momentum of sunlight itself. The thrust is minute but continuous and free, building up large velocity changes over time. Japan's IKAROS proved the principle in interplanetary space in 2010, and The Planetary Society's LightSail 2 demonstrated sail-raised orbits around Earth.",
    relatedKeys: ["satellite:lightsail-2", "space_engineering_concept:delta-v-budget"],
    highlights: ["Pushed by sunlight — no propellant needed"],
  }),
  eng("propulsion", {
    slug: "monopropellant",
    name: "Monopropellant Propulsion",
    description:
      "A simple chemical system in which a single propellant — classically hydrazine — is decomposed over a catalyst bed to produce hot gas, needing no separate oxidiser or ignition. Monopropellant thrusters are workhorses for spacecraft attitude control and small maneuvers, valued for their simplicity and quick, repeatable pulses.",
    relatedKeys: ["space_engineering_concept:bipropellant", "spacecraft_component:reaction-control-system", "spacecraft_component:chemical-propulsion"],
    highlights: ["One propellant decomposed over a catalyst — no oxidiser"],
  }),
  eng("propulsion", {
    slug: "bipropellant",
    name: "Bipropellant Propulsion",
    description:
      "A chemical system that burns a separate fuel and oxidiser, releasing far more energy than a monopropellant and delivering higher exhaust velocity. Bipropellant engines — from hypergolic storable combinations to cryogenic hydrogen–oxygen — power launch vehicles, orbit-insertion burns, and deep-space main engines.",
    relatedKeys: ["space_engineering_concept:monopropellant", "spacecraft_component:chemical-propulsion", "propellant:mmh-n2o4"],
    highlights: ["Separate fuel and oxidiser — higher performance than monopropellant"],
  }),
  eng("propulsion", {
    slug: "staged-combustion-cycle",
    name: "Staged-Combustion Cycle",
    description:
      "A high-efficiency rocket-engine power cycle in which propellant burned in a preburner drives the turbopumps and is then routed into the main chamber, so almost none is wasted. It is harder to build than the simpler gas-generator cycle but yields higher performance; the Space Shuttle's RS-25 used it, and SpaceX's Raptor uses the even more demanding full-flow staged-combustion variant.",
    relatedKeys: ["rocket_engine:rs-25", "rocket_engine:raptor", "space_engineering_concept:specific-impulse"],
    highlights: ["Waste-nothing engine cycle — RS-25 and full-flow Raptor"],
  }),
];
