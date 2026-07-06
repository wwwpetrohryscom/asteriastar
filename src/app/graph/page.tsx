import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GxCards } from "@/components/graph-explorer/GxCards";
import { GraphStatsPanel } from "@/components/graph-explorer/GraphStatsPanel";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, graphDiscoveryPath } from "@/lib/routes";
import { BR_DISCOVERIES } from "@/app/graph/discovery";

const DESCRIPTION =
  "Explore the complete scientific knowledge graph visually. Live tools that run real algorithms over the actual graph — statistics and knowledge metrics, the entity and relation explorers, breadth-first neighbourhood expansion, the shortest-path finder, the taxonomy and cross-domain explorers, and graph search — alongside visualisation lenses (force-directed, hierarchical, and cluster layouts) and domain graphs (mission, institution, discovery, scientific lineage). Every number is counted live from the graph and every path is a real chain of relations; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Scientific Knowledge Graph Explorer", description: DESCRIPTION, path: ROUTES.graph });

export default function GraphExplorerHubPage() {
  const e = engine.graphExplorer;
  const stats = e.statistics();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Graph Explorer", url: ROUTES.graph },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Scientific Knowledge Graph Explorer", description: DESCRIPTION, url: ROUTES.graph })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Encyclopedia · {e.viewCount} views · {stats.entityCount.toLocaleString()} entities</span>} title="Scientific Knowledge Graph Explorer" lead="Everything AsteriaStar knows is one connected graph. This explorer opens it up — count its parts, walk an entity's neighbourhood, or trace the shortest chain of relations between any two things in the cosmos. Every figure here is counted live from the real graph." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="font-display text-2xl font-bold">The graph, live</h2>
          <div className="mt-4"><GraphStatsPanel stats={stats} /></div>
        </section>
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the graph</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BR_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={graphDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-halo hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} views</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="views-heading">
          <h2 id="views-heading" className="font-display text-2xl font-bold">The views</h2>
          <div className="mt-4"><GxCards records={e.all()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each view is a first-class knowledge-graph entity resolved through the Scientific Data Engine. The computed views run real graph algorithms — breadth-first neighbourhoods and shortest paths, live counts and degree statistics — over the actual entities and relations of the platform. Every number is counted and every path is a genuine chain of relations; nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-halo underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
