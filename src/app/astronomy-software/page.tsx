import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SoftwareCards } from "@/components/astronomy-software/SoftwareCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astronomySoftwareDiscoveryPath } from "@/lib/routes";
import { CH_DISCOVERIES } from "@/app/astronomy-software/discovery";

const DESCRIPTION =
  "The software that astronomers and astrophotographers actually use — from the desktop to the telescope to the terminal. Desktop planetariums: Stellarium, KStars, Celestia, Cartes du Ciel, SkySafari. Imaging and acquisition: PixInsight, Siril, DeepSkyStacker, N.I.N.A., PHD2, ASCOM, INDI, Ekos. Scientific tools: IRAF, CASA, TOPCAT, SAOImage DS9, Aladin, AstroImageJ, Montage. Libraries: Skyfield, poliastro, Orekit. Reuses the Astropy ecosystem, the SPICE and JPL Horizons ephemerides, the data archives and standards (VizieR, SIMBAD, MAST, CDS, FITS, VOTable, the Virtual Observatory), the observing techniques, the observatories, and the equipment already in the graph. Only well-established facts — purpose and platforms — are stated; version numbers are omitted and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Astronomical Software Ecosystem", description: DESCRIPTION, path: ROUTES.astronomySoftware });

// Software, ephemerides, archives and standards already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "research_software:astropy",
  "research_software:astroquery",
  "ephemeris_system:spice-toolkit",
  "ephemeris_system:jpl-horizons",
  "data_archive:vizier",
  "data_archive:simbad",
  "data_standard:fits",
  "data_standard:votable",
  "vo_framework:the-virtual-observatory",
  "observing_technique:plate-solving",
  "observatory:alma",
  "observatory:very-large-array",
];

export default function AstronomySoftwareHubPage() {
  const e = engine.astronomySoftware;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astronomy Software", url: ROUTES.astronomySoftware },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astronomical Software Ecosystem", description: DESCRIPTION, url: ROUTES.astronomySoftware })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Encyclopedia · {e.count} entries · the tools of the trade</span>}
        title="Astronomical Software Ecosystem"
        lead="Modern astronomy runs on software. This is the ecosystem: the planetariums that show the sky, the suites that automate a night of imaging and process the results, the professional tools that calibrate and analyse data, and the libraries that compute positions and orbits. Each package is placed beside the techniques, archives, and instruments it works with."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the ecosystem</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CH_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={astronomySoftwareDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="desktop-heading">
          <h2 id="desktop-heading" className="font-display text-2xl font-bold">Desktop &amp; planetarium</h2>
          <div className="mt-4"><SoftwareCards records={e.desktop()} /></div>
        </section>

        <section aria-labelledby="imaging-heading">
          <h2 id="imaging-heading" className="font-display text-2xl font-bold">Imaging &amp; acquisition</h2>
          <div className="mt-4"><SoftwareCards records={[...e.imaging(), ...e.acquisition()]} /></div>
        </section>

        <section aria-labelledby="scientific-heading">
          <h2 id="scientific-heading" className="font-display text-2xl font-bold">Scientific tools</h2>
          <div className="mt-4"><SoftwareCards records={e.scientific()} /></div>
        </section>

        <section aria-labelledby="library-heading">
          <h2 id="library-heading" className="font-display text-2xl font-bold">Libraries &amp; toolkits</h2>
          <div className="mt-4"><SoftwareCards records={e.libraries()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The software, ephemerides, archives, and standards this ecosystem builds on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Astropy ecosystem, the SPICE and JPL Horizons ephemerides, the data archives and standards (VizieR, SIMBAD, MAST, CDS, FITS, VOTable, the Virtual Observatory), the observing techniques, and the observatories already in the graph. Only well-established facts — purpose and platforms — are stated; version numbers are omitted and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
