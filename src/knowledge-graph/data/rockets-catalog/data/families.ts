import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Rocket families — multi-vehicle lineages. Each is operated_by a provider; its
 * member vehicles point back via member_of_family (authored on the vehicle).
 */
type F = {
  slug: string;
  name: string;
  provider: string; // organization slug (operator)
  country: string;
  status: string;
  startYear?: string;
  endYear?: string;
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (f: F): RocketRecord => ({
  id: `rocket_family:${f.slug}`,
  slug: f.slug,
  name: f.name,
  kind: "family",
  altNames: f.alt,
  description: f.description,
  sources: f.sources ?? ["nasa"],
  providerSlug: f.provider,
  country: f.country,
  status: f.status,
  startYear: f.startYear,
  endYear: f.endYear,
});

export const families: RocketRecord[] = [
  // United States
  mk({ slug: "saturn", name: "Saturn", provider: "nasa", country: "United States", status: "Retired", startYear: "1961", endYear: "1975", sources: ["nasa"], description: "NASA's family of heavy- and super-heavy-lift rockets developed for the Apollo program — the Saturn I, Saturn IB, and the Moon-launching Saturn V." }),
  mk({ slug: "atlas", name: "Atlas", provider: "ula", country: "United States", status: "Active", startYear: "1957", sources: ["ula"], description: "A long-running U.S. launch-vehicle family that evolved from an early ICBM into the modern Atlas V operated by United Launch Alliance." }),
  mk({ slug: "delta", name: "Delta", provider: "ula", country: "United States", status: "Retired", startYear: "1960", endYear: "2024", sources: ["ula"], description: "A prolific U.S. launch-vehicle family spanning six decades, from the Thor-derived Delta through the Delta II and the hydrogen-fueled Delta IV, retired in 2024." }),
  mk({ slug: "titan", name: "Titan", provider: "lockheed-martin", country: "United States", status: "Retired", startYear: "1959", endYear: "2005", sources: ["gunters"], description: "A U.S. family derived from the Titan ICBM — the crewed Titan II of Gemini, and the hypergolic Titan III and Titan IV heavy launchers for national-security and planetary missions." }),
  mk({ slug: "falcon", name: "Falcon", provider: "spacex", country: "United States", status: "Active", startYear: "2006", sources: ["spacex"], description: "SpaceX's family of RP-1/LOX rockets — the retired Falcon 1, the reusable Falcon 9, and the Falcon Heavy — that made orbital-class booster reuse routine." }),
  mk({ slug: "sls", name: "Space Launch System", provider: "nasa", country: "United States", status: "Active", startYear: "2022", sources: ["nasa"], alt: ["SLS"], description: "NASA's super-heavy-lift family for the Artemis program, planned in progressively more capable Block 1, Block 1B, and Block 2 configurations." }),

  // Europe
  mk({ slug: "ariane", name: "Ariane", provider: "arianespace", country: "Europe", status: "Active", startYear: "1979", sources: ["arianespace", "esa"], description: "Europe's flagship launch-vehicle family, from the Ariane 1 of 1979 through the heavy-lift Ariane 5 and the current Ariane 6." }),

  // Russia / Soviet Union
  mk({ slug: "r-7", name: "R-7 / Soyuz family", provider: "roscosmos", country: "Russia", status: "Active", startYear: "1957", sources: ["gunters"], alt: ["Semyorka", "Soyuz family"], description: "The most-launched rocket lineage in history — descended from the R-7, the world's first ICBM (1957), and continued today by the crew-carrying Soyuz." }),

  // China
  mk({ slug: "long-march", name: "Long March", provider: "cnsa", country: "China", status: "Active", startYear: "1970", sources: ["gunters"], alt: ["Chang Zheng"], description: "China's principal launch-vehicle family, spanning small to heavy lift — from the early hypergolic Long March 2/3/4 to the modern cryogenic Long March 5/6/7/8." }),

  // Japan
  mk({ slug: "h-rocket", name: "H series", provider: "jaxa", country: "Japan", status: "Active", startYear: "1986", sources: ["jaxa"], alt: ["H-I", "H-II", "H3"], description: "Japan's family of liquid-hydrogen launch vehicles — the H-I, H-II, H-IIA/H-IIB, and the current H3 — developed by JAXA and Mitsubishi Heavy Industries." }),
];
