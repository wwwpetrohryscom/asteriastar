import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { StarTable } from "@/components/stars/StarTable";
import { engine } from "@/platform/data-engine";
import { STAR_DISCOVERIES } from "@/app/stars/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, starCategoryPath, constellationStarsPath, starDiscoveryPath } from "@/lib/routes";

const COUNT = engine.star.count;
const DESCRIPTION = `An open encyclopedia of ${COUNT.toLocaleString()} real stars — brightest, nearest, by constellation, type, and visibility — built from authoritative catalogues with full provenance.`;

export const metadata: Metadata = buildMetadata({ title: "Star Encyclopedia", description: DESCRIPTION, path: ROUTES.stars });

export default function StarsHubPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Stars", url: ROUTES.stars },
  ];
  const categories = engine.star.categories();
  const constellations = engine.star.constellations();
  const brightest = engine.star.brightest(12);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Star Encyclopedia", description: DESCRIPTION, url: ROUTES.stars })]} />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        accent="nebula"
        eyebrow={<span>Star Encyclopedia</span>}
        title="Every star, a first-class entity"
        lead={`The open encyclopedia of stars. ${COUNT.toLocaleString()} stars across all 88 constellations — each with real catalogue data, provenance, and knowledge-graph connections.`}
      >
        <p className="mt-6 text-sm text-faint">
          {COUNT.toLocaleString()} stars · {constellations.length} constellations · {categories.length} stellar types · data from the open HYG database (Hipparcos · Yale BSC · Gliese), CC BY-SA 4.0
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="brightest-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="brightest-heading" className="font-display text-2xl font-bold">Brightest stars</h2>
            <Link href={starDiscoveryPath("brightest")} className="text-sm text-muted transition hover:text-fg">See all →</Link>
          </div>
          <div className="mt-4"><StarTable stars={brightest} /></div>
        </section>

        <section aria-labelledby="discover-heading">
          <h2 id="discover-heading" className="font-display text-2xl font-bold">Discover</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STAR_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={starDiscoveryPath(d.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="types-heading">
          <h2 id="types-heading" className="font-display text-2xl font-bold">Browse by type</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {categories.map((c) => (
              <li key={c.category}>
                <Link href={starCategoryPath(c.category)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">
                  {c.label}<span className="text-xs text-faint">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="constellations-heading">
          <h2 id="constellations-heading" className="font-display text-2xl font-bold">Browse by constellation</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {constellations.map((c) => (
              <li key={c.id}>
                <Link href={constellationStarsPath(c.def.slug)} className="flex items-baseline justify-between gap-2 text-muted transition hover:text-fg">
                  <span>{c.def.name}</span>
                  <span className="text-xs text-faint">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-1.5">
            Stars are generated from the open <a href="https://www.astronexus.com/hyg" target="_blank" rel="noopener noreferrer" className="text-nebula underline-offset-4 hover:underline">HYG database</a> (a compilation of the ESA Hipparcos catalogue, the Yale Bright Star Catalogue, and the Gliese Catalogue of Nearby Stars), licensed CC BY-SA 4.0. Every value is real catalogue data; no measurements are invented. See the{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}
