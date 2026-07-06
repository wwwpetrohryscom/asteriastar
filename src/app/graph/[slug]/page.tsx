import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { GxDetail } from "@/components/graph-explorer/GxDetail";
import { GraphStatsPanel } from "@/components/graph-explorer/GraphStatsPanel";
import { NeighborhoodPanel, PathPanel } from "@/components/graph-explorer/GraphDemo";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { graphViewPath } from "@/lib/routes";
import type { GraphViewRecord } from "@/knowledge-graph/data/graph-explorer-catalog/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.graphExplorer.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/graph/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.graphExplorer.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: graphViewPath(slug) });
}

/** Build a real, live demo for a computed view, run over the actual graph. */
function demoFor(r: GraphViewRecord): { node: ReactNode; title: string } | null {
  const g = engine.graphExplorer;
  const exampleId = (r.relatedKeys ?? []).find((k) => !k.startsWith("graph_view:"));
  if (r.slug === "graph-statistics" || r.slug === "knowledge-metrics") {
    return { node: <GraphStatsPanel stats={g.statistics()} />, title: "Live from the graph" };
  }
  if (r.slug === "shortest-path-finder") {
    const from = "star:sirius";
    const to = "galaxy:milky-way";
    return { node: <PathPanel path={g.shortestPath(from, to)} from={from} to={to} />, title: "A real path through the graph" };
  }
  if (r.backing === "computed" && exampleId) {
    const nb = g.neighborhood(exampleId, 1);
    if (nb.center) return { node: <NeighborhoodPanel center={nb.center} nodes={nb.nodes} />, title: "A real neighbourhood" };
  }
  return null;
}

export default async function GraphViewPage({ params }: PageProps<"/graph/[slug]">) {
  const { slug } = await params;
  const d = engine.graphExplorer.resolveEntry(slug);
  if (!d) notFound();
  const demo = demoFor(d.record);
  return <GxDetail d={d} demo={demo?.node} demoTitle={demo?.title} />;
}
