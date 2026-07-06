import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import type { ResolvedLiveSource } from "@/platform/data-engine/live-data-engine";
import { CATEGORY_LABEL } from "@/knowledge-graph/data/live-data-catalog/types";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, livePath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

export function LiveDetail({ d }: { d: ResolvedLiveSource }) {
  const r = d.record;
  const url = livePath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live Data", url: ROUTES.live },
    { name: r.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DataFeed",
    name: r.name,
    description: r.description,
    url: absoluteUrl(url),
    ...(r.endpoint ? { sameAs: r.endpoint } : {}),
  };
  const science = d.connections.science;
  const env = d.envelope;
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>{CATEGORY_LABEL[r.category]} · {r.status === "planned" ? "Architecture-ready" : r.status}</span>} title={r.name} lead={r.description} />
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {/* The honesty envelope — the real, non-fabricated status of this provider. */}
            <section aria-labelledby="envelope" className="rounded-2xl border border-aurora/25 bg-aurora/[0.06] p-5">
              <h2 id="envelope" className="font-display text-sm font-semibold uppercase tracking-wider text-aurora">Provider status</h2>
              <dl className="mt-3 grid grid-cols-1 gap-y-1.5 text-sm sm:grid-cols-2 sm:gap-x-6">
                <div className="flex justify-between gap-2"><dt className="text-muted">Status</dt><dd className="font-medium text-fg">{env.status}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted">Data shown</dt><dd className="font-medium text-fg">{env.data ? "live" : "none (not connected)"}</dd></div>
                {env.endpoint ? <div className="flex justify-between gap-2"><dt className="text-muted">Endpoint</dt><dd className="truncate"><a href={env.endpoint} className="text-aurora hover:underline" rel="nofollow noopener">{env.endpoint.replace(/^https?:\/\//, "")}</a></dd></div> : null}
                {env.license ? <div className="flex justify-between gap-2"><dt className="text-muted">Licence</dt><dd className="text-right text-fg">{env.license}</dd></div> : null}
                <div className="flex justify-between gap-2"><dt className="text-muted">Fetched at</dt><dd className="text-fg">{env.fetchedAt ?? "—"}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted">Stale</dt><dd className="text-fg">{env.stale ? "yes" : "no"}</dd></div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted">{env.provenance}</p>
            </section>

            {r.dataKinds?.length ? (
              <section aria-labelledby="kinds">
                <h2 id="kinds" className="font-display text-2xl font-bold">What it provides</h2>
                <ul className="mt-3 flex flex-wrap gap-2">{r.dataKinds.map((k) => <li key={k} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-muted">{k}</li>)}</ul>
              </section>
            ) : null}

            {r.limitations ? (
              <section aria-labelledby="limits">
                <h2 id="limits" className="font-display text-2xl font-bold">Limitations</h2>
                <p className="mt-2 text-sm text-muted">{r.limitations}</p>
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Organisation &amp; phenomena</h2>
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
                <p className="mt-3 text-xs leading-relaxed text-faint">A provider that is not connected shows no data — only its honest status. No live value or timestamp is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-aurora underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
