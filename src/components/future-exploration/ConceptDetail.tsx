import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { ConceptCards } from "@/components/future-exploration/ConceptCards";
import type { ResolvedConcept } from "@/platform/data-engine/future-missions-engine";
import { KIND_LABEL, STATUS_LABEL } from "@/knowledge-graph/data/future-missions-catalog/types";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, futureExplorationPath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

function Chips({ refs }: { refs: Ref[] }) {
  return <ul className="mt-4 flex flex-wrap gap-2">{refs.map((m) => <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>)}</ul>;
}

export function ConceptDetail({ d }: { d: ResolvedConcept }) {
  const r = d.record;
  const url = futureExplorationPath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Future Exploration", url: ROUTES.futureExploration },
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
      <HeroSection compact accent="ember" eyebrow={<span>{KIND_LABEL[r.kind]}{d.theme ? ` · ${d.theme.name}` : ""}{r.status ? ` · ${STATUS_LABEL[r.status]}` : ""}</span>} title={r.name} lead={r.description}>
        <div className="mt-4 flex flex-wrap gap-2">
          {d.theme ? <Link href={d.theme.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-nasa hover:border-white/30">{d.theme.name}</Link> : null}
          {d.agency ? <Link href={d.agency.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-nasa hover:border-white/30">{d.agency.name}</Link> : null}
          {d.target ? <Link href={d.target.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-nasa hover:border-white/30">Target: {d.target.name}</Link> : null}
        </div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">{r.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-nasa">›</span>{h}</li>)}</ul>
              </section>
            ) : null}

            {r.goals?.length ? (
              <section aria-labelledby="goals">
                <h2 id="goals" className="font-display text-2xl font-bold">Mission goals</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">{r.goals.map((g) => <li key={g} className="flex gap-2"><span className="text-nasa">›</span>{g}</li>)}</ul>
              </section>
            ) : null}

            {r.technology ? (
              <section aria-labelledby="tech" className="scientific-card p-5">
                <h2 id="tech" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Technology</h2>
                <p className="mt-2 text-sm text-muted">{r.technology}</p>
              </section>
            ) : null}

            {r.uncertainties ? (
              <section aria-labelledby="unc" className="scientific-card p-5">
                <h2 id="unc" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Status &amp; uncertainties</h2>
                <p className="mt-2 text-sm text-muted">{r.uncertainties}</p>
              </section>
            ) : null}

            {r.definition ? (
              <section aria-labelledby="def" className="scientific-card p-5">
                <h2 id="def" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">In brief</h2>
                <p className="mt-2 text-sm text-muted">{r.definition}</p>
              </section>
            ) : null}

            {(d.members.length || d.reusedMembers.length) ? (
              <section aria-labelledby="members">
                <h2 id="members" className="font-display text-2xl font-bold">Missions in this theme</h2>
                {d.members.length ? <div className="mt-4"><ConceptCards records={d.members} /></div> : null}
                {d.reusedMembers.length ? (
                  <div className="mt-4">
                    <p className="text-sm text-muted">Already in development or en route:</p>
                    <Chips refs={d.reusedMembers} />
                  </div>
                ) : null}
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Related</h2>
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
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-nasa">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {(r.status || r.timelineLabel || d.agency || d.target) ? (
              <section aria-labelledby="quick" className="scientific-card p-5">
                <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
                <dl className="mt-3 divide-y divide-white/5 text-sm">
                  {r.status ? <div className="flex justify-between gap-3 py-2"><dt className="text-faint">Status</dt><dd className="text-right font-medium text-fg">{STATUS_LABEL[r.status]}</dd></div> : null}
                  {r.timelineLabel ? <div className="flex justify-between gap-3 py-2"><dt className="text-faint">Timeline</dt><dd className="text-right font-medium text-fg">{r.timelineLabel}</dd></div> : null}
                  {d.agency ? <div className="flex justify-between gap-3 py-2"><dt className="text-faint">Agency</dt><dd className="text-right font-medium text-fg"><Link href={d.agency.href ?? "#"} className="hover:text-nasa">{d.agency.name}</Link></dd></div> : null}
                  {d.target ? <div className="flex justify-between gap-3 py-2"><dt className="text-faint">Target</dt><dd className="text-right font-medium text-fg"><Link href={d.target.href ?? "#"} className="hover:text-nasa">{d.target.name}</Link></dd></div> : null}
                </dl>
              </section>
            ) : null}
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section aria-labelledby="quality" className="scientific-card p-5">
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Only official or credible concepts are included. Status and uncertainties are stated honestly; dates are given only when publicly stated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
