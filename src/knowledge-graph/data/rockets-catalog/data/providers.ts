import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Launch providers. Existing `organization:*` entities are ENRICHED as providers
 * (`existing: true`, never recreated); genuinely-new commercial providers are
 * created. Each new provider must be referenced by at least one vehicle.
 */
type Pr = {
  slug: string;
  name: string;
  existing?: boolean;
  country: string;
  founded?: string;
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (p: Pr): RocketRecord => ({
  id: `organization:${p.slug}`,
  slug: p.slug,
  name: p.name,
  kind: "provider",
  existing: p.existing,
  altNames: p.alt,
  description: p.description,
  sources: p.sources ?? ["nasa"],
  country: p.country,
  startYear: p.founded,
});

export const providers: RocketRecord[] = [
  // --- existing organizations, enriched as launch providers ---
  mk({ slug: "nasa", name: "NASA", existing: true, country: "United States", sources: ["nasa"], description: "The U.S. civil space agency, operator of the Saturn family, Space Shuttle, and the Space Launch System." }),
  mk({ slug: "spacex", name: "SpaceX", existing: true, country: "United States", founded: "2002", sources: ["spacex"], description: "The commercial launch provider behind Falcon 1, Falcon 9, Falcon Heavy, and Starship, and a pioneer of orbital-class booster reuse." }),
  mk({ slug: "ula", name: "United Launch Alliance", existing: true, country: "United States", founded: "2006", sources: ["ula"], alt: ["ULA"], description: "A Boeing–Lockheed Martin joint venture operating the Atlas V, Delta IV, and Vulcan Centaur for U.S. government and commercial launches." }),
  mk({ slug: "blue-origin", name: "Blue Origin", existing: true, country: "United States", founded: "2000", sources: ["blueorigin"], description: "The company behind the reusable New Shepard suborbital vehicle, the orbital New Glenn, and the BE-3/BE-4 engines." }),
  mk({ slug: "rocket-lab", name: "Rocket Lab", existing: true, country: "United States / New Zealand", founded: "2006", sources: ["rocketlab"], description: "A small-launch provider operating the Electron rocket and developing the medium-lift, reusable Neutron." }),
  mk({ slug: "arianespace", name: "Arianespace", existing: true, country: "Europe", founded: "1980", sources: ["arianespace"], description: "The European launch-services company marketing the Ariane and Vega families from the Guiana Space Centre." }),
  mk({ slug: "esa", name: "ESA", existing: true, country: "Europe", sources: ["esa"], description: "The European Space Agency, which funds and develops the Ariane and Vega launch vehicles operated by Arianespace." }),
  mk({ slug: "roscosmos", name: "Roscosmos", existing: true, country: "Russia", sources: ["roscosmos"], description: "The Russian state space corporation operating the Soyuz, Proton, and Angara launch vehicles." }),
  mk({ slug: "cnsa", name: "CNSA", existing: true, country: "China", sources: ["gunters"], alt: ["China National Space Administration"], description: "China's national space administration, associated with the Long March family of launch vehicles." }),
  mk({ slug: "jaxa", name: "JAXA", existing: true, country: "Japan", sources: ["jaxa"], description: "The Japan Aerospace Exploration Agency, which develops the H-IIA, H-IIB, H3, and Epsilon launch vehicles." }),
  mk({ slug: "isro", name: "ISRO", existing: true, country: "India", sources: ["isro"], description: "The Indian Space Research Organisation, operator of the PSLV, GSLV, LVM3, and SSLV launch vehicles." }),

  // --- new commercial providers (each referenced by ≥1 vehicle) ---
  mk({ slug: "lockheed-martin", name: "Lockheed Martin", existing: false, country: "United States", founded: "1995", sources: ["gunters"], alt: ["Martin Marietta", "Martin Company"], description: "The aerospace manufacturer whose lineage (the Martin Company \u2192 Martin Marietta \u2192 Lockheed Martin) built and operated the Titan family of launch vehicles." }),
  mk({ slug: "northrop-grumman", name: "Northrop Grumman Space Systems", existing: false, country: "United States", sources: ["gunters"], alt: ["Orbital Sciences", "Orbital ATK"], description: "The aerospace company (via the former Orbital Sciences / Orbital ATK) that operates the Antares, Pegasus, and Minotaur launch vehicles." }),
  mk({ slug: "relativity-space", name: "Relativity Space", existing: false, country: "United States", founded: "2015", sources: ["gunters"], description: "A launch company developing the medium-lift, reusable Terran R using large-scale additive manufacturing (3D printing)." }),
  mk({ slug: "firefly-aerospace", name: "Firefly Aerospace", existing: false, country: "United States", founded: "2017", sources: ["gunters"], description: "A launch and space company operating the small-to-medium-lift Firefly Alpha rocket." }),
  mk({ slug: "isar-aerospace", name: "Isar Aerospace", existing: false, country: "Germany", founded: "2018", sources: ["gunters"], description: "A German launch startup developing the small-lift Spectrum rocket." }),
  mk({ slug: "pld-space", name: "PLD Space", existing: false, country: "Spain", founded: "2011", sources: ["gunters"], description: "A Spanish launch company developing the Miura family, including the suborbital Miura 1 and orbital Miura 5." }),
  mk({ slug: "virgin-orbit", name: "Virgin Orbit", existing: false, country: "United States", founded: "2017", sources: ["gunters"], description: "A now-defunct air-launch company that operated LauncherOne, released from a modified Boeing 747 carrier aircraft." }),
];
