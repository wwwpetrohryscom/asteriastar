import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";

/**
 * Propellant combinations. Chemistry (fuel/oxidizer, phase, hypergolicity) is
 * well-established public knowledge; no performance figures are invented here.
 */
type P = {
  slug: string;
  name: string;
  fuel: string;
  oxidizer?: string;
  propellantClass: string;
  cryogenic?: boolean;
  hypergolic?: boolean;
  solid?: boolean;
  alt?: string[];
  description: string;
};
const mk = (p: P): RocketRecord => ({
  id: `propellant:${p.slug}`,
  slug: p.slug,
  name: p.name,
  kind: "propellant",
  altNames: p.alt,
  description: p.description,
  sources: ["nasa"],
  fuel: p.fuel,
  oxidizer: p.oxidizer,
  propellantClass: p.propellantClass,
  cryogenic: p.cryogenic,
  hypergolic: p.hypergolic,
  solid: p.solid,
});

export const propellants: RocketRecord[] = [
  mk({ slug: "rp1-lox", name: "RP-1 / LOX", fuel: "RP-1 (refined kerosene)", oxidizer: "Liquid oxygen (LOX)", propellantClass: "Semi-cryogenic", cryogenic: false, alt: ["Kerolox", "Kerosene/LOX"], description: "A refined-kerosene fuel burned with liquid oxygen. Dense and room-temperature-storable fuel with a cryogenic oxidizer; the workhorse first-stage combination from the Saturn V's F-1 to SpaceX's Merlin." }),
  mk({ slug: "lh2-lox", name: "LH2 / LOX", fuel: "Liquid hydrogen (LH2)", oxidizer: "Liquid oxygen (LOX)", propellantClass: "Cryogenic", cryogenic: true, alt: ["Hydrolox", "Hydrogen/LOX"], description: "Liquid hydrogen burned with liquid oxygen — the highest-performing chemical propellant by specific impulse, but low-density and deeply cryogenic. Used by the RS-25, RL10, Vulcain, and LE-7/LE-9." }),
  mk({ slug: "ch4-lox", name: "Methane / LOX", fuel: "Liquid methane (CH4)", oxidizer: "Liquid oxygen (LOX)", propellantClass: "Cryogenic", cryogenic: true, alt: ["Methalox", "LNG/LOX"], description: "Liquid methane burned with liquid oxygen. A modern choice balancing performance, density, and reusability (clean-burning, in-situ producible on Mars); used by Raptor, BE-4, and Vulcain-class successors." }),
  mk({ slug: "udmh-n2o4", name: "UDMH / N2O4", fuel: "Unsymmetrical dimethylhydrazine (UDMH)", oxidizer: "Dinitrogen tetroxide (N2O4)", propellantClass: "Hypergolic", hypergolic: true, alt: ["Hypergolic (UDMH)"], description: "A storable hypergolic combination that ignites on contact without an igniter. Long the mainstay of the Proton and early Long March vehicles; toxic and being phased out for new designs." }),
  mk({ slug: "mmh-n2o4", name: "MMH / N2O4", fuel: "Monomethylhydrazine (MMH)", oxidizer: "Dinitrogen tetroxide / MON (N2O4)", propellantClass: "Hypergolic", hypergolic: true, alt: ["Hypergolic (MMH)"], description: "A storable hypergolic combination used in upper stages and orbital-maneuvering systems where reliable restart matters, such as the Ariane 5 storable upper stage." }),
  mk({ slug: "aerozine50-n2o4", name: "Aerozine 50 / N2O4", fuel: "Aerozine 50 (UDMH + hydrazine)", oxidizer: "Dinitrogen tetroxide (N2O4)", propellantClass: "Hypergolic", hypergolic: true, description: "A hypergolic blend of UDMH and hydrazine with N2O4 oxidizer, used by the Titan family and various upper stages during the 20th century." }),
  mk({ slug: "solid-apcp", name: "Solid (APCP)", fuel: "Ammonium perchlorate composite propellant (APCP)", propellantClass: "Solid", solid: true, alt: ["Solid propellant", "APCP"], description: "A cast solid propellant of ammonium-perchlorate oxidizer, aluminium fuel, and a rubber binder. High thrust and simplicity, but not throttleable or shut-down-able once lit; used in the Shuttle/SLS boosters, Vega, and many strap-on boosters." }),
];
