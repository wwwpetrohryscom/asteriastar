import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditorialHero, type HeroFact } from "@/components/editorial/EditorialHero";
import { StatGrid } from "@/components/editorial/StatGrid";
import { RelatedObjects } from "@/components/editorial/RelatedObjects";
import { EarthComparison, SectionHeader, ObservationPanel } from "@/components/editorial/scientific";
import { getHeroImageForEntity } from "@/lib/media/registry";
import { EntityImagery } from "@/components/media/EntityImagery";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { bodySlug } from "@/knowledge-graph/data/solar-system-catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, solarBodyPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return engine.solar.all().map((b) => ({ slug: bodySlug(b.id) }));
}

export async function generateMetadata({ params }: PageProps<"/solar-system/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = engine.solar.resolve(slug);
  if (!b) return {};
  return buildMetadata({
    title: `${b.record.name} — ${b.kindLabel}`,
    description: `${b.record.name}: ${b.record.classification ?? b.kindLabel}. Real data — physical characteristics, orbit, moons, and exploration — with sources and knowledge-graph connections.`,
    path: solarBodyPath(slug),
  });
}

type Row = { label: string; value: string };
const n = (v: number | undefined) => (v == null ? undefined : v.toLocaleString());

// Standard derivations from source-backed mass & radius (labelled "· derived").
// g = GM/r² ; v_esc = √(2GM/r). G in m³ kg⁻¹ s⁻².
const G = 6.674e-11;
const deriveGravity = (m1e24?: number, rKm?: number) =>
  m1e24 != null && m1e24 > 0 && rKm != null && rKm > 0 ? (G * m1e24 * 1e24) / (rKm * 1000) ** 2 : undefined;
const deriveEscape = (m1e24?: number, rKm?: number) =>
  m1e24 != null && m1e24 > 0 && rKm != null && rKm > 0 ? Math.sqrt((2 * G * m1e24 * 1e24) / (rKm * 1000)) / 1000 : undefined;

