import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { EntityImagery } from "@/components/media/EntityImagery";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { CATEGORY_LABEL } from "@/components/meteorites/MeteoritesTable";
import type { ResolvedMeteorite } from "@/platform/data-engine/meteorite-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, meteoritePath, meteoriteClassPath } from "@/lib/routes";

type Row = { label: string; value: string; href?: string };

export function MeteoriteDetail({ d }: { d: ResolvedMeteorite }) {
  const m = d.record;
  const url = meteoritePath(m.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Meteorites", url: ROUTES.meteorites },
    { name: m.name, url },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Classification", m.classificationLabel);
  push("Type", m.fallType === "fall" ? "Observed fall" : m.fallType === "find" ? "Find" : undefined);
  push("Fell / found", [m.fallDate, m.location, m.country].filter(Boolean).join(" · ") || undefined);
  push("Mass", m.massLabel);
  push("Group", d.group?.name, d.group?.href);
  push("Class", d.class?.name, d.class?.href ?? (m.classSlug ? meteoriteClassPath(m.classSlug) : undefined));
  push("Recovery site", d.recoverySite?.name, d.recoverySite?.href);

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: m.name,
    ...(m.altNames?.length ? { alternateName: m.altNames } : {}),
    description: m.description,
    url: absoluteUrl(url),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Meteorite{m.category ? ` · ${CATEGORY_LABEL[m.category] ?? m.category}` : ""}{m.country ? ` · ${m.country}` : ""}</span>}
        title={m.name}
        lead={m.description}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Meteorites</Badge>
          {m.fallType && <span className="text-sm text-faint">{m.fallType === "fall" ? "Observed fall" : "Find"}</span>}
          {d.parentBodies.map((p) => <Link key={p.id} href={p.href ?? "#"} className="rounded-full border border-white/15 bg-white/[0.03] px-2 py-0.5 text-xs text-nebula hover:border-white/30">From {p.name}</Link>)}
        </div>
      </HeroSection>

      <Container className="mt-6"><EntityImagery entityId={m.id} /></Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {(d.parentBodies.length || d.fireballs.length || d.related.length) ? (
              <section aria-labelledby="origin">
                <h2 id="origin" className="font-display text-2xl font-bold">Origin &amp; links</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {d.parentBodies.length ? <RefRow label="Parent body" refs={d.parentBodies} /> : null}
                  {d.fireballs.length ? <RefRow label="Entry event" refs={d.fireballs} /> : null}
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
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-nebula">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={m.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.href ? <Link href={f.href} className="hover:text-nebula">{f.value}</Link> : f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="livesky" className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.04] p-5">
              <h2 id="livesky" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Meteors in the sky</h2>
              <p className="mt-2 text-xs text-muted">Most meteors burn up as shooting stars and never reach the ground. This encyclopedia detects no live fireballs; for what is observable, use the Live Sky tools.</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/sky/meteor-showers" className="text-nebula hover:underline">Meteor showers →</Link></li>
                <li><Link href="/sky/observing-calendar" className="text-nebula hover:underline">Observing calendar →</Link></li>
              </ul>
            </section>

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
                <p className="mt-3 text-xs leading-relaxed text-faint">Classification and fall data from the Meteoritical Bulletin Database. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function RefRow({ label, refs }: { label: string; refs: { id: string; name: string; href?: string }[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-faint">{label}:</span>
      {refs.map((x, i) => (
        <Link key={x.id || `${x.name}-${i}`} href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-medium text-fg hover:border-white/25">{x.name}</Link>
      ))}
    </div>
  );
}
