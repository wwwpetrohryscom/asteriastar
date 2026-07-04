import type { SysRecord } from "@/knowledge-graph/data/spacecraft-systems-catalog/types";

/** Spacecraft components — the parts that make up each subsystem. */
const c = (subsystemSlug: string, category: SysRecord["category"]) => (r: Omit<SysRecord, "kind" | "id" | "subsystemSlug" | "category"> & { slug: string }): SysRecord => ({ ...r, kind: "component", id: `spacecraft_component:${r.slug}`, subsystemSlug, category });

const power = c("electrical-power", "power");
const prop = c("propulsion", "propulsion");
const att = c("attitude-control", "attitude");
const av = c("command-and-data-handling", "avionics");
const th = c("thermal-control", "thermal");
const edl = c("entry-descent-and-landing", "edl");
const str = c("structure", "structure");
const rob = c("robotics", "robotics");

export const components: SysRecord[] = [
  /* power */
  power({ slug: "solar-array", name: "Solar Array", description: "Panels of photovoltaic cells that convert sunlight into electricity — the primary power source for most spacecraft in the inner Solar System. Beyond Jupiter, sunlight becomes too weak and other sources are needed.", sources: ["nasa"], highlights: ["The workhorse power source of the inner Solar System"] }),
  power({ slug: "battery", name: "Battery", description: "Rechargeable batteries store energy from the solar arrays to power a spacecraft through eclipse, at night, or during peak demand. Lithium-ion has largely replaced older nickel chemistries.", sources: ["nasa"] }),
  power({ slug: "rtg", name: "Radioisotope Thermoelectric Generator (RTG)", altNames: ["RTG"], description: "A nuclear power source that converts the heat of decaying plutonium-238 directly into electricity. RTGs let missions operate far from the Sun or through the lunar night — powering Voyager, Cassini, and the nuclear Mars rovers Curiosity and Perseverance (the earlier rovers were solar-powered).", sources: ["nasa", "jpl"], highlights: ["Powers deep-space missions where sunlight is too weak"] }),
  power({ slug: "fuel-cell", name: "Fuel Cell", description: "A device that generates electricity by combining hydrogen and oxygen, producing water as a by-product. Fuel cells powered the Apollo and Space Shuttle missions, useful for short crewed flights needing high power.", sources: ["nasa"] }),
  /* propulsion */
  prop({ slug: "chemical-propulsion", name: "Chemical Propulsion", description: "Thrusters and engines that burn propellants for high thrust — the standard means of orbit insertion and large manoeuvres, using monopropellants (hydrazine) or bipropellants.", sources: ["nasa"] }),
  prop({ slug: "ion-thruster", name: "Ion Thruster", altNames: ["Gridded ion thruster"], description: "A gridded electrostatic thruster that ionises a propellant (usually xenon) and accelerates it with electric-field grids to very high exhaust velocity. It delivers tiny thrust but sips fuel, enabling missions like Deep Space 1 and Dawn.", sources: ["nasa", "jpl"], highlights: ["Gentle but ultra-efficient; enabled Deep Space 1 and Dawn"] }),
  prop({ slug: "hall-effect-thruster", name: "Hall-Effect Thruster", description: "A type of electric propulsion that traps electrons in a magnetic field to ionise and accelerate propellant. Widely used for satellite station-keeping and, increasingly, for deep-space missions — NASA's Psyche is the first to fly Hall-effect thrusters beyond lunar orbit.", sources: ["nasa", "esa"], highlights: ["Psyche is the first to fly Hall thrusters beyond the Moon"] }),
  prop({ slug: "cold-gas-thruster", name: "Cold-Gas Thruster", description: "The simplest thruster — it just releases a stored, pressurised gas through a nozzle. Low-performance but reliable, used for fine attitude control and on small spacecraft.", sources: ["nasa"] }),
  prop({ slug: "nuclear-thermal-propulsion", name: "Nuclear Thermal Propulsion", description: "A propulsion concept that heats a propellant with a nuclear reactor for high thrust and efficiency. Long studied and tested on the ground, it is a candidate for future fast crewed trips to Mars.", sources: ["nasa"] }),
  prop({ slug: "reaction-control-system", name: "Reaction Control System (RCS)", altNames: ["RCS"], description: "A set of small thrusters arranged around a spacecraft for precise control of orientation and small translations — used for pointing, docking, and stabilisation.", sources: ["nasa"] }),
  /* attitude */
  att({ slug: "reaction-wheel", name: "Reaction Wheel", description: "A spinning flywheel that a spacecraft speeds up or slows down to rotate itself, by conservation of angular momentum, without using any propellant — the workhorse of precise pointing.", sources: ["nasa", "esa"], highlights: ["Turns a spacecraft using no fuel"] }),
  att({ slug: "control-moment-gyro", name: "Control Moment Gyroscope (CMG)", altNames: ["CMG"], description: "A spinning gyroscope whose axis is tilted to produce large control torques efficiently — used on big, agile spacecraft such as the International Space Station and Earth-imaging satellites.", sources: ["nasa"] }),
  /* avionics */
  av({ slug: "flight-computer", name: "Flight Computer", description: "The central processor that runs a spacecraft — executing command sequences, controlling subsystems, and reacting to faults. Deep-space computers are radiation-hardened and modest by consumer standards, prizing reliability over speed.", sources: ["nasa", "jpl"] }),
  av({ slug: "onboard-software", name: "Onboard Flight Software", description: "The programs that fly the spacecraft — running the control loops, sequences, and autonomy. Flight software is exhaustively tested, because a bug billions of kilometres away cannot be fixed by hand.", sources: ["nasa", "jpl"] }),
  av({ slug: "radiation-hardened-memory", name: "Radiation-Hardened Memory", description: "Memory and electronics designed to withstand the charged particles of space, which can flip bits or damage circuits. Error-correcting codes and hardened parts keep the computer trustworthy.", sources: ["nasa"] }),
  av({ slug: "fault-management", name: "Fault Management", description: "The onboard logic that detects, isolates, and recovers from failures autonomously — putting the spacecraft into a safe state and calling home when it cannot resolve a problem itself.", sources: ["nasa", "jpl"] }),
  /* thermal */
  th({ slug: "radiator", name: "Radiator", description: "A surface that sheds a spacecraft's waste heat into space by infrared radiation — the only way to cool in a vacuum, where there is no air to carry heat away.", sources: ["nasa"] }),
  th({ slug: "multi-layer-insulation", name: "Multi-Layer Insulation (MLI)", altNames: ["MLI"], description: "The shiny, quilted blankets that wrap most spacecraft — many thin reflective layers that block radiative heat transfer, insulating against both the Sun's heat and the cold of space.", sources: ["nasa"], highlights: ["The gold blankets you see on spacecraft"] }),
  th({ slug: "heater", name: "Heater & Heat Pipe", description: "Electric heaters and passive heat pipes that keep components — propellant lines, batteries, instruments — above their minimum temperatures, moving heat from where it is made to where it is needed or shed.", sources: ["nasa"] }),
  /* structure */
  str({ slug: "primary-structure", name: "Primary Structure", description: "The main load-bearing frame of the spacecraft, which carries the launch loads and provides the rigid backbone to which everything else is mounted.", sources: ["nasa", "esa"] }),
  str({ slug: "deployable-mechanisms", name: "Deployable Mechanisms", description: "The hinges, booms, and release devices that unfold solar arrays, antennas, and instrument booms after launch — single-use mechanisms that must work the first time.", sources: ["nasa", "esa"] }),
  /* edl */
  edl({ slug: "heat-shield", name: "Heat Shield", description: "The ablative or reusable shield that protects a spacecraft from the searing heat of atmospheric entry, where air violently compressed ahead of the vehicle's bow shock can reach thousands of degrees (the heating is dominated by shock compression, not friction). Ablative shields char and carry heat away as they erode.", sources: ["nasa", "jpl"], highlights: ["Survives thousands of degrees at atmospheric entry"] }),
  edl({ slug: "parachute", name: "Parachute", description: "The decelerator that slows a spacecraft in an atmosphere after the heat shield has done its work — from the supersonic parachutes of Mars landers to the splashdown chutes of crew capsules.", sources: ["nasa"] }),
  edl({ slug: "retropropulsion", name: "Retropropulsion & Landing Systems", description: "The thrusters, legs, or airbags that manage the final touchdown — from the sky-crane of the Mars rovers to the propulsive landings of crew and booster vehicles.", sources: ["nasa", "jpl"] }),
  /* robotics */
  rob({ slug: "robotic-arm", name: "Robotic Arm", altNames: ["Canadarm", "Manipulator arm"], description: "A jointed manipulator used to move cargo, service hardware, capture spacecraft, or collect samples. The Shuttle's Canadarm helped assemble the Space Station and the permanently-installed Canadarm2 services it; planetary landers carry smaller sampling arms.", sources: ["nasa", "esa"], highlights: ["Canadarm2 builds and services the ISS"] }),
];
