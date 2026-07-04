import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import type { ResolvedOps } from "@/platform/data-engine/mission-operations-engine";
import { KIND_LABEL } from "@/knowledge-graph/data/mission-operations-catalog/types";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, missionOperationsPath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

export function OpsDetail({ d }: { d: ResolvedOps }) {
  const r = d.record;
  const url = missionOperationsPath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Mission Operations", url: ROUTES.missionOperations },
    { name: r.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": r.kind === "center" ? "Organization" : "DefinedTerm",
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
      <HeroSection compact accent="stone" eyebrow={<span>{KIND_LABEL[r.kind]}{r.agencyLabel ? ` · ${r.agencyLabel}` : ""}</span>} title={r.name} lead={r.description} />
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {(d.operator || d.networks.length || d.related.length) ? (
              <section aria-labelledby="links">
                <h2 id="links" className="font-display text-2xl font-bold">Connections</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {d.operator ? <RefRow label="Operated by" refs={[d.operator]} /> : null}
                  {d.networks.length ? <RefRow label="Uses network" refs={d.networks} /> : null}
                  {d.related.length ? <RefRow label="Related" refs={d.related} /> : null}
                </div>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-stone">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {(r.locationLabel || r.role) ? (
              <section aria-labelledby="quick" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
                <dl className="mt-3 divide-y divide-white/5 text-sm">
                  {r.locationLabel ? <div className="flex justify-between gap-3 py-2"><dt className="text-faint">Location</dt><dd className="text-right font-medium text-fg">{r.locationLabel}</dd></div> : null}
                  {r.countryLabel ? <div className="flex justify-between gap-3 py-2"><dt className="text-faint">Country</dt><dd className="text-right font-medium text-fg">{r.countryLabel}</dd></div> : null}
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Curated from NASA, ESA, and the agencies. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-stone underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function RefRow({ label, refs }: { label: string; refs: Ref[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-faint">{label}:</span>
      {refs.map((x, i) => (
        <Link key={x.id || `${x.name}-${i}`} href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-medium text-fg hover:border-white/25">{x.name}</Link>
      ))}
    </div>
  );
}
