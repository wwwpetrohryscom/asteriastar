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
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, satelliteOperatorPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.satellites.operators().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/satellites/operator/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const o = engine.satellites.resolveOperator(slug);
  if (!o) return {};
  return buildMetadata({ title: `${o.record.name} — satellites`, description: o.record.description, path: satelliteOperatorPath(slug) });
}

export default async function SatelliteOperatorPage({ params }: PageProps<"/satellites/operator/[slug]">) {
  const { slug } = await params;
  const d = engine.satellites.resolveOperator(slug);
  if (!d) notFound();
  const o = d.record;
  const url = satelliteOperatorPath(slug);
  const fleet = [...d.constellations, ...d.satellites];

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: o.name, url },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: o.name,
    ...(o.altNames?.length ? { alternateName: o.altNames } : {}),
    description: o.description,
    url: absoluteUrl(url),
    identifier: o.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Satellite operator{o.country ? ` · ${o.country}` : ""}</span>}
        title={o.name}
        lead={o.description}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Operator</Badge>
          <span className="text-sm text-faint">{fleet.length} satellite{fleet.length === 1 ? "" : "s"} &amp; constellations in graph</span>
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {fleet.length ? (
              <section aria-labelledby="fleet">
                <h2 id="fleet" className="font-display text-2xl font-bold">Fleet</h2>
                <p className="mt-1 text-sm text-faint">Satellites and constellations operated by {o.name} that are modelled in this encyclopedia.</p>
                <div className="mt-3"><SatellitesCards records={fleet} /></div>
              </section>
            ) : (
              <section className="scientific-card p-5">
                <h2 className="font-display text-base font-semibold text-fg">Fleet</h2>
                <p className="mt-2 text-sm text-muted">No satellites operated by {o.name} are modelled in this encyclopedia yet.</p>
              </section>
            )}

            <SourceList keys={o.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {o.launchDate && (
              <section className="scientific-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
                <dl className="mt-3 divide-y divide-white/5">
                  {o.country && (
                    <div className="flex justify-between gap-3 py-2 text-sm"><dt className="text-faint">Country</dt><dd className="text-right font-medium text-fg">{o.country}</dd></div>
                  )}
                  <div className="flex justify-between gap-3 py-2 text-sm"><dt className="text-faint">Founded</dt><dd className="text-right font-medium text-fg">{o.launchDate}</dd></div>
                </dl>
              </section>
            )}

            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section className="scientific-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Authority</h2>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <p className="mt-3 text-xs leading-relaxed text-faint">Existing space agencies are reused as operators, never duplicated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
