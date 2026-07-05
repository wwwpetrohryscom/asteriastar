import { engine } from "@/platform/data-engine";
import type { CitizenRecord } from "@/knowledge-graph/data/citizen-astronomy-catalog/types";

/** Engine-driven discovery hubs for the Citizen Science, Amateur Astronomy & Public Observing Encyclopedia. */
export interface AyDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CitizenRecord[];
}

const e = engine.citizenAstronomy;

export const AY_DISCOVERIES: AyDiscovery[] = [
  { slug: "citizen-science", title: "Citizen Science", description: "Where the public does real research — Zooniverse, Galaxy Zoo, Planet Hunters, Globe at Night, Aurorasaurus, and Stardust@home.", get: () => e.projects() },
  { slug: "amateur-observing", title: "Amateur Observing", description: "The ways amateurs watch the sky — backyard observing, variable-star, asteroid and comet observing, occultation timing, and meteor watching.", get: () => e.activities() },
  { slug: "equipment", title: "Observing Equipment", description: "The tools of the hobby — from the first pair of binoculars and a Dobsonian to an astrophotography rig.", get: () => e.equipment() },
  { slug: "public-outreach", title: "Public Outreach", description: "How astronomy reaches everyone — star parties, public observatories, dark-sky parks, and astronomy education.", get: () => e.outreach() },
  { slug: "organisations", title: "Amateur Organisations", description: "The bodies that coordinate amateur astronomy — the AAVSO, the International Meteor Organization, and ALPO.", get: () => e.organizations() },
];

const BY_SLUG = new Map(AY_DISCOVERIES.map((d) => [d.slug, d]));
export function getAyDiscovery(slug: string): AyDiscovery | undefined {
  return BY_SLUG.get(slug);
}
