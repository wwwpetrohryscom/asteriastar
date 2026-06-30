import { engine } from "@/platform/data-engine";
import type { ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";

/** Discovery lists — generated from the observatory engine over real data. */
export interface ObsDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => ObsRecord[];
}

const o = engine.observatories;
const yearOf = (s?: string) => { const m = s?.match(/\d{4}/); return m ? Number(m[0]) : undefined; };
const isSolar = (r: ObsRecord) => /solar/i.test(r.observatoryType ?? "") || /solar|sun/i.test(r.telescopeClass ?? "") || r.relatedKeys?.includes("star:sun");

export const OBS_DISCOVERIES: ObsDiscovery[] = [
  { slug: "all-observatories", title: "All Observatories", description: "Every observatory facility in the encyclopedia.", get: () => o.byKind("observatory") },
  { slug: "ground-based-observatories", title: "Ground-Based Observatories", description: "Observatory facilities on the Earth's surface.", get: () => o.byKind("observatory") },
  { slug: "space-telescopes", title: "Space Telescopes", description: "Observatories that operate from orbit and beyond.", get: () => o.byKind("space-telescope") },
  { slug: "optical-telescopes", title: "Optical Telescopes", description: "Telescopes that gather visible light.", get: () => o.byKind("telescope").filter((r) => r.bandSlugs?.includes("visible-light")) },
  { slug: "radio-telescopes", title: "Radio Telescopes", description: "Telescopes and arrays that observe radio waves.", get: () => o.byBand("radio") },
  { slug: "infrared-telescopes", title: "Infrared Telescopes", description: "Telescopes that observe heat — infrared light.", get: () => o.byBand("infrared").concat(o.byBand("near-infrared")).filter((v, i, a) => a.indexOf(v) === i) },
  { slug: "x-ray-telescopes", title: "X-ray Telescopes", description: "Observatories of the high-energy X-ray universe.", get: () => o.byBand("x-ray") },
  { slug: "gamma-ray-telescopes", title: "Gamma-ray Telescopes", description: "Observatories of the most energetic light.", get: () => o.byBand("gamma-ray") },
  { slug: "solar-observatories", title: "Solar Observatories", description: "Telescopes and missions that study the Sun.", get: () => o.all().filter(isSolar) },
  { slug: "survey-telescopes", title: "Survey Telescopes", description: "Facilities that map large areas of the sky.", get: () => o.all().filter((r) => (r.surveySlugs?.length ?? 0) > 0) },
  { slug: "sky-surveys", title: "Sky Surveys", description: "Systematic surveys mapping the cosmos.", get: () => o.byKind("survey") },
  { slug: "astronomical-instruments", title: "Astronomical Instruments", description: "The cameras and spectrographs that gather the data.", get: () => o.byKind("instrument") },
  { slug: "largest-telescopes", title: "Largest Telescopes", description: "The biggest light-collecting apertures in the world.", get: () => o.largestTelescopes(20) },
  { slug: "historic-telescopes", title: "Historic Telescopes", description: "The instruments that founded modern astronomy.", get: () => o.all().filter((r) => (r.kind === "telescope" || r.kind === "observatory") && (yearOf(r.firstLight) ?? 9999) < 1970) },
  { slug: "future-telescopes", title: "Future Telescopes", description: "Observatories under construction — not yet operational.", get: () => o.planned() },
  { slug: "gravitational-wave-observatories", title: "Gravitational-Wave Observatories", description: "Detectors that sense ripples in spacetime.", get: () => o.byBand("gravitational-waves") },
  { slug: "neutrino-observatories", title: "Neutrino Observatories", description: "Detectors that catch ghostly cosmic particles.", get: () => o.byBand("neutrinos") },
  { slug: "multi-messenger-astronomy", title: "Multi-Messenger Astronomy", description: "Observatories that combine light, waves, and particles.", get: () => o.byBand("multi-messenger") },
];

const BY_SLUG = new Map(OBS_DISCOVERIES.map((d) => [d.slug, d]));
export function getObsDiscovery(slug: string): ObsDiscovery | undefined {
  return BY_SLUG.get(slug);
}
