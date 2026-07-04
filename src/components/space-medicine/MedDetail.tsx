import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { MedCards } from "@/components/space-medicine/MedCards";
import type { ResolvedMed } from "@/platform/data-engine/space-medicine-engine";
import { KIND_LABEL } from "@/knowledge-graph/data/space-medicine-catalog/types";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, spaceMedicinePath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

function Chips({ refs }: { refs: Ref[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {refs.map((m) => <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>)}
    </ul>
  );
}

export function MedDetail({ d }: { d: ResolvedMed }) {
  const r = d.record;
  const url = spaceMedicinePath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Medicine", url: ROUTES.spaceMedicine },
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
      <HeroSection compact accent="aurora" eyebrow={<span>{KIND_LABEL[r.kind]}{d.topic ? ` · ${d.topic.name}` : ""}</span>} title={r.name} lead={r.description}>
        <div className="mt-4 flex flex-wrap gap-2">
          {d.topic ? <Link href={d.topic.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-aurora hover:border-white/30">{d.topic.name}</Link> : null}
          {d.eclss ? <Link href={d.eclss.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-aurora hover:border-white/30">Part of {d.eclss.name}</Link> : null}
        </div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">{r.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-aurora">›</span>{h}</li>)}</ul>
              </section>
            ) : null}

            {r.definition ? (
              <section aria-labelledby="def" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 id="def" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">In brief</h2>
                <p className="mt-2 text-sm text-muted">{r.definition}</p>
              </section>
            ) : null}

            {d.members.length ? (
              <section aria-labelledby="members">
                <h2 id="members" className="font-display text-2xl font-bold">In this discipline</h2>
                <div className="mt-4"><MedCards records={d.members} /></div>
              </section>
            ) : null}

            {d.mitigatedBy.length ? (
              <section aria-labelledby="mitby">
                <h2 id="mitby" className="font-display text-2xl font-bold">Countermeasures</h2>
                <p className="mt-1 text-sm text-muted">How this effect is mitigated.</p>
                <Chips refs={d.mitigatedBy} />
              </section>
            ) : null}

            {d.mitigates.length ? (
              <section aria-labelledby="mit">
                <h2 id="mit" className="font-display text-2xl font-bold">Mitigates</h2>
                <p className="mt-1 text-sm text-muted">The physiological effects this countermeasure targets.</p>
                <Chips refs={d.mitigates} />
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Studied aboard &amp; related</h2>
                <Chips refs={d.related} />
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-aurora">{cx.other.name}</Link>
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Curated from NASA and ESA human-research sources. Quantitative figures are omitted unless well established. See{" "}<Link href="/transparency/source-quality" className="text-aurora underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
