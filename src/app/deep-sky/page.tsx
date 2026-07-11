import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeepSkyTable } from "@/components/deep-sky/DeepSkyTable";
import { engine } from "@/platform/data-engine";
import { DEEP_SKY_DISCOVERIES } from "@/app/deep-sky/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, deepSkyDiscoveryPath, constellationStarsPath } from "@/lib/routes";

const COUNT = engine.deepSky.count;
const DESCRIPTION = `An encyclopedia of ${COUNT} real deep-sky objects — galaxies, nebulae, and star clusters from the Messier, Caldwell, and NGC/IC catalogues — as first-class knowledge-graph entities with observing guides.`;

export const metadata: Metadata = buildMetadata({ title: "Deep Sky Encyclopedia", description: DESCRIPTION, path: ROUTES.deepSky });

export default function DeepSkyHub() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Sky", url: ROUTES.deepSky },
  ];
  const types = engine.deepSky.types();
  const constellations = engine.deepSky.constellations();
  const brightest = engine.deepSky.brightest(12);
  const messierCount = engine.deepSky.byCatalog("messier").length;
  const caldwellCount = engine.deepSky.byCatalog("caldwell").length;

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Deep Sky Encyclopedia", description: DESCRIPTION, url: ROUTES.deepSky })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="plasma"
        eyebrow={<span>Deep Sky &amp; Galaxy Encyclopedia</span>}
        title="Beyond the Solar System"
        lead={`Galaxies, nebulae, and star clusters across the sky — ${COUNT} real deep-sky objects, each a first-class entity with catalogue data, an observing guide, and knowledge-graph connections.`}
      >
        <p className="mt-6 text-sm text-faint">
          {types.map((t) => `${t.count} ${t.plural.toLowerCase()}`).slice(0, 5).join(" · ")} · {messierCount} Messier &amp; {caldwellCount} Caldwell objects · data from OpenNGC (CC BY-SA 4.0)
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="brightest-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="brightest-heading" className="font-display text-2xl font-bold">Brightest deep-sky objects</h2>
            <Link href={deepSkyDiscoveryPath("bright-deep-sky")} className="text-sm text-muted transition hover:text-fg">See all →</Link>
          </div>
          <div className="mt-4"><DeepSkyTable objects={brightest} /></div>
        </section>

        <section aria-labelledby="discover-heading">
          <h2 id="discover-heading" className="font-display text-2xl font-bold">Discover</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEEP_SKY_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={deepSkyDiscoveryPath(d.slug)} className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nasa">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="types-heading">
          <h2 id="types-heading" className="font-display text-2xl font-bold">Browse by type</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {types.map((t) => (
              <li key={t.type} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted">
                {t.plural}<span className="text-xs text-faint">{t.count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="constellations-heading">
          <h2 id="constellations-heading" className="font-display text-2xl font-bold">Richest constellations</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {constellations.slice(0, 24).map((c) => (
              <li key={c.id}>
                <Link href={constellationStarsPath(c.def.slug)} className="flex items-baseline justify-between gap-2 text-muted transition hover:text-fg">
                  <span>{c.def.name}</span>
                  <span className="text-xs text-faint">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="scientific-card p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-1.5">
            Objects are generated from the open <a href="https://github.com/mattiaverga/OpenNGC" target="_blank" rel="noopener noreferrer" className="text-nasa underline-offset-4 hover:underline">OpenNGC database</a> — a compilation of the NGC/IC, Messier, and Caldwell catalogues, licensed CC BY-SA 4.0. Every value is real; no measurements or identifiers are invented. See the{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}
