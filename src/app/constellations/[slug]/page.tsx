import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, constellationPath, constellationFamilyPath, constellationSeasonPath, starPath, deepSkyPath, meteorShowerPath, skyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.constellations.all().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/constellations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = engine.constellations.get(slug);
  if (!c) return {};
  return buildMetadata({ title: `${c.name} (${c.genitive})`, description: c.description ?? `The constellation ${c.name}.`, path: constellationPath(slug) });
}

type Row = { label: string; value: string; href?: string };

export default async function ConstellationPage({ params }: PageProps<"/constellations/[slug]">) {
  const { slug } = await params;
  const d = engine.constellations.resolve(slug);
  if (!d) notFound();
  const c = d.record;
  const url = constellationPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Constellations", url: ROUTES.constellations },
    { name: c.name, url },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Abbreviation", c.abbr);
  push("Genitive", c.genitive);
  push("Meaning", c.meaning);
  push("Family", d.family?.name, d.family ? constellationFamilyPath(c.family!) : undefined);
  push("Hemisphere", c.hemisphere ? c.hemisphere[0].toUpperCase() + c.hemisphere.slice(1) : undefined);
  push("Best season", d.season?.name, c.season ? constellationSeasonPath(c.season) : undefined);
  push("Area", c.areaSqDeg != null ? `${c.areaSqDeg.toLocaleString()} deg²` : undefined);
  push("Rank by size", c.rankByArea != null ? `${c.rankByArea} of 88` : undefined);
  push("Brightest star", d.brightestStar?.name, d.brightestStar?.href);
  push("Zodiac", c.zodiac ? "Yes" : undefined);
  push("Ancient (Ptolemy)", c.ptolemaic ? "Yes" : undefined);

  const topStars = d.stars.slice(0, 12);
  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: c.name,
    alternateName: c.genitive,
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
        eyebrow={<span>Constellation · {c.abbr}{c.hemisphere ? ` · ${c.hemisphere} sky` : ""}</span>}
        title={c.name}
        lead={c.meaning ? `${c.genitive} — ${c.meaning}` : c.genitive}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Constellations</Badge>
          {c.zodiac && <span className="text-sm text-faint">Zodiac</span>}
          {c.rankByArea != null && <span className="text-sm text-faint">#{c.rankByArea} by area</span>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{c.description}</p>
            </section>

            {c.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-muted"><span className="mt-1 text-amber-300">★</span><span>{h}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}

            {topStars.length ? (
              <section aria-labelledby="stars">
                <h2 id="stars" className="font-display text-2xl font-bold">Notable stars</h2>
                <p className="mt-1 text-sm text-faint">{d.stars.length} catalogued star{d.stars.length === 1 ? "" : "s"} in this encyclopedia.</p>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {topStars.map((s) => (
                    <li key={s.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <Link href={starPath(s.slug)} className="font-medium text-fg hover:text-nebula">{s.name}</Link>
                      {s.apparentMagnitude != null && <span className="font-mono text-xs text-faint">mag {s.apparentMagnitude}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.deepSky.length ? (
              <section aria-labelledby="deepsky">
                <h2 id="deepsky" className="font-display text-2xl font-bold">Deep-sky objects</h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {d.deepSky.slice(0, 24).map((o) => (
                    <li key={o.id} className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <Link href={deepSkyPath(o.slug)} className="font-medium text-fg hover:text-nebula">{o.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.meteorShowers.length ? (
              <section aria-labelledby="meteors">
                <h2 id="meteors" className="font-display text-2xl font-bold">Meteor shower radiants</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.meteorShowers.map((m) => (
                    <Link key={m.slug} href={meteorShowerPath(m.slug)} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/25">
                      <div className="font-medium text-fg">{m.name}</div>
                      {m.peakLabel && <div className="text-xs text-faint">Peak {m.peakLabel}</div>}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {d.exoplanets.length ? (
              <section aria-labelledby="exoplanets">
                <h2 id="exoplanets" className="font-display text-2xl font-bold">Exoplanets</h2>
                <p className="mt-1 text-sm text-faint">Hosted by catalogued stars in {c.name}.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.exoplanets.slice(0, 24).map((x) => (
                    <Link key={x.id} href={x.href ?? `/explore/entity/${x.id.replace(":", "/")}`} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{x.name}</Link>
                  ))}
                </div>
              </section>
            ) : null}

            {d.mythology.length ? (
              <section aria-labelledby="mythology">
                <h2 id="mythology" className="font-display text-2xl font-bold">Mythology</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.mythology.map((m) => (
                    <Link key={m.id} href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{m.name}</Link>
                  ))}
                </div>
              </section>
            ) : null}

            {d.neighbors.length ? (
              <section aria-labelledby="neighbors">
                <h2 id="neighbors" className="font-display text-2xl font-bold">Neighbouring constellations</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.neighbors.map((n) => (
                    <Link key={n.id} href={n.href ?? constellationPath(n.id.split(":")[1])} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{n.name}</Link>
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
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-nebula">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={c.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.href ? <Link href={f.href} className="hover:text-nebula">{f.value}</Link> : f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Live Sky — link to the computed tools; constellation visibility is not fabricated. */}
            <section aria-labelledby="livesky" className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.04] p-5">
              <h2 id="livesky" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">See it in the sky</h2>
              <p className="mt-2 text-xs text-muted">Use the computed Live Sky tools for tonight&apos;s conditions at your location — this page states no live visibility itself.</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href={skyPath("night-sky-tonight")} className="text-nebula hover:underline">Tonight&apos;s observing dashboard →</Link></li>
                <li><Link href={skyPath("planet-visibility")} className="text-nebula hover:underline">Planet visibility →</Link></li>
                <li><Link href={skyPath("moon")} className="text-nebula hover:underline">Moon position &amp; phase →</Link></li>
                {d.meteorShowers.length > 0 && <li><Link href={ROUTES.sky + "/meteor-showers"} className="text-nebula hover:underline">Meteor showers →</Link></li>}
              </ul>
            </section>

            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}

            {d.quality && (
              <section aria-labelledby="quality" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Constellation data from the IAU. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}

            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">All catalogued stars</h2>
              <p className="mt-2 text-muted">Browse every catalogued star in {c.name}.</p>
              <Link href={`/stars/constellations/${slug}`} className="mt-2 inline-block text-nebula hover:underline">Star list →</Link>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
