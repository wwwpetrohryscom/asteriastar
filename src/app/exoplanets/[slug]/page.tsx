import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { EntityImagery } from "@/components/media/EntityImagery";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { ExoplanetTable } from "@/components/exoplanets/ExoplanetTable";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath, getConnectionsByDomain } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, exoplanetPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.exoplanets.allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/exoplanets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.exoplanets.resolve(slug);
  if (!d) return {};
  const name = d.kind === "planet" ? d.record.name : d.kind === "host" ? d.host.name : d.kind === "system" ? d.system.name : d.kind === "method" ? d.method.name : d.cls.name;
  const desc = d.kind === "planet" ? d.record.name + " — exoplanet facts, host star, orbit, and discovery from the NASA Exoplanet Archive."
    : d.kind === "method" ? d.method.description : d.kind === "host" ? `${d.host.name} and its ${d.planets.length} known planets.` : `${name} — real exoplanet data, graph-connected.`;
  return buildMetadata({ title: name, description: desc, path: exoplanetPath(slug) });
}

type Row = { label: string; value: string; href?: string };

/**
 * Bulk density derived from a planet's source-backed Earth-mass and Earth-radius,
 * ρ = M / (4/3·π·r³), in g/cm³. Standard, non-fabricating (inputs come from the
 * NASA Exoplanet Archive); returns undefined unless both inputs are positive.
 * Earth (M⊕=1, R⊕=1) → 5.51 g/cm³, the known value, confirming the constants.
 */
function derivedDensityGCm3(massEarth?: number, radiusEarth?: number): number | undefined {
  if (massEarth == null || radiusEarth == null || massEarth <= 0 || radiusEarth <= 0) return undefined;
  const M_EARTH_KG = 5.972e24, R_EARTH_M = 6.371e6;
  const volumeM3 = (4 / 3) * Math.PI * (radiusEarth * R_EARTH_M) ** 3;
  const rho = (massEarth * M_EARTH_KG) / volumeM3 / 1000; // kg/m³ → g/cm³
  // No planetary composition — even a compressed pure-iron world — exceeds ~30 g/cm³.
  // A result above that means the archive's mass and radius come from inconsistent
  // measurements (e.g. a TTV mass upper limit paired with a transit radius); no honest
  // density can be formed from them, so the derived value is withheld.
  return rho > 30 ? undefined : rho;
}

