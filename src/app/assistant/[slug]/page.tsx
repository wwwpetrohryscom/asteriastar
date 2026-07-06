import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AsDetail } from "@/components/assistant/AsDetail";
import { ComparePanel, RelatedPanel, ExplainPanel } from "@/components/assistant/AssistantDemo";
import { PathPanel } from "@/components/graph-explorer/GraphDemo";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { assistantPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.scientificAssistant.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/assistant/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.scientificAssistant.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: assistantPath(slug) });
}

/** Build a real, grounded demo for a capability, run over the actual graph. */
function demoFor(slug: string): { node: ReactNode; title: string } | null {
  const a = engine.scientificAssistant;
  if (slug === "concept-comparison") {
    const c = a.compare("planet:mars", "planet:venus");
    if (c) return { node: <ComparePanel a={c.a} b={c.b} shared={c.shared} />, title: "A real comparison, from the graph" };
  }
  if (slug === "evidence-chains") {
    const chain = a.evidenceChain("astronomer:edwin-hubble", "cosmology_concept:dark-energy");
    return { node: <PathPanel path={chain} from="Edwin Hubble" to="Dark Energy" />, title: "A real evidence chain" };
  }
  if (slug === "related-concepts") {
    const rel = a.related("stellar_process:main-sequence-evolution", 12);
    const center = { id: "stellar_process:main-sequence-evolution", name: "Main-Sequence Evolution", type: "stellar_process", href: "/stellar-astrophysics/main-sequence-evolution" };
    return { node: <RelatedPanel center={center} related={rel} />, title: "Real related concepts" };
  }
  if (slug === "object-explanation" || slug === "scientific-summaries") {
    const ex = a.explain("astronomical_theory:keplers-laws");
    if (ex) return { node: <ExplainPanel entity={ex.entity} description={ex.description} sources={ex.sources} links={ex.links} />, title: "A grounded explanation" };
  }
  return null;
}

export default async function AssistantPage({ params }: PageProps<"/assistant/[slug]">) {
  const { slug } = await params;
  const d = engine.scientificAssistant.resolveEntry(slug);
  if (!d) notFound();
  const demo = demoFor(slug);
  return <AsDetail d={d} demo={demo?.node} demoTitle={demo?.title} />;
}
