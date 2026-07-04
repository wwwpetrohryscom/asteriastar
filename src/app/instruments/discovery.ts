import { engine } from "@/platform/data-engine";
import type { InstRecord } from "@/knowledge-graph/data/instruments-catalog/types";

/** Engine-driven discovery hubs for the Scientific Instruments & Payloads Encyclopedia. */
export interface InstDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => InstRecord[];
}

const e = engine.instruments;

export const INST_DISCOVERIES: InstDiscovery[] = [
  { slug: "classes", title: "Instrument Classes", description: "The kinds of scientific instrument — cameras, spectrometers, magnetometers, radars, altimeters, seismometers, and more.", get: () => e.classes() },
  { slug: "imaging", title: "Cameras & Imaging", description: "The eyes of spacecraft — optical cameras and imaging spectrometers that map worlds.", get: () => e.byCategory("imaging") },
  { slug: "spectroscopy", title: "Spectrometers", description: "Instruments that split light to reveal composition, from ultraviolet to gamma-ray.", get: () => e.byCategory("spectroscopy") },
  { slug: "fields-particles", title: "Fields & Particles", description: "Magnetometers, particle detectors, and dust detectors that sense the invisible environment of space.", get: () => e.byCategory("fields-particles") },
  { slug: "active-sensing", title: "Active Sensing", description: "Radars, laser altimeters, and seismometers that actively probe surfaces and interiors.", get: () => e.byCategory("active-sensing") },
];

const BY_SLUG = new Map(INST_DISCOVERIES.map((d) => [d.slug, d]));
export function getInstDiscovery(slug: string): InstDiscovery | undefined {
  return BY_SLUG.get(slug);
}