export default async function ExoplanetPage({ params }: PageProps<"/exoplanets/[slug]">) {
  const { slug } = await params;
  const d = engine.exoplanets.resolve(slug);
  if (!d) notFound();

  const title = d.kind === "planet" ? d.record.name : d.kind === "host" ? d.host.name : d.kind === "system" ? d.system.name : d.kind === "method" ? d.method.name : d.cls.name;
  const kindLabel = d.kind === "planet" ? (d.className ?? "Exoplanet") : d.kind === "host" ? "Host star" : d.kind === "system" ? "Planetary system" : d.kind === "method" ? "Detection method" : "Planetary class";
  const url = exoplanetPath(slug);
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Exoplanets", url: ROUTES.exoplanets }, { name: title, url }];

  const jsonLd = {
    "@context": "https://schema.org", "@type": d.kind === "host" ? "Thing" : "CreativeWork", name: title,
    description: d.kind === "planet" ? d.record.name : title, url: absoluteUrl(url),
    identifier: d.kind === "planet" ? d.record.id : undefined,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember"
        eyebrow={<span>{kindLabel}{d.kind === "planet" && d.host ? ` · ${d.record.hostName}` : ""}</span>}
        title={title}
        lead={d.kind === "method" ? d.method.description : undefined}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Exoplanets</Badge>
          {d.kind === "planet" && d.record.habitableCandidate && <span className="rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-xs text-success-strong">Habitable-zone candidate</span>}
          {d.kind === "planet" && d.record.discoveryYear && <span className="text-sm text-faint">Discovered {d.record.discoveryYear}</span>}
        </div>
      </HeroSection>

      {(d.kind === "planet" || d.kind === "host") && (
        <Container className="mt-6"><EntityImagery entityId={d.kind === "planet" ? d.record.id : d.host.id} /></Container>
      )}

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {d.kind === "planet" && <PlanetBody d={d} />}
            {d.kind === "host" && <HostBody d={d} />}
            {d.kind === "system" && <SystemBody d={d} />}
            {d.kind === "method" && <MethodBody d={d} />}
            {d.kind === "class" && <ClassBody d={d} />}
          </div>
          <aside className="space-y-6">
            <QuickFacts d={d} />
            {(d.kind === "planet" || d.kind === "host") && d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}

            {(d.kind === "planet" || d.kind === "host") && d.quality && (
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
                <p className="mt-3 text-xs leading-relaxed text-faint">Data from the <Link href="/exoplanets" className="text-nasa hover:underline">NASA Exoplanet Archive</Link>. See <Link href="/transparency/source-quality" className="text-nasa hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

type D = NonNullable<ReturnType<typeof engine.exoplanets.resolve>>;

function PlanetBody({ d }: { d: Extract<D, { kind: "planet" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="overview" title="Scientific overview">
        <p className="leading-relaxed text-muted">
          {r.name} is {d.className ? `${/^[aeiou]/i.test(d.className) ? "an" : "a"} ${d.className.toLowerCase()}` : "an exoplanet"} orbiting {r.hostName}
          {r.orbitalPeriodDays != null ? `, completing an orbit every ${r.orbitalPeriodDays >= 2 ? Math.round(r.orbitalPeriodDays) : r.orbitalPeriodDays} days` : ""}
          {d.distanceLy ? `, about ${d.distanceLy} light-years from Earth` : ""}.
          {r.discoveryYear ? ` It was discovered in ${r.discoveryYear}${d.method ? ` using the ${d.method.name.toLowerCase()}` : ""}.` : ""}
        </p>
      </Section>
      <Section id="host" title="Host star">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {d.host && <RefCard label="Host star" name={d.host.name} href={d.host.href} />}
          {r.hostSpectralType && <RefCard label="Spectral type" name={r.hostSpectralType} />}
          {r.hostTeffK && <RefCard label="Temperature" name={`${r.hostTeffK.toLocaleString()} K`} />}
          {r.hostMassSolar && <RefCard label="Mass" name={`${r.hostMassSolar} M☉`} />}
        </div>
      </Section>
      {d.siblings.length ? (
        <Section id="system" title={`Planetary system${d.system ? ` — ${d.system.name}` : ""}`}>
          {d.system && <p className="mb-3 text-sm text-muted"><Link href={exoplanetPath(d.system.slug)} className="text-nasa hover:underline">View the {d.system.name}</Link> ({d.siblings.length + 1} known planets).</p>}
          <ExoplanetTable planets={[r, ...d.siblings].sort((a, b) => (a.orbitalPeriodDays ?? 9e9) - (b.orbitalPeriodDays ?? 9e9))} showHost={false} />
        </Section>
      ) : null}
      <Section id="discovery" title="Discovery and detection">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {d.method && <RefCard label="Detection method" name={d.method.name} href={exoplanetPath(d.method.slug)} />}
          {r.discoveryYear && <RefCard label="Discovery year" name={String(r.discoveryYear)} />}
          {d.facility && <RefCard label="Discovered at" name={d.facility.name} href={d.facility.href} />}
        </div>
      </Section>
      {r.habitableCandidate ? (
        <Section id="habitability" title="Habitability notes">
          <p className="leading-relaxed text-muted">{r.name} lies in the habitable zone of its star, the range of orbits where liquid water could in principle exist on a planet&apos;s surface. This makes it a candidate of interest for habitability studies — but lying in the habitable zone is <strong className="text-fg">not</strong> evidence that the planet is habitable or inhabited; its atmosphere and surface conditions remain unknown.</p>
        </Section>
      ) : null}
      <ConnectionsSection id={r.id} />
    </>
  );
}

function HostBody({ d }: { d: Extract<D, { kind: "host" }> }) {
  return (
    <>
      <Section id="overview" title="Overview">
        <p className="leading-relaxed text-muted">{d.host.record.hostSpectralType ? `${d.host.name} is a ${d.host.record.hostSpectralType} star` : `${d.host.name} is a star`} that hosts {d.planets.length} known exoplanet{d.planets.length === 1 ? "" : "s"} in this catalogue{d.distanceLy ? `, about ${d.distanceLy} light-years from Earth` : ""}.</p>
      </Section>
      <Section id="planets" title="Known planets"><ExoplanetTable planets={d.planets.slice().sort((a, b) => (a.orbitalPeriodDays ?? 9e9) - (b.orbitalPeriodDays ?? 9e9))} showHost={false} /></Section>
      <ConnectionsSection id={d.host.id} />
    </>
  );
}

function SystemBody({ d }: { d: Extract<D, { kind: "system" }> }) {
  return (
    <>
      <Section id="overview" title="System overview">
        <p className="leading-relaxed text-muted">The {d.system.name} has {d.planets.length} known planets in this catalogue{d.host ? `, orbiting the star ${d.host.name}` : ""}{d.years.length === 1 ? `, all discovered in ${d.years[0]}` : d.years.length > 1 ? `, discovered between ${d.years[0]} and ${d.years[d.years.length - 1]}` : ""}.</p>
      </Section>
      {d.host && <Section id="host" title="Host star"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><RefCard label="Host star" name={d.host.name} href={d.host.href} /></div></Section>}
      <Section id="planets" title="Planets"><ExoplanetTable planets={d.planets} showHost={false} /></Section>
    </>
  );
}

function MethodBody({ d }: { d: Extract<D, { kind: "method" }> }) {
  return (
    <>
      <Section id="how" title="How it works"><p className="leading-relaxed text-muted">{d.method.detail}</p></Section>
      <Section id="limits" title="Strengths and limitations"><p className="leading-relaxed text-muted">{d.method.limitations}</p></Section>
      {d.examples.length ? <Section id="examples" title="Example exoplanets"><ExoplanetTable planets={d.examples} /></Section> : null}
    </>
  );
}

function ClassBody({ d }: { d: Extract<D, { kind: "class" }> }) {
  return (
    <>
      <Section id="overview" title="Overview"><p className="leading-relaxed text-muted">{d.cls.description}</p></Section>
      <Section id="planets" title={`${d.cls.plural} (${d.planets.length})`}><ExoplanetTable planets={d.planets} /></Section>
    </>
  );
}

function QuickFacts({ d }: { d: D }) {
  const facts: Row[] = [];
  let derivedShown = false;
  const push = (label: string, value?: string | number | null, href?: string) => { if (value != null && value !== "") facts.push({ label, value: String(value), href }); };
  if (d.kind === "planet") {
    const r = d.record;
    push("Class", d.className); push("Host star", d.host?.name, d.host?.href);
    push("Discovery method", d.method?.name, d.method ? exoplanetPath(d.method.slug) : undefined);
    push("Discovery year", r.discoveryYear); push("Orbital period", r.orbitalPeriodDays != null ? `${r.orbitalPeriodDays} d` : undefined);
    push("Semi-major axis", r.semiMajorAxisAu != null ? `${r.semiMajorAxisAu} AU` : undefined);
    push("Eccentricity", r.eccentricity); push("Radius", r.radiusEarth != null ? `${r.radiusEarth} R⊕` : undefined);
    push("Mass", r.massEarth != null ? `${r.massEarth} M⊕` : undefined);
    // Derived bulk density from source-backed mass + radius: ρ = M / (4/3·π·r³).
    // Standard, labelled `· derived`; the archive stores no density itself.
    const rho = derivedDensityGCm3(r.massEarth, r.radiusEarth);
    if (rho != null) { push("Density", `${rho.toFixed(2)} g/cm³ · derived`); derivedShown = true; }
    // Equilibrium temperature: an insolation-set temperature cannot fall below the
    // cosmic-microwave-background floor (2.725 K); such values are archive artefacts,
    // shown as an honest empty state rather than an impossible measurement.
    push("Equilibrium temp.", r.eqTempK != null && r.eqTempK > 2.725 ? `${r.eqTempK} K` : undefined);
    push("Insolation", r.insolationFlux != null && r.insolationFlux > 0 ? `${r.insolationFlux} S⊕` : undefined); push("Distance", d.distanceLy != null ? `${d.distanceLy} ly` : undefined);
  } else if (d.kind === "host") {
    push("Spectral type", d.host.record.hostSpectralType); push("Effective temp.", d.host.record.hostTeffK != null ? `${d.host.record.hostTeffK.toLocaleString()} K` : undefined);
    push("Radius", d.host.record.hostRadiusSolar != null ? `${d.host.record.hostRadiusSolar} R☉` : undefined); push("Mass", d.host.record.hostMassSolar != null ? `${d.host.record.hostMassSolar} M☉` : undefined);
    push("Metallicity [Fe/H]", d.host.record.hostMetallicity); push("Distance", d.distanceLy != null ? `${d.distanceLy} ly` : undefined); push("Known planets", d.planets.length);
  } else if (d.kind === "system") {
    push("Known planets", d.planets.length); push("Host star", d.host?.name, d.host?.href);
  } else if (d.kind === "method") {
    push("Example planets", d.examples.length);
  } else {
    push("Planets in catalogue", d.planets.length);
  }
  if (!facts.length) return null;
  return (
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
      {derivedShown && (
        <p className="mt-3 text-xs leading-relaxed text-faint">Density is <span className="text-muted">derived</span> from the archive mass and radius via ρ = M / (4⁄3·π·r³); all other values are catalogued measurements.</p>
      )}
    </section>
  );
}

function ConnectionsSection({ id }: { id: string }) {
  const science = getConnectionsByDomain(id).science;
  if (!science.length) return null;
  return (
    <Section id="connections" title="Knowledge connections">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {science.slice(0, 20).map((c) => (
          <li key={c.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
            <span className="text-faint">{c.outgoing ? RELATION_LABELS[c.relation.type] : INVERSE_RELATION_LABELS[c.relation.type]}</span>
            <Link href={entityGraphPath(c.other)} className="text-right font-medium text-fg hover:text-nasa">{c.other.name}</Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function RefCard({ label, name, href }: { label: string; name: string; href?: string }) {
  const body = (<><div className="text-xs text-faint">{label}</div><div className="font-medium text-fg">{name}</div></>);
  return href ? <Link href={href} className="scientific-card p-3 transition hover:border-white/25">{body}</Link>
    : <div className="scientific-card p-3">{body}</div>;
}
