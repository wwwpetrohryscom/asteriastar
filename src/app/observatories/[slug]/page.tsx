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
import { ObsStatusPill } from "@/components/observatories/ObsCards";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, observatoryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.observatories.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observatories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.observatories.resolve(slug);
  if (!d) return {};
  return buildMetadata({ title: `${d.record.name} — ${d.kindLabel}`, description: d.record.description, path: observatoryPath(slug) });
}

type Row = { label: string; value: string; href?: string };

export default async function ObservatoryPage({ params }: PageProps<"/observatories/[slug]">) {
  const { slug } = await params;
  const d = engine.observatories.resolve(slug);
  if (!d) notFound();
  const r = d.record;
  const url = observatoryPath(slug);
  const link = (ref?: { id: string; name: string; slug?: string }) => (ref?.slug ? observatoryPath(ref.slug) : ref ? graphPath(ref.id) : undefined);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observatories", url: ROUTES.observatories },
    { name: r.name, url },
  ];

  const facts: Row[] = [{ label: "Type", value: d.kindLabel }];
  const push = (label: string, value?: string | number, href?: string) => { if (value != null && value !== "") facts.push({ label, value: String(value), href }); };
  if (r.kind === "observatory") {
    push("Class", r.observatoryType); push("Operator", d.operator?.name, link(d.operator)); push("Site", d.site?.name, link(d.site));
    push("Country", r.country); push("Location", r.location); push("Altitude", r.altitudeM ? `${r.altitudeM.toLocaleString()} m` : undefined);
    push("First light", r.firstLight); push("Status", r.status);
  } else if (r.kind === "telescope") {
    push("Class", r.telescopeClass); push("Aperture", r.apertureM ? `${r.apertureM} m` : undefined); push("Mirror", r.mirrorSize);
    push("Operator", d.operator?.name, link(d.operator)); push("Observatory", d.observatory?.name, link(d.observatory)); push("Site", d.site?.name, link(d.site));
    push("First light", r.firstLight); push("Status", r.status);
  } else if (r.kind === "space-telescope") {
    push("Status", r.status); push("Operator", d.operator?.name, link(d.operator)); push("Orbit", r.orbit);
    push("Aperture", r.apertureM ? `${r.apertureM} m` : undefined); push("Launched / first light", r.firstLight);
  } else if (r.kind === "instrument") {
    push("Instrument type", r.observatoryType); push("Host", d.record.hostSlug && refLabel(d.record.hostSlug), d.record.hostSlug ? observatoryPath(d.record.hostSlug) : undefined);
  } else if (r.kind === "survey") {
    push("Period", r.operationalPeriod);
  } else if (r.kind === "band") {
    push("Coverage", r.wavelength);
  } else if (r.kind === "site") {
    push("Country", r.country); push("Altitude", r.altitudeM ? `${r.altitudeM.toLocaleString()} m` : undefined);
  } else {
    push("Country", r.country);
  }

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": r.kind === "organization" ? "Organization" : r.kind === "observatory" || r.kind === "site" ? "Place" : "CreativeWork",
    name: r.name,
    ...(r.altNames?.length ? { alternateName: r.altNames } : {}),
    description: r.description,
    url: absoluteUrl(url),
    identifier: r.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo"
        eyebrow={<span>{d.kindLabel}{d.site ? ` · ${d.site.name}` : r.country ? ` · ${r.country}` : ""}</span>}
        title={r.name}
        lead={r.altNames?.length ? `Also known as ${r.altNames.join(", ")}` : undefined}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Observatories</Badge>
          {r.status && <ObsStatusPill status={r.status} />}
          {r.apertureM && <span className="text-sm text-faint">{r.apertureM} m aperture</span>}
        </div>
      </HeroSection>

      <Container className="mt-6"><EntityImagery entityId={r.id} /></Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
            </section>

            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {r.highlights.map((x) => <li key={x} className="flex gap-3 text-muted"><span className="mt-1 text-[var(--accent)]">▹</span><span>{x}</span></li>)}
                </ul>
              </section>
            ) : null}

            {d.telescopes.length ? (
              <section aria-labelledby="telescopes">
                <h2 id="telescopes" className="font-display text-2xl font-bold">Telescopes</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.telescopes.map((t) => <RefCard key={t.id} label={t.telescopeClass ?? "Telescope"} name={t.name} href={observatoryPath(t.slug)} />)}
                </div>
              </section>
            ) : null}

            {d.instruments.length ? (
              <section aria-labelledby="instruments">
                <h2 id="instruments" className="font-display text-2xl font-bold">Instruments</h2>
                <ul className="mt-4 space-y-2.5">
                  {d.instruments.map((i) => (
                    <li key={i.id} className="scientific-card p-3">
                      <Link href={observatoryPath(i.slug)} className="font-medium text-fg hover:text-nasa">{i.name}</Link>
                      {i.observatoryType && <span className="block text-sm text-muted">{i.observatoryType}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.bands.length ? (
              <section aria-labelledby="bands">
                <h2 id="bands" className="font-display text-2xl font-bold">Observing bands</h2>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {d.bands.map((b) => (
                    <Link key={b.id} href={observatoryPath(b.slug)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{b.name}</Link>
                  ))}
                </div>
              </section>
            ) : null}

            {d.surveys.length ? (
              <section aria-labelledby="surveys">
                <h2 id="surveys" className="font-display text-2xl font-bold">Surveys</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.surveys.map((s) => <RefCard key={s.id} label="Survey" name={s.name} href={observatoryPath(s.slug)} />)}
                </div>
              </section>
            ) : null}

            {r.discoveries?.length || d.observedObjects.length ? (
              <section aria-labelledby="discoveries">
                <h2 id="discoveries" className="font-display text-2xl font-bold">Major discoveries</h2>
                {r.discoveries?.length ? (
                  <ul className="mt-3 space-y-2">
                    {r.discoveries.map((x) => <li key={x} className="flex gap-3 text-muted"><span className="mt-1 text-nasa">★</span><span>{x}</span></li>)}
                  </ul>
                ) : null}
                {d.observedObjects.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {d.observedObjects.map((obj) => <RefCard key={obj.id} label="Observed" name={obj.name} href={graphPath(obj.id)} />)}
                  </div>
                ) : null}
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 30).map((c) => (
                    <li key={c.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{c.outgoing ? RELATION_LABELS[c.relation.type] : INVERSE_RELATION_LABELS[c.relation.type]}</span>
                      <Link href={entityGraphPath(c.other)} className="text-right font-medium text-fg hover:text-nasa">{c.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
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
                <p className="mt-3 text-xs leading-relaxed text-faint">
                  Curated from authoritative public sources. See{" "}
                  <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
                </p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function graphPath(id: string): string | undefined {
  const ent = getEntityById(id);
  return ent ? entityGraphPath(ent) : undefined;
}
function refLabel(slug: string): string {
  return engine.observatories.get(slug)?.name ?? slug;
}

function RefCard({ label, name, href }: { label: string; name: string; href?: string }) {
  const body = (<><div className="text-xs text-faint">{label}</div><div className="font-medium text-fg">{name}</div></>);
  return href ? (
    <Link href={href} className="scientific-card p-3 transition hover:border-white/25">{body}</Link>
  ) : (
    <div className="scientific-card p-3">{body}</div>
  );
}
