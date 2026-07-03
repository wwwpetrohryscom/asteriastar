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
import { absoluteUrl, ROUTES, satelliteOrbitPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.satellites.orbits().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/satellites/orbit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const o = engine.satellites.resolveOrbit(slug);
  if (!o) return {};
  return buildMetadata({ title: o.record.name, description: o.record.description, path: satelliteOrbitPath(slug) });
}

type Row = { label: string; value: string };

export default async function SatelliteOrbitPage({ params }: PageProps<"/satellites/orbit/[slug]">) {
  const { slug } = await params;
  const d = engine.satellites.resolveOrbit(slug);
  if (!d) notFound();
  const o = d.record;
  const url = satelliteOrbitPath(slug);
  const members = [...d.constellations, ...d.satellites];

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: o.name, url },
  ];

  const facts: Row[] = [];
  if (o.altitudeRange) facts.push({ label: "Altitude", value: o.altitudeRange });
  if (o.periodLabel) facts.push({ label: "Orbital period", value: o.periodLabel });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
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
      <HeroSection compact accent="nebula" eyebrow={<span>Orbit type</span>} title={o.name} lead={o.use ?? o.description}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Orbit</Badge>
          {facts.map((f) => <span key={f.label} className="text-sm text-faint">{f.label}: {f.value}</span>)}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{o.description}</p>
            </section>

            {o.use ? (
              <section aria-labelledby="uses">
                <h2 id="uses" className="font-display text-2xl font-bold">Typical uses</h2>
                <p className="mt-3 leading-relaxed text-muted">{o.use}</p>
              </section>
            ) : null}

            {members.length ? (
              <section aria-labelledby="members">
                <h2 id="members" className="font-display text-2xl font-bold">Satellites in this orbit</h2>
                <p className="mt-1 text-sm text-faint">{members.length} satellite{members.length === 1 ? "" : "s"} and constellations modelled in this orbit.</p>
                <div className="mt-3"><SatellitesCards records={members} /></div>
              </section>
            ) : null}

            <SourceList keys={o.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {facts.length ? (
              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
                <dl className="mt-3 divide-y divide-white/5">
                  {facts.map((f) => (
                    <div key={f.label} className="flex justify-between gap-3 py-2 text-sm"><dt className="text-faint">{f.label}</dt><dd className="text-right font-medium text-fg">{f.value}</dd></div>
                  ))}
                </dl>
              </section>
            ) : null}

            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Authority</h2>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <p className="mt-3 text-xs leading-relaxed text-faint">Altitude ranges and periods are standard reference values. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
