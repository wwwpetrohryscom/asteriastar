import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AssistantToolNav } from "@/components/assistant/AssistantToolNav";
import { AssistantTool } from "@/components/assistant/AssistantTool";
import { engine } from "@/platform/data-engine";
import { RELATION_LABELS } from "@/knowledge-graph/schema";
import { formatCitation } from "@/lib/citations";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "A grounded explanation of any entity — what it is, its real relations, and its cited sources — assembled only from the knowledge graph. No language model; nothing generated.";
export const metadata: Metadata = buildMetadata({ title: "Grounded Assistant — Explain", description: DESCRIPTION, path: `${ROUTES.assistant}/entity` });

export default async function ExplainPage({ searchParams }: PageProps<"/assistant/entity">) {
  const sp = await searchParams;
  const id = typeof sp.id === "string" ? sp.id : undefined;
  const result = id ? engine.groundedAssistant.explain(id) : null;
  const cites = id ? engine.groundedAssistant.citations(id) : null;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Assistant", url: ROUTES.assistant },
    { name: "Explain", url: `${ROUTES.assistant}/entity` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Grounded Assistant · Deterministic</span>} title="Explain an entity" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <AssistantToolNav active="entity" />
        <AssistantTool basePath={`${ROUTES.assistant}/entity`} fields={[{ name: "id", label: "Entity to explain" }]} runLabel="Explain" />

        {id && !result && (
          <p className="mt-8 rounded-2xl border border-white/15 bg-white/[0.02] p-6 text-sm text-faint">No entity found for <code className="text-fg">{id}</code> — not enough graph evidence.</p>
        )}
        {result && (
          <div className="mt-8 space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-fg">{result.entity.name}</h2>
              <p className="text-xs text-faint">{result.entity.type}</p>
              {result.description && <p className="mt-3 text-sm leading-relaxed text-muted">{result.description}</p>}
            </section>
            {result.links.length > 0 && (
              <section aria-labelledby="links">
                <h3 id="links" className="font-display text-lg font-bold">How it connects <span className="text-sm font-normal text-faint">({result.links.length} real relations)</span></h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {result.links.map((l, i) => (
                    <li key={`${l.relation}-${l.other.id}-${i}`} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{RELATION_LABELS[l.relation as keyof typeof RELATION_LABELS] ?? l.relation.replace(/_/g, " ")}</span>
                      <Link href={l.other.href} className="text-right font-medium text-fg hover:text-nasa">{l.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {cites && cites.citations.length > 0 && (
              <section aria-labelledby="cites">
                <h3 id="cites" className="font-display text-lg font-bold">Citations <span className="text-sm font-normal text-faint">({cites.citations.length})</span></h3>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {cites.citations.map((c) => <li key={c.id}>{formatCitation(c, "apa")}</li>)}
                </ul>
              </section>
            )}
            <p className="text-xs text-faint">Assembled only from {result.entity.name}&rsquo;s own description, its real graph relations, and its cited sources — deterministic, no language model.</p>
          </div>
        )}
      </Container>
    </>
  );
}
