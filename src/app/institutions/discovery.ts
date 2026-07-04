import { engine } from "@/platform/data-engine";

/** Engine-driven discovery hubs for the Space Agencies, Institutions & Laboratories Encyclopedia. */
export interface InstitutionDiscovery {
  slug: string;
  title: string;
  description: string;
  typeSlugs: string[];
}

export const INSTITUTION_DISCOVERIES: InstitutionDiscovery[] = [
  { slug: "space-agencies", title: "Space Agencies", description: "The government bodies that fund and run the world's space programs — NASA, ESA, JAXA, ISRO, Roscosmos, CNSA, and the national agencies.", typeSlugs: ["space-agency"] },
  { slug: "field-centers", title: "Field Centers", description: "The specialised centres of NASA, ESA, and JAXA — from Goddard and Johnson to ESTEC and Tsukuba — each with its own role.", typeSlugs: ["field-center"] },
  { slug: "laboratories", title: "Laboratories & Institutes", description: "The laboratories and research institutes that design, build, and lead the science of robotic missions — JPL, APL, SwRI, and more.", typeSlugs: ["research-laboratory", "science-institute"] },
  { slug: "commercial", title: "Commercial Space Companies", description: "The private companies building launch vehicles, spacecraft, and satellites — SpaceX, Blue Origin, Rocket Lab, and the aerospace primes.", typeSlugs: ["commercial-space-company"] },
  { slug: "observatories", title: "Observatory Organisations", description: "The organizations that operate ground-based observatories and support the astronomical community — ESO, NOIRLab, and the national observatories.", typeSlugs: ["observatory-organisation"] },
];

const BY_SLUG = new Map(INSTITUTION_DISCOVERIES.map((d) => [d.slug, d]));
export function getInstitutionDiscovery(slug: string): InstitutionDiscovery | undefined {
  return BY_SLUG.get(slug);
}

export function institutionDiscoveryCount(d: InstitutionDiscovery): number {
  return engine.institutions.memberSet(d.typeSlugs).count;
}
