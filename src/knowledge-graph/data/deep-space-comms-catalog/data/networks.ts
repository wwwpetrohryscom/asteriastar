import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

/**
 * Deep-space and near-Earth communication NETWORKS (reused `tracking_network` type). The
 * NASA Deep Space Network, ESA's Estrack, and NASA's Near Space Network already exist and
 * are ENRICHED (existing: true) — linked to their stations, bands, and the missions they
 * support. The national and commercial networks are created here. Mission-support links
 * reuse the existing space missions; nothing is fabricated.
 */

const mk = (r: Omit<DSCommRecord, "kind" | "id"> & { slug: string }): DSCommRecord => ({
  ...r,
  kind: "network",
  id: `tracking_network:${r.slug}`,
  category: r.category ?? "deep-space",
});

export const networks: DSCommRecord[] = [
  mk({
    slug: "deep-space-network",
    name: "Deep Space Network (DSN)",
    existing: true,
    description:
      "NASA's international array of giant radio antennas — the backbone of deep-space communication and navigation. Three complexes spaced about 120° apart in longitude (Goldstone, Madrid, Canberra) keep any distant spacecraft in view as Earth rotates, providing tracking, telemetry, command, and radiometric navigation for missions across the Solar System and beyond.",
    operatorKey: "organization:jpl",
    operatorLabel: "NASA / JPL",
    bandSlugs: ["s-band", "x-band", "ka-band"],
    tracksMissionKeys: [
      "space_mission:voyager-1", "space_mission:voyager-2", "space_mission:cassini-huygens",
      "space_mission:new-horizons", "space_mission:juno", "space_mission:parker-solar-probe",
      "space_telescope:james-webb-space-telescope", "space_mission:osiris-rex", "space_mission:lucy",
      "space_mission:psyche", "space_mission:dart",
    ],
    role: "Tracking, telemetry, command, and radiometric navigation for deep-space missions.",
    sources: ["nasa", "jpl"],
    highlights: ["Three complexes ~120° apart keep spacecraft always in view", "The workhorse of interplanetary communication"],
  }),
  mk({
    slug: "estrack",
    name: "ESTRACK",
    existing: true,
    altNames: ["ESA Tracking Station Network"],
    description:
      "The European Space Agency's global tracking-station network, including deep-space antennas at New Norcia (Australia), Cebreros (Spain), and Malargüe (Argentina). It provides communication and navigation for ESA's interplanetary missions and cross-supports partner agencies.",
    operatorKey: "organization:esa",
    operatorLabel: "ESA",
    bandSlugs: ["s-band", "x-band", "ka-band"],
    tracksMissionKeys: ["space_mission:rosetta", "space_mission:hera"],
    role: "Communication and navigation for ESA deep-space missions.",
    sources: ["esa"],
    highlights: ["Three 35 m deep-space antennas across three continents"],
  }),
  mk({
    slug: "near-space-network",
    name: "Near Space Network",
    existing: true,
    category: "near-earth",
    altNames: ["NSN", "Near Earth Network + Space Network"],
    description:
      "NASA's network for missions near Earth — out to roughly the Moon and the Sun–Earth Lagrange points — formed by merging the ground-based Near Earth Network with the space-based Space Network (the TDRS relay satellites). It provides direct-to-ground and relay links, and now hosts optical (laser) communication demonstrations.",
    operatorKey: "organization:nasa",
    operatorLabel: "NASA / Goddard",
    bandSlugs: ["s-band", "ka-band", "optical"],
    role: "Direct-to-ground and relay communication for near-Earth missions.",
    sources: ["nasa"],
    highlights: ["Merged the Near Earth Network and the TDRS-based Space Network", "Hosts NASA's optical-communication demonstrations"],
  }),
  mk({
    slug: "chinese-deep-space-network",
    name: "Chinese Deep Space Network",
    altNames: ["CDSN"],
    description:
      "China's deep-space tracking network, operated for CNSA, with large antennas at Jiamusi (66 m) and Kashgar (35 m) in China and a station in Argentina. It supports China's lunar (Chang'e) and planetary (Tianwen) missions.",
    operatorKey: "organization:cnsa",
    operatorLabel: "CNSA / CLTC",
    bandSlugs: ["s-band", "x-band"],
    tracksMissionKeys: ["space_mission:tianwen-1"],
    role: "Communication and navigation for China's deep-space missions.",
    sources: ["nasa"],
    highlights: ["66 m antenna at Jiamusi", "Supports the Chang'e and Tianwen missions"],
  }),
  mk({
    slug: "russian-deep-space-network",
    name: "Russian Deep Space Network",
    altNames: ["RDSN"],
    description:
      "Russia's deep-space communication facilities, operated by Roscosmos, with large antennas at Ussuriysk in the Far East and historically at Bear Lakes and Yevpatoria (Crimea). It descends from the Soviet deep-space network that supported the Luna, Venera, and Mars probes.",
    operatorKey: "organization:roscosmos",
    operatorLabel: "Roscosmos",
    bandSlugs: ["s-band", "x-band"],
    role: "Communication and navigation for Russian deep-space missions.",
    sources: ["nasa"],
    highlights: ["Descends from the Soviet-era Venera and Mars deep-space network"],
  }),
  mk({
    slug: "indian-deep-space-network",
    name: "Indian Deep Space Network",
    altNames: ["IDSN"],
    description:
      "ISRO's deep-space network, centred on the 32 m and 18 m antennas at Byalalu near Bengaluru. It provided tracking and communication for the Chandrayaan lunar missions and the Mars Orbiter Mission (Mangalyaan).",
    operatorKey: "organization:isro",
    operatorLabel: "ISRO",
    bandSlugs: ["s-band", "x-band"],
    tracksMissionKeys: ["space_mission:chandrayaan-3", "space_mission:mangalyaan"],
    role: "Communication and navigation for ISRO's deep-space missions.",
    sources: ["nasa"],
    highlights: ["32 m antenna at Byalalu", "Supported Chandrayaan and Mangalyaan"],
  }),
  mk({
    slug: "jaxa-deep-space-network",
    name: "JAXA Deep Space Network",
    altNames: ["Usuda Deep Space Center"],
    description:
      "Japan's deep-space tracking network, run by JAXA/ISAS, centred on the Usuda Deep Space Center in Nagano (a 64 m antenna) and the newer 54 m Misasa antenna. It supported the Hayabusa asteroid missions and Japan's other deep-space probes.",
    operatorKey: "organization:jaxa",
    operatorLabel: "JAXA / ISAS",
    bandSlugs: ["s-band", "x-band"],
    tracksMissionKeys: ["space_mission:hayabusa", "space_mission:hayabusa2", "space_mission:mmx"],
    role: "Communication and navigation for JAXA's deep-space missions.",
    sources: ["jaxa"],
    highlights: ["Usuda's 64 m antenna", "Supported the Hayabusa sample-return missions"],
  }),
  mk({
    slug: "commercial-deep-space",
    name: "Commercial Deep-Space Services",
    category: "near-earth",
    altNames: ["Commercial ground-station networks"],
    description:
      "A growing set of commercial providers — such as KSAT, SSC, and Goonhilly — that offer deep-space and near-Earth ground-station support on a service basis, augmenting the government networks as mission traffic grows. NASA's Near Space Network increasingly buys commercial services alongside its own antennas.",
    operatorLabel: "KSAT, SSC, Goonhilly and other commercial providers",
    bandSlugs: ["s-band", "x-band"],
    relatedKeys: ["tracking_network:deep-space-network"],
    role: "Commercial ground-station support augmenting the government networks.",
    sources: ["nasa"],
    highlights: ["Commercial antennas augment the DSN and Near Space Network"],
  }),
];
