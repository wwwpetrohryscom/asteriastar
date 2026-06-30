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
import { HsfStatusPill } from "@/components/human-spaceflight/HsfCards";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, humanSpaceflightPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.humanSpaceflight.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/human-spaceflight/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.humanSpaceflight.resolve(slug);
  if (!d) return {};
  return buildMetadata({ title: `${d.record.name} — ${d.kindLabel}`, description: d.record.description, path: humanSpaceflightPath(slug) });
}

type Row = { label: string; value: string; href?: string };

export default async function HumanSpaceflightPage({ params }: PageProps<"/human-spaceflight/[slug]">) {
  const { slug } = await params;
  const d = engine.humanSpaceflight.resolve(slug);
  if (!d) notFound();
  const r = d.record;
  const url = humanSpaceflightPath(slug);
  const link = (ref?: { id: string; name: string; slug?: string }) => (ref?.slug ? humanSpaceflightPath(ref.slug) : ref ? entityGraphPath2(ref.id) : undefined);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Human Spaceflight", url: ROUTES.humanSpaceflight },
    { name: r.name, url },
  ];

  const facts: Row[] = [{ label: "Type", value: d.kindLabel }];
  const push = (label: string, value?: string | number, href?: string) => { if (value != null && value !== "") facts.push({ label, value: String(value), href }); };
  if (r.kind === "station") {
    push("Country", r.country); push("Operator", d.agency?.name, link(d.agency)); push("Program", d.program?.name, link(d.program));
    push("Status", r.status); push("Launch date", r.launchDate); push("Reentry / deorbit", r.reentryDate);
    push("Operational period", r.operationalPeriod); push("Orbit", r.orbit);
    push("Mass", r.massKg ? `${r.massKg.toLocaleString()} kg` : undefined); push("Length", r.lengthM ? `${r.lengthM} m` : undefined);
    push("Pressurized volume", r.pressurizedVolumeM3 ? `${r.pressurizedVolumeM3} m³` : undefined);
    push("Crew capacity", r.crewCapacity); push("Docking ports", r.dockingPorts);
  } else if (r.kind === "module") {
    push("Station", d.station?.name, link(d.station)); push("Role", r.role); push("Agency", d.agency?.name, link(d.agency)); push("Launch date", r.launchDate);
  } else if (r.kind === "crew-vehicle" || r.kind === "cargo-vehicle") {
    push("Spacecraft type", r.craftType); push("Operator", d.agency?.name, link(d.agency)); push("Program", d.program?.name, link(d.program));
    push("Status", r.status); push("First flight", r.firstFlight); push("Crew capacity", r.crewCapacity); push("Services", d.station?.name, link(d.station));
  } else if (r.kind === "program") {
    push("Agency", d.agency?.name, link(d.agency)); push("Period", r.operationalPeriod); push("Status", r.status);
  } else if (r.kind === "astronaut") {
    push("Nationality", r.nationality); push("Agency", d.agency?.name, link(d.agency)); push("Born", r.bornYear); push("First spaceflight", r.firstFlight);
  } else if (r.kind === "expedition") {
    push("Station", d.station?.name, link(d.station)); push("Period", r.operationalPeriod); push("Commander", d.commander?.name, link(d.commander)); push("Launch vehicle", d.launchVehicle?.name, link(d.launchVehicle));
  } else if (r.kind === "eva") {
    push("Date", r.launchDate); push("Duration", r.durationText); push("Program", d.program?.name, link(d.program)); push("Station", d.station?.name, link(d.station));
  } else {
    push("Station", d.station?.name, link(d.station));
  }

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": r.kind === "astronaut" ? "Person" : r.kind === "program" ? "Project" : "CreativeWork",
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
      <HeroSection compact accent="aurora"
        eyebrow={<span>{d.kindLabel}{d.station && r.kind !== "station" ? ` · ${d.station.name}` : r.country ? ` · ${r.country}` : ""}</span>}
        title={r.name}
        lead={r.altNames?.length ? `Also known as ${r.altNames.join(", ")}` : undefined}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Human spaceflight</Badge>
          {r.status && <HsfStatusPill status={r.status} />}
          {r.launchDate && <span className="text-sm text-faint">{r.kind === "eva" ? "" : "Launched "}{r.launchDate}</span>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
            </section>

            {r.highlights?.length ? (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-display text-2xl font-bold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {r.highlights.map((x) => (
                    <li key={x} className="flex gap-3 text-muted"><span className="mt-1 text-[var(--accent)]">▹</span><span>{x}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.modules.length ? (
              <section aria-labelledby="modules">
                <h2 id="modules" className="font-display text-2xl font-bold">Modules</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.modules.map((m) => <RefCard key={m.id} label={m.role ?? "Module"} name={m.name} href={humanSpaceflightPath(m.slug)} />)}
                </div>
              </section>
            ) : null}

            {d.crew.length ? (
              <section aria-labelledby="crew">
                <h2 id="crew" className="font-display text-2xl font-bold">Crew</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.crew.map((c) => <RefCard key={c.id} label="Crew member" name={c.name} href={c.slug ? humanSpaceflightPath(c.slug) : entityGraphPath2(c.id)} />)}
                </div>
              </section>
            ) : null}

            {d.participants.length ? (
              <section aria-labelledby="participants">
                <h2 id="participants" className="font-display text-2xl font-bold">Participants</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {d.participants.map((c) => <RefCard key={c.id} label="Spacewalker" name={c.name} href={c.slug ? humanSpaceflightPath(c.slug) : entityGraphPath2(c.id)} />)}
                </div>
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
                    <dd className="text-right font-medium text-fg">
                      {f.href ? <Link href={f.href} className="hover:text-nebula">{f.value}</Link> : f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

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
                <p className="mt-3 text-xs leading-relaxed text-faint">
                  Curated from authoritative public sources. See{" "}
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

function entityGraphPath2(id: string): string | undefined {
  const ent = getEntityById(id);
  return ent ? entityGraphPath(ent) : undefined;
}

function RefCard({ label, name, href }: { label: string; name: string; href?: string }) {
  const body = (
    <>
      <div className="text-xs text-faint">{label}</div>
      <div className="font-medium text-fg">{name}</div>
    </>
  );
  return href ? (
    <Link href={href} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/25">{body}</Link>
  ) : (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">{body}</div>
  );
}
