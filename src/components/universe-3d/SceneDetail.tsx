import type { ReactNode } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import type { ResolvedScene } from "@/platform/data-engine/webgl-universe-engine";
import { CATEGORY_LABEL, COVERAGE_LABEL } from "@/knowledge-graph/data/webgl-universe-catalog";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, universeScenePath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

/**
 * Layout shell for a Universe scene (Program BU). The interactive viewer, the accessibility data table,
 * and any descriptive content are injected by the page (which builds them from real engine data); this
 * shell frames them with the honest coverage panel — the coverage mode, the exact coordinate basis, and
 * the limitations — so a reader always sees what the geometry means and what it does not claim.
 */
export function SceneDetail({
  d,
  viewer,
  table,
  descriptive,
}: {
  d: ResolvedScene;
  viewer?: ReactNode;
  table?: ReactNode;
  descriptive?: ReactNode;
}) {
  const r = d.record;
  const url = universeScenePath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "3D Universe", url: ROUTES.universe3d },
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
  const science = d.connections.science;
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>{CATEGORY_LABEL[r.category]} · {r.dataSource}</span>}
        title={r.name}
        lead={r.description}
      />
      <Container className="mt-8 mb-14">
        {viewer ? <div className="mb-8">{viewer}</div> : null}
        {descriptive ? <div className="mb-8">{descriptive}</div> : null}

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {/* The honesty envelope for geometry. */}
            <section aria-labelledby="coverage" className="scientific-card p-5">
              <h2 id="coverage" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">What this scene shows</h2>
              <p className="mt-3 text-sm text-fg"><span className="font-medium text-nasa">{COVERAGE_LABEL[r.coverageMode]}</span></p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.coordinateBasis}</p>
              {r.limitations ? <p className="mt-3 text-xs leading-relaxed text-faint">{r.limitations}</p> : null}
            </section>

            {table ? (
              <section aria-labelledby="table">
                <h2 id="table" className="font-display text-2xl font-bold">The objects in this scene</h2>
                <p className="mt-2 text-sm text-muted">The same measured data as the visual scene, as a table — readable without JavaScript and by a screen reader.</p>
                <div className="mt-4">{table}</div>
              </section>
            ) : null}

            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">{r.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-nasa">›</span>{h}</li>)}</ul>
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">What it draws on</h2>
                <ul className="mt-4 flex flex-wrap gap-2">{d.related.map((x: Ref) => <li key={x.id}><Link href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{x.name}</Link></li>)}</ul>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-nasa">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {d.completes ? (
              <section className="scientific-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Completes the atlas view</h2>
                <Link href={d.completes.href ?? "#"} className="mt-2 inline-block text-sm font-medium text-nasa hover:underline">{d.completes.name} ›</Link>
              </section>
            ) : null}
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section aria-labelledby="review" className="scientific-card p-5">
                <h2 id="review" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Review</h2>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <p className="mt-3 text-xs leading-relaxed text-faint">Every position is a measured coordinate reused from the graph; no position is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
