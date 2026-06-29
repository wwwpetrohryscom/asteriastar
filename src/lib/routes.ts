import { SITE_URL } from "@/lib/site";
import type { Category, Section } from "@/lib/content/types";

/**
 * Route helpers — the only place URLs are constructed.
 *
 * Components and pages should import these rather than hand-writing paths, so
 * the routing scheme can evolve in one place. `*Path` helpers return
 * site-relative paths (for <Link>); `absoluteUrl` builds canonical URLs for
 * metadata, JSON-LD, and the sitemap.
 */

export const ROUTES = {
  home: "/",
  about: "/about",
  editorialPolicy: "/editorial-policy",
  sourcesPolicy: "/sources-policy",
} as const;

export function sectionPath(section: Pick<Section, "slug">): string {
  return `/${section.slug}`;
}

export function categoryPath(
  section: Pick<Section, "slug">,
  category: Pick<Category, "slug">,
): string {
  return `/${section.slug}/${category.slug}`;
}

/** Build an entry path from raw slugs (used by the entry registry). */
export function entryPath(
  section: string,
  category: string,
  entry: string,
): string {
  return `/${section}/${category}/${entry}`;
}

/** Build an absolute, canonical URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}
