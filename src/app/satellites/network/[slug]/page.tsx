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
import { engine } from "@/platform/data-engine";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, satelliteNetworkPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.satellites.networks().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/satellites/network/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = engine.satellites.resolveNetwork(slug);
  if (!n) return {};
  return buildMetadata({ title: n.record.name, description: n.record.description, path: satelliteNetworkPath(slug) });
}

export default async function SatelliteNetworkPage({ params }: PageProps<"/satellites/network/[slug]">) {
  const { slug } = await params;
  const d = engine.satellites.resolveNetwork(slug);
  if (!d) notFound();
  const n = d.record;
  const url = satelliteNetworkPath(slug);
  const science = d.connections.science;

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: n.name, url },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: n.name,
    ...(n.altNames?.length ? { alternateName: n.altNames } : {}),
    description: n.description,
    url: absoluteUrl(url),
    identifier: n.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Tracking network{n.country ? ` · ${n.country}` : ""}</span>} title={n.name} lead={n.description}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Tracking network</Badge>
          {d.agency && <span className="text-sm text-faint">Operated by {d.agency.name}</span>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{n.description}</p>
              <p className="mt-3 text-sm text-faint">Individual ground stations are described within the network rather than modelled as separate entities — a stated scope limit of this encyclopedia, not fabricated data.</p>
            </section>

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

            <SourceList keys={n.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section className="scientific-card p-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {n.country && <div className="flex justify-between gap-3 py-2 text-sm"><dt className="text-faint">Region</dt><dd className="text-right font-medium text-fg">{n.country}</dd></div>}
                {d.agency && (
                  <div className="flex justify-between gap-3 py-2 text-sm"><dt className="text-faint">Operator</dt><dd className="text-right font-medium text-fg">{d.agency.href ? <Link href={d.agency.href} className="hover:text-nasa">{d.agency.name}</Link> : d.agency.name}</dd></div>
                )}
              </dl>
            </section>

            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section className="scientific-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Authority</h2>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <p className="mt-3 text-xs leading-relaxed text-faint">See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
