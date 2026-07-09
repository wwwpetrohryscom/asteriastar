import { engine } from "@/platform/data-engine";
import type { ChRecord } from "@/knowledge-graph/data/astronomy-software-catalog/types";

/** Engine-driven discovery hubs for the Astronomical Software Ecosystem Encyclopedia. */
export interface ChDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => ChRecord[];
}

const e = engine.astronomySoftware;

export const CH_DISCOVERIES: ChDiscovery[] = [
  { slug: "desktop-planetariums", title: "Desktop & Planetarium", description: "Software for exploring the sky on screen — Stellarium, KStars, Celestia, Cartes du Ciel, and SkySafari.", get: () => e.desktop() },
  { slug: "imaging-and-acquisition", title: "Imaging & Acquisition", description: "Software for capturing and processing astrophotos — PixInsight, Siril, and DeepSkyStacker for processing; N.I.N.A., PHD2, ASCOM, INDI, and Ekos for acquisition and device control.", get: () => [...e.imaging(), ...e.acquisition()] },
  { slug: "scientific-tools", title: "Scientific Tools", description: "Professional analysis software — IRAF, CASA, TOPCAT, SAOImage DS9, Aladin, AstroImageJ, and Montage.", get: () => e.scientific() },
  { slug: "libraries", title: "Libraries & Toolkits", description: "Programming libraries for astronomy — Skyfield, poliastro, and Orekit, alongside the Astropy ecosystem.", get: () => e.libraries() },
];

const BY_SLUG = new Map(CH_DISCOVERIES.map((d) => [d.slug, d]));
export function getChDiscovery(slug: string): ChDiscovery | undefined {
  return BY_SLUG.get(slug);
}
