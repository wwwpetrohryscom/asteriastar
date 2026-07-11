import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConstellationsTable } from "@/components/constellations/ConstellationsTable";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, constellationDiscoveryPath, constellationFamilyPath, constellationSeasonPath } from "@/lib/routes";
import { CONSTELLATION_DISCOVERIES } from "@/app/constellations/discovery";

const DESCRIPTION =
  "A graph-driven encyclopedia of all 88 official IAU constellations — their stars, deep-sky objects, exoplanets, meteor-shower radiants, mythology, families, and seasonal visibility. Constellation data from the IAU; connections reuse the platform's real star, deep-sky, and meteor-shower entities, with unknown values left blank.";

export const metadata: Metadata = buildMetadata({ title: "Constellations", description: DESCRIPTION, path: ROUTES.constellations });

export default function ConstellationsHubPage() {
  const e = engine.constellations;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Constellations", url: ROUTES.constellations },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Constellations", description: DESCRIPTION, url: ROUTES.constellations })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Encyclopedia · all 88 IAU constellations</span>}
        title="Constellations"
        lead="The 88 official constellations that map the entire sky — connected to their brightest stars, deep-sky objects, exoplanets, meteor showers, families, and mythology through the Knowledge Graph."
      />

      <Container className="mt-8 mb-14 space-y-10">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by theme</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONSTELLATION_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={constellationDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} constellations</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="families-heading">
          <h2 id="families-heading" className="font-display text-2xl font-bold">Constellation families</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {e.families().map((f) => (
              <li key={f.slug} className="scientific-card p-4">
                <Link href={constellationFamilyPath(f.slug)} className="font-medium text-fg hover:text-nasa">{f.name}</Link>
                <div className="text-xs text-faint">{e.byFamily(f.slug).length} constellations</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="seasons-heading">
          <h2 id="seasons-heading" className="font-display text-2xl font-bold">The seasonal sky</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {e.seasons().map((s) => (
              <li key={s.slug} className="scientific-card p-4">
                <Link href={constellationSeasonPath(s.slug)} className="font-medium text-fg hover:text-nasa">{s.name}</Link>
                <div className="text-xs text-faint">{s.months}</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="zodiac-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="zodiac-heading" className="font-display text-2xl font-bold">The zodiac</h2>
            <Link href={constellationDiscoveryPath("all-constellations")} className="text-sm text-nasa underline-offset-4 hover:underline">All 88 constellations →</Link>
          </div>
          <div className="mt-4"><ConstellationsTable records={e.zodiac()} /></div>
        </section>

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each constellation is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Boundaries, areas, and designations follow the International Astronomical Union; stars, deep-sky objects, exoplanets, and meteor showers are the platform&apos;s existing, source-backed entities — reused, never duplicated. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
