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
import { RocketsTable } from "@/components/rockets/RocketsTable";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, rocketPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.launchVehicles.all().map((r) => ({ slug: r.slug }));
}

/** Canonical path: reused (existing) entities point at their primary home in the
 *  graph (e.g. /exploration/{slug} or /explore/entity/...), so the /rockets page is
 *  an alternate view and does not compete as a duplicate. New rocket entities own
 *  their /rockets/{slug} URL. */
function canonicalPathFor(record: { id: string; slug: string; existing?: boolean }): string {
  if (record.existing) {
    const entity = getEntityById(record.id);
    if (entity) return entityGraphPath(entity);
  }
  return rocketPath(record.slug);
}

export async function generateMetadata({ params }: PageProps<"/rockets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.launchVehicles.resolve(slug);
  if (!d) return {};
  return buildMetadata({ title: `${d.record.name} — ${d.kindLabel}`, description: d.record.description, path: canonicalPathFor(d.record) });
}

type Ref = { id: string; name: string; slug?: string };
type Row = { label: string; value: string; href?: string };

function crossLink(id: string | undefined): string | undefined {
  if (!id) return undefined;
  const ent = getEntityById(id);
  return ent ? entityGraphPath(ent) : undefined;
}
function refLink(ref?: Ref): string | undefined {
  if (!ref) return undefined;
  return ref.slug ? rocketPath(ref.slug) : crossLink(ref.id);
}

