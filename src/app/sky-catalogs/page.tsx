import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogCards } from "@/components/sky-catalogs/CatalogCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyCatalogsDiscoveryPath } from "@/lib/routes";
import { CD_DISCOVERIES } from "@/app/sky-catalogs/discovery";

const DESCRIPTION =
  "The professional catalogue layer of the sky — the databases and designation systems by which astronomers name and find objects. New first-class catalogues: Caldwell, Barnard, Sharpless (Sh2), Abell, PGC, UGC, Gliese, Tycho-2, SAO, GCVS, WDS, LHS, Wolf, and the Bonner Durchmusterung — grouped into catalog families (deep-sky visual, the Dreyer general catalogues, nebulae, galaxies, astrometric, nearby-star, and variable & double star) — plus the Bayer, Flamsteed, and variable-star designation systems. Reuses the eleven existing catalogue entities (Messier, NGC, IC, Henry Draper, Hipparcos, Gaia, the Harvard/Yerkes classifications), the sky surveys, the data archives (CDS, SIMBAD, VizieR, NED), the compiling astronomers, and the Gaia telescope. Only well-established catalogue facts are stated; unknown counts and epochs are left empty and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Astronomical Catalogs & Professional Sky Databases", description: DESCRIPTION, path: ROUTES.skyCatalogs });

// Catalogue infrastructure already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "catalog:messier",
  "catalog:ngc",
  "catalog:index-catalogue",
  "catalog:henry-draper-catalogue",
  "catalog:hipparcos-catalogue",
  "catalog:gaia-catalogue",
  "data_archive:cds",
  "data_archive:simbad",
  "data_archive:vizier",
  "data_archive:ned",
  "space_telescope:gaia",
  "sky_survey:gaia-dr3",
];

export default function SkyCatalogsHubPage() {
  const e = engine.skyCatalogs;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Sky Catalogues", url: ROUTES.skyCatalogs },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astronomical Catalogs & Professional Sky Databases", description: DESCRIPTION, url: ROUTES.skyCatalogs })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>Encyclopedia · {e.count} entries · how the sky is named and indexed</span>}
        title="Astronomical Catalogs & Professional Sky Databases"
        lead="Every object in the sky has a name — usually many. This is the professional catalogue layer: the great reference lists from the Bonner Durchmusterung to Gaia, the families they fall into, and the designation systems, from Bayer letters to variable-star names, that astronomers use to point unambiguously at a star, cluster, or galaxy."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the catalogue layer</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CD_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={skyCatalogsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-white hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="catalogues-heading">
          <h2 id="catalogues-heading" className="font-display text-2xl font-bold">Professional catalogues</h2>
          <div className="mt-4"><CatalogCards records={e.catalogs()} /></div>
        </section>

        <section aria-labelledby="families-heading">
          <h2 id="families-heading" className="font-display text-2xl font-bold">Catalog families</h2>
          <div className="mt-4"><CatalogCards records={e.families()} /></div>
        </section>

        <section aria-labelledby="designations-heading">
          <h2 id="designations-heading" className="font-display text-2xl font-bold">Designation systems</h2>
          <div className="mt-4"><CatalogCards records={e.designations()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The catalogues, archives, surveys, and telescope this layer builds on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the existing catalogue entities (Messier, NGC, IC, Henry Draper, Hipparcos, Gaia), the sky surveys, the data archives (CDS, SIMBAD, VizieR, NED), the compiling astronomers, and the Gaia telescope already in the graph. Only well-established catalogue facts are stated; uncertain object counts and epochs are left empty rather than invented, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-white underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
