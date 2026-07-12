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
import { MissionPrecisionSection } from "@/components/authority/MissionPrecisionSection";
import { getMissionPrecision } from "@/knowledge-graph/data/mission-precision";
import { PrimaryVerificationSection } from "@/components/authority/PrimaryVerificationSection";
import { getMissionPrimary } from "@/knowledge-graph/data/mission-primary";
import { DerivedValuesPanel } from "@/components/authority/DerivedValuesPanel";
import { derivedField } from "@/knowledge-graph/data/derived-values";
import { ExplorationTable, StatusPill } from "@/components/exploration/ExplorationTable";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, explorationPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.exploration.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exploration/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.exploration.resolve(slug);
  if (!d) return {};
  return buildMetadata({
    title: `${d.record.name} — ${d.kindLabel}`,
    description: d.record.description,
    path: explorationPath(slug),
  });
}

type Row = { label: string; value: string; href?: string };

/**
 * Mission span from the unified derived-value registry (single source of truth):
 * "Mission duration" (a fixed span between two catalogued dates) or "Time since launch"
 * (elapsed as of the data-release reference instant, for a still-active mission).
 * Returns the label + formatted value, or undefined when no derived span exists.
 */
function missionSpan(entityId: string): { label: string; value: string } | undefined {
  const dur = derivedField(entityId, "missionDuration") ?? derivedField(entityId, "timeSinceLaunch");
  if (!dur) return undefined;
  const days = dur.value;
  const span = days < 365.25 ? `${Math.round(days)} day${Math.round(days) === 1 ? "" : "s"}` : `${(days / 365.25).toFixed(1)} years`;
  return { label: dur.formulaId === "mission-duration" ? "Mission duration" : "Time since launch", value: `${span} · derived` };
}

