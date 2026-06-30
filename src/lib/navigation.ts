import { getAllSections } from "@/lib/content/registry";
import { LEARNING_PATHS } from "@/lib/learn";
import { sectionPath, learnPath, ROUTES } from "@/lib/routes";

/**
 * Platform navigation model.
 *
 * Drives the premium grouped mega-menu and the mobile menu from one source. The
 * eight platform areas (Explore, Knowledge, Observatory, Learning, Datasets,
 * Community, Developers, Platform) are organized into a small set of header
 * groups so the header stays uncluttered.
 */

export interface NavLink {
  name: string;
  href: string;
  description?: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavGroup {
  id: string;
  label: string;
  /** A direct link (no panel) when set; otherwise a mega-menu with columns. */
  href?: string;
  columns?: NavColumn[];
}

export function getNavGroups(): NavGroup[] {
  const sections = getAllSections();
  const hubLinks: NavLink[] = sections.map((s) => ({
    name: s.name,
    href: sectionPath(s),
    description: s.tagline,
  }));
  const half = Math.ceil(hubLinks.length / 2);
  const featuredPaths: NavLink[] = LEARNING_PATHS.slice(0, 3).map((p) => ({
    name: p.title,
    href: learnPath(p.slug),
  }));

  return [
    {
      id: "explore",
      label: "Explore",
      columns: [
        {
          title: "Traverse the graph",
          links: [
            { name: "Star Encyclopedia", href: ROUTES.stars, description: "Thousands of real stars" },
            { name: "Solar System", href: ROUTES.solarSystem, description: "Planets, moons, missions" },
            { name: "Deep Sky", href: ROUTES.deepSky, description: "Galaxies, nebulae, clusters" },
            { name: "Exploration", href: ROUTES.exploration, description: "Missions, spacecraft, agencies" },
            { name: "Explore", href: ROUTES.explore, description: "Topics, entities, and connections" },
            { name: "Discover", href: ROUTES.discover, description: "Curated entry points" },
            { name: "Entity Index", href: ROUTES.entityIndex, description: "Every entity, A–Z" },
            { name: "Topic Index", href: ROUTES.topicIndex, description: "Browse by topic" },
          ],
        },
        {
          title: "Tools",
          links: [
            { name: "Compare", href: ROUTES.compare, description: "Side-by-side entities" },
            { name: "Search", href: ROUTES.search, description: "The whole knowledge graph" },
          ],
        },
      ],
    },
    {
      id: "knowledge",
      label: "Knowledge",
      columns: [
        { title: "Hubs", links: hubLinks.slice(0, half) },
        { title: "More hubs", links: hubLinks.slice(half) },
      ],
    },
    {
      id: "learn",
      label: "Learn",
      columns: [
        {
          title: "Guided",
          links: [
            { name: "Learning Paths", href: ROUTES.learn, description: "Structured journeys" },
            { name: "Timelines", href: ROUTES.timelines, description: "Sourced chronologies" },
          ],
        },
        { title: "Featured paths", links: featuredPaths },
      ],
    },
    {
      id: "data",
      label: "Data & API",
      columns: [
        {
          title: "Open data",
          links: [
            { name: "Open Data", href: ROUTES.openData, description: "Standards & access" },
            { name: "Datasets", href: ROUTES.datasets, description: "JSON, CSV, JSON-LD" },
          ],
        },
        {
          title: "Reference",
          links: [
            { name: "Registry", href: ROUTES.registry, description: "Schema & identifiers" },
            { name: "Developers", href: ROUTES.developers, description: "API contracts" },
          ],
        },
      ],
    },
    {
      id: "platform",
      label: "Platform",
      columns: [
        {
          title: "Platform",
          links: [
            { name: "Platform Core", href: ROUTES.platform, description: "Architecture & registries" },
            { name: "Authority", href: ROUTES.authority, description: "Coverage & quality" },
            { name: "Transparency", href: ROUTES.transparency, description: "How it works" },
            { name: "Observatory", href: ROUTES.observatory, description: "Celestial data platform" },
          ],
        },
        {
          title: "About",
          links: [
            { name: "Community", href: ROUTES.community },
            { name: "About", href: ROUTES.about },
            { name: "Editorial Policy", href: ROUTES.editorialPolicy },
            { name: "Sources", href: ROUTES.sourcesPolicy },
          ],
        },
      ],
    },
  ];
}

/** A flat list of all nav links, for the mobile menu and link audits. */
export function getNavLinks(): NavLink[] {
  return getNavGroups().flatMap((g) => (g.href ? [{ name: g.label, href: g.href }] : g.columns?.flatMap((c) => c.links) ?? []));
}
