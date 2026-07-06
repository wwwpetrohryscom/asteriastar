import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AsCards } from "@/components/assistant/AsCards";
import { ComparePanel } from "@/components/assistant/AssistantDemo";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, assistantDiscoveryPath } from "@/lib/routes";
import { BS_DISCOVERIES } from "@/app/assistant/discovery";

const DESCRIPTION =
  "Turn the knowledge graph into an explainable, grounded research assistant. The grounded capabilities are backed by real retrieval over the graph today — scientific search, object explanation, concept comparison, relationship explanation, evidence chains, provenance- and citation-aware answers, related concepts, reading recommendations, scientific summaries, learning-path generation, and cross-domain reasoning — and surface only facts already in the graph, with their provenance and a traceable chain of relations. There is no language model in this layer and nothing is generated or invented: the no-hallucination guarantee. The architecture capabilities — the answer modes, RAG-ready interfaces, prompt orchestration, conversation memory, and LLM integration — are prepared as interfaces for a future model that would phrase these grounded facts, never add to them.";

export const metadata: Metadata = buildMetadata({ title: "Scientific AI Research Assistant Platform", description: DESCRIPTION, path: ROUTES.assistant });

export default function AssistantHubPage() {
  const e = engine.scientificAssistant;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Research Assistant", url: ROUTES.assistant },
  ];
  const cmp = e.compare("planet:mars", "planet:venus");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Scientific AI Research Assistant Platform", description: DESCRIPTION, url: ROUTES.assistant })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Encyclopedia · {e.count} capabilities · {e.groundedCount} grounded today</span>} title="Scientific AI Research Assistant Platform" lead="An assistant that never makes things up. It answers from the knowledge graph alone — comparing concepts by their real connections, tracing evidence chain by chain, and citing the provenance of every fact — so an answer can always be checked against the graph. A language model, when it comes, will phrase these grounded facts and never add to them." />
      <Container className="mt-8 mb-14 space-y-12">
        {cmp ? (
          <section aria-labelledby="demo-heading">
            <h2 id="demo-heading" className="font-display text-2xl font-bold">Grounded, not generated</h2>
            <p className="mt-1 text-sm text-muted">A real concept comparison — the common ground between two planets, drawn from the graph:</p>
            <div className="mt-4"><ComparePanel a={cmp.a} b={cmp.b} shared={cmp.shared} /></div>
          </section>
        ) : null}
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the assistant</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BS_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={assistantDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} capabilities</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="grounded-heading">
          <h2 id="grounded-heading" className="font-display text-2xl font-bold">Grounded capabilities</h2>
          <div className="mt-4"><AsCards records={e.grounded()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each capability is a first-class knowledge-graph entity resolved through the Scientific Data Engine. The grounded capabilities run real retrieval over the actual graph — search, comparison, evidence chains, related concepts, grounded explanations — and surface only facts already in the graph, each with its cited sources. There is no language model in this layer; nothing is generated. The architecture capabilities are interfaces for a future model that would phrase these grounded facts and never add to them. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
