import {
  ENTITY_TYPE_LABELS,
  entityGraphPath,
  getAllGraphEntities,
} from "@/knowledge-graph";
import { getAllEntries } from "@/content/entries";
import { getAllSections, getAllCategories } from "@/lib/content/registry";
import { TOPICS } from "@/lib/discovery";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import { COMPARISONS } from "@/lib/compare";
import {
  categoryPath,
  sectionPath,
  topicPath,
  learnPath,
  timelinePath,
  comparePath,
} from "@/lib/routes";

/**
 * Universal search index — a single, static list of everything searchable:
 * graph entities, content entries, hubs/categories, explorer topics, learning
 * paths, timelines, and comparisons. Built at build time and filtered entirely
 * client-side (no fetching, no AI, no hallucination — only real records).
 */

export type SearchGroup =
  | "Entity"
  | "Article"
  | "Hub"
  | "Topic"
  | "Learning path"
  | "Timeline"
  | "Comparison";

export interface SearchItem {
  id: string;
  name: string;
  group: SearchGroup;
  kindLabel: string;
  href: string;
  keywords: string;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const e of getAllGraphEntities()) {
    items.push({
      id: `entity:${e.id}`,
      name: e.name,
      group: "Entity",
      kindLabel: ENTITY_TYPE_LABELS[e.type],
      href: entityGraphPath(e),
      keywords: [e.name, ...(e.aliases ?? []), e.type].join(" ").toLowerCase(),
    });
  }

  for (const entry of getAllEntries()) {
    items.push({
      id: `entry:${entry.path}`,
      name: entry.title,
      group: "Article",
      kindLabel: entry.section,
      href: entry.path,
      keywords: [entry.title, entry.excerpt, ...entry.tags].join(" ").toLowerCase(),
    });
  }

  for (const section of getAllSections()) {
    items.push({
      id: `hub:${section.slug}`,
      name: section.name,
      group: "Hub",
      kindLabel: "Knowledge hub",
      href: sectionPath(section),
      keywords: `${section.name} ${section.tagline}`.toLowerCase(),
    });
  }
  for (const { section, category } of getAllCategories()) {
    items.push({
      id: `category:${section.slug}/${category.slug}`,
      name: category.name,
      group: "Topic",
      kindLabel: section.name,
      href: categoryPath(section, category),
      keywords: [category.name, category.summary, ...(category.keywords ?? [])].join(" ").toLowerCase(),
    });
  }

  for (const t of TOPICS) {
    items.push({ id: `topic:${t.slug}`, name: t.title, group: "Topic", kindLabel: "Explore", href: topicPath(t.slug), keywords: `${t.title} ${t.description}`.toLowerCase() });
  }
  for (const p of LEARNING_PATHS) {
    items.push({ id: `learn:${p.slug}`, name: p.title, group: "Learning path", kindLabel: "Learn", href: learnPath(p.slug), keywords: `${p.title} ${p.description}`.toLowerCase() });
  }
  for (const t of TIMELINES) {
    items.push({ id: `timeline:${t.slug}`, name: t.title, group: "Timeline", kindLabel: "Timeline", href: timelinePath(t.slug), keywords: `${t.title} ${t.description}`.toLowerCase() });
  }
  for (const c of COMPARISONS) {
    items.push({ id: `compare:${c.slug}`, name: c.title, group: "Comparison", kindLabel: "Compare", href: comparePath(c.slug), keywords: `${c.title} ${c.description}`.toLowerCase() });
  }

  return items;
}

export const SEARCH_GROUPS: SearchGroup[] = [
  "Entity",
  "Article",
  "Topic",
  "Hub",
  "Learning path",
  "Timeline",
  "Comparison",
];
