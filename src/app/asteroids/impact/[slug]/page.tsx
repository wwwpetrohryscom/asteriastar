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
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, asteroidImpactPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.asteroids.impacts().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/impact/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.asteroids.resolveImpact(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: asteroidImpactPath(slug) });
}

export default async function AsteroidImpactPage({ params }: PageProps<"/asteroids/impact/[slug]">) {
  const { slug } = await params;
  const d = engine.asteroids.resolveImpact(slug);
  if (!d) notFound();
  const r = d.record;
  const url = asteroidImpactPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Asteroids", url: ROUTES.asteroids },
    { name: r.name, url },
  ];
  const facts: { label: string; value: string }[] = [];
  if (r.impactDate) facts.push({ label: "When", value: r.impactDate });
  if (r.impactLocation) facts.push({ label: "Where", value: r.impactLocation });
  if (r.impactorSizeLabel) facts.push({ label: "Impactor", value: r.impactorSizeLabel });
  if (r.energyLabel) facts.push({ label: "Energy", value: r.energyLabel });
  if (r.craterLabel) facts.push({ label: "Crater", value: r.craterLabel });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: r.name,
    description: r.description,
    ...(r.impactLocation ? { location: { "@type": "Place", name: r.impactLocation } } : {}),
    url: absoluteUrl(url),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Impact event{r.impactDate ? ` · ${r.impactDate}` : ""}</span>} title={r.name} lead={r.description}>
        <Badge tone="accent">Impact event</Badge>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
              <p className="mt-3 text-sm text-faint">Figures are given only where scientifically established; this page describes the event factually, without exaggeration.</p>
            </section>
            <SourceList keys={r.sources} title="Sources" />
          </div>
          <aside className="space-y-6">
            {facts.length ? (
              <section className="scientific-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
                <dl className="mt-3 divide-y divide-white/5">
                  {facts.map((f) => (
                    <div key={f.label} className="flex justify-between gap-3 py-2 text-sm"><dt className="text-faint">{f.label}</dt><dd className="text-right font-medium text-fg">{f.value}</dd></div>
                  ))}
                </dl>
              </section>
            ) : null}
            <section className="scientific-card p-5 text-sm">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Planetary defense</h2>
              <p className="mt-2 text-muted">Impact history is why near-Earth objects are systematically discovered and tracked.</p>
              <Link href="/asteroids/planetary-defense" className="mt-2 inline-block text-nasa hover:underline">Planetary defense →</Link>
            </section>
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section className="scientific-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Authority</h2>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
