import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { hrefForRecord } from "@/components/deep-space-comms/DSCommCards";
import type { ResolvedDSNetwork } from "@/platform/data-engine/deep-space-comms-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, dsnNetworkPath } from "@/lib/routes";

type Ref = { id: string; name: string; href?: string };

export function NetworkDetail({ d }: { d: ResolvedDSNetwork }) {
  const n = d.record;
  const pagePath = dsnNetworkPath(n.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Space Network", url: ROUTES.deepSpaceNetwork },
    { name: n.name, url: pagePath },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: n.name,
    ...(n.altNames?.length ? { alternateName: n.altNames } : {}),
    description: n.description,
    url: absoluteUrl(d.canonicalHref),
  };
  const science = d.connections.science;

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Communication network{n.operatorLabel ? ` · ${n.operatorLabel}` : ""}</span>} title={n.name} lead={n.description} />

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {n.existing ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
                This is the deep-space-communications view of {n.name}. See its{" "}
                <Link href={d.canonicalHref} className="text-aurora underline-offset-4 hover:underline">main network page</Link> for the base profile.
              </p>
            ) : null}

            {d.stations.length ? (
              <section aria-labelledby="stations">
                <h2 id="stations" className="font-display text-2xl font-bold">Stations</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {d.stations.map((s) => (
                    <li key={s.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <Link href={hrefForRecord(s)} className="font-medium text-fg hover:text-aurora">{s.name}</Link>
                      {(s.locationLabel || s.diameterLabel) ? <div className="mt-0.5 text-xs text-faint">{[s.locationLabel, s.diameterLabel].filter(Boolean).join(" · ")}</div> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.tracksMissions.length ? (
              <section aria-labelledby="supports">
                <h2 id="supports" className="font-display text-2xl font-bold">Missions supported</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {d.tracksMissions.map((m) => <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>)}
                </ul>
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

            <SourceList keys={n.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5 text-sm">
                {d.operator ? <FactRow label="Operator" value={d.operator.name} href={d.operator.href} /> : (n.operatorLabel ? <FactRow label="Operator" value={n.operatorLabel} /> : null)}
                {n.role ? <FactRow label="Role" value={n.role} /> : null}
                {d.bands.length ? <FactRow label="Bands" value={d.bands.map((b) => b.name).join(", ")} /> : null}
              </dl>
            </section>
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && <QualityPanel quality={d.quality} reviewStatus={d.reviewStatus} />}
          </aside>
        </div>
      </Container>
    </>
  );
}

export function FactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex justify-between gap-3 py-2">
      <dt className="text-faint">{label}</dt>
      <dd className="text-right font-medium text-fg">{href ? <Link href={href} className="hover:text-aurora">{value}</Link> : value}</dd>
    </div>
  );
}

export function QualityPanel({ quality, reviewStatus }: { quality: NonNullable<ResolvedDSNetwork["quality"]>; reviewStatus: ResolvedDSNetwork["reviewStatus"] }) {
  return (
    <section aria-labelledby="quality" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="quality" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quality &amp; authority</h2>
        <span className="text-xs text-faint">{quality.completenessPercent}%</span>
      </div>
      <div className="mt-3"><ReviewBadge status={reviewStatus} /></div>
      <dl className="mt-3 grid grid-cols-1 gap-y-1.5">
        {(Object.keys(quality.indicators) as QualityDimension[]).slice(0, 6).map((dim) => (
          <div key={dim} className="flex items-center justify-between gap-2 text-sm">
            <dt className="text-muted">{QUALITY_DIMENSION_LABELS[dim]}</dt>
            <dd><CoverageBadge level={quality.indicators[dim]} /></dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-faint">Infrastructure facts from NASA/JPL, ESA, and JAXA. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-aurora underline-offset-4 hover:underline">source quality</Link>.</p>
    </section>
  );
}

export type { Ref };
