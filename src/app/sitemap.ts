import type { MetadataRoute } from "next";
import { getAllCategories, getAllSections } from "@/lib/content/registry";
import { getAllEntries } from "@/content/entries";
import { getStandaloneEntities, entityGraphPath } from "@/knowledge-graph";
import { TOPICS, RELATIONSHIP_PAGES } from "@/lib/discovery";
import { COMPARISONS } from "@/lib/compare";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import {
  absoluteUrl,
  categoryPath,
  sectionPath,
  topicPath,
  connectionPath,
  comparePath,
  learnPath,
  timelinePath,
  ROUTES,
} from "@/lib/routes";

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
    { url: absoluteUrl(ROUTES.explore), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(ROUTES.discover), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.entityIndex), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.topicIndex), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.compare), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.learn), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl(ROUTES.timelines), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.search), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl(ROUTES.about), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl(ROUTES.editorialPolicy), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl(ROUTES.sourcesPolicy), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Discovery: topic indexes, relationship pages, standalone graph entities.
  const discoveryRoutes: MetadataRoute.Sitemap = [
    ...TOPICS.map((t) => ({ url: absoluteUrl(topicPath(t.slug)), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...RELATIONSHIP_PAGES.map((p) => ({ url: absoluteUrl(connectionPath(p.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...COMPARISONS.map((c) => ({ url: absoluteUrl(comparePath(c.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...LEARNING_PATHS.map((p) => ({ url: absoluteUrl(learnPath(p.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...TIMELINES.map((t) => ({ url: absoluteUrl(timelinePath(t.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...getStandaloneEntities().map((e) => ({ url: absoluteUrl(entityGraphPath(e)), changeFrequency: "monthly" as const, priority: 0.4 })),
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

  // Published entries (the third taxonomy level).
  const entryRoutes: MetadataRoute.Sitemap = getAllEntries().map((entry) => ({
    url: entry.canonicalUrl,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...sectionRoutes,
    ...categoryRoutes,
    ...entryRoutes,
    ...discoveryRoutes,
  ].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
