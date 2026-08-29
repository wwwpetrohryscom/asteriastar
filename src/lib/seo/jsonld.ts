import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/routes";

/**
 * Schema.org JSON-LD builders.
 *
 * Each function returns a plain, serializable object. Render them with the
 * <JsonLd> component. We only assert structured data we can stand behind — no
 * fabricated ratings, counts, or social profiles.
 */

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

export interface Crumb {
  name: string;
  /** Site-relative path or absolute URL. */
  url: string;
}

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icons/icon-512.png"),
      width: 512,
      height: 512,
    },
    foundingDate: SITE.founded,
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.url),
    mainEntityOfPage: absoluteUrl(input.url),
    inLanguage: "en",
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * A Schema.org ImageObject for a real, licensed observation image. Emitted on
 * entity pages that show a hero image so search/AI surfaces can cite it with
 * correct credit and license.
 */
export function imageObjectSchema(input: {
  url: string;
  contentUrl: string;
  caption?: string;
  alt: string;
  credit: string;
  license: string;
  acquireLicensePage?: string;
  width?: number;
  height?: number;
  dateCreated?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: absoluteUrl(input.contentUrl),
    url: absoluteUrl(input.contentUrl),
    caption: input.caption ?? input.alt,
    name: input.alt,
    creditText: input.credit,
    creator: { "@id": ORG_ID },
    copyrightNotice: input.credit,
    license: input.license,
    ...(input.acquireLicensePage ? { acquireLicensePage: input.acquireLicensePage } : {}),
    ...(input.width ? { width: input.width } : {}),
    ...(input.height ? { height: input.height } : {}),
    ...(input.dateCreated ? { dateCreated: input.dateCreated } : {}),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function webPageSchema(input: {
  name: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export function howToSchema(input: {
  name: string;
  description: string;
  url: string;
  steps: HowToStep[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    inLanguage: "en",
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function softwareApplicationSchema(input: {
  name: string;
  description: string;
  url: string;
  category?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    applicationCategory: input.category ?? "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * A Dataset, for a page whose subject really is a dataset — the live space-weather products, for
 * example, each of which is a real, citable, publicly-fetchable file with a named distributor and
 * licence. It is deliberately NOT used for pages that merely display numbers: `Dataset` claims the
 * page is a description of a data resource, and that claim has to be true.
 */
export function datasetSchema(input: {
  name: string;
  description: string;
  url: string;
  creatorName: string;
  creatorUrl?: string;
  license?: string;
  /** Keywords describing the measured variables. */
  variables?: string[];
  /**
   * The date the series begins, as YYYY-MM-DD. Emitted as an open-ended ISO 8601 interval
   * (`2026-08-29/..`), the form specified for a feed still being extended.
   *
   * There is deliberately no `repeatFrequency`: its schema.org domain is `Schedule`, not `Dataset`,
   * so on a Dataset node it is an out-of-vocabulary property consumers drop — and it used to drag a
   * non-ISO `temporalCoverage: "current"` along with it, expressing open-ended coverage in a form
   * nothing can parse.
   */
  coverageFrom?: string;
  distributionUrl?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    isAccessibleForFree: true,
    inLanguage: "en",
    creator: { "@type": "Organization", name: input.creatorName, ...(input.creatorUrl ? { url: input.creatorUrl } : {}) },
    ...(input.license ? { license: input.license } : {}),
    ...(input.variables?.length ? { variableMeasured: input.variables } : {}),
    ...(input.coverageFrom ? { temporalCoverage: `${input.coverageFrom}/..` } : {}),
    ...(input.distributionUrl
      ? { distribution: { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: input.distributionUrl } }
      : {}),
    /*
     * The dataset's publisher is the agency that produces it, NOT AsteriaStar. AsteriaStar
     * publishes the PAGE — which the WebPage node alongside this one already says — and the
     * distribution URL points at the agency's own file. Naming ourselves publisher here would be a
     * provenance claim in machine-readable markup that the visible text is careful never to make.
     */
    publisher: { "@type": "Organization", name: input.creatorName, ...(input.creatorUrl ? { url: input.creatorUrl } : {}) },
    includedInDataCatalog: { "@type": "DataCatalog", "@id": ORG_ID },
  };
}
