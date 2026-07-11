import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AssistantToolNav } from "@/components/assistant/AssistantToolNav";
import { AssistantTool } from "@/components/assistant/AssistantTool";
import { engine } from "@/platform/data-engine";
import { entityGraphPath, getEntityById } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "The shortest evidence path between two entities — a real chain of graph relations connecting them, followable link by link. Reasoning you can check.";
export const metadata: Metadata = buildMetadata({ title: "Grounded Assistant — Evidence path", description: DESCRIPTION, path: `${ROUTES.assistant}/evidence-path` });

export default async function EvidencePathPage({ searchParams }: PageProps<"/assistant/evidence-path">) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : undefined;
  const to = typeof sp.to === "string" ? sp.to : undefined;
  const path = from && to ? engine.groundedAssistant.evidencePath(from, to) : null;
  const fromName = from ? getEntityById(from)?.name ?? from : undefined;
  const toName = to ? getEntityById(to)?.name ?? to : undefined;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Assistant", url: ROUTES.assistant },
    { name: "Evidence path", url: `${ROUTES.assistant}/evidence-path` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Grounded Assistant · Deterministic</span>} title="Evidence path" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <AssistantToolNav active="evidence-path" />
        <AssistantTool basePath={`${ROUTES.assistant}/evidence-path`} fields={[{ name: "from", label: "From entity" }, { name: "to", label: "To entity" }]} runLabel="Find path" />

        {from && to && path === null && (
          <p className="mt-8 rounded-2xl border border-white/15 bg-white/[0.02] p-6 text-sm text-faint">No evidence path connects <span className="text-fg">{fromName}</span> and <span className="text-fg">{toName}</span> — not enough graph evidence to link them.</p>
        )}
        {path && (
          <div className="mt-8">
            <h2 className="font-display text-xl font-bold text-fg">{fromName} → {toName}</h2>
            <p className="text-xs text-faint">{path.length === 0 ? "The two are the same entity." : `${path.length} step${path.length === 1 ? "" : "s"}, every one a real relation.`}</p>
            <ol className="mt-4 space-y-2">
              {path.map((n, i) => {
                const ent = getEntityById(n.id);
                return (
                  <li key={n.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                    <span className="font-mono text-xs text-faint">{i + 1}</span>
                    <Link href={ent ? entityGraphPath(ent) : "#"} className="text-sm font-medium text-fg hover:text-nasa">{n.name}</Link>
                    <span className="text-xs text-faint">{n.type}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs text-faint">A real shortest path via breadth-first search over the knowledge graph — deterministic, no language model.</p>
          </div>
        )}
      </Container>
    </>
  );
}
