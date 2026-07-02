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
import { relationLabel, type Connection } from "@/knowledge-graph";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { spectralInfo, CATEGORY_INFO } from "@/lib/star-content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, starPath, constellationStarsPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return engine.star.all().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = engine.star.resolve(slug);
  if (!s) return {};
  const desc = `${s.record.name}${s.record.scientificName && s.record.scientificName !== s.record.name ? ` (${s.record.scientificName})` : ""} — ${s.categoryLabel ?? "a star"} in ${s.constellation?.name ?? "the night sky"}${s.record.distanceLy != null ? `, about ${s.record.distanceLy} light-years away` : ""}. Real catalogue data, sources, and connections.`;
  return buildMetadata({ title: `${s.record.name} — Star`, description: desc, path: starPath(slug) });
}

function fmt(n: number | undefined, unit = "", dp?: number): string | undefined {
  if (n == null) return undefined;
  const v = dp != null ? n.toFixed(dp) : n.toLocaleString();
  return `${v}${unit}`;
}

export default async function StarPage({ params }: PageProps<"/stars/[slug]">) {
  const { slug } = await params;
  const s = engine.star.resolve(slug);
  if (!s) notFound();
  const r = s.record;

  const url = starPath(slug);
  const sci = spectralInfo(r.spectralClass);
  const evolution = r.category ? CATEGORY_INFO[r.category] : undefined;

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Stars", url: ROUTES.stars },
    ...(s.constellation ? [{ name: s.constellation.name, url: constellationStarsPath(s.constellation.slug) }] : []),
    { name: r.name, url },
  ];

  const quickFacts: { label: string; value: string }[] = [
    s.categoryLabel ? { label: "Type", value: s.categoryLabel } : null,
    s.constellation ? { label: "Constellation", value: s.constellation.name } : null,
    r.spectralType ? { label: "Spectral type", value: r.spectralType } : null,
    r.apparentMagnitude != null ? { label: "Apparent magnitude", value: String(r.apparentMagnitude) } : null,
    r.distanceLy != null ? { label: "Distance", value: `${fmt(r.distanceLy)} light-years` } : null,
    r.luminositySolar != null ? { label: "Luminosity", value: `${fmt(r.luminositySolar)} ☉` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const physical: { label: string; value: string }[] = [
    r.spectralType ? { label: "Spectral type", value: r.spectralType } : null,
    r.luminosityClass ? { label: "Luminosity class", value: r.luminosityClass } : null,
    r.apparentMagnitude != null ? { label: "Apparent magnitude", value: String(r.apparentMagnitude) } : null,
    r.absoluteMagnitude != null ? { label: "Absolute magnitude", value: String(r.absoluteMagnitude) } : null,
    r.luminositySolar != null ? { label: "Luminosity (Sun = 1)", value: fmt(r.luminositySolar) as string } : null,
    r.colorIndex != null ? { label: "Colour index (B−V)", value: String(r.colorIndex) } : null,
    r.distanceLy != null ? { label: "Distance", value: `${fmt(r.distanceLy)} ly${r.distancePc != null ? ` (${fmt(r.distancePc)} pc)` : ""}` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const sciConnections: Connection[] = s.connections.science;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: r.name,
    ...(s.catalogNumbers.length ? { alternateName: s.catalogNumbers } : {}),
    description: `${s.categoryLabel ?? "Star"} in ${s.constellation?.name ?? "the night sky"}.`,
    url: absoluteUrl(url),
    identifier: r.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>{s.categoryLabel ?? "Star"}{s.constellation ? ` · ${s.constellation.name}` : ""}</span>}
        title={r.name}
        lead={r.scientificName && r.scientificName !== r.name ? r.scientificName : undefined}
      >
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="accent">Knowledge graph</Badge>
          {s.catalogNumbers.slice(0, 4).map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-muted">{c}</span>
          ))}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {/* Scientific overview */}
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Scientific overview</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted">
                <p>
                  {r.name} is {s.categoryLabel ? `a ${s.categoryLabel.toLowerCase()}` : "a star"}
                  {s.constellation ? ` in the constellation ${s.constellation.name} (${s.constellation.genitive})` : ""}
                  {r.distanceLy != null ? `, lying about ${fmt(r.distanceLy)} light-years from Earth` : ""}.
                </p>
                {sci && <p><strong className="text-fg">{sci.label}.</strong> {sci.blurb} Such stars have surface temperatures around {sci.tempK} and appear {sci.color} to the eye.</p>}
              </div>
            </section>

            {/* Physical properties */}
            {physical.length > 0 && (
              <section aria-labelledby="physical">
                <h2 id="physical" className="font-display text-2xl font-bold">Physical properties</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-white/5">
                      {physical.map((row) => (
                        <tr key={row.label} className="transition hover:bg-white/[0.02]">
                          <td className="px-4 py-2.5 text-faint">{row.label}</td>
                          <td className="px-4 py-2.5 text-right font-medium text-fg">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-faint">Values are real catalogue data; fields without a reliable value are omitted, never estimated.</p>
              </section>
            )}

            {/* Evolution */}
            {evolution && (
              <section aria-labelledby="evolution">
                <h2 id="evolution" className="font-display text-2xl font-bold">Evolution</h2>
                <p className="mt-3 leading-relaxed text-muted">{evolution}</p>
              </section>
            )}

            {/* Location in the sky */}
            <section aria-labelledby="location">
              <h2 id="location" className="font-display text-2xl font-bold">Location in the sky</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {s.constellation && (
                  <Link href={constellationStarsPath(s.constellation.slug)} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/25">
                    <div className="text-xs text-faint">Constellation</div>
                    <div className="font-medium text-fg">{s.constellation.name}</div>
                  </Link>
                )}
                {s.hemisphere && <Fact label="Hemisphere" value={s.hemisphere === "equatorial" ? "Both (equatorial)" : `${s.hemisphere[0].toUpperCase()}${s.hemisphere.slice(1)}`} />}
                {s.season && <Fact label="Best seen" value={`${s.season} (N. evening sky)`} />}
                {r.ra != null && <Fact label="RA / Dec" value={`${r.ra}h / ${r.dec}°`} />}
              </div>
            </section>

            {/* Knowledge connections */}
            {sciConnections.length > 0 && (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 space-y-2">
                  {sciConnections.map((c) => (
                    <li key={c.relation.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                      <span className="text-sm text-faint">{relationLabel(c.relation.type, c.outgoing)}</span>
                      <span className="text-sm font-medium text-fg">{c.other.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Related stars */}
            {s.neighbors.length > 0 && (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Related stars{s.constellation ? ` in ${s.constellation.name}` : ""}</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {s.neighbors.map((n) => (
                    <li key={n.id}>
                      <Link href={starPath(n.slug)} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 transition hover:border-white/25 hover:bg-white/[0.04]">
                        <span className="font-medium text-fg">{n.name}</span>
                        <span className="text-xs text-faint">{n.apparentMagnitude != null ? `mag ${n.apparentMagnitude}` : ""}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          {/* Sidebar: quick facts + authority/quality */}
          <aside className="space-y-6">
            <section aria-labelledby="quickfacts" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h2 id="quickfacts" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {quickFacts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {s.catalogNumbers.length > 0 && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <div className="text-xs uppercase tracking-wider text-faint">Designations</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.catalogNumbers.map((c) => (
                      <span key={c} className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-xs text-muted">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {s.quality && <EntityProvenancePanel entityId={s.quality.entityId} />}

            {s.quality && (
              <section aria-labelledby="quality" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="quality" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quality &amp; authority</h2>
                  <span className="text-xs text-faint">{s.quality.completenessPercent}%</span>
                </div>
                <div className="mt-3"><ReviewBadge status={s.reviewStatus} /></div>
                <dl className="mt-3 grid grid-cols-1 gap-y-1.5">
                  {(Object.keys(s.quality.indicators) as QualityDimension[]).slice(0, 6).map((d) => (
                    <div key={d} className="flex items-center justify-between gap-2 text-sm">
                      <dt className="text-muted">{QUALITY_DIMENSION_LABELS[d]}</dt>
                      <dd><CoverageBadge level={s.quality!.indicators[d]} /></dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-faint">
                  Catalogue data from the open HYG database (Hipparcos · Yale BSC · Gliese), CC BY-SA 4.0. See{" "}
                  <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.
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
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="text-xs text-faint">{label}</div>
      <div className="font-medium text-fg">{value}</div>
    </div>
  );
}
