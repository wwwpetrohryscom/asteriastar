import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { DeepSkyPrecisionSection } from "@/components/authority/DeepSkyPrecisionSection";
import { getDeepSkyPrecision } from "@/knowledge-graph/data/deep-sky-catalog/precision";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { DeepSkyTable } from "@/components/deep-sky/DeepSkyTable";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, deepSkyPath, constellationStarsPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return engine.deepSky.all().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-sky/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.deepSky.resolve(slug);
  if (!d) return {};
  return buildMetadata({
    title: `${d.record.name} — ${d.classLabel}`,
    description: `${d.record.name}: ${d.classLabel} in ${d.constellation?.name ?? "the sky"}${d.record.apparentMagnitude != null ? `, magnitude ${d.record.apparentMagnitude}` : ""}. Real catalogue data, observation guide, catalogs, and connections.`,
    path: deepSkyPath(slug),
  });
}

type Row = { label: string; value: string };

export default async function DeepSkyPage({ params }: PageProps<"/deep-sky/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSky.resolve(slug);
  if (!d) notFound();
  const r = d.record;
  const precision = getDeepSkyPrecision(r.id);
  const url = deepSkyPath(slug);

  // Scientific-overview prose, assembled so optional clauses never dangle.
  const article = /^(?:[aeiou]|h ii)/i.test(d.classLabel) ? "an" : "a";
  const place = d.constellation ? ` in the constellation ${d.constellation.name}` : "";
  const measures: string[] = [];
  if (r.apparentMagnitude != null) measures.push(`shines at apparent magnitude ${r.apparentMagnitude}`);
  if (r.sizeMajorArcmin != null) measures.push(`spans about ${r.sizeMajorArcmin} arcminutes of sky`);
  const classPhrase = d.classLabel.toLowerCase().replace("h ii", "H II");
  const overview = `${r.name} is ${article} ${classPhrase}${place}.` + (measures.length ? ` It ${measures.join(" and ")}.` : "");

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Sky", url: ROUTES.deepSky },
    ...(d.constellation ? [{ name: d.constellation.name, url: constellationStarsPath(d.constellation.slug) }] : []),
    { name: r.name, url },
  ];

  const facts: Row[] = [
    { label: "Type", value: d.classLabel },
    d.constellation ? { label: "Constellation", value: d.constellation.name } : null,
    r.apparentMagnitude != null ? { label: "Apparent magnitude", value: String(r.apparentMagnitude) } : null,
    r.sizeMajorArcmin != null ? { label: "Apparent size", value: `${r.sizeMajorArcmin}′${r.sizeMinorArcmin != null ? ` × ${r.sizeMinorArcmin}′` : ""}` } : null,
    // Projected axis ratio (elongation on the sky), derived from the two source-backed
    // angular diameters: b/a = minor ÷ major. Standard catalogue quantity; labelled derived.
    r.sizeMajorArcmin != null && r.sizeMinorArcmin != null && r.sizeMajorArcmin > 0
      ? { label: "Axis ratio (b/a)", value: `${(r.sizeMinorArcmin / r.sizeMajorArcmin).toFixed(2)} · derived` }
      : null,
    r.hubbleType ? { label: "Morphology", value: r.hubbleType } : null,
    d.difficultyLabel ? { label: "Difficulty", value: d.difficultyLabel } : null,
  ].filter(Boolean) as Row[];

  const catalogs: Row[] = [
    r.ids.messier ? { label: "Messier", value: r.ids.messier } : null,
    r.ids.caldwell ? { label: "Caldwell", value: r.ids.caldwell } : null,
    r.ids.ngc ? { label: "NGC", value: r.ids.ngc } : null,
    r.ids.ic ? { label: "IC", value: r.ids.ic } : null,
    r.ids.ugc ? { label: "UGC", value: r.ids.ugc } : null,
    r.ids.pgc ? { label: "PGC", value: r.ids.pgc } : null,
  ].filter(Boolean) as Row[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: r.name,
    ...(d.catalogNumbers.length ? { alternateName: d.catalogNumbers } : {}),
    description: `${d.classLabel} in ${d.constellation?.name ?? "the night sky"}.`,
    url: absoluteUrl(url),
    identifier: r.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>{d.classLabel}{d.constellation ? ` · ${d.constellation.name}` : ""}</span>}
        title={r.name}
        lead={r.ids.common && r.ids.messier ? r.ids.messier : undefined}
      >
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="accent">Deep sky</Badge>
          {d.catalogNumbers.slice(0, 4).map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-muted">{c}</span>
          ))}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Scientific overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{overview}</p>
            </section>

            {/* Observation guide */}
            {(d.difficultyLabel || r.apparentMagnitude != null) && (
              <section aria-labelledby="observe">
                <h2 id="observe" className="font-display text-2xl font-bold">Observation guide</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {d.difficultyLabel && <Fact label="Difficulty" value={d.difficultyLabel} />}
                  {d.aperture && <Fact label="Recommended equipment" value={d.aperture} />}
                  {d.season && <Fact label="Best observed" value={`${d.season}${d.hemisphere === "northern" ? " (N. evening sky)" : d.hemisphere === "southern" ? " (S. evening sky)" : " (evening sky)"}`} />}
                  {d.hemisphere && <Fact label="Best hemisphere" value={d.hemisphere === "equatorial" ? "Both (equatorial)" : `${d.hemisphere[0].toUpperCase()}${d.hemisphere.slice(1)}`} />}
                </div>
                <p className="mt-3 text-xs text-faint">Guidance follows standard observing practice, derived from the object&apos;s real magnitude and position. A dark, moonless sky always helps.</p>
              </section>
            )}

            {/* Location */}
            <section aria-labelledby="location">
              <h2 id="location" className="font-display text-2xl font-bold">Location in the sky</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {d.constellation && (
                  <Link href={constellationStarsPath(d.constellation.slug)} className="scientific-card p-3 transition hover:border-white/25">
                    <div className="text-xs text-faint">Constellation</div>
                    <div className="font-medium text-fg">{d.constellation.name}</div>
                  </Link>
                )}
                {r.raHours != null && <Fact label="RA / Dec" value={`${r.raHours}h / ${r.decDeg}°`} />}
                {d.hemisphere && <Fact label="Hemisphere" value={d.hemisphere === "equatorial" ? "Both" : `${d.hemisphere[0].toUpperCase()}${d.hemisphere.slice(1)}`} />}
                {d.season && <Fact label="Season" value={d.season} />}
              </div>
            </section>

            {/* Precision measurements (SIMBAD + NED, field-level provenance) */}
            {precision && <DeepSkyPrecisionSection p={precision} />}

            {/* Related objects */}
            {d.neighbors.length > 0 && (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Other objects{d.constellation ? ` in ${d.constellation.name}` : ""}</h2>
                <div className="mt-4"><DeepSkyTable objects={d.neighbors} showConstellation={false} /></div>
              </section>
            )}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section aria-labelledby="quick" className="scientific-card p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {catalogs.length > 0 && (
              <section aria-labelledby="catalogs" className="scientific-card p-5">
                <h2 id="catalogs" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Catalogues</h2>
                <dl className="mt-3 divide-y divide-white/5">
                  {catalogs.map((c) => (
                    <div key={c.label} className="flex justify-between gap-3 py-2 text-sm">
                      <dt className="text-faint">{c.label}</dt>
                      <dd className="text-right font-mono font-medium text-fg">{c.value}</dd>
                    </div>
                  ))}
                </dl>
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
                <p className="mt-3 text-xs leading-relaxed text-faint">
                  Catalogue data from OpenNGC (NGC/IC · Messier · Caldwell), CC BY-SA 4.0. See{" "}
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="scientific-card p-3">
      <div className="text-xs text-faint">{label}</div>
      <div className="font-medium text-fg">{value}</div>
    </div>
  );
}
