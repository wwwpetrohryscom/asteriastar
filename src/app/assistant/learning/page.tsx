import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AssistantToolNav } from "@/components/assistant/AssistantToolNav";
import { AssistantTool } from "@/components/assistant/AssistantTool";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { learnPath } from "@/lib/routes";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "A grounded learning path from any entity — its real broader context, the related concepts to explore next, and any curated platform path that features it. A curriculum drawn from the graph.";
export const metadata: Metadata = buildMetadata({ title: "Grounded Assistant — Learning path", description: DESCRIPTION, path: `${ROUTES.assistant}/learning` });

export default async function LearningPage({ searchParams }: PageProps<"/assistant/learning">) {
  const sp = await searchParams;
  const id = typeof sp.id === "string" ? sp.id : undefined;
  const result = id ? engine.groundedAssistant.learningPath(id) : null;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Assistant", url: ROUTES.assistant },
    { name: "Learning path", url: `${ROUTES.assistant}/learning` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Grounded Assistant · Deterministic</span>} title="Build a learning path" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <AssistantToolNav active="learning" />
        <AssistantTool basePath={`${ROUTES.assistant}/learning`} fields={[{ name: "id", label: "Start from entity" }]} runLabel="Build path" />

        {id && !result && (
          <p className="mt-8 rounded-2xl border border-white/15 bg-white/[0.02] p-6 text-sm text-faint">No entity found — not enough graph evidence.</p>
        )}
        {result && (
          <div className="mt-8 space-y-8">
            <h2 className="font-display text-2xl font-bold text-fg">A path from <Link href={result.entity.href} className="hover:text-nebula">{result.entity.name}</Link></h2>
            {result.note && <p className="rounded-2xl border border-white/15 bg-white/[0.02] p-6 text-sm text-faint">{result.note}</p>}
            {result.foundations.length > 0 && (
              <section aria-labelledby="foundations">
                <h3 id="foundations" className="font-display text-lg font-bold">Foundations &amp; context</h3>
                <p className="text-xs text-faint">What this sits within, from real hierarchical relations.</p>
                <ul className="mt-3 flex flex-wrap gap-2">{result.foundations.map((f) => <li key={f.id}><Link href={f.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{f.name}</Link></li>)}</ul>
              </section>
            )}
            {result.explore.length > 0 && (
              <section aria-labelledby="explore">
                <h3 id="explore" className="font-display text-lg font-bold">Explore next</h3>
                <p className="text-xs text-faint">The nearest related concepts in the graph.</p>
                <ul className="mt-3 flex flex-wrap gap-2">{result.explore.map((e) => <li key={e.id}><Link href={e.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{e.name}</Link></li>)}</ul>
              </section>
            )}
            {result.curatedPaths.length > 0 && (
              <section aria-labelledby="curated">
                <h3 id="curated" className="font-display text-lg font-bold">Curated learning paths</h3>
                <ul className="mt-3 space-y-2">{result.curatedPaths.map((p) => <li key={p.slug} className="rounded-lg border border-white/10 bg-white/[0.02] p-3"><Link href={learnPath(p.slug)} className="font-medium text-fg hover:text-nebula">{p.title}</Link><p className="mt-0.5 text-sm text-muted">{p.description}</p></li>)}</ul>
              </section>
            )}
            <p className="text-xs text-faint">Assembled from {result.entity.name}&rsquo;s real relations and the platform&rsquo;s curated paths — deterministic, no language model.</p>
          </div>
        )}
      </Container>
    </>
  );
}
