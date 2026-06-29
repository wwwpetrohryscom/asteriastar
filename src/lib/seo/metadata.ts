import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/routes";

/**
 * Metadata helpers.
 *
 * `buildMetadata` produces a consistent, SEO-complete Metadata object for any
 * page: a unique title and description, a canonical URL, and matching Open
 * Graph / Twitter tags. The default Open Graph image is supplied by the
 * root-level `opengraph-image` file convention and inherited automatically.
 */

/** Full, human-readable title (what Open Graph and the tab show). */
export function formatTitle(title?: string): string {
  if (!title || title === SITE.name) return defaultTitle;
  return `${title} · ${SITE.name}`;
}

export const defaultTitle = `${SITE.name} — Astronomy, Night Sky & Astrology`;

interface BuildMetadataInput {
  /** Page-specific title, without the site suffix (the template adds it). */
  title: string;
  description: string;
  /** Site-relative path, used for the canonical URL. */
  path: string;
  /** Open Graph object type. Defaults to "website". */
  ogType?: "website" | "article";
  /** Set true to keep a page out of search indexes. */
  noindex?: boolean;
  keywords?: string[];
}

export function buildMetadata({
  title,
  description,
  path,
  ogType = "website",
  noindex = false,
  keywords,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = formatTitle(title);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: ogType,
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
