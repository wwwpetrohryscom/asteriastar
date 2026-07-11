import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { SatellitesCards } from "@/components/satellites/SatellitesCards";
import { CATEGORY_LABEL } from "@/components/satellites/SatellitesTable";
import { engine } from "@/platform/data-engine";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, satelliteConstellationPath, skyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.satellites.constellations().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/satellites/constellation/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = engine.satellites.resolveConstellation(slug);
  if (!c) return {};
  return buildMetadata({ title: `${c.record.name} constellation`, description: c.record.description, path: satelliteConstellationPath(slug) });
}

type Row = { label: string; value: string; href?: string };

export default async function SatelliteConstellationPage({ params }: PageProps<"/satellites/constellation/[slug]">) {
  const { slug } = await params;
  const d = engine.satellites.resolveConstellation(slug);
  if (!d) notFound();
  const c = d.record;
  const url = satelliteConstellationPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: c.name, url },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Category", c.category ? CATEGORY_LABEL[c.category] ?? c.category : undefined);
  push("Operator", d.operator?.name, d.operator?.href);
  push("Country", c.country);
  push("Orbit", d.orbit?.name, d.orbit?.href);
  push("Constellation size", c.constellationSizeLabel);
  push("Status", c.status);

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: c.name,
    ...(c.altNames?.length ? { alternateName: c.altNames } : {}),
    description: c.description,
    url: absoluteUrl(url),
    identifier: c.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Satellite constellation{c.category ? ` · ${CATEGORY_LABEL[c.category] ?? c.category}` : ""}</span>}
        title={c.name}
        lead={c.constellationSizeLabel ?? c.description}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Constellation</Badge>
          {c.status && <span className="text-sm text-faint">{c.status}</span>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{c.description}</p>
            </section>

            {d.members.length ? (
              <section aria-labelledby="members">
                <h2 id="members" className="font-display text-2xl font-bold">Member satellites</h2>
                <p className="mt-1 text-sm text-faint">Individual satellites of this constellation modelled in the encyclopedia.</p>
                <div className="mt-3"><SatellitesCards records={d.members} /></div>
              </section>
            ) : (
              <section aria-labelledby="members" className="scientific-card p-5">
                <h2 id="members" className="font-display text-base font-semibold text-fg">Member satellites</h2>
                <p className="mt-2 text-sm text-muted">Individual members of large, fast-changing constellations are not enumerated here — their rosters change continually, and this encyclopedia does not invent a fixed list. The constellation is modelled as a single entity connected to its operator and orbit.</p>
              </section>
            )}

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

            <section aria-labelledby="livesky" className="rounded-2xl border border-white/20 bg-white/[0.045] p-5">
              <h2 id="livesky" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Observing the sky</h2>
              <p className="mt-2 text-xs text-muted">Some low-orbit constellations are visible as moving points of light, but this page states no pass times and performs no tracking. For tonight&apos;s conditions at your location, use the computed Live Sky tools.</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href={skyPath("night-sky-tonight")} className="text-nasa hover:underline">Tonight&apos;s observing dashboard →</Link></li>
                <li><Link href={skyPath("moon")} className="text-nasa hover:underline">Moon position &amp; phase →</Link></li>
              </ul>
            </section>

            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section className="scientific-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Authority</h2>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <p className="mt-3 text-xs leading-relaxed text-faint">Unknown values are left blank; constellation sizes are given only where well-established. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