export default async function SolarBodyPage({ params }: PageProps<"/solar-system/[slug]">) {
  const { slug } = await params;
  const b = engine.solar.resolve(slug);
  if (!b) notFound();
  const r = b.record;
  const url = solarBodyPath(slug);
  const isCraft = r.kind === "mission" || r.kind === "spacecraft";

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Solar System", url: ROUTES.solarSystem },
    { name: r.name, url },
  ];

  const gDerived = r.gravityMs2 == null ? deriveGravity(r.mass1e24Kg, r.radiusKm) : undefined;
  const eDerived = r.escapeVelocityKms == null ? deriveEscape(r.mass1e24Kg, r.radiusKm) : undefined;
  const derivedShown = gDerived != null || eDerived != null;

  const physical: Row[] = [
    r.mass1e24Kg != null && r.mass1e24Kg > 0 ? { label: "Mass", value: `${n(r.mass1e24Kg)} ×10²⁴ kg` } : null,
    r.diameterKm != null ? { label: "Diameter", value: `${n(r.diameterKm)} km` } : null,
    r.radiusKm != null ? { label: "Radius", value: `${n(r.radiusKm)} km` } : null,
    r.densityGCm3 != null ? { label: "Density", value: `${r.densityGCm3} g/cm³` } : null,
    r.gravityMs2 != null
      ? { label: "Surface gravity", value: `${r.gravityMs2} m/s²` }
      : gDerived != null ? { label: "Surface gravity", value: `${gDerived.toFixed(2)} m/s² · derived` } : null,
    r.escapeVelocityKms != null
      ? { label: "Escape velocity", value: `${r.escapeVelocityKms} km/s` }
      : eDerived != null ? { label: "Escape velocity", value: `${eDerived.toFixed(1)} km/s · derived` } : null,
    r.rotationPeriodHours != null ? { label: "Rotation period", value: `${n(Math.abs(r.rotationPeriodHours))} h${r.rotationPeriodHours < 0 ? " (retrograde)" : ""}` } : null,
    r.meanTemperatureC != null ? { label: "Mean temperature", value: `${r.meanTemperatureC} °C` } : null,
    r.albedo != null ? { label: "Albedo", value: `${r.albedo}` } : null,
    r.magnitude != null ? { label: "Magnitude", value: `${r.magnitude}` } : null,
  ].filter(Boolean) as Row[];

  const orbit: Row[] = [
    r.distanceFromSun1e6Km != null ? { label: "Distance from Sun", value: `${n(r.distanceFromSun1e6Km)} million km${r.semiMajorAxisAu != null ? ` (${r.semiMajorAxisAu} AU)` : ""}` } : null,
    r.orbitalPeriodYears != null ? { label: "Orbital period", value: `${r.orbitalPeriodYears} years` } : r.orbitalPeriodDays != null ? { label: "Orbital period", value: `${n(r.orbitalPeriodDays)} days` } : null,
    r.perihelion1e6Km != null ? { label: "Perihelion", value: `${n(r.perihelion1e6Km)} million km` } : null,
    r.aphelion1e6Km != null ? { label: "Aphelion", value: `${n(r.aphelion1e6Km)} million km` } : null,
    r.eccentricity != null ? { label: "Eccentricity", value: `${r.eccentricity}` } : null,
    r.inclinationDeg != null ? { label: "Orbital inclination", value: `${r.inclinationDeg}°` } : null,
    r.obliquityDeg != null ? { label: "Axial tilt", value: `${r.obliquityDeg}°` } : null,
    r.orbitalVelocityKms != null ? { label: "Orbital velocity", value: `${r.orbitalVelocityKms} km/s` } : null,
  ].filter(Boolean) as Row[];

  const mission: Row[] = [
    r.agency ? { label: "Agency", value: r.agency } : null,
    r.launchYear ? { label: "Launched", value: r.launchYear } : null,
    r.missionType ? { label: "Type", value: r.missionType } : null,
    r.status ? { label: "Status", value: r.status } : null,
  ].filter(Boolean) as Row[];

  const quick: Row[] = [
    { label: "Type", value: r.classification ?? b.kindLabel },
    b.parent ? { label: r.kind === "moon" ? "Orbits" : "System", value: b.parent.name } : null,
    r.discoveryYear ? { label: "Discovered", value: `${r.discoveryYear}${r.discoveredBy ? ` · ${r.discoveredBy}` : ""}` } : null,
    r.moonCount != null ? { label: "Moons", value: String(r.moonCount) } : null,
    r.hasRingSystem ? { label: "Ring system", value: "Yes" } : null,
  ].filter(Boolean) as Row[];

  const heroFacts: HeroFact[] = isCraft
    ? [
        { label: "Agency", value: r.agency },
        { label: "Launched", value: r.launchYear ? String(r.launchYear) : undefined },
        { label: "Type", value: r.missionType },
        { label: "Status", value: r.status },
      ]
    : [
        { label: "Type", value: r.classification ?? b.kindLabel },
        { label: "Diameter", value: r.diameterKm != null ? `${n(r.diameterKm)} km` : undefined },
        { label: "Distance from Sun", value: r.distanceFromSun1e6Km != null ? `${n(r.distanceFromSun1e6Km)} M km` : undefined },
        { label: "Surface gravity", value: r.gravityMs2 != null ? `${r.gravityMs2} m/s²` : undefined },
        { label: "Mean temp.", value: r.meanTemperatureC != null ? `${r.meanTemperatureC} °C` : undefined },
        { label: "Moons", value: r.moonCount != null ? String(r.moonCount) : undefined },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: r.name,
    ...(r.designation ? { alternateName: r.designation } : {}),
    description: `${r.classification ?? b.kindLabel}.`,
    url: absoluteUrl(url),
    identifier: r.id,
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-6"><Breadcrumbs crumbs={crumbs} /></Container>
      <EditorialHero
        entityId={r.id}
        eyebrow={`${b.kindLabel}${r.classification ? ` · ${r.classification}` : ""}`}
        title={r.name}
        subtitle={r.designation && r.designation !== r.name ? r.designation : undefined}
        facts={heroFacts}
      />

      <Container className="mt-12 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <section>
              <SectionHeader kicker="Overview" title="Scientific overview" />
              <p className="mt-4 max-w-2xl text-lg leading-[1.75] text-muted">
                {r.name} is {r.classification ? `a ${r.classification.toLowerCase()}` : `a ${b.kindLabel.toLowerCase()}`}
                {b.parent && r.kind === "moon" ? ` orbiting ${b.parent.name}` : b.parent && r.kind !== "star" && !isCraft ? ` in orbit around ${b.parent.name}` : ""}
                {r.distanceFromSun1e6Km != null ? `, at a mean distance of ${n(r.distanceFromSun1e6Km)} million km from the Sun` : ""}
                {r.agency ? `, operated by ${r.agency}` : ""}
                {r.launchYear ? `, launched in ${r.launchYear}` : ""}.
              </p>
            </section>

            {isCraft && <StatGrid heading="Mission" stats={mission} />}
            {!isCraft && <StatGrid heading="Physical characteristics" stats={physical} />}
            {!isCraft && derivedShown && (
              <p className="max-w-2xl text-xs leading-relaxed text-faint">
                Values marked <span className="font-medium text-muted">· derived</span> are computed from this body&rsquo;s
                source-backed mass and radius using standard relations — surface gravity <span className="text-muted">g = GM/r²</span> and
                escape velocity <span className="text-muted">v = √(2GM/r)</span> — not separately catalogued measurements.
              </p>
            )}
            {!isCraft && r.diameterKm != null && <EarthComparison name={r.name} otherDiameterKm={r.diameterKm} />}
            {!isCraft && <StatGrid heading="Orbit" stats={orbit} />}

            <EntityImagery entityId={r.id} heading="Gallery" skip={1} />

            {(() => {
              const heroImg = getHeroImageForEntity(r.id);
              return heroImg ? (
                <ObservationPanel instrument={heroImg.instrument} mission={heroImg.mission} provider={heroImg.provider} captureDate={heroImg.captureDate} />
              ) : null;
            })()}

            {/* Targets (missions/spacecraft) */}
            {isCraft && (r.targets?.length || r.landedOn?.length || r.partOfMission) ? (
              <section aria-labelledby="targets">
                <h2 id="targets" className="font-display text-2xl font-bold">Targets &amp; destinations</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {[...(r.targets ?? []), ...(r.landedOn ?? []), ...(r.partOfMission ? [r.partOfMission] : [])].map((tid) => {
                    const t = engine.solar.get(tid);
                    return t ? (
                      <li key={tid}>
                        <Link href={solarBodyPath(bodySlug(tid))} className="rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{t.name}</Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </section>
            ) : null}

            {/* Moons */}
            {b.moons.length > 0 && (
              <RelatedObjects
                heading={`Moons (${b.moons.length})`}
                max={16}
                items={b.moons.map((m) => ({ id: m.id, name: m.name, href: solarBodyPath(bodySlug(m.id)) }))}
              />
            )}

            {/* Surface features */}
            {b.features.length > 0 && (
              <section aria-labelledby="features">
                <h2 id="features" className="font-display text-2xl font-bold">Notable surface features</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {b.features.map((f) => (
                    <li key={f.id}><Link href={solarBodyPath(bodySlug(f.id))} className="rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{f.name}</Link></li>
                  ))}
                </ul>
              </section>
            )}

            {/* Exploration */}
            {(b.missions.length > 0 || b.spacecraft.length > 0) && (
              <RelatedObjects
                heading="Exploration"
                max={16}
                items={[...b.missions, ...b.spacecraft].map((mc) => ({ id: mc.id, name: mc.name, href: solarBodyPath(bodySlug(mc.id)) }))}
              />
            )}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section aria-labelledby="quick" className="scientific-card p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {quick.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {b.quality && <EntityProvenancePanel entityId={b.quality.entityId} />}

            {b.quality && (
              <section aria-labelledby="quality" className="scientific-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="quality" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quality &amp; authority</h2>
                  <span className="text-xs text-faint">{b.quality.completenessPercent}%</span>
                </div>
                <div className="mt-3"><ReviewBadge status={b.reviewStatus} /></div>
                <dl className="mt-3 grid grid-cols-1 gap-y-1.5">
                  {(Object.keys(b.quality.indicators) as QualityDimension[]).slice(0, 6).map((d) => (
                    <div key={d} className="flex items-center justify-between gap-2 text-sm">
                      <dt className="text-muted">{QUALITY_DIMENSION_LABELS[d]}</dt>
                      <dd><CoverageBadge level={b.quality!.indicators[d]} /></dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-faint">
                  Data from the NASA Planetary Fact Sheet & JPL (public domain). See{" "}
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
