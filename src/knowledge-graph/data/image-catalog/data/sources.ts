import type { SourceDef } from "@/knowledge-graph/data/image-catalog/types";

/** Source archives the platform catalogues from. Only openly-licensed / public-domain archives. */
export const IMAGE_SOURCES: SourceDef[] = [
  { slug: "nasa-image-library", name: "NASA Image and Video Library", institution: "NASA", sourceKey: "nasa", archiveUrl: "https://images.nasa.gov", defaultLicenseSlug: "public-domain", note: "NASA's official public-domain image archive." },
  { slug: "stsci-hubble", name: "HubbleSite", institution: "NASA / STScI", sourceKey: "stsci", archiveUrl: "https://hubblesite.org/images", defaultLicenseSlug: "public-domain", note: "US Hubble image archive from the Space Telescope Science Institute." },
  { slug: "stsci-webb", name: "WebbTelescope.org", institution: "NASA / STScI", sourceKey: "stsci", archiveUrl: "https://webbtelescope.org/resource-gallery/images", defaultLicenseSlug: "public-domain", note: "US James Webb image archive from STScI." },
  { slug: "esa-hubble", name: "ESA/Hubble Image Archive", institution: "ESA/Hubble", sourceKey: "esa-hubble", archiveUrl: "https://esahubble.org/images/", defaultLicenseSlug: "cc-by-4-0", note: "European Hubble image archive; CC BY 4.0." },
  { slug: "esa-webb", name: "ESA/Webb Image Archive", institution: "ESA/Webb", sourceKey: "esa-webb", archiveUrl: "https://esawebb.org/images/", defaultLicenseSlug: "cc-by-4-0", note: "European Webb image archive; CC BY 4.0." },
  { slug: "eso", name: "ESO Image Archive", institution: "European Southern Observatory", sourceKey: "eso", archiveUrl: "https://www.eso.org/public/images/", defaultLicenseSlug: "cc-by-4-0", note: "ESO's public image archive; CC BY 4.0." },
  { slug: "eht", name: "Event Horizon Telescope", institution: "EHT Collaboration", sourceKey: "eht", archiveUrl: "https://eventhorizontelescope.org/press", defaultLicenseSlug: "cc-by-4-0", note: "The Event Horizon Telescope Collaboration's released imagery; CC BY 4.0." },
  { slug: "noirlab", name: "NSF NOIRLab Image Archive", institution: "NSF NOIRLab", sourceKey: "noirlab", archiveUrl: "https://noirlab.edu/public/images/", defaultLicenseSlug: "cc-by-4-0", note: "US ground-based optical/infrared image archive; CC BY 4.0." },
  { slug: "wikimedia", name: "Wikimedia Commons", institution: "Wikimedia Foundation", sourceKey: "wikimedia", archiveUrl: "https://commons.wikimedia.org", defaultLicenseSlug: "public-domain", note: "Media repository; each file's license (public domain or Creative Commons) is verified individually." },
];