export default async function RocketPage({ params }: PageProps<"/rockets/[slug]">) {
  const { slug } = await params;
  const d = engine.launchVehicles.resolve(slug);
  if (!d) notFound();
  const r = d.record;
  const url = rocketPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Rockets", url: ROUTES.rockets },
    { name: r.name, url },
  ];

  // Adaptive quick facts by kind. Only non-empty values appear (unknowns stay hidden).
  const facts: Row[] = [{ label: "Type", value: d.kindLabel }];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  if (r.kind === "vehicle") {
    push("Family", d.family?.name, refLink(d.family));
    push("Operator", d.provider?.name, refLink(d.provider));
    push("Country", r.country);
    push("First flight", r.firstFlight);
    push("Last flight", r.lastFlight);
    push("Status", r.status);
    push("Lift class", r.liftClass);
    push("Payload to LEO", r.payloadLeoKg != null ? `${r.payloadLeoKg.toLocaleString()} kg` : undefined);
    push("Payload to GTO", r.payloadGtoKg != null ? `${r.payloadGtoKg.toLocaleString()} kg` : undefined);
    push("Height", r.heightM != null ? `${r.heightM} m` : undefined);
    push("Stages", r.stageCount);
    push("Reusable", r.reusable === undefined ? undefined : r.reusable ? "Yes" : "No");
    push("Human-rated", r.humanRated === undefined ? undefined : r.humanRated ? "Yes" : "No");
  } else if (r.kind === "family") {
    push("Operator", d.provider?.name, refLink(d.provider));
    push("Country", r.country);
    push("Since", r.startYear);
    push("Retired", r.endYear);
    push("Status", r.status);
  } else if (r.kind === "engine") {
    push("Cycle", r.engineCycle);
    push("Propellant", d.propellants[0]?.name, refLink(d.propellants[0]));
    push("Manufacturer", d.manufacturer?.name, refLink(d.manufacturer));
    push("Sea-level thrust", r.thrustSeaLevelKn != null ? `${r.thrustSeaLevelKn.toLocaleString()} kN` : undefined);
    push("Vacuum thrust", r.thrustVacuumKn != null ? `${r.thrustVacuumKn.toLocaleString()} kN` : undefined);
    push("Specific impulse (vac)", r.specificImpulseVacuumS != null ? `${r.specificImpulseVacuumS} s` : undefined);
  } else if (r.kind === "stage") {
    push("Role", r.stageRole);
    push("Stage number", r.stageNumber);
    push("Engine", d.engines[0]?.name, refLink({ id: d.engines[0]?.id ?? "", name: "", slug: d.engines[0]?.slug }));
    push("Engine count", r.engineCount);
    push("Propellant", d.propellants[0]?.name, refLink(d.propellants[0]));
  } else if (r.kind === "propellant") {
    push("Fuel", r.fuel);
    push("Oxidizer", r.oxidizer);
    push("Class", r.propellantClass);
    push("Cryogenic", r.cryogenic === undefined ? undefined : r.cryogenic ? "Yes" : "No");
    push("Hypergolic", r.hypergolic === undefined ? undefined : r.hypergolic ? "Yes" : "No");
  } else if (r.kind === "pad") {
    push("Launch site", d.site?.name, refLink(d.site));
    push("Location", r.location);
  } else if (r.kind === "provider") {
    push("Country", r.country);
    push("Founded", r.startYear);
  } else if (r.kind === "program") {
    push("Country", r.country);
    push("Started", r.startYear);
    push("Ended", r.endYear);
  }

  const science = d.connections.science;
  // schema.org type by kind: hardware → Product; provider → Organization; pad →
  // Place; a family (a lineage) or a program (an initiative) → CreativeWork.
  const schemaType =
    r.kind === "provider" ? "Organization" : r.kind === "pad" ? "Place" : r.kind === "program" || r.kind === "family" ? "CreativeWork" : "Product";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: r.name,
    ...(r.altNames?.length ? { alternateName: r.altNames } : {}),
    description: r.description,
    url: absoluteUrl(url),
    identifier: r.id,
  };

  // Component ref grids per kind.
  const refGrids: { title: string; refs: Ref[] }[] = [];
  if (d.family) refGrids.push({ title: "Family", refs: [d.family] });
  if (d.stages.length) refGrids.push({ title: "Stages", refs: d.stages.map((s) => ({ id: s.id, name: s.name, slug: s.slug })) });
  if (d.engines.length) refGrids.push({ title: "Engines", refs: d.engines.map((s) => ({ id: s.id, name: s.name, slug: s.slug })) });
  if (d.propellants.length) refGrids.push({ title: "Propellants", refs: d.propellants });
  if (d.pads.length) refGrids.push({ title: "Launch pads", refs: d.pads });
  if (d.launchVehicles.length) refGrids.push({ title: "Powers", refs: d.launchVehicles });

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>{d.kindLabel}{d.provider ? ` · ${d.provider.name}` : r.country ? ` · ${r.country}` : ""}</span>}
        title={r.name}
        lead={r.altNames?.length ? `Also known as ${r.altNames.join(", ")}` : undefined}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Rockets</Badge>
          {r.liftClass && <span className="text-sm text-faint">{r.liftClass}</span>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
            </section>

            {r.kind === "family" && d.vehicles.length ? (
              <section aria-labelledby="members">
                <h2 id="members" className="font-display text-2xl font-bold">Vehicles in this family</h2>
                <div className="mt-4"><RocketsTable records={d.vehicles} /></div>
              </section>
            ) : null}

            {refGrids.length ? (
              <section aria-labelledby="components">
                <h2 id="components" className="font-display text-2xl font-bold">Components &amp; hardware</h2>
                <div className="mt-4 space-y-5">
                  {refGrids.map((g) => (
                    <div key={g.title}>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-faint">{g.title}</h3>
                      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {g.refs.map((ref) => <RefCard key={ref.id + ref.name} name={ref.name} href={refLink(ref)} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {r.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-muted"><span className="mt-1 text-amber-300">★</span><span>{h}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 30).map((c) => (
                    <li key={c.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{c.outgoing ? RELATION_LABELS[c.relation.type] : INVERSE_RELATION_LABELS[c.relation.type]}</span>
                      <Link href={entityGraphPath(c.other)} className="text-right font-medium text-fg hover:text-nebula">{c.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
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
              <p className="mt-3 text-xs leading-relaxed text-faint">Unknown specifications are left blank rather than estimated.</p>
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Curated from authoritative public sources. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function RefCard({ name, href }: { name: string; href?: string }) {
  const body = <div className="font-medium text-fg">{name}</div>;
  return href ? (
    <Link href={href} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/25">{body}</Link>
  ) : (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">{body}</div>
  );
}
