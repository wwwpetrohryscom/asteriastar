import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GeoCards } from "@/components/planetary-geology/GeoCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, planetaryGeologyDiscoveryPath } from "@/lib/routes";
import { GEO_DISCOVERIES } from "@/app/planetary-geology/discovery";

const DESCRIPTION =
  "A planetary-geology encyclopedia of the surfaces of the Solar System — impact craters and basins, volcanoes and cryovolcanoes, canyons and mountains, dunes, chaos terrain, ice plains, and hydrocarbon lakes — across Mars, the Moon, Mercury, Venus, Ceres, Vesta, the icy moons, and Pluto. Reuses the platform's planets, moons, and surface features; every figure is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Planetary Geology & Surface Features", description: DESCRIPTION, path: ROUTES.planetaryGeology });

export default function PlanetaryGeologyHubPage() {
  const e = engine.planetaryGeology;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Planetary Geology", url: ROUTES.planetaryGeology },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Planetary Geology & Surface Features", description: DESCRIPTION, url: ROUTES.planetaryGeology })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Encyclopedia · {e.featureTypes().length} feature types · {e.featureCount} features</span>} title="Planetary Geology &amp; Surface Features" lead="Every solid world in the Solar System tells its story in its surface — in craters and canyons, volcanoes and dunes, ice plains and lakes of methane. This encyclopedia maps the geology of the planets and moons, feature by feature." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the surfaces</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GEO_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={planetaryGeologyDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="types-heading">
          <h2 id="types-heading" className="font-display text-2xl font-bold">Feature types</h2>
          <div className="mt-4"><GeoCards records={e.featureTypes()} /></div>
        </section>
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="font-display text-2xl font-bold">Named features</h2>
          <div className="mt-4"><GeoCards records={e.features()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each feature type and named feature is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the planets, moons, and dwarf planets and the surface features already in the graph. Curated from NASA/JPL planetary data. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
