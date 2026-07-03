import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Launch pads. Each is part_of an existing launch_site entity, and is referenced
 * by the vehicles that launch(ed) from it. Coordinates are omitted unless well
 * established; nothing is invented.
 */
type Pd = {
  slug: string;
  name: string;
  site: string; // launch_site slug (parent, must exist)
  location?: string;
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (p: Pd): RocketRecord => ({
  id: `launch_pad:${p.slug}`,
  slug: p.slug,
  name: p.name,
  kind: "pad",
  altNames: p.alt,
  description: p.description,
  sources: p.sources ?? ["nasa"],
  siteSlug: p.site,
  location: p.location,
});

export const pads: RocketRecord[] = [
  // United States — Kennedy / Cape Canaveral / Vandenberg / Wallops
  mk({ slug: "lc-39a", name: "Launch Complex 39A", site: "kennedy-space-center", location: "Merritt Island, Florida, USA", sources: ["nasa"], alt: ["LC-39A", "Pad 39A"], description: "The historic Kennedy Space Center pad that launched the Apollo 11 Saturn V and many Space Shuttle flights, now leased to SpaceX for Falcon 9, Falcon Heavy, and Starship operations." }),
  mk({ slug: "lc-39b", name: "Launch Complex 39B", site: "kennedy-space-center", location: "Merritt Island, Florida, USA", sources: ["nasa"], alt: ["LC-39B"], description: "A Kennedy Space Center pad used for Apollo, Skylab, and Shuttle launches and rebuilt as a clean-pad for NASA's Space Launch System." }),
  mk({ slug: "slc-37b", name: "Space Launch Complex 37B", site: "cape-canaveral", location: "Cape Canaveral, Florida, USA", sources: ["nasa"], alt: ["SLC-37B"], description: "A Cape Canaveral complex that launched Saturn IB flights and later served the Delta IV and Delta IV Heavy." }),
  mk({ slug: "slc-41", name: "Space Launch Complex 41", site: "cape-canaveral", location: "Cape Canaveral, Florida, USA", sources: ["ula"], alt: ["SLC-41"], description: "A Cape Canaveral complex used for Titan launches and now the home pad of United Launch Alliance's Atlas V and Vulcan Centaur." }),
  mk({ slug: "slc-17", name: "Space Launch Complex 17", site: "cape-canaveral", location: "Cape Canaveral, Florida, USA", sources: ["ula"], alt: ["SLC-17"], description: "A Cape Canaveral complex long used by the Delta family, including the Delta II that launched NASA's Mars rovers." }),
  mk({ slug: "slc-40", name: "Space Launch Complex 40", site: "cape-canaveral", location: "Cape Canaveral, Florida, USA", sources: ["spacex"], alt: ["SLC-40"], description: "SpaceX's primary Falcon 9 pad at Cape Canaveral \u2014 the workhorse complex for most Falcon 9 launches." }),
  mk({ slug: "slc-4e", name: "Space Launch Complex 4E", site: "vandenberg", location: "Vandenberg Space Force Base, California, USA", sources: ["spacex"], alt: ["SLC-4E"], description: "The SpaceX Falcon 9 pad at Vandenberg for polar and Sun-synchronous launches on the U.S. West Coast." }),
  mk({ slug: "wallops-0a", name: "MARS Pad 0A", site: "wallops", location: "Wallops Island, Virginia, USA", sources: ["nasa"], alt: ["Pad 0A", "LP-0A"], description: "The Mid-Atlantic Regional Spaceport pad at Wallops used by Northrop Grumman's Antares to launch Cygnus cargo missions." }),
  // Europe — Guiana Space Centre
  mk({ slug: "ela-1", name: "Ensemble de Lancement Ariane 1", site: "guiana-space-centre", location: "Kourou, French Guiana", sources: ["esa"], alt: ["ELA-1"], description: "The first Ariane launch complex at the Guiana Space Centre, used by the early Ariane 1–3 vehicles." }),
  mk({ slug: "ela-3", name: "Ensemble de Lancement Ariane 3", site: "guiana-space-centre", location: "Kourou, French Guiana", sources: ["arianespace", "esa"], alt: ["ELA-3"], description: "The Guiana Space Centre complex that launched every Ariane 5 mission." }),
  mk({ slug: "ela-4", name: "Ensemble de Lancement Ariane 4", site: "guiana-space-centre", location: "Kourou, French Guiana", sources: ["arianespace", "esa"], alt: ["ELA-4"], description: "The Guiana Space Centre complex built as the new launch pad for Ariane 6." }),
  mk({ slug: "slp-kourou", name: "Vega Launch Complex (SLV)", site: "guiana-space-centre", location: "Kourou, French Guiana", sources: ["arianespace", "esa"], alt: ["SLV", "ZLV"], description: "The Guiana Space Centre complex for the Vega and Vega-C small launchers, on the site of the former Ariane 1 pad." }),
  // Russia / Kazakhstan
  mk({ slug: "gagarins-start", name: "Gagarin's Start (Site 1)", site: "baikonur", location: "Baikonur Cosmodrome, Kazakhstan", sources: ["roscosmos"], alt: ["Site 1/5", "Baikonur Site 1"], description: "The historic Baikonur pad that launched Sputnik 1 and Yuri Gagarin, and for decades the departure point for Soyuz crews to orbit." }),
  mk({ slug: "lc-81-baikonur", name: "Baikonur Site 81", site: "baikonur", location: "Baikonur Cosmodrome, Kazakhstan", sources: ["gunters"], alt: ["Site 81"], description: "A Baikonur complex used for Proton heavy-lift launches." }),
  mk({ slug: "baikonur-45", name: "Baikonur Site 45", site: "baikonur", location: "Baikonur Cosmodrome, Kazakhstan", sources: ["gunters"], alt: ["Site 45"], description: "The Baikonur complex built for the Zenit launch vehicle." }),
  mk({ slug: "plesetsk-35", name: "Plesetsk Site 35", site: "plesetsk", location: "Plesetsk Cosmodrome, Russia", sources: ["gunters"], alt: ["Site 35"], description: "The Plesetsk complex used for Angara launches in northern Russia." }),
  // China
  mk({ slug: "jiuquan-921", name: "Jiuquan Area 4 (SLS-1)", site: "jiuquan", location: "Jiuquan Satellite Launch Center, China", sources: ["gunters"], description: "The Jiuquan complex for China's human-rated Long March 2F, launching Shenzhou crews to the Tiangong station." }),
  mk({ slug: "xichang-2", name: "Xichang LC-2", site: "xichang", location: "Xichang Satellite Launch Center, China", sources: ["gunters"], description: "A Xichang complex widely used for Long March 3B launches to geostationary transfer orbit." }),
  mk({ slug: "wenchang-101", name: "Wenchang LC-101", site: "wenchang", location: "Wenchang Space Launch Site, Hainan, China", sources: ["gunters"], description: "The coastal Wenchang complex for the heavy-lift Long March 5." }),
  mk({ slug: "wenchang-201", name: "Wenchang LC-201", site: "wenchang", location: "Wenchang Space Launch Site, Hainan, China", sources: ["gunters"], description: "The Wenchang complex for the Long March 7, which launches Tianzhou cargo missions." }),
  // Japan / India
  mk({ slug: "yoshinobu", name: "Yoshinobu Launch Complex", site: "tanegashima", location: "Tanegashima Space Center, Japan", sources: ["jaxa"], description: "The Tanegashima complex for Japan's large liquid launch vehicles — the H-II, H-IIA/H-IIB, and H3." }),
  mk({ slug: "first-launch-pad", name: "First Launch Pad (FLP)", site: "satish-dhawan", location: "Satish Dhawan Space Centre, Sriharikota, India", sources: ["isro"], alt: ["FLP"], description: "The first ISRO pad at Sriharikota, used for the PSLV and SSLV." }),
  mk({ slug: "second-launch-pad", name: "Second Launch Pad (SLP)", site: "satish-dhawan", location: "Satish Dhawan Space Centre, Sriharikota, India", sources: ["isro"], alt: ["SLP"], description: "The second ISRO pad at Sriharikota, used for the GSLV and LVM3, including the Chandrayaan and Gaganyaan missions." }),
  // Starbase
  mk({ slug: "olp-starbase", name: "Orbital Launch Pad (Starbase)", site: "starbase", location: "Boca Chica, Texas, USA", sources: ["spacex"], alt: ["OLP", "Pad A"], description: "SpaceX's orbital launch and catch complex at Starbase for the fully reusable Starship and Super Heavy." }),
];
