import type { ReactNode } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import type { ResolvedAssistant } from "@/platform/data-engine/scientific-assistant-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, assistantPath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

export function AsDetail({ d, demo, demoTitle }: { d: ResolvedAssistant; demo?: ReactNode; demoTitle?: string }) {
  const r = d.record;
  const url = assistantPath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Research Assistant", url: ROUTES.assistant },
    { name: r.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: r.name,
    ...(r.altNames?.length ? { alternateName: r.altNames } : {}),
    description: r.description,
    url: absoluteUrl(url),
  };
  const architecture = r.grounding === "architecture";
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Assistant capability · {r.capability}</span>} title={r.name} lead={r.description} />
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {demo ? (
              <section aria-labelledby="demo">
                <h2 id="demo" className="font-display text-2xl font-bold">{demoTitle ?? "Grounded, from the graph"}</h2>
                <div className="mt-4">{demo}</div>
              </section>
            ) : null}

            {architecture ? (
              <section aria-labelledby="arch" className="rounded-2xl border border-plasma/25 bg-plasma/[0.06] p-5">
                <h2 id="arch" className="font-display text-sm font-semibold uppercase tracking-wider text-plasma">Architecture-ready</h2>
                <p className="mt-2 text-sm text-muted">The interface is defined and modelled in the graph, but no language model is wired in. When one is, it will phrase the grounded facts the retrieval layer supplies — never add to them. Nothing is fabricated.</p>
              </section>
            ) : null}

            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">{r.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-plasma">›</span>{h}</li>)}</ul>
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Examples &amp; related capabilities</h2>
                <ul className="mt-4 flex flex-wrap gap-2">{d.related.map((x: Ref) => <li key={x.id}><Link href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{x.name}</Link></li>)}</ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section aria-labelledby="quality" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="quality" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quality &amp; authority</h2>
                  <span className="text-xs text-faint">{d.quality.completenessPercent}%</span>
                </div>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <dl className="mt-3 grid grid-cols-1 gap-y-1.5">
                  {(Object.keys(d.quality.indicators) as QualityDimension[]).slice(0, 6).map((dim) => (
                    <div key={dim} className="flex items-center justify-between gap-2 text-sm">
                      <dt className="text-muted">{QUALITY_DIMENSION_LABELS[dim]}</dt>
                      <dd><CoverageBadge level={d.quality!.indicators[dim]} /></dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-faint">The grounded capabilities surface only facts already in the graph, each with its provenance and a traceable chain of relations. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