export default async function ExplorationPage({ params }: PageProps<"/exploration/[slug]">) {
  const { slug } = await params;
  const d = engine.exploration.resolve(slug);
  if (!d) notFound();
  const r = d.record;
  const missionPrecision = getMissionPrecision(r.id);
  const missionPrimary = getMissionPrimary(r.id);
  const url = explorationPath(slug);
  const link = (ref?: { id: string; name: string; slug?: string }) =>
    ref?.slug ? explorationPath(ref.slug) : undefined;

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Exploration", url: ROUTES.exploration },
    { name: r.name, url },
  ];

  // Adaptive quick facts by kind.
  const facts: Row[] = [{ label: "Type", value: d.kindLabel }];
  const push = (label: string, value?: string, href?: string) => { if (value) facts.push({ label, value, href }); };
  if (r.kind === "mission") {
    push("Agency", d.agency?.name, link(d.agency));
    push("Program", d.program?.name, link(d.program));
    push("Mission type", r.missionType);
    push("Destination", r.destination);
    push("Launch date", r.launchDate);
    push("End date", r.endDate);
    push("Status", r.status);
    // Derived mission span from the unified registry (duration or time-since-launch).
    const span = missionSpan(r.id);
    if (span) push(span.label, span.value);
    push("Launch vehicle", d.vehicle?.name, link(d.vehicle));
    push("Launch site", d.site?.name, link(d.site));
  } else if (r.kind === "agency") {
    push("Abbreviation", r.abbreviation);
    push("Country", r.country);
    push("Founded", r.founded);
    push("Headquarters", r.headquarters);
  } else if (r.kind === "vehicle") {
    push("Operator", d.operator?.name, link(d.operator));
    push("Country", r.country);
    push("First flight", r.firstFlight);
    push("Status", r.status);
    push("Payload to LEO", r.payloadLeoKg ? `${r.payloadLeoKg.toLocaleString()} kg` : undefined);
  } else if (r.kind === "site") {
    push("Country", r.country);
    push("Location", r.location);
    push("Operator", d.operator?.name, link(d.operator));
    push("First launch", r.firstFlight);
  } else if (r.kind === "program") {
    push("Agency", d.agency?.name, link(d.agency));
    push("Started", r.startYear);
    push("Ended", r.endYear ?? (r.status === "Active" ? "present" : undefined));
    push("Status", r.status);
  } else if (r.kind === "spacecraft") {
    push("Spacecraft type", r.craftType);
    push("Agency", d.agency?.name, link(d.agency));
    push("Status", r.status);
  } else if (r.kind === "astronaut") {
    push("Nationality", r.nationality);
    push("Agency", d.agency?.name, link(d.agency));
    push("Born", r.bornYear);
    push("First spaceflight", r.firstFlight);
  } else if (r.kind === "instrument") {
    push("Instrument type", r.instrumentType);
    push("Measures", r.measures);
  }

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": r.kind === "agency" ? "Organization" : r.kind === "astronaut" ? "Person" : "CreativeWork",
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
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>{d.kindLabel}{d.agency ? ` · ${d.agency.name}` : r.country ? ` · ${r.country}` : ""}</span>}
        title={r.name}
        lead={r.altNames?.length ? `Also known as ${r.altNames.join(", ")}` : undefined}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Exploration</Badge>
          {r.status && <StatusPill status={r.status} />}
          {r.launchDate && <span className="text-sm text-faint">Launched {r.launchDate}</span>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">{r.kind === "mission" ? "Mission overview" : "Overview"}</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
            </section>

            {missionPrecision && <MissionPrecisionSection p={missionPrecision} />}
            {missionPrimary && <PrimaryVerificationSection p={missionPrimary} />}
            <DerivedValuesPanel entityId={r.id} />

            {r.objectives?.length ? (
              <section aria-labelledby="objectives">
                <h2 id="objectives" className="font-display text-2xl font-bold">Objectives</h2>
                <ul className="mt-3 space-y-2">
                  {r.objectives.map((o) => (
                    <li key={o} className="flex gap-3 text-muted"><span className="mt-1 text-nasa">▹</span><span>{o}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}

            {(r.outcome || r.discoveries?.length) ? (
              <section aria-labelledby="results">
                <h2 id="results" className="font-display text-2xl font-bold">Outcome &amp; discoveries</h2>
                {r.outcome && <p className="mt-3 leading-relaxed text-muted">{r.outcome}</p>}
                {r.discoveries?.length ? (
                  <ul className="mt-3 space-y-2">
                    {r.discoveries.map((x) => (
                      <li key={x} className="flex gap-3 text-muted"><span className="mt-1 text-nasa">★</span><span>{x}</span></li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ) : null}

            {/* Mission profile: vehicle / site / target cards */}
            {r.kind === "mission" && (d.vehicle || d.site || d.targets.length) ? (
              <section aria-labelledby="profile">
                <h2 id="profile" className="font-display text-2xl font-bold">Mission profile</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.vehicle && <RefCard label="Launch vehicle" name={d.vehicle.name} href={link(d.vehicle)} />}
                  {d.site && <RefCard label="Launch site" name={d.site.name} href={link(d.site)} />}
                  {d.targets.map((t) => {
                    const ent = getEntityById(t.id);
                    return <RefCard key={t.id} label="Target" name={t.name} href={ent ? entityGraphPath(ent) : undefined} />;
                  })}
                </div>
              </section>
            ) : null}

            {d.spacecraft.length ? (
              <section aria-labelledby="spacecraft">
                <h2 id="spacecraft" className="font-display text-2xl font-bold">Spacecraft</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.spacecraft.map((s) => <RefCard key={s.id} label={s.craftType ?? "Spacecraft"} name={s.name} href={explorationPath(s.slug)} />)}
                </div>
              </section>
            ) : null}

            {d.crew.length ? (
              <section aria-labelledby="crew">
                <h2 id="crew" className="font-display text-2xl font-bold">Crew</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.crew.map((c) => <RefCard key={c.id} label={c.nationality ?? "Crew"} name={c.name} href={explorationPath(c.slug)} />)}
                </div>
              </section>
            ) : null}

            {d.instruments.length ? (
              <section aria-labelledby="instruments">
                <h2 id="instruments" className="font-display text-2xl font-bold">Scientific instruments</h2>
                <ul className="mt-4 space-y-2.5">
                  {d.instruments.map((i) => (
                    <li key={i.id} className="scientific-card p-3">
                      <Link href={explorationPath(i.slug)} className="font-medium text-fg hover:text-nasa">{i.name}</Link>
                      {i.measures && <span className="block text-sm text-muted">{i.measures}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((c) => (
                    <li key={c.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{c.outgoing ? RELATION_LABELS[c.relation.type] : INVERSE_RELATION_LABELS[c.relation.type]}</span>
                      <Link href={entityGraphPath(c.other)} className="text-right font-medium text-fg hover:text-nasa">{c.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.relatedMissions.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Related missions</h2>
                <div className="mt-4"><ExplorationTable records={d.relatedMissions} /></div>
              </section>
            ) : null}

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
                    <dd className="text-right font-medium text-fg">
                      {f.href ? <Link href={f.href} className="hover:text-nasa">{f.value}</Link> : f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

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

function RefCard({ label, name, href }: { label: string; name: string; href?: string }) {
  const body = (
    <>
      <div className="text-xs text-faint">{label}</div>
      <div className="font-medium text-fg">{name}</div>
    </>
  );
  return href ? (
    <Link href={href} className="scientific-card p-3 transition hover:border-white/25">{body}</Link>
  ) : (
    <div className="scientific-card p-3">{body}</div>
  );
}
