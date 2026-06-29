import Link from "next/link";
import { getGraphEntitiesByType, entityGraphPath } from "@/knowledge-graph";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import { RELATIONSHIP_PAGES } from "@/lib/discovery";
import { learnPath, timelinePath, connectionPath } from "@/lib/routes";

interface FeedLink {
  title: string;
  href: string;
  meta?: string;
}
interface FeedSection {
  title: string;
  links: FeedLink[];
}

/**
 * The Knowledge Feed — NOT a social feed. No engagement algorithm, no infinite
 * scroll, no fake activity or timestamps. It surfaces real, graph-driven
 * additions to the platform: learning paths, comparisons, timelines, connection
 * pages, and recently-added kinds of entities. Everything links into the graph.
 */
export function KnowledgeFeed() {
  const exoplanets = getGraphEntitiesByType("exoplanet").slice(0, 6);
  const launchVehicles = getGraphEntitiesByType("launch_vehicle").slice(0, 6);

  const sections: FeedSection[] = [
    {
      title: "New learning paths",
      links: LEARNING_PATHS.slice(0, 6).map((p) => ({ title: p.title, href: learnPath(p.slug) })),
    },
    {
      title: "New timelines",
      links: TIMELINES.map((t) => ({ title: t.title, href: timelinePath(t.slug), meta: `${t.events.length} events` })),
    },
    {
      title: "Explore by connection",
      links: RELATIONSHIP_PAGES.slice(0, 6).map((p) => ({ title: p.title, href: connectionPath(p.slug) })),
    },
    {
      title: "Recently added: exoplanets",
      links: exoplanets.map((e) => ({ title: e.name, href: entityGraphPath(e) })),
    },
    {
      title: "Recently added: launch vehicles",
      links: launchVehicles.map((e) => ({ title: e.name, href: entityGraphPath(e) })),
    },
  ].filter((s) => s.links.length > 0);

  return (
    <section aria-labelledby="feed-heading">
      <h2 id="feed-heading" className="font-display text-2xl font-bold">What&apos;s new on Asteria Star</h2>
      <p className="mt-2 max-w-2xl text-muted">
        Real additions to the knowledge platform — no engagement algorithm, no
        infinite scroll, no fake activity. Just new knowledge.
      </p>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-faint">{section.title}</h3>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-baseline justify-between gap-2 text-sm text-muted transition hover:text-fg"
                  >
                    <span>{link.title}</span>
                    {link.meta && <span className="text-xs text-faint">{link.meta}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
