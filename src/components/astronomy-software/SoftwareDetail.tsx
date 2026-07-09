import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import type { ResolvedCh } from "@/platform/data-engine/astronomy-software-engine";
import { KIND_LABEL } from "@/knowledge-graph/data/astronomy-software-catalog/types";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, astronomySoftwarePath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

export function SoftwareDetail({ d }: { d: ResolvedCh }) {
  const r = d.record;
  const url = astronomySoftwarePath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astronomy Software", url: ROUTES.astronomySoftware },
    { name: r.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: r.name,
    ...(r.altNames?.length ? { alternateName: r.altNames } : {}),
    applicationCategory: "Astronomy",
    ...(r.platforms?.length ? { operatingSystem: r.platforms.join(", ") } : {}),
    description: r.description,
    url: absoluteUrl(url),
  };
  const science = d.connections.science;
  const eyebrow = [KIND_LABEL[r.kind], r.platforms?.join(" · "), r.licenseLabel].filter(Boolean).join(" · ");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>{eyebrow}</span>} title={r.name} lead={r.description} />
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">{r.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-plasma">›</span>{h}</li>)}</ul>
              </section>
            ) : null}

            {(r.platforms?.length || r.licenseLabel) ? (
              <section aria-labelledby="facts" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 id="facts" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">At a glance</h2>
                <dl className="mt-2 grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
                  {r.platforms?.length ? (<div className="flex gap-2"><dt className="text-faint">Platforms</dt><dd className="text-muted">{r.platforms.join(", ")}</dd></div>) : null}
                  {r.licenseLabel ? (<div className="flex gap-2"><dt className="text-faint">Licence</dt><dd className="text-muted">{r.licenseLabel}</dd></div>) : null}
                </dl>
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Works with</h2>
                <ul className="mt-4 flex flex-wrap gap-2">{d.related.map((x: Ref) => <li key={x.id}><Link href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{x.name}</Link></li>)}</ul>
              </section>
            ) : null}

            {d.usedBy.length ? (
              <section aria-labelledby="usedby">
                <h2 id="usedby" className="font-display text-2xl font-bold">Across the software ecosystem</h2>
                <ul className="mt-4 flex flex-wrap gap-2">{d.usedBy.map((x: Ref) => <li key={x.id}><Link href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{x.name}</Link></li>)}</ul>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-plasma">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Curated from project documentation and the astronomy-software community. Only well-established facts — purpose and platforms — are stated; version numbers are omitted and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
