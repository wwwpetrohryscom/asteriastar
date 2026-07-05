import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GaCards } from "@/components/galactic-astronomy/GaCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galacticAstronomyDiscoveryPath } from "@/lib/routes";
import { BG_DISCOVERIES } from "@/app/galactic-astronomy/discovery";

const DESCRIPTION =
  "The anatomy and life of our Galaxy. The structure of the Milky Way: the thin and thick discs, the bulge and the bar, the stellar halo, the spiral arms, the galactic warp, the Galactic Centre and its central molecular zone, the hot corona, and the Sun's own neighbourhood. And its dynamics, archaeology, and fate: galactic rotation and the flat rotation curve that reveals dark matter, the stellar streams and radial migration that stir the disc, galactic archaeology with Gaia, the galactic magnetic field, the satellite galaxies the Milky Way is still accreting, and the coming collision with Andromeda. Reuses the platform's Milky Way, Sagittarius A*, the Local Group, the Magellanic Clouds, Andromeda and Triangulum, the dark-matter halo, the galaxy-rotation-curve method, the galaxy-merger process, Gaia and its DR3 survey, and the interstellar medium; only well-established astronomy is stated and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Galactic Astronomy & the Milky Way", description: DESCRIPTION, path: ROUTES.galacticAstronomy });

export default function GalacticAstronomyHubPage() {
  const e = engine.galacticAstronomy;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Galactic Astronomy", url: ROUTES.galacticAstronomy },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Galactic Astronomy & the Milky Way", description: DESCRIPTION, url: ROUTES.galacticAstronomy })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Encyclopedia · {e.count} entries · {e.structureCount} galactic structures</span>} title="Galactic Astronomy &amp; the Milky Way" lead="We live inside the object we most want to understand. This is the anatomy of the Milky Way — its discs and bulge, its bar and spiral arms, the black hole at its heart — and the story of how it turns, how it remembers its past in the motions of its stars, and how it will one day merge with Andromeda." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the Galaxy</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BG_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={galacticAstronomyDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-aurora hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="structure-heading">
          <h2 id="structure-heading" className="font-display text-2xl font-bold">The anatomy of the Galaxy</h2>
          <div className="mt-4"><GaCards records={e.structure()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each galactic structure and dynamical phenomenon is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Milky Way, Sagittarius A*, the Local Group, the Magellanic Clouds, Andromeda, the dark-matter halo, the galaxy-rotation-curve method, the galaxy-merger process, Gaia, and the interstellar medium already in the graph. Curated from NASA, ESO, and the galactic-astronomy literature. Only well-established astronomy is stated. See{" "}<Link href="/transparency/source-quality" className="text-aurora underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
