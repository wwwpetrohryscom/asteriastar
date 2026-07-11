import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { CATEGORY_LABEL } from "@/components/satellites/SatellitesTable";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, satellitePath, skyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.satellites.satellites().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/satellites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = engine.satellites.get(slug);
  if (!s || s.kind !== "satellite") return {};
  return buildMetadata({ title: s.name, description: s.description, path: satellitePath(slug) });
}

type Row = { label: string; value: string; href?: string };

export default async function SatellitePage({ params }: PageProps<"/satellites/[slug]">) {
  const { slug } = await params;
  const d = engine.satellites.resolveSatellite(slug);
  if (!d) notFound();
  const s = d.record;
  const url = satellitePath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: s.name, url },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Category", s.category ? CATEGORY_LABEL[s.category] ?? s.category : undefined);
  push("Operator", d.operator?.name, d.operator?.href);
  push("Country", s.country);
  push("Launched", s.launchDate);
  push("Retired", s.retiredDate);
  push("Status", s.status);
  push("Orbit", d.orbit?.name, d.orbit?.href);
  push("Orbit class", s.orbitClass);
  push("Altitude", s.altitudeKm != null ? `${s.altitudeKm.toLocaleString()} km` : undefined);
  push("Altitude range", s.altitudeRange);
  push("Inclination", s.inclinationDeg != null ? `${s.inclinationDeg}°` : undefined);
  push("Period", s.periodLabel ?? (s.periodMinutes != null ? `${s.periodMinutes} min` : undefined));
  push("Mass", s.massKg != null ? `${s.massKg.toLocaleString()} kg` : undefined);
  push("Launch vehicle", d.launchVehicle?.name, d.launchVehicle?.href);
  push("Launch site", d.launchSite?.name, d.launchSite?.href);
  push("Constellation", d.constellation?.name, d.constellation?.href);

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: s.name,
    ...(s.altNames?.length ? { alternateName: s.altNames } : {}),
    description: s.description,
    url: absoluteUrl(url),
    identifier: s.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Satellite{s.category ? ` · ${CATEGORY_LABEL[s.category] ?? s.category}` : ""}{s.country ? ` · ${s.country}` : ""}</span>}
        title={s.name}
        lead={s.applications ?? (d.operator?.name ? `Operated by ${d.operator.name}.` : s.description)}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Satellites</Badge>
          {s.status && <span className="text-sm text-faint">{s.status}</span>}
          {s.launchDate && <span className="text-sm text-faint">Launched {s.launchDate}</span>}
        </div>
      </HeroSection>

      <Container className="mt-6"><EntityImagery entityId={s.id} /></Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.description}</p>
            </section>

            {s.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-muted"><span className="mt-1 text-nasa">★</span><span>{h}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.instruments.length ? (
              <section aria-labelledby="instruments">
                <h2 id="instruments" className="font-display text-2xl font-bold">Instruments</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.instruments.map((i) => (
                    <Link key={i.id} href={i.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{i.name}</Link>
                  ))}
                </div>
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Related</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.related.map((r) => (
                    <Link key={r.id} href={r.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{r.name}</Link>
                  ))}
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

            <SourceList keys={s.sources} title="Sources" />
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

            {/* Live Sky — link to the computed tools; satellite visibility is NOT fabricated
                and no real-time tracking is performed. */}
            <section aria-labelledby="livesky" className="rounded-2xl border border-white/20 bg-white/[0.045] p-5">
              <h2 id="livesky" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Observing the sky</h2>
              <p className="mt-2 text-xs text-muted">This encyclopedia performs no live satellite tracking and states no pass times. For what is genuinely visible tonight at your location, use the computed Live Sky tools.</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href={skyPath("night-sky-tonight")} className="text-nasa hover:underline">Tonight&apos;s observing dashboard →</Link></li>
                <li><Link href={skyPath("planet-visibility")} className="text-nasa hover:underline">Planet visibility →</Link></li>
                <li><Link href={skyPath("moon")} className="text-nasa hover:underline">Moon position &amp; phase →</Link></li>
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Reused agencies, rockets, and launch sites are the platform&apos;s existing entities. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
