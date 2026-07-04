import { engine } from "@/platform/data-engine";
import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

/**
 * Engine-driven discovery hubs for the Deep Space Communications & Navigation Encyclopedia.
 * Every hub is a pure query over engine.deepSpaceCommunications.
 */
export interface DSCommDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => DSCommRecord[];
}

const e = engine.deepSpaceCommunications;

export const DSCOMM_DISCOVERIES: DSCommDiscovery[] = [
  { slug: "networks", title: "Networks", description: "The deep-space and near-Earth communication networks — NASA's DSN, ESA's Estrack, the Near Space Network, and the national and commercial networks.", get: () => e.networks() },
  { slug: "tracking-stations", title: "Tracking Stations", description: "The deep-space ground complexes with giant antennas — Goldstone, Madrid, Canberra, and their counterparts worldwide.", get: () => e.trackingStations() },
  { slug: "ground-stations", title: "Ground Stations", description: "Near-Earth network ground terminals, including the TDRS gateway at White Sands and high-latitude stations.", get: () => e.groundStations() },
  { slug: "antennas", title: "Antennas", description: "The ground dishes and spacecraft antennas that carry deep-space signals, from 70 m giants to laser terminals.", get: () => e.antennas() },
  { slug: "signal-bands", title: "Signal Bands", description: "The radio and optical bands used for deep-space communication — S, X, Ka, UHF, and laser.", get: () => e.signalBands() },
  { slug: "navigation", title: "Navigation", description: "How spacecraft are located and pointed — radiometric tracking, Delta-DOR, optical and autonomous navigation.", get: () => e.navigationMethods() },
  { slug: "laser-communications", title: "Laser Communications", description: "Optical (laser) communication — the frontier of deep-space data rates, from DSOC to LCRD.", get: () => e.laserCommunications() },
  { slug: "future-communications", title: "Future Communications", description: "Where deep-space communication is heading — optical links, antenna arraying, and onboard atomic clocks.", get: () => e.bySlugs(["dsoc", "lcrd", "phased-array", "deep-space-atomic-clock", "optical"]) },
];

const BY_SLUG = new Map(DSCOMM_DISCOVERIES.map((d) => [d.slug, d]));
export function getDSCommDiscovery(slug: string): DSCommDiscovery | undefined {
  return BY_SLUG.get(slug);
}
