import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { EntityImagery } from "@/components/media/EntityImagery";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { MissionStatusBadge } from "@/components/small-body-missions/MissionStatusBadge";
import type { ResolvedMission } from "@/platform/data-engine/small-body-missions-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, smallBodyMissionPath, smallBodyTypePath, smallBodySamplePath } from "@/lib/routes";

type Row = { label: string; value: string; href?: string };
type Ref = { id: string; name: string; href?: string };

export function MissionDetail({ d }: { d: ResolvedMission }) {
  const m = d.record;
  const pagePath = smallBodyMissionPath(m.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Small-Body Missions", url: ROUTES.smallBodyMissions },
    { name: m.name, url: pagePath },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Agency", m.agencyLabel);
  push("Launched", m.launchDate);
  push("Launch vehicle", m.launchVehicleLabel ?? d.launchVehicle?.name, d.launchVehicle?.href);
  push("Spacecraft", m.spacecraftLabel);
  push("Mission type", m.missionTypeLabel);

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: m.name,
    ...(m.altNames?.length ? { alternateName: m.altNames } : {}),
    description: m.description,
    url: absoluteUrl(d.canonicalHref),
  };

  const sci: { label: string; value?: string }[] = [
    { label: "Goals", value: m.goals },
    { label: "Engineering milestones", value: m.milestones },
    { label: "Science discoveries", value: m.discoveries },
    { label: "Surface operations", value: m.surfaceOps },
    { label: "Sample return", value: m.sampleReturnLabel },
    { label: "Instruments", value: m.instrumentsLabel },
    { label: "Outcome", value: m.outcome },
    { label: "Known limitations", value: m.limitations },
  ].filter((x) => x.value);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>Small-body mission{m.agencyLabel ? ` · ${m.agencyLabel}` : ""}</span>}
        title={m.name}
        lead={m.description}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {m.status ? <MissionStatusBadge status={m.status} /> : null}
          {d.classes.map((c) => <Link key={c.id} href={c.href ?? smallBodyTypePath(c.slug ?? "")} className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-white hover:border-white/30">{c.name}</Link>)}
        </div>
      </HeroSection>

      <Container className="mt-6"><EntityImagery entityId={m.id} /></Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {m.existing ? (
              <p className="scientific-card px-4 py-3 text-sm text-muted">
                This is the small-body-missions view of {m.name}. See its{" "}
                <Link href={d.canonicalHref} className="text-white underline-offset-4 hover:underline">main mission page</Link> for the full profile.
              </p>
            ) : null}

            {(d.targets.length || m.targetLabel || d.sample) ? (
              <section aria-labelledby="targets">
                <h2 id="targets" className="font-display text-2xl font-bold">Targets &amp; sample</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {d.targets.length ? <RefRow label="Target bodies" refs={d.targets} /> : null}
                  {m.targetLabel ? <div className="flex flex-wrap items-baseline gap-2"><span className="text-faint">Also:</span><span className="text-muted">{m.targetLabel}</span></div> : null}
                  {d.sample ? <RefRow label="Returned sample" refs={[{ id: d.sample.id, name: d.sample.name, href: d.sample.slug ? smallBodySamplePath(d.sample.slug) : d.sample.href }]} /> : null}
                </div>
              </section>
            ) : null}

            {sci.length ? (
              <section aria-labelledby="science">
                <h2 id="science" className="font-display text-2xl font-bold">Mission &amp; science</h2>
                <dl className="mt-3 space-y-3 text-sm">
                  {sci.map((x) => (
                    <div key={x.label}>
                      <dt className="text-faint">{x.label}</dt>
                      <dd className="mt-0.5 text-muted">{x.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-white">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={m.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="scientific-card p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              {m.status ? <div className="mt-3"><MissionStatusBadge status={m.status} /></div> : null}
              <dl className="mt-3 divide-y divide-white/5">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.href ? <Link href={f.href} className="hover:text-white">{f.value}</Link> : f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

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
                <p className="mt-3 text-xs leading-relaxed text-faint">Mission facts from NASA/JPL, ESA, and JAXA. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-white underline-offset-4 hover:underline">source quality</Link>.</p>
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
