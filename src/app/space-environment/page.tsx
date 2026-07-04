import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EnvCards } from "@/components/space-environment/EnvCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceEnvironmentDiscoveryPath } from "@/lib/routes";
import { ENV_DISCOVERIES } from "@/app/space-environment/discovery";

const DESCRIPTION =
  "A scientific encyclopedia of the hazards of space — space weather (solar wind, flares, coronal mass ejections, geomagnetic storms, auroras), the radiation environment (the Van Allen belts, galactic cosmic rays, solar energetic particles), the physical hazards to spacecraft (orbital debris, micrometeoroids, charging, atomic oxygen), and the indices and monitoring missions that track them. Reuses the Sun, planets, and solar missions; every value is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Space Environment & Hazards", description: DESCRIPTION, path: ROUTES.spaceEnvironment });

export default function SpaceEnvironmentHubPage() {
  const e = engine.spaceEnvironment;
  const monitors = e.monitoringAssets();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Environment", url: ROUTES.spaceEnvironment },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Environment & Hazards", description: DESCRIPTION, url: ROUTES.spaceEnvironment })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Encyclopedia · {e.count} phenomena &amp; hazards</span>} title="Space Environment &amp; Hazards" lead="Space is not empty — it is filled with radiation, plasma, and debris that threaten spacecraft and astronauts. This encyclopedia maps the hazards of space, from the Sun's storms to the cosmic rays of the galaxy, and the missions that watch for them." />

      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the hazards</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ENV_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={spaceEnvironmentDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-ember hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="weather-heading">
          <h2 id="weather-heading" className="font-display text-2xl font-bold">Space weather</h2>
          <p className="mt-1 text-sm text-faint">The Sun-driven phenomena that shape near-Earth space.</p>
          <div className="mt-4"><EnvCards records={e.phenomena()} /></div>
        </section>

        <section aria-labelledby="radiation-heading">
          <h2 id="radiation-heading" className="font-display text-2xl font-bold">Radiation &amp; hazards</h2>
          <div className="mt-4"><EnvCards records={[...e.radiationEnvironments(), ...e.hazards()]} /></div>
        </section>

        <section aria-labelledby="monitor-heading">
          <h2 id="monitor-heading" className="font-display text-2xl font-bold">Monitoring missions</h2>
          <p className="mt-1 text-sm text-faint">The spacecraft and centres that watch the Sun and the space environment.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {monitors.map((m) => <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>)}
          </ul>
        </section>

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each phenomenon, radiation environment, hazard, and index is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Sun, the planets, and the solar missions. This encyclopedia states no live conditions — for current space weather, see NOAA&apos;s Space Weather Prediction Center. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-ember underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
