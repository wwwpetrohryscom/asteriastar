/**
 * The HELPERG ecosystem registry — the single source of truth.
 *
 * Every surface that lists ecosystem products (the global bar, the /ecosystem
 * directory, structured data, any future footer or mobile menu) derives from
 * this file. Nothing may re-declare the list.
 *
 * DELIBERATELY DEPENDENCY-FREE. This module is imported by a component that
 * ships to the browser, so it must never import from `@/knowledge-graph`,
 * `@/lib/media`, `@/content`, or anything else that reaches the data layer —
 * doing so would pull megabytes of scientific data into the client bundle. It
 * has no imports at all, and `scripts/validate-ecosystem.ts` enforces that.
 *
 * URLs here are canonical and exact, copied verbatim from the product owners.
 * They carry no tracking, campaign, or affiliate parameters, and must not gain
 * any: these are the products' real homes, and a directory that rewrites them
 * is worse than no directory.
 */

/** A product with a website of its own. */
export interface EcosystemWebProject {
  readonly kind: "website";
  /** Stable, unique slug. Used for React keys, anchors, and test assertions. */
  readonly id: string;
  readonly name: string;
  /** Canonical https URL, exactly as supplied. No tracking parameters, ever. */
  readonly url: string;
  readonly category: EcosystemCategoryId;
  /**
   * Only present where the claim is verifiable — see DESCRIPTION POLICY below.
   * Most entries deliberately have none.
   */
  readonly description?: string;
}

/** A mobile product. One app is one entry, however many stores it ships to. */
export interface EcosystemApp {
  readonly kind: "app";
  readonly id: string;
  readonly name: string;
  readonly category: EcosystemCategoryId;
  readonly iosUrl?: string;
  readonly androidUrl?: string;
  /** Some apps also have a website; it is the same product, not a second one. */
  readonly websiteUrl?: string;
  readonly description?: string;
}

export type EcosystemProject = EcosystemWebProject | EcosystemApp;

export type EcosystemCategoryId =
  | "business"
  | "telecom"
  | "intelligence"
  | "knowledge"
  | "utilities"
  | "apps";

export interface EcosystemCategory {
  readonly id: EcosystemCategoryId;
  readonly title: string;
  /** Factual framing of what the grouping is — not a marketing claim. */
  readonly summary: string;
}

export const ECOSYSTEM_CATEGORIES: readonly EcosystemCategory[] = [
  { id: "business", title: "Business & SaaS", summary: "Tools for running a business — the HELPERG hub itself, analytics, finance, hiring and people." },
  { id: "telecom", title: "Telecom", summary: "Phone numbers and mobile connectivity." },
  { id: "intelligence", title: "Research & Intelligence", summary: "Location and market data platforms." },
  { id: "knowledge", title: "Knowledge Platforms", summary: "Reference and encyclopedic platforms, each covering one domain in depth." },
  { id: "utilities", title: "Utilities", summary: "Document and file tools on the web." },
  { id: "apps", title: "Mobile Apps", summary: "Native applications for iOS and Android." },
] as const;

/**
 * DESCRIPTION POLICY
 *
 * A description appears here only when it can be verified, not inferred from a
 * product's name. Writing plausible-sounding copy for eighteen products nobody
 * on this side has audited would be fabrication, and a directory that invents
 * what other products do is worse than one that simply names them accurately.
 *
 * Two entries qualify today, both verifiable from this repository:
 *   - AsteriaStar, whose description is its own `SITE.description`.
 *   - WebmasterID, which this site loads its analytics tracker from.
 *
 * The rest carry name, exact canonical URL and category — all of which are
 * facts. Descriptions can be filled in later by whoever owns each product's
 * copy; the type already supports it and the UI already renders it.
 */
export const ECOSYSTEM_WEBSITES: readonly EcosystemWebProject[] = [
  // ---- Business & SaaS ---------------------------------------------------
  { kind: "website", id: "helperg", name: "HELPERG", url: "https://helperg.com", category: "business" },
  {
    kind: "website",
    id: "webmasterid",
    name: "WebmasterID",
    url: "https://webmasterid.com",
    category: "business",
    description: "Web analytics. AsteriaStar uses it for its own traffic measurement.",
  },
  { kind: "website", id: "cash-workspace", name: "Cash Workspace", url: "https://www.cashworkspace.com", category: "business" },
  { kind: "website", id: "talentpartnerid", name: "TalentPartnerID", url: "https://talentpartnerid.com", category: "business" },
  { kind: "website", id: "hrhelperg", name: "HRHelperG", url: "https://hrhelperg.com", category: "business" },
  { kind: "website", id: "petro-hrys", name: "Petro Hrys", url: "https://petrohrys.com", category: "business" },

  // ---- Telecom -----------------------------------------------------------
  { kind: "website", id: "twin-phone", name: "Twin Phone", url: "https://twin-phone.com", category: "telecom" },
  { kind: "website", id: "esimky", name: "eSIMky", url: "https://esimky.com", category: "telecom" },

  // ---- Research & Intelligence -------------------------------------------
  { kind: "website", id: "geobusinessiq", name: "GeoBusinessIQ", url: "https://geobusinessiq.com", category: "intelligence" },
  { kind: "website", id: "global-city-intelligence", name: "Global City Intelligence", url: "https://globalcityintelligence.com", category: "intelligence" },

  // ---- Knowledge Platforms -----------------------------------------------
  { kind: "website", id: "agricultureid", name: "AgricultureID", url: "https://agricultureid.com", category: "knowledge" },
  { kind: "website", id: "faunahub", name: "FaunaHub", url: "https://faunahub.com", category: "knowledge" },
  { kind: "website", id: "builddesignhub", name: "BuildDesignHub", url: "https://builddesignhub.com", category: "knowledge" },
  { kind: "website", id: "printerarchive", name: "PrinterArchive", url: "https://printerarchive.net", category: "knowledge" },
  { kind: "website", id: "virtue-and-power", name: "Virtue & Power", url: "https://virtueandpower.com", category: "knowledge" },
  { kind: "website", id: "socialsporthub", name: "SocialSportHub", url: "https://socialsporthub.com", category: "knowledge" },
  {
    kind: "website",
    id: "asteriastar",
    name: "AsteriaStar",
    url: "https://asteriastar.com",
    category: "knowledge",
    description:
      "A knowledge platform for everything above Earth — astronomy, space, the night sky, celestial events, mythology, and astrology as a clearly separate cultural tradition.",
  },

  // ---- Utilities ---------------------------------------------------------
  { kind: "website", id: "pdfeditconvert", name: "PDF Edit & Convert", url: "https://pdfeditconvert.top", category: "utilities" },
] as const;

