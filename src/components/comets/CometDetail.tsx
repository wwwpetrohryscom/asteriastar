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
import { CATEGORY_LABEL, periodLabel } from "@/components/comets/CometsTable";
import type { ResolvedComet } from "@/platform/data-engine/comet-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES } from "@/lib/routes";

type Row = { label: string; value: string; href?: string };

/** Shared detail view for a comet / active asteroid / dormant comet. */
export function CometDetail({ d, kindLabel, url }: { d: ResolvedComet; kindLabel: string; url: string }) {
  const c = d.record;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Comets", url: ROUTES.comets },
    { name: c.name, url },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Designation", c.designation);
  push("Type", c.cometTypeLabel ?? (c.category ? CATEGORY_LABEL[c.category] ?? c.category : undefined));
  push("Family", d.family?.name, d.family?.href);
  push("Discovered", [c.discoveryYear, c.discoveredBy].filter(Boolean).join(" · ") || undefined);
  push("Orbital period", periodLabel(c));
  push("Perihelion", c.perihelionDate);
  push("Next perihelion", c.nextPerihelion);
  push("Nucleus diameter", c.nucleusDiameterKm != null ? `${c.nucleusDiameterKm} km` : undefined);
  if (c.fragmented) push("Note", "Has fragmented into multiple pieces");

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: c.name,
    ...(c.altNames?.length ? { alternateName: c.altNames } : {}),
    ...(c.designation ? { identifier: c.designation } : {}),
    description: c.description,
    url: absoluteUrl(url),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>{kindLabel}{c.designation ? ` · ${c.designation}` : ""}</span>}
        title={c.name}
        lead={c.description}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Comets</Badge>
          {c.greatComet && <span className="rounded-full border border-nasa/40 bg-nasa/10 px-2 py-0.5 text-xs font-medium text-nasa">Great comet</span>}
          {c.sungrazer && <span className="text-sm text-faint">Sungrazer</span>}
        </div>
      </HeroSection>

      <Container className="mt-6"><EntityImagery entityId={c.id} /></Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {c.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {c.highlights.map((h) => (<li key={h} className="flex gap-3 text-muted"><span className="mt-1 text-nasa">★</span><span>{h}</span></li>))}
                </ul>
              </section>
            ) : null}

            {(d.visitedBy.length || d.sampleReturnedBy.length || d.targetedBy.length) ? (
              <section aria-labelledby="missions">
                <h2 id="missions" className="font-display text-2xl font-bold">Exploration</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {d.visitedBy.length ? <RefRow label="Visited by" refs={d.visitedBy} /> : null}
                  {d.sampleReturnedBy.length ? <RefRow label="Sample returned by" refs={d.sampleReturnedBy} /> : null}
                  {d.targetedBy.length ? <RefRow label="Targeted by" refs={d.targetedBy} /> : null}
                </div>
              </section>
            ) : null}

            {(d.classes.length || d.reservoirs.length || d.meteorShowers.length) ? (
              <section aria-labelledby="context">
                <h2 id="context" className="font-display text-2xl font-bold">Classification &amp; origin</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {d.classes.length ? <RefRow label="Class" refs={d.classes} /> : null}
                  {d.reservoirs.length ? <RefRow label="Source reservoir" refs={d.reservoirs} /> : null}
                  {d.meteorShowers.length ? <RefRow label="Parent of meteor shower" refs={d.meteorShowers} /> : null}
                  {c.meteorShowerNote && !d.meteorShowers.length ? <p className="text-muted"><span className="text-faint">Meteor shower:</span> {c.meteorShowerNote}</p> : null}
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
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-nasa">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={c.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="scientific-card p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.href ? <Link href={f.href} className="hover:text-nasa">{f.value}</Link> : f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Live Sky — link to the computed tools; comet visibility is NOT fabricated. */}
            <section aria-labelledby="livesky" className="rounded-2xl border border-white/20 bg-white/[0.045] p-5">
              <h2 id="livesky" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Observing</h2>
              <p className="mt-2 text-xs text-muted">This encyclopedia states no current comet brightness or &ldquo;visible tonight&rdquo; claim. For what is actually observable, use the Live Sky tools.</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/sky/comets" className="text-nasa hover:underline">Comets in the Live Sky →</Link></li>
                <li><Link href="/sky/meteor-showers" className="text-nasa hover:underline">Meteor showers →</Link></li>
                <li><Link href="/sky/observing-calendar" className="text-nasa hover:underline">Observing calendar →</Link></li>
              </ul>
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Orbits and discovery data from the NASA/JPL Small-Body Database. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
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
      {refs.map((m, i) => (
        <Link key={m.id || `${m.name}-${i}`} href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-medium text-fg hover:border-white/25">{m.name}</Link>
      ))}
    </div>
  );
}
