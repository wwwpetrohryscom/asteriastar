import type { MetadataRoute } from "next";
import { getAllCategories, getAllSections } from "@/lib/content/registry";
import { absoluteUrl, categoryPath, sectionPath, ROUTES } from "@/lib/routes";

/**
 * Generates sitemap.xml from the content registry, so every public route is
 * included automatically. Static routes are listed explicitly; hubs and
 * categories are derived. As the site grows past Google's 50k-URL limit, this
 * can be split with generateSitemaps without changing the data source.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.home), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(ROUTES.about), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl(ROUTES.editorialPolicy), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl(ROUTES.sourcesPolicy), changeFrequency: "yearly", priority: 0.3 },
  ];

  const sectionRoutes: MetadataRoute.Sitemap = getAllSections().map((section) => ({
    url: absoluteUrl(sectionPath(section)),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map(
    ({ section, category }) => ({
      url: absoluteUrl(categoryPath(section, category)),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...sectionRoutes, ...categoryRoutes].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
