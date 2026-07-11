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
import { CATEGORY_LABEL, TAXONOMY_LABEL, diameterLabel } from "@/components/asteroids/AsteroidsTable";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, asteroidPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.asteroids.pages().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.asteroids.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: asteroidPath(slug) });
}

type Row = { label: string; value: string; href?: string };

export default async function AsteroidPage({ params }: PageProps<"/asteroids/[slug]">) {
  const { slug } = await params;
  const d = engine.asteroids.resolveAsteroid(slug);
  if (!d) notFound();
  const a = d.record;
  const url = asteroidPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Asteroids", url: ROUTES.asteroids },
    { name: a.name, url },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Designation", a.designation);
  push("Category", a.category ? CATEGORY_LABEL[a.category] ?? a.category : undefined);
  push("Taxonomy", a.taxonomyClass ? TAXONOMY_LABEL[a.taxonomyClass] ?? a.taxonomyClass : undefined, undefined);
  push("Spectral type", a.spectralType);
  push("Diameter", diameterLabel(a));
  push("Discovered", [a.discoveryYear, a.discoveredBy].filter(Boolean).join(" · ") || undefined);
  push("Family", d.family?.name, d.family?.href);
  push("Near-Earth class", d.neoClass?.name, d.neoClass?.href);
  push("Orbital resonance", d.resonance?.name, d.resonance?.href);
  push("System", a.systemType ? `${a.systemType[0].toUpperCase()}${a.systemType.slice(1)}${a.moons?.length ? ` — moon${a.moons.length > 1 ? "s" : ""}: ${a.moons.join(", ")}` : ""}` : undefined);
  push("Primary", d.primary?.name, d.primary?.href);

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: a.name,
    ...(a.altNames?.length ? { alternateName: a.altNames } : {}),
    ...(a.designation ? { identifier: a.designation } : {}),
    description: a.description,
    url: absoluteUrl(url),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Minor planet{a.category ? ` · ${CATEGORY_LABEL[a.category] ?? a.category}` : ""}{a.designation ? ` · ${a.designation}` : ""}</span>}
        title={a.name}
        lead={a.description}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Asteroids</Badge>
          {a.pha && <span className="rounded-full border border-nasa/40 bg-nasa/10 px-2 py-0.5 text-xs font-medium text-nasa">Potentially hazardous</span>}
          {a.systemType && <span className="text-sm text-faint">{a.systemType} system</span>}
        </div>
      </HeroSection>

      <Container className="mt-6"><EntityImagery entityId={a.id} /></Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {a.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {a.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-muted"><span className="mt-1 text-nasa">★</span><span>{h}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}

            {(d.visitedBy.length || d.sampleReturnedBy.length || d.targetedBy.length) ? (
              <section aria-labelledby="missions">
                <h2 id="missions" className="font-display text-2xl font-bold">Exploration</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {d.visitedBy.length ? <MissionRow label="Visited by" refs={d.visitedBy} /> : null}
                  {d.sampleReturnedBy.length ? <MissionRow label="Sample returned by" refs={d.sampleReturnedBy} /> : null}
                  {d.targetedBy.length ? <MissionRow label="Targeted by" refs={d.targetedBy} /> : null}
                </div>
              </section>
            ) : null}

            {d.groups.length || d.trojanGroups.length ? (
              <section aria-labelledby="populations">
                <h2 id="populations" className="font-display text-2xl font-bold">Populations</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...d.groups, ...d.trojanGroups].map((g) => (
                    <Link key={g.id} href={g.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{g.name}</Link>
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

            <SourceList keys={a.sources} title="Sources" />
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

            {a.pha && (
              <section className="rounded-2xl border border-nasa/40 bg-nasa/10 p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Planetary defense</h2>
                <p className="mt-2 text-xs text-muted">Classified as a Potentially Hazardous Asteroid — an objective size-and-distance monitoring category, not a prediction of impact.</p>
                <Link href="/asteroids/planetary-defense" className="mt-2 inline-block text-sm text-nasa hover:underline">How near-Earth objects are tracked →</Link>
              </section>
            )}

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
                <p className="mt-3 text-xs leading-relaxed text-faint">Designations from the IAU Minor Planet Center; orbits/sizes from NASA/JPL. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function MissionRow({ label, refs }: { label: string; refs: { id: string; name: string; href?: string }[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-faint">{label}:</span>
      {refs.map((m) => (
        <Link key={m.id} href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-medium text-fg hover:border-white/25">{m.name}</Link>
      ))}
    </div>
  );
}
