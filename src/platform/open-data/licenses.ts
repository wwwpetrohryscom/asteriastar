/**
 * License model for open data.
 *
 * Different underlying sources carry different terms. Asteria's own compiled
 * metadata (the knowledge-graph structure, relationships, and editorial text) is
 * published under CC BY-SA 4.0; upstream scientific data retains its own terms.
 * Licenses are never mixed silently — every dataset declares exactly one primary
 * license here, and each cites the upstream terms that apply to its source data.
 */

export type LicenseId =
  | "cc-by-sa-4.0"
  | "public-domain"
  | "nasa-public-domain"
  | "esa-eso-terms"
  | "openngc"
  | "hyg"
  | "nasa-exoplanet-archive"
  | "internal-asteria";

export interface LicenseInfo {
  id: LicenseId;
  name: string;
  url?: string;
  /** How this license constrains reuse, in plain terms. */
  summary: string;
  /** True when reuse requires crediting the source. */
  attributionRequired: boolean;
  /** True when share-alike (derivatives under the same license) applies. */
  shareAlike: boolean;
}

export const LICENSES: Record<LicenseId, LicenseInfo> = {
  "cc-by-sa-4.0": {
    id: "cc-by-sa-4.0",
    name: "Creative Commons Attribution-ShareAlike 4.0",
    url: "https://creativecommons.org/licenses/by-sa/4.0/",
    summary: "Reuse and adapt freely with attribution; derivatives must carry the same license.",
    attributionRequired: true,
    shareAlike: true,
  },
  "public-domain": {
    id: "public-domain",
    name: "Public domain",
    summary: "No known copyright; usable without restriction. Attribution is courteous, not required.",
    attributionRequired: false,
    shareAlike: false,
  },
  "nasa-public-domain": {
    id: "nasa-public-domain",
    name: "NASA — public domain (US Government work)",
    url: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
    summary: "US Government works are generally not copyrighted; some media has separate terms. Verify per-item.",
    attributionRequired: false,
    shareAlike: false,
  },
  "esa-eso-terms": {
    id: "esa-eso-terms",
    name: "ESA / ESO usage terms (CC BY 4.0 for most media)",
    url: "https://www.eso.org/public/outreach/copyright/",
    summary: "Most ESA/ESO outreach media is CC BY 4.0; scientific data may carry separate access terms.",
    attributionRequired: true,
    shareAlike: false,
  },
  openngc: {
    id: "openngc",
    name: "OpenNGC (CC BY-SA 4.0)",
    url: "https://github.com/mattiaverga/OpenNGC",
    summary: "Deep-sky object catalogue; attribution and share-alike apply.",
    attributionRequired: true,
    shareAlike: true,
  },
  hyg: {
    id: "hyg",
    name: "HYG stellar database (CC BY-SA 2.5)",
    url: "https://github.com/astronexus/HYG-Database",
    summary: "Compiled stellar catalogue; attribution and share-alike apply.",
    attributionRequired: true,
    shareAlike: true,
  },
  "nasa-exoplanet-archive": {
    id: "nasa-exoplanet-archive",
    name: "NASA Exoplanet Archive terms",
    url: "https://exoplanetarchive.ipac.caltech.edu/docs/acknowledge.html",
    summary: "Freely usable with the requested acknowledgement of the NASA Exoplanet Archive.",
    attributionRequired: true,
    shareAlike: false,
  },
  "internal-asteria": {
    id: "internal-asteria",
    name: "Asteria compiled metadata (CC BY-SA 4.0)",
    url: "https://creativecommons.org/licenses/by-sa/4.0/",
    summary: "Asteria's own graph structure, relationships, and editorial text. Attribution + share-alike.",
    attributionRequired: true,
    shareAlike: true,
  },
};

export function getLicense(id: LicenseId): LicenseInfo {
  return LICENSES[id];
}

export const ALL_LICENSES: LicenseInfo[] = Object.values(LICENSES);
