import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { BodyTable } from "@/components/solar-system/BodyTable";
import { engine } from "@/platform/data-engine";
import { SOLAR_DISCOVERIES } from "@/app/solar-system/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, solarDiscoveryPath } from "@/lib/routes";

const COUNT = engine.solar.count;
const DESCRIPTION = `A reference-quality encyclopedia of the Solar System — the Sun, planets, dwarf planets, moons, asteroids, comets, missions, and spacecraft, built on real NASA/JPL data as first-class knowledge-graph entities.`;

export const metadata: Metadata = buildMetadata({ title: "Solar System Encyclopedia", description: DESCRIPTION, path: ROUTES.solarSystem });

export default function SolarSystemHub() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Solar System", url: ROUTES.solarSystem },
  ];
  const planets = engine.solar.planets();
  const kinds = engine.solar.kinds();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Solar System Encyclopedia", description: DESCRIPTION, url: ROUTES.solarSystem })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="halo"
        eyebrow={<span>Solar System Encyclopedia</span>}
        title="Our cosmic neighbourhood"
        lead={`The Sun and the worlds that orbit it — ${COUNT} bodies, each a first-class entity with real measurements, exploration history, and knowledge-graph connections.`}
      >
        <p className="mt-6 text-sm text-faint">
          {kinds.map((k) => `${k.count} ${k.plural.toLowerCase()}`).join(" · ")} · data from the NASA Planetary Fact Sheet & JPL (public domain)
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="planets-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="planets-heading" className="font-display text-2xl font-bold">The planets</h2>
            <Link href={solarDiscoveryPath("all-planets")} className="text-sm text-muted transition hover:text-fg">All planets →</Link>
          </div>
          <div className="mt-4"><BodyTable bodies={planets} /></div>
        </section>

        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by category</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOLAR_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={solarDiscoveryPath(d.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-1.5">
            Planet and moon measurements come from the <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noopener noreferrer" className="text-nebula underline-offset-4 hover:underline">NASA Planetary Fact Sheet</a> and JPL (public domain). Smaller bodies, missions, spacecraft, and surface features are curated from established NASA/JPL/IAU facts. Every value is real; unknown values are omitted, never invented. See{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
