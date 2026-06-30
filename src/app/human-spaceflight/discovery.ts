import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { KIND_LABEL, type HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";
import { humanSpaceflightPath } from "@/lib/routes";
import type { HsfCardItem } from "@/components/human-spaceflight/HsfCards";

/** Discovery lists — generated from the human-spaceflight engine over real data. */
export interface HsfDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => HsfCardItem[];
}

const h = engine.humanSpaceflight;

function meta(r: HsfRecord): string {
  switch (r.kind) {
    case "station": return [r.country, r.operationalPeriod].filter(Boolean).join(" · ");
    case "module": return [r.role, r.launchDate].filter(Boolean).join(" · ");
    case "crew-vehicle":
    case "cargo-vehicle": return [r.craftType, r.firstFlight && `since ${r.firstFlight}`].filter(Boolean).join(" · ");
    case "program": return r.operationalPeriod ?? "";
    case "expedition": return r.operationalPeriod ?? "";
    case "eva": return [r.launchDate, r.durationText].filter(Boolean).join(" · ");
    case "astronaut": return r.nationality ?? "";
    default: return KIND_LABEL[r.kind];
  }
}

const toCard = (r: HsfRecord): HsfCardItem => ({
  id: r.id, name: r.name, href: humanSpaceflightPath(r.slug), kindLabel: KIND_LABEL[r.kind],
  meta: meta(r), description: r.description, status: r.status,
});

const cards = (records: HsfRecord[]): HsfCardItem[] => records.map(toCard);

/** Unified astronaut roster across the human-spaceflight and exploration catalogs. */
function astronauts(filter?: (nationality: string) => boolean): HsfCardItem[] {
  const all = [...h.byKind("astronaut"), ...engine.exploration.byKind("astronaut")];
  const seen = new Set<string>();
  const out: HsfCardItem[] = [];
  for (const r of all) {
    if (seen.has(r.id) || (filter && !(r.nationality && filter(r.nationality)))) continue;
    seen.add(r.id);
    const ent = getEntityById(r.id);
    out.push({ id: r.id, name: r.name, href: ent ? entityGraphPath(ent) : humanSpaceflightPath(r.slug), kindLabel: "Astronaut", meta: r.nationality, description: r.description });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

const HIST = /deorbited|reentered|decommissioned|completed/i;

export const HSF_DISCOVERIES: HsfDiscovery[] = [
  { slug: "all-space-stations", title: "All Space Stations", description: "Every space station in the encyclopedia, past, present, and planned.", get: () => cards(h.byKind("station")) },
  { slug: "operational-space-stations", title: "Operational Space Stations", description: "Space stations currently crewed and in operation.", get: () => cards(h.stationsByStatus((s) => /operational/i.test(s))) },
  { slug: "historical-space-stations", title: "Historical Space Stations", description: "Space stations that have been deorbited or retired.", get: () => cards(h.stationsByStatus((s) => HIST.test(s))) },
  { slug: "planned-space-stations", title: "Planned Space Stations", description: "Future stations under development — not yet operational.", get: () => cards(h.stationsByStatus((s) => /planned/i.test(s))) },
  { slug: "iss-modules", title: "ISS Modules", description: "The pressurized modules that make up the International Space Station.", get: () => cards(h.modulesOf("international-space-station")) },
  { slug: "human-spaceflight-programs", title: "Human Spaceflight Programs", description: "The programs that have carried humans into space.", get: () => cards(h.byKind("program")) },
  { slug: "crewed-spacecraft", title: "Crewed Spacecraft", description: "Spacecraft built to carry people.", get: () => cards(h.byKind("crew-vehicle")) },
  { slug: "cargo-spacecraft", title: "Cargo Spacecraft", description: "Uncrewed vehicles that resupply space stations.", get: () => cards(h.byKind("cargo-vehicle")) },
  { slug: "astronauts", title: "Astronauts", description: "People who have flown into space, from the pioneers to today.", get: () => astronauts() },
  { slug: "cosmonauts", title: "Cosmonauts", description: "Russian and Soviet space travellers.", get: () => astronauts((n) => /russia|soviet/i.test(n)) },
  { slug: "taikonauts", title: "Taikonauts", description: "Chinese space travellers.", get: () => astronauts((n) => /china/i.test(n)) },
  { slug: "iss-expeditions", title: "ISS Expeditions", description: "The long-duration resident crews of the International Space Station.", get: () => cards(h.expeditions()) },
  { slug: "evas-and-spacewalks", title: "EVAs and Spacewalks", description: "Historic extravehicular activities.", get: () => cards(h.evas()) },
  { slug: "spacewalk-milestones", title: "Spacewalk Milestones", description: "The firsts of working outside a spacecraft.", get: () => cards(h.evas()) },
  { slug: "commercial-crew", title: "Commercial Crew", description: "Commercially developed crewed spacecraft serving the ISS.", get: () => cards(h.byKind("crew-vehicle").filter((r) => r.programSlug === "commercial-crew")) },
  { slug: "lunar-human-spaceflight", title: "Lunar Human Spaceflight", description: "Spacecraft, programs, and stations for crewed exploration of the Moon.", get: () => cards([...h.byKind("crew-vehicle"), ...h.byKind("program"), ...h.byKind("station")].filter((r) => r.programSlug === "apollo" || r.programSlug === "artemis" || /apollo|artemis|gateway/i.test(r.name))) },
  { slug: "space-station-science", title: "Space Station Systems & Science", description: "The systems that keep a station running and the science done aboard — docking, life support, experiments, and space medicine.", get: () => cards([...h.byKind("docking-system"), ...h.byKind("life-support"), ...h.byKind("experiment"), ...h.byKind("medicine")]) },
];

const BY_SLUG = new Map(HSF_DISCOVERIES.map((d) => [d.slug, d]));
export function getHsfDiscovery(slug: string): HsfDiscovery | undefined {
  return BY_SLUG.get(slug);
}
