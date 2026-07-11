import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import type { ResolvedFireball } from "@/platform/data-engine/meteorite-engine";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES } from "@/lib/routes";

/** Shared detail view for a fireball or an impact structure. */
export function MeteoriteEventView({ d, kindLabel, url }: { d: ResolvedFireball; kindLabel: string; url: string }) {
  const r = d.record;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Meteorites", url: ROUTES.meteorites },
    { name: r.name, url },
  ];
  const science = d.connections.science;
  const facts: { label: string; value: string }[] = [];
  if (r.fallDate) facts.push({ label: "Date", value: r.fallDate });
  if (r.location) facts.push({ label: "Location", value: [r.location, r.country].filter(Boolean).join(", ") });
  else if (r.country) facts.push({ label: "Country", value: r.country });
  if (r.energyLabel) facts.push({ label: "Energy", value: r.energyLabel });
  if (r.diameterLabel) facts.push({ label: "Diameter", value: r.diameterLabel });
  if (r.ageLabel) facts.push({ label: "Age", value: r.ageLabel });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": r.kind === "fireball" ? "Event" : "Place",
    name: r.name,
    description: r.description,
    ...(r.location ? { location: { "@type": "Place", name: [r.location, r.country].filter(Boolean).join(", ") } } : {}),
    url: absoluteUrl(url),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>{kindLabel}{r.fallDate ? ` · ${r.fallDate}` : ""}</span>} title={r.name} lead={r.description}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">{kindLabel}</Badge>
          {r.bolide && <span className="text-sm text-faint">Bolide</span>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
              <p className="mt-3 text-sm text-faint">Figures are given only where scientifically established; this page describes the event factually, without exaggeration.</p>
            </section>

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Related</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.related.map((x) => (<Link key={x.id} href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{x.name}</Link>))}
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
