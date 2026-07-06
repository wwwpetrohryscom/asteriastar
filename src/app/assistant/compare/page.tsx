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
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "A grounded comparison of two entities by the real common ground between them — the entities they both connect to in the graph. A comparison from relations, not rhetoric.";
export const metadata: Metadata = buildMetadata({ title: "Grounded Assistant — Compare", description: DESCRIPTION, path: `${ROUTES.assistant}/compare` });

export default async function ComparePage({ searchParams }: PageProps<"/assistant/compare">) {
  const sp = await searchParams;
  const a = typeof sp.a === "string" ? sp.a : undefined;
  const b = typeof sp.b === "string" ? sp.b : undefined;
  const result = a && b ? engine.groundedAssistant.compare(a, b) : null;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Assistant", url: ROUTES.assistant },
    { name: "Compare", url: `${ROUTES.assistant}/compare` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Grounded Assistant · Deterministic</span>} title="Compare two entities" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <AssistantToolNav active="compare" />
        <AssistantTool basePath={`${ROUTES.assistant}/compare`} fields={[{ name: "a", label: "First entity" }, { name: "b", label: "Second entity" }]} runLabel="Compare" />

        {a && b && !result && (
          <p className="mt-8 rounded-2xl border border-white/15 bg-white/[0.02] p-6 text-sm text-faint">One or both entities were not found — not enough graph evidence.</p>
        )}
        {result && (
          <div className="mt-8 space-y-6">
            <h2 className="font-display text-2xl font-bold text-fg">
              <Link href={result.a.href} className="hover:text-nebula">{result.a.name}</Link> &amp; <Link href={result.b.href} className="hover:text-nebula">{result.b.name}</Link>
            </h2>
            {result.shared.length === 0 ? (
              <p className="rounded-2xl border border-white/15 bg-white/[0.02] p-6 text-sm text-faint">These two entities share no direct graph neighbours — not enough graph evidence for a common-ground comparison.</p>
            ) : (
              <section aria-labelledby="shared">
                <h3 id="shared" className="font-display text-lg font-bold">Common ground <span className="text-sm font-normal text-faint">({result.shared.length} shared connections)</span></h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.shared.map((s) => (
                    <li key={s.id}><Link href={s.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{s.name} <span className="text-faint">· {s.type}</span></Link></li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-faint">Every shared item is a real graph neighbour of both entities — deterministic, no language model.</p>
              </section>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
