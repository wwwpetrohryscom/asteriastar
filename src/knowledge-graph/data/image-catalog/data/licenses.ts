import type { LicenseDef } from "@/knowledge-graph/data/image-catalog/types";

/** Only genuinely open or public-domain licenses are catalogued. */
export const LICENSES: LicenseDef[] = [
  {
    slug: "public-domain", name: "Public Domain", shortName: "Public Domain",
    url: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
    requiresAttribution: false, open: true,
    note: "Works produced by US federal agencies (NASA, JPL, USNO) are generally not subject to copyright and are free to use. A credit line is still requested and always shown here.",
  },
  {
    slug: "cc-by-4-0", name: "Creative Commons Attribution 4.0 International", shortName: "CC BY 4.0",
    url: "https://creativecommons.org/licenses/by/4.0/",
    requiresAttribution: true, open: true,
    note: "Free to share and adapt with attribution. Used by ESA/Hubble, ESA/Webb, ESO, and the Event Horizon Telescope Collaboration. (Wikimedia Commons files may instead be CC BY-SA 4.0; each is verified individually.)",
  },
];
