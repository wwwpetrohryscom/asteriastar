import type { ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";

/** Observing sites and telescope organizations. */

const S = (slug: string, name: string, country: string, altitudeM: number | undefined, description: string, alt?: string[]): ObsRecord =>
  ({ id: `observing_site:${slug}`, slug, name, kind: "site", country, altitudeM, description, sources: ["eso"], altNames: alt });

export const sites: ObsRecord[] = [
  S("atacama-desert", "Atacama Desert", "Chile", 2500, "The Atacama Desert in northern Chile is one of the driest, clearest places on Earth, hosting many of the world's great observatories.", ["Atacama"]),
  S("la-palma", "La Palma", "Spain (Canary Islands)", 2400, "The island of La Palma in the Canary Islands hosts the Roque de los Muchachos Observatory, one of the premier sites of the Northern Hemisphere."),
  S("south-pole", "South Pole", "Antarctica", 2800, "The geographic South Pole offers extremely dry, stable air and months of darkness, ideal for neutrino, microwave-background, and infrared astronomy."),
];

const O = (slug: string, name: string, country: string, description: string, alt?: string[], sources?: ObsRecord["sources"]): ObsRecord =>
  ({ id: `organization:${slug}`, slug, name, kind: "organization", country, description, sources: sources ?? ["nasa"], altNames: alt });

export const organizations: ObsRecord[] = [
  O("eso", "European Southern Observatory", "Europe / Chile", "ESO is a 16-nation intergovernmental organisation that builds and operates major ground-based observatories in Chile, including the VLT and the future ELT.", ["ESO"], ["eso"]),
  O("noirlab", "NSF NOIRLab", "United States", "NSF's NOIRLab is the US national centre for ground-based, night-time optical and infrared astronomy, operating Gemini, CTIO, Kitt Peak, and the Rubin Observatory.", ["NOIRLab"], ["noirlab"]),
  O("nrao", "National Radio Astronomy Observatory", "United States", "The NRAO operates major radio astronomy facilities for the US scientific community, including the VLA and (as a partner) ALMA.", ["NRAO"]),
  O("naoj", "National Astronomical Observatory of Japan", "Japan", "The NAOJ is Japan's national centre for astronomy, operating the Subaru Telescope and partnering in ALMA.", ["NAOJ"], ["nasa"]),
  O("stsci", "Space Telescope Science Institute", "United States", "STScI conducts the science operations of the Hubble and James Webb space telescopes for NASA.", ["STScI"], ["nasa"]),
  O("caltech-ipac", "Caltech/IPAC", "United States", "IPAC at Caltech provides science operations and data archives for many infrared and survey missions, including Spitzer and WISE.", ["IPAC"]),
  O("nsf", "National Science Foundation", "United States", "The US National Science Foundation funds and stewards major astronomy facilities, including LIGO, NOIRLab, and the NRAO.", ["NSF"]),
  O("naoc", "National Astronomical Observatories, CAS", "China", "The National Astronomical Observatories of the Chinese Academy of Sciences operate China's major astronomical facilities, including the FAST radio telescope.", ["NAOC"]),
  O("cara", "California Association for Research in Astronomy", "United States", "CARA, a partnership of Caltech and the University of California (with NASA as a partner), operates the W. M. Keck Observatory.", ["CARA"]),
  O("nso", "National Solar Observatory", "United States", "The National Solar Observatory, an AURA centre funded by the NSF, operates the Daniel K. Inouye Solar Telescope and the GONG network.", ["NSO"]),
  O("sao", "Smithsonian Astrophysical Observatory", "United States", "The Smithsonian Astrophysical Observatory, part of the Center for Astrophysics | Harvard & Smithsonian, runs the Chandra X-ray Center for NASA.", ["SAO", "CXC"]),
];
