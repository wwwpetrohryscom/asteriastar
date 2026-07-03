import { engine } from "@/platform/data-engine";
import type { SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";

/**
 * Engine-driven discovery hubs for the Satellite Encyclopedia. Every hub is a pure
 * query over engine.satellites; filters are honest — a satellite with an unknown
 * value is simply excluded from that hub rather than assigned an invented one. The
 * "firsts" set is a curated reference list of historic milestone satellites (not
 * fabricated data).
 */
export interface SatelliteDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => SatelliteRecord[];
}

const e = engine.satellites;

// Historic milestone satellites (a curated reference list of real firsts).
const FIRSTS = ["explorer-1", "vanguard-1", "tiros-1", "telstar-1", "early-bird", "landsat-1", "molniya"];

export const SATELLITE_DISCOVERIES: SatelliteDiscovery[] = [
  { slug: "all-satellites", title: "All Satellites", description: "Every individual satellite modelled in the encyclopedia, across all applications.", view: "table", get: () => e.satellites() },
  { slug: "constellations", title: "Satellite Constellations", description: "Multi-satellite systems — from GPS and Galileo to Starlink and OneWeb.", view: "cards", get: () => e.constellations() },
  { slug: "communications", title: "Communications Satellites", description: "Satellites and constellations that relay voice, data, television, and internet.", view: "cards", get: () => [...e.byCategory("communications"), ...e.constellations().filter((c) => c.category === "communications")] },
  { slug: "navigation", title: "Navigation Satellites", description: "The global navigation satellite systems — GPS, Galileo, GLONASS, and BeiDou.", view: "cards", get: () => e.constellations().filter((c) => c.category === "navigation") },
  { slug: "earth-observation", title: "Earth-Observation Satellites", description: "Satellites that image and measure the land, ocean, and atmosphere.", view: "cards", get: () => e.byCategory("earth-observation") },
  { slug: "weather", title: "Weather Satellites", description: "Geostationary and polar-orbiting satellites that watch the Earth's weather.", view: "cards", get: () => e.byCategory("weather") },
  { slug: "science", title: "Scientific Satellites", description: "Satellites dedicated to studying the Earth system — gravity, ice, soil, and clouds.", view: "cards", get: () => e.byCategory("science") },
  { slug: "astronomy", title: "Astronomy Satellites", description: "Space-based observatories that study the sky rather than the Earth.", view: "cards", get: () => e.byCategory("astronomy") },
  { slug: "commercial", title: "Commercial Satellites", description: "Privately-operated Earth-imaging and connectivity satellites and constellations.", view: "cards", get: () => [...e.byCategory("commercial"), ...e.constellations().filter((c) => c.category === "commercial")] },
  { slug: "technology", title: "Technology Demonstrators", description: "Satellites that pioneered new techniques — from solar power to solar sailing.", view: "cards", get: () => e.byCategory("technology") },
  { slug: "active-satellites", title: "Active Satellites", description: "Satellites currently operating in orbit.", view: "table", get: () => e.active() },
  { slug: "historic-satellites", title: "Historic Satellites", description: "Retired satellites that shaped the space age.", view: "cards", get: () => e.historical() },
  { slug: "satellite-firsts", title: "Satellite Firsts", description: "Milestone satellites that did something for the first time.", view: "cards", get: () => e.bySlugs(FIRSTS) },
  { slug: "low-earth-orbit", title: "Low Earth Orbit (LEO)", description: "Satellites and constellations in the busy low-Earth-orbit regime.", view: "cards", get: () => e.byOrbit("leo") },
  { slug: "medium-earth-orbit", title: "Medium Earth Orbit (MEO)", description: "Satellites in medium Earth orbit — home of the navigation constellations.", view: "cards", get: () => e.byOrbit("meo") },
  { slug: "geostationary", title: "Geostationary Satellites", description: "Satellites parked over the equator, fixed above one point on the Earth.", view: "cards", get: () => e.byOrbit("geo") },
  { slug: "sun-synchronous", title: "Sun-Synchronous Satellites", description: "Earth-observation satellites in the constant-illumination sun-synchronous orbit.", view: "cards", get: () => e.byOrbit("sso") },
  { slug: "polar-orbit", title: "Polar-Orbiting Satellites", description: "Satellites that pass near the poles to survey the whole rotating planet.", view: "cards", get: () => e.byOrbit("polar") },
];

const BY_SLUG = new Map(SATELLITE_DISCOVERIES.map((d) => [d.slug, d]));
export function getSatelliteDiscovery(slug: string): SatelliteDiscovery | undefined {
  return BY_SLUG.get(slug);
}
