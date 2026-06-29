import { getAllSections } from "@/lib/content/registry";
import { getEntriesByCategory, ENTRY_STATS } from "@/content/entries";
import { GRAPH_STATS } from "@/knowledge-graph";
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
import { SITE } from "@/lib/site";

/**
 * Serves /llms.txt — an LLM-friendly map of the site, generated from the
 * content registry (see https://llmstxt.org). Kept in sync with the sitemap
 * automatically. Statically rendered at build time.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.tagline} ${SITE.positioning}`);
  lines.push("");
  lines.push(SITE.principle);
  lines.push("");
  lines.push(
    "Astronomy and the Sky Guide are scientific and source-backed. Astrology is presented as cultural and interpretive tradition, never as proven science.",
  );
  lines.push("");
  lines.push(
    `Content is organized in three levels: sections (hubs) → categories (topics) → entries (individual pages, e.g. a specific star, planet, mission, or zodiac sign). There are currently ${ENTRY_STATS.total} published entries at /[section]/[category]/[entry]. Entries are listed under their category below.`,
  );
  lines.push("");

  for (const section of getAllSections()) {
    lines.push(`## ${section.name} — ${section.tagline}`);
    lines.push(`${absoluteUrl(sectionPath(section))}`);
    lines.push("");
    for (const category of section.categories) {
      lines.push(
        `- [${category.name}](${absoluteUrl(categoryPath(section, category))}): ${category.summary}`,
      );
      for (const entry of getEntriesByCategory(section.slug, category.slug)) {
        lines.push(`  - [${entry.title}](${entry.canonicalUrl}): ${entry.excerpt}`);
      }
    }
    lines.push("");
  }

  lines.push("## Explore (knowledge graph)");
  lines.push(
    `A knowledge graph of ${GRAPH_STATS.entityCount} entities and ${GRAPH_STATS.relationCount} relations powers static discovery pages. Scientific, cultural, and astrological connections are kept separate.`,
  );
  lines.push(`- [Explore](${absoluteUrl(ROUTES.explore)})`);
  lines.push(`- [Entity index](${absoluteUrl(ROUTES.entityIndex)})`);
  lines.push(`- [Topic index](${absoluteUrl(ROUTES.topicIndex)})`);
  lines.push(`- [Discover](${absoluteUrl(ROUTES.discover)})`);
  for (const topic of TOPICS) {
    lines.push(`- [${topic.title}](${absoluteUrl(topicPath(topic.slug))}): ${topic.description}`);
  }
  for (const page of RELATIONSHIP_PAGES) {
    lines.push(`- [${page.title}](${absoluteUrl(connectionPath(page.slug))}): ${page.description}`);
  }
  lines.push("");

  lines.push("## Learn (learning paths)");
  for (const p of LEARNING_PATHS) {
    lines.push(`- [${p.title}](${absoluteUrl(learnPath(p.slug))}): ${p.description}`);
  }
  lines.push("");

  lines.push("## Compare");
  for (const c of COMPARISONS) {
    lines.push(`- [${c.title}](${absoluteUrl(comparePath(c.slug))}): ${c.description}`);
  }
  lines.push("");

  lines.push("## Timelines");
  for (const t of TIMELINES) {
    lines.push(`- [${t.title}](${absoluteUrl(timelinePath(t.slug))}): ${t.description}`);
  }
  lines.push("");
  lines.push(`Universal search: ${absoluteUrl(ROUTES.search)}`);
  lines.push("");

  lines.push("## Community (architecture preview)");
  lines.push(
    "Knowledge-first community architecture — no accounts, profiles, posts, feeds, or user data yet. User contributions will attach to graph entities; the graph stays the source of truth.",
  );
  lines.push(`- [Community](${absoluteUrl(ROUTES.community)})`);
  lines.push(`- [Observations](${absoluteUrl("/community/observations")})`);
  lines.push(`- [Astrophotography](${absoluteUrl("/community/astrophotography")})`);
  lines.push(`- [Collections](${absoluteUrl("/community/collections")})`);
  lines.push(`- [Contributors](${absoluteUrl("/community/contributors")})`);
  lines.push(`- [Learn Together](${absoluteUrl("/community/learning")})`);
  lines.push(`- [Explore Together](${absoluteUrl("/community/explore-together")})`);
  lines.push("");

  lines.push("## Policies");
  lines.push(`- [About](${absoluteUrl(ROUTES.about)})`);
  lines.push(`- [Editorial Policy](${absoluteUrl(ROUTES.editorialPolicy)})`);
  lines.push(`- [Sources Policy](${absoluteUrl(ROUTES.sourcesPolicy)})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
