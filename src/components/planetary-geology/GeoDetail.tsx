import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { GeoCards } from "@/components/planetary-geology/GeoCards";
import type { ResolvedGeo } from "@/platform/data-engine/planetary-geology-engine";
import { KIND_LABEL } from "@/knowledge-graph/data/planetary-geology-catalog/types";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, planetaryGeologyPath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

export function GeoDetail({ d }: { d: ResolvedGeo }) {
  const r = d.record;
  const url = planetaryGeologyPath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Planetary Geology", url: ROUTES.planetaryGeology },
    { name: r.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": r.kind === "feature" ? "Place" : "DefinedTerm",
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
      <HeroSection compact accent="plasma" eyebrow={<span>{KIND_LABEL[r.kind]}{d.body ? ` · ${d.body.name}` : ""}</span>} title={r.name} lead={r.description}>
        <div className="mt-4 flex flex-wrap gap-2">
          {d.featureType ? <Link href={d.featureType.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-plasma hover:border-white/30">{d.featureType.name}</Link> : null}
          {d.body ? <Link href={d.body.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-plasma hover:border-white/30">On {d.body.name}</Link> : null}
        </div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">{r.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-plasma">›</span>{h}</li>)}</ul>
              </section>
            ) : null}

            {r.definition ? (
              <section aria-labelledby="def" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 id="def" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">In brief</h2>
                <p className="mt-2 text-sm text-muted">{r.definition}</p>
              </section>
            ) : null}

            {(d.members.length || d.reusedMembers.length) ? (
              <section aria-labelledby="members">
                <h2 id="members" className="font-display text-2xl font-bold">Examples of this feature</h2>
                {d.members.length ? <div className="mt-4"><GeoCards records={d.members} /></div> : null}
                {d.reusedMembers.length ? <ul className="mt-4 flex flex-wrap gap-2">{d.reusedMembers.map((m) => <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>)}</ul> : null}
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Explored by</h2>
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
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-plasma">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {r.dimensionsLabel ? (
              <section aria-labelledby="quick" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
                <dl className="mt-3 divide-y divide-white/5 text-sm">
                  <div className="flex justify-between gap-3 py-2"><dt className="text-faint">Size</dt><dd className="text-right font-medium text-fg">{r.dimensionsLabel}</dd></div>
                  {d.body ? <div className="flex justify-between gap-3 py-2"><dt className="text-faint">World</dt><dd className="text-right font-medium text-fg"><Link href={d.body.href ?? "#"} className="hover:text-plasma">{d.body.name}</Link></dd></div> : null}
                </dl>
              </section>
            ) : null}
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Curated from NASA/JPL planetary data. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
