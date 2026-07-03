import { engine } from "@/platform/data-engine";
import type { CometRecord } from "@/knowledge-graph/data/comets-catalog/types";

/**
 * Engine-driven discovery hubs for the Comets & Small-Body Reservoirs Encyclopedia.
 * Every hub is a pure query over engine.comets; filters are honest — a comet with an
 * unknown value is simply excluded rather than assigned an invented one. Reservoir
 * hubs for the Kuiper Belt and Centaurs are represented on the hub page by links to
 * Program Y's dynamical-group pages (reused, not duplicated) rather than as separate,
 * empty comet hubs.
 */
export interface CometDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => CometRecord[];
}

const e = engine.comets;

export const COMET_DISCOVERIES: CometDiscovery[] = [
  { slug: "all-comets", title: "All Comets", description: "Every comet and transition object modelled in the encyclopedia.", view: "table", get: () => e.comets() },
  { slug: "periodic-comets", title: "Periodic Comets", description: "Comets that return on measured orbits, from Encke's 3.3 years to Halley's 76.", view: "table", get: () => e.periodicComets() },
  { slug: "long-period-comets", title: "Long-Period Comets", description: "Comets on orbits longer than ~200 years, arriving from the Oort cloud.", view: "cards", get: () => e.longPeriodComets() },
  { slug: "great-comets", title: "Great Comets", description: "The rare, brilliant comets that become naked-eye spectacles — Hale–Bopp, NEOWISE, McNaught, and more.", view: "cards", get: () => e.greatComets() },
  { slug: "jupiter-family-comets", title: "Jupiter-Family Comets", description: "Short-period comets shepherded by Jupiter, originating in the scattered disc.", view: "cards", get: () => e.byClass("jupiter-family") },
  { slug: "halley-type-comets", title: "Halley-Type Comets", description: "Periodic comets with intermediate orbits of decades to two centuries.", view: "cards", get: () => e.byClass("halley-type") },
  { slug: "sungrazing-comets", title: "Sungrazing Comets", description: "Comets that skim the Sun at perihelion, most of them members of the Kreutz family.", view: "cards", get: () => e.sungrazers() },
  { slug: "main-belt-comets", title: "Main-Belt Comets", description: "Bodies on asteroid-belt orbits that display recurring comet-like activity.", view: "cards", get: () => e.byClass("main-belt-comet") },
  { slug: "oort-cloud-comets", title: "Oort Cloud Comets", description: "Comets whose source is the distant, spherical Oort cloud.", view: "cards", get: () => e.byReservoir("oort-cloud") },
  { slug: "scattered-disc-comets", title: "Scattered-Disc Comets", description: "Jupiter-family comets sourced from the scattered disc beyond Neptune (reusing Program Y's population).", view: "cards", get: () => e.reusedReservoirMembers("minor_planet_group:scattered-disc") },
  { slug: "meteor-shower-parents", title: "Meteor-Shower Parent Bodies", description: "The comets and asteroids whose debris streams produce the annual meteor showers.", view: "cards", get: () => e.meteorShowerParents() },
  { slug: "comet-missions", title: "Comet Missions", description: "Comets and transition objects that have been visited by a spacecraft.", view: "cards", get: () => e.cometMissionTargets() },
  { slug: "sample-return-comets", title: "Sample-Return Comets", description: "Comets from which spacecraft have returned material to Earth.", view: "cards", get: () => e.sampleReturnComets() },
  { slug: "planetary-defense-comets", title: "Planetary-Defense Comets", description: "Comets relevant to impact studies — the Jupiter impactor Shoemaker–Levy 9 and the Mars close-approacher Siding Spring.", view: "cards", get: () => e.planetaryDefenseComets() },
  { slug: "historic-comets", title: "Historic Comets", description: "The great and periodic comets discovered before the twentieth century.", view: "cards", get: () => e.historicComets() },
  { slug: "transition-objects", title: "Transition Objects", description: "Objects that blur the line between asteroid and comet — active asteroids and dormant comets.", view: "cards", get: () => e.transitionObjects() },
  { slug: "active-asteroids", title: "Active Asteroids", description: "Asteroids that show comet-like activity, such as the Geminids parent Phaethon.", view: "cards", get: () => e.activeAsteroids() },
  { slug: "dormant-comets", title: "Dormant Comets", description: "Extinct or dormant cometary nuclei on comet-like orbits.", view: "cards", get: () => e.dormantComets() },
];

const BY_SLUG = new Map(COMET_DISCOVERIES.map((d) => [d.slug, d]));
export function getCometDiscovery(slug: string): CometDiscovery | undefined {
  return BY_SLUG.get(slug);
}
