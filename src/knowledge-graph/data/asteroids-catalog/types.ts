import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Asteroids & Minor Planets Encyclopedia data model (Program Y).
 *
 * Hand-curated from authoritative public sources — the IAU Minor Planet Center
 * (MPC), NASA/JPL Small-Body Database and CNEOS, and agency mission pages. EVERY
 * technical field is optional and omitted when not reliably known: orbits, sizes,
 * masses, rotation periods, taxonomy, discovery dates, discoverers, families, and
 * missions are NEVER invented. Cross-references reuse existing graph entities — the
 * five dwarf planets, the ten asteroids already modelled, the small-body missions
 * (Dawn, Hayabusa/2, OSIRIS-REx, DART, Psyche, Lucy…), observatories, and
 * organizations — this program duplicates none of them.
 */

export type MinorBodyKind =
  | "asteroid" // individual asteroid / minor planet (existing type — reuse)
  | "dwarf-planet" // reused dwarf planet (existing type — never created here)
  | "family" // collisional family
  | "group" // dynamical minor-planet population
  | "neo-class" // near-Earth orbit class (Apollo/Aten/Amor/Atira)
  | "trojan-group" // Lagrangian Trojan camp / population
  | "resonance" // mean-motion orbital resonance
  | "impact" // terrestrial impact event
  | "mission"; // small-body mission not yet in the graph (reused type — no page)

/** The graph EntityType each kind maps to. asteroid/dwarf-planet/mission reuse existing types. */
export const KIND_ENTITY_TYPE: Record<MinorBodyKind, EntityType> = {
  asteroid: "asteroid",
  "dwarf-planet": "dwarf_planet",
  family: "asteroid_family",
  group: "minor_planet_group",
  "neo-class": "near_earth_object",
  "trojan-group": "trojan_group",
  resonance: "orbital_resonance",
  impact: "impact_event",
  mission: "space_mission",
};

export const KIND_LABEL: Record<MinorBodyKind, string> = {
  asteroid: "Asteroid",
  "dwarf-planet": "Dwarf planet",
  family: "Asteroid family",
  group: "Minor-planet group",
  "neo-class": "Near-Earth object class",
  "trojan-group": "Trojan group",
  resonance: "Orbital resonance",
  impact: "Impact event",
  mission: "Mission",
};

/** Broad application/browse category — drives some discovery hubs (not a graph entity). */
export type BodyCategory =
  | "main-belt"
  | "near-earth"
  | "trojan"
  | "centaur"
  | "trans-neptunian"
  | "dwarf-planet"
  | "impactor";

export interface MinorBodyRecord {
  /* --- identity / graph --- */
  id: string; // "<type>:<slug>"
  slug: string;
  name: string;
  kind: MinorBodyKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references by slug / id (resolved in the index; reuse existing entities) --- */
  familySlug?: string; // asteroid → its collisional family
  groupSlugs?: string[]; // asteroid → dynamical population(s) (minor_planet_group)
  neoClassSlug?: string; // asteroid → near-Earth orbit class
  trojanGroupSlugs?: string[]; // asteroid → Trojan camp / population
  resonanceSlug?: string; // asteroid/group/trojan → orbital resonance it shares
  parentBodySlug?: string; // a moonlet → its primary; a family → its parent body
  systemPrimarySlug?: string; // a member of a binary/triple system → the primary
  visitedBySlugs?: string[]; // → space_mission that flew by / orbited / impacted
  sampleReturnBySlugs?: string[]; // → space_mission that returned a sample
  targetOfSlugs?: string[]; // → en-route / planned mission targeting this body
  relatedKeys?: string[]; // full ids of existing entities to link (associated_with)

  /* --- display specs, ALL optional, never invented --- */
  category?: BodyCategory;
  designation?: string; // formal MPC designation, e.g. "(4) Vesta", "(65803) Didymos"
  discoveredBy?: string;
  discoveryYear?: string;
  discoveryLocation?: string;
  spectralType?: string; // taxonomy, e.g. "C", "S", "M", "V", "B", "D"
  taxonomyClass?: "carbonaceous" | "silicaceous" | "metallic" | "basaltic" | "other"; // broad class for hubs

  // orbital
  semiMajorAxisAu?: number;
  perihelionAu?: number;
  aphelionAu?: number;
  eccentricity?: number;
  inclinationDeg?: number;
  orbitalPeriodYears?: number;
  absoluteMagnitudeH?: number;

  // physical
  meanDiameterKm?: number;
  dimensionsLabel?: string; // for irregular bodies, e.g. "1120 × 1000 × 950 km"
  rotationPeriodHours?: number;
  massKg?: number;
  albedo?: number;

  // classification flags
  pha?: boolean; // Potentially Hazardous Asteroid (objective MPC/CNEOS criterion)
  systemType?: "binary" | "triple"; // multiple-body system
  moons?: string[]; // named satellites (descriptive)

  // group / neo-class / trojan / resonance metadata
  regionLabel?: string; // where a population sits, e.g. "2.0–3.3 AU"
  definition?: string; // the objective definition of a class/population
  lagrangePoint?: "L4" | "L5"; // Trojan camp
  resonanceRatio?: string; // e.g. "3:2", "2:3", "1:1"
  resonanceWithSlug?: string; // planet the resonance is with (reused planet id)

  // impact metadata
  impactDate?: string;
  impactLocation?: string;
  energyLabel?: string; // e.g. "~440 kilotons TNT"
  impactorSizeLabel?: string;
  craterLabel?: string;

  highlights?: string[];
}
