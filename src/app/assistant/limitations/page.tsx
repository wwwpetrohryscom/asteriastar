import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AssistantToolNav } from "@/components/assistant/AssistantToolNav";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "What the grounded assistant can and cannot do. It returns only real facts, relations, and citations from the graph; no language model is configured, so it never generates prose and never fabricates an answer.";
export const metadata: Metadata = buildMetadata({ title: "Grounded Assistant — Limitations", description: DESCRIPTION, path: `${ROUTES.assistant}/limitations` });

export default function LimitationsPage() {
  const status = engine.groundedAssistant.llmStatus();
  // A real example of the citation-forced packet a model WOULD receive — proof the architecture is real
  // while no model runs. Built from a well-known, well-connected entity.
  const examplePrompt = engine.groundedAssistant.citationForcedPrompt("planet:mars");
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Assistant", url: ROUTES.assistant },
    { name: "Limitations", url: `${ROUTES.assistant}/limitations` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Grounded Assistant · Honesty</span>} title="What the assistant can and cannot do" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <AssistantToolNav active="limitations" />

        <div className="space-y-10">
          <section aria-labelledby="status" className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 id="status" className="font-display text-lg font-bold text-fg">Language-model status</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-faint">LLM configured</dt><dd className="font-medium text-fg">{status.llmConfigured ? "Yes" : "No"}</dd></div>
              <div><dt className="text-faint">Provider</dt><dd className="font-medium text-fg">{status.provider ?? "—"}</dd></div>
              <div><dt className="text-faint">Mode</dt><dd className="font-medium text-nebula">{status.mode}</dd></div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted">{status.note}</p>
          </section>

          <section aria-labelledby="can">
            <h2 id="can" className="font-display text-2xl font-bold">What it does — deterministically</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li className="flex gap-2"><span className="text-comet">✓</span>Explains an entity from its real description, relations, and cited sources.</li>
              <li className="flex gap-2"><span className="text-comet">✓</span>Compares two entities by their real shared connections.</li>
              <li className="flex gap-2"><span className="text-comet">✓</span>Traces the shortest evidence path between two entities, link by link.</li>
              <li className="flex gap-2"><span className="text-comet">✓</span>Builds a learning path from real relations and curated paths.</li>
              <li className="flex gap-2"><span className="text-comet">✓</span>Summarises the real, source-backed citations behind an entity.</li>
              <li className="flex gap-2"><span className="text-comet">✓</span>Says &ldquo;not enough graph evidence&rdquo; when the graph cannot answer.</li>
            </ul>
          </section>

          <section aria-labelledby="cannot">
            <h2 id="cannot" className="font-display text-2xl font-bold">What it will not do</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li className="flex gap-2"><span className="text-ember">✗</span>Generate prose or opinions — no language model is configured.</li>
              <li className="flex gap-2"><span className="text-ember">✗</span>Assert a fact that is not already in the knowledge graph.</li>
              <li className="flex gap-2"><span className="text-ember">✗</span>Invent numbers, dates, names, or citations to fill a gap.</li>
              <li className="flex gap-2"><span className="text-ember">✗</span>Persist a conversation — there is no chat history or account.</li>
            </ul>
          </section>

          <section aria-labelledby="guardrails">
            <h2 id="guardrails" className="font-display text-2xl font-bold">The guardrails — ready for a model</h2>
            <p className="mt-1 text-sm text-muted">If a language-model provider is ever wired in, it may only phrase the grounded facts it is given, under these rules:</p>
            <ol className="mt-3 space-y-1.5 text-sm text-muted">
              {status.guardrails.map((g, i) => <li key={i} className="flex gap-2"><span className="text-nebula">{i + 1}.</span>{g}</li>)}
            </ol>
          </section>

          {examplePrompt && (
            <section aria-labelledby="packet">
              <h2 id="packet" className="font-display text-2xl font-bold">The citation-forced packet</h2>
              <p className="mt-1 text-sm text-muted">This is exactly what a model would receive for an example entity — grounded facts and citations, and nothing else. The retrieval is real today; the generation is future work.</p>
              <pre className="mt-4 max-h-80 overflow-auto rounded-2xl border border-white/10 bg-[#05070f] p-4 text-xs leading-relaxed text-muted whitespace-pre-wrap">{examplePrompt}</pre>
            </section>
          )}
        </div>
      </Container>
    </>
  );
}