/**
 * Mobile applications.
 *
 * One app is one entry. An App Store listing and a Play Store listing for the
 * same product are two platforms of one thing, not two products, and are
 * rendered as platform buttons on a single card.
 *
 * Where a platform URL is absent it is absent because none was supplied. It is
 * never guessed: an invented store URL is a broken link with a plausible shape,
 * which is worse than an honestly missing button.
 */
export const ECOSYSTEM_APPS: readonly EcosystemApp[] = [
  {
    kind: "app", id: "app-zip", name: "ZIP", category: "apps",
    androidUrl: "https://play.google.com/store/apps/details?id=com.ziparchivator.zip&pcampaignid=web_share",
    iosUrl: "https://apps.apple.com/app/id6753772583",
  },
  {
    kind: "app", id: "app-printer", name: "Printer", category: "apps",
    androidUrl: "https://play.google.com/store/apps/details?id=com.helperg.smart.printer",
    iosUrl: "https://apps.apple.com/app/id6746067890",
  },
  {
    kind: "app", id: "app-fax", name: "Fax", category: "apps",
    androidUrl: "https://play.google.com/store/apps/details?id=com.helperg.fax.app&pcampaignid=web_share",
    iosUrl: "https://apps.apple.com/app/id6760895885",
  },
  {
    kind: "app", id: "app-pdf", name: "PDF", category: "apps",
    androidUrl: "https://play.google.com/store/apps/details?id=com.helperg.editor.documents&pcampaignid=web_share",
    iosUrl: "https://apps.apple.com/app/id6747341672",
  },
  {
    // No Android listing was supplied for this app, so it has no Play button.
    kind: "app", id: "app-cv-resume", name: "CV Resume", category: "apps",
    iosUrl: "https://apps.apple.com/app/id6745150815",
  },
  {
    kind: "app", id: "app-invoice-maker", name: "Invoice Maker", category: "apps",
    androidUrl: "https://play.google.com/store/apps/details?id=com.helperg.invoicer",
    iosUrl: "https://apps.apple.com/app/id6747311276",
  },
  {
    kind: "app", id: "app-pocket-manager", name: "Pocket Manager", category: "apps",
    androidUrl: "https://play.google.com/store/apps/details?id=com.helperg.money",
    iosUrl: "https://apps.apple.com/app/id6743084126",
  },
  {
    // Shares a name and a website with the Twin Phone web product above: the
    // same product on two surfaces, listed once per surface on purpose.
    kind: "app", id: "app-twin-phone", name: "Twin Phone", category: "apps",
    iosUrl: "https://apps.apple.com/app/id6792280945",
    websiteUrl: "https://twin-phone.com",
  },
] as const;

/** Every project, websites first. */
export const ECOSYSTEM_PROJECTS: readonly EcosystemProject[] = [
  ...ECOSYSTEM_WEBSITES,
  ...ECOSYSTEM_APPS,
] as const;

/** Websites in one category, in registry order. */
export function websitesInCategory(id: EcosystemCategoryId): readonly EcosystemWebProject[] {
  return ECOSYSTEM_WEBSITES.filter((p) => p.category === id);
}

/** Categories that actually contain websites, so no empty column is rendered. */
export const WEBSITE_CATEGORIES: readonly EcosystemCategory[] = ECOSYSTEM_CATEGORIES.filter(
  (c) => c.id !== "apps" && ECOSYSTEM_WEBSITES.some((p) => p.category === c.id),
);

/** Counts used in the collapsed bar label and on the directory page. */
export const ECOSYSTEM_COUNTS = {
  websites: ECOSYSTEM_WEBSITES.length,
  apps: ECOSYSTEM_APPS.length,
} as const;

/** The directory page on this site. The bar links here as its crawlable home. */
export const ECOSYSTEM_PATH = "/ecosystem";

/** Every outbound URL the registry can produce — used by the link validator. */
export function allEcosystemUrls(): string[] {
  const urls: string[] = [];
  for (const p of ECOSYSTEM_WEBSITES) urls.push(p.url);
  for (const a of ECOSYSTEM_APPS) {
    if (a.iosUrl) urls.push(a.iosUrl);
    if (a.androidUrl) urls.push(a.androidUrl);
    if (a.websiteUrl) urls.push(a.websiteUrl);
  }
  return urls;
}
