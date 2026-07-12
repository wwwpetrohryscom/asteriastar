import type { PrimarySourceDef } from "./types";

/**
 * Curated official primary-source documents for marquee missions. Every URL is a real,
 * verifiable NASA/ESA mission page (its reachability is re-checked on every ingest);
 * none is invented. Coverage is deliberately a curated set — primary engineering
 * verification is a manual, authoritative task, not a bulk scrape.
 */
export const PRIMARY_SOURCES: PrimarySourceDef[] = [
  { missionId: "space_mission:voyager-1", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Voyager 1", sourceUrl: "https://science.nasa.gov/mission/voyager/voyager-1/" },
  { missionId: "space_mission:voyager-2", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Voyager 2", sourceUrl: "https://science.nasa.gov/mission/voyager/voyager-2/" },
  { missionId: "space_mission:cassini-huygens", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Cassini", sourceUrl: "https://science.nasa.gov/mission/cassini/" },
  { missionId: "space_mission:galileo", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Galileo", sourceUrl: "https://science.nasa.gov/mission/galileo/" },
  { missionId: "space_mission:juno", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Juno", sourceUrl: "https://science.nasa.gov/mission/juno/" },
  { missionId: "space_mission:new-horizons", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — New Horizons", sourceUrl: "https://science.nasa.gov/mission/new-horizons/" },
  { missionId: "space_mission:parker-solar-probe", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Parker Solar Probe", sourceUrl: "https://science.nasa.gov/mission/parker-solar-probe/" },
  { missionId: "space_mission:maven", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — MAVEN", sourceUrl: "https://science.nasa.gov/mission/maven/" },
  { missionId: "space_mission:juice", agency: "ESA", tier: "primary_agency", sourceTitle: "ESA — Juice", sourceUrl: "https://www.esa.int/Science_Exploration/Space_Science/Juice" },
  { missionId: "space_mission:mars-2020", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Mars 2020 Perseverance", sourceUrl: "https://science.nasa.gov/mission/mars-2020-perseverance/" },
  { missionId: "space_mission:mars-science-laboratory", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — MSL Curiosity", sourceUrl: "https://science.nasa.gov/mission/msl-curiosity/" },
  { missionId: "space_mission:osiris-rex", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — OSIRIS-REx", sourceUrl: "https://science.nasa.gov/mission/osiris-rex/" },
  { missionId: "space_mission:insight", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — InSight", sourceUrl: "https://science.nasa.gov/mission/insight/" },
  { missionId: "space_mission:dawn", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Dawn", sourceUrl: "https://science.nasa.gov/mission/dawn/" },
  { missionId: "space_mission:messenger", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — MESSENGER", sourceUrl: "https://science.nasa.gov/mission/messenger/" },
  { missionId: "space_telescope:kepler-space-telescope", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Kepler", sourceUrl: "https://science.nasa.gov/mission/kepler/" },
  { missionId: "space_mission:lucy", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Lucy", sourceUrl: "https://science.nasa.gov/mission/lucy/" },
  { missionId: "space_mission:psyche", agency: "NASA", tier: "primary_agency", sourceTitle: "NASA Science — Psyche", sourceUrl: "https://science.nasa.gov/mission/psyche/" },
];
