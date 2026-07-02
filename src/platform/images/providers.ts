import type { SourceKey } from "@/lib/sources";

/**
 * Image-platform providers — typed interfaces for FUTURE automated ingest from
 * open image archives, plus a registry of the archives the platform draws on.
 * The seeded catalogue is curated by hand with verified provenance; these
 * providers describe how automated ingest would work. Nothing here scrapes,
 * calls a live API from a page, or ingests anything not openly licensed.
 */

export type ImageProviderKey =
  | "nasa-image-library" | "stsci" | "esa-hubble" | "esa-webb" | "eso" | "eht" | "noirlab" | "wikimedia";

export type IngestStatus = "planned" | "available" | "connected";

/** A future client for an open image archive. Returns catalogue-ready records. */
export interface ImageArchiveProvider {
  key: ImageProviderKey;
  /** Search the archive (future). */
  search(query: string, limit: number): Promise<unknown[]>;
  /** Fetch the licensing/credit metadata for a specific archive item (future). */
  metadata(archiveItemId: string): Promise<unknown>;
}

export interface ImageProviderInfo {
  key: ImageProviderKey;
  name: string;
  organization: string;
  url: string;
  sources: SourceKey[];
  defaultLicense: string;
  status: IngestStatus;
  access: "public-api" | "public-media" | "requires-review";
  notes: string;
}

export const IMAGE_PROVIDERS: ImageProviderInfo[] = [
  { key: "nasa-image-library", name: "NASA Image and Video Library", organization: "NASA", url: "https://images.nasa.gov", sources: ["nasa"], defaultLicense: "public-domain", status: "planned", access: "public-api", notes: "Public NASA imagery with an open search API; most items are public domain (credit requested)." },
  { key: "stsci", name: "STScI (Hubble & Webb)", organization: "Space Telescope Science Institute", url: "https://outerspace.stsci.edu/", sources: ["stsci"], defaultLicense: "public-domain", status: "planned", access: "public-media", notes: "US Hubble/Webb press images; generally free to use with credit." },
  { key: "esa-hubble", name: "ESA/Hubble", organization: "European Space Agency", url: "https://esahubble.org", sources: ["esa-hubble"], defaultLicense: "cc-by-4-0", status: "planned", access: "public-media", notes: "European Hubble archive; CC BY 4.0." },
  { key: "esa-webb", name: "ESA/Webb", organization: "European Space Agency", url: "https://esawebb.org", sources: ["esa-webb"], defaultLicense: "cc-by-4-0", status: "planned", access: "public-media", notes: "European Webb archive; CC BY 4.0." },
  { key: "eso", name: "ESO Image Archive", organization: "European Southern Observatory", url: "https://www.eso.org/public/images/", sources: ["eso"], defaultLicense: "cc-by-4-0", status: "planned", access: "public-media", notes: "ESO public images; CC BY 4.0." },
  { key: "eht", name: "Event Horizon Telescope", organization: "EHT Collaboration", url: "https://eventhorizontelescope.org/press", sources: ["eht"], defaultLicense: "cc-by-4-0", status: "planned", access: "public-media", notes: "EHT press imagery; CC BY 4.0." },
  { key: "noirlab", name: "NSF NOIRLab", organization: "NSF NOIRLab", url: "https://noirlab.edu/public/images/", sources: ["noirlab"], defaultLicense: "cc-by-4-0", status: "planned", access: "public-media", notes: "US ground-based image archive; CC BY 4.0." },
  { key: "wikimedia", name: "Wikimedia Commons", organization: "Wikimedia Foundation", url: "https://commons.wikimedia.org", sources: ["wikimedia"], defaultLicense: "public-domain", status: "planned", access: "public-media", notes: "Per-file licensing must be verified before ingest; only PD/CC files." },
];

const BY_KEY = new Map(IMAGE_PROVIDERS.map((p) => [p.key, p]));
export const getImageProvider = (key: ImageProviderKey): ImageProviderInfo | undefined => BY_KEY.get(key);
