import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CmCards } from "@/components/celestial-mechanics/CmCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, celestialMechanicsDiscoveryPath } from "@/lib/routes";
import { BE_DISCOVERIES } from "@/app/celestial-mechanics/discovery";

const DESCRIPTION =
  "The mathematical foundation of how bodies move and how time is kept. The orbital mechanics: Kepler's laws and Newtonian gravity, the restricted three-body problem and N-body dynamics, the Lagrange points, the Hill sphere and Roche limit, orbital perturbations, mean-motion and secular resonances, tidal evolution and spin-orbit coupling, and orbital elements. The reference frames and epochs against which positions are measured: the ICRS, the barycentric and geocentric systems, the ecliptic, and the J2000 and B1950 epochs. The ephemeris systems that give the positions of Solar System bodies: the JPL Development Ephemeris, the SPICE toolkit, and Horizons. And the scales of astronomical time: Terrestrial and Barycentric Dynamical Time, UT1 and the leap second, sidereal and solar time. Reuses the platform's universal-gravitation theory, Kepler and Newton, JPL, the Jupiter resonances, the TAI and UTC standards, the precession discovery, and JWST; only well-established constants are stated and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Celestial Mechanics & Timekeeping", description: DESCRIPTION, path: ROUTES.celestialMechanics });

export default function CelestialMechanicsHubPage() {
  const e = engine.celestialMechanics;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Celestial Mechanics", url: ROUTES.celestialMechanics },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Celestial Mechanics & Timekeeping", description: DESCRIPTION, url: ROUTES.celestialMechanics })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Encyclopedia · {e.count} entries · {e.dynamicsCount} orbital-mechanics concepts</span>} title="Celestial Mechanics &amp; Timekeeping" lead="Beneath every predicted eclipse, every spacecraft trajectory, and every star chart lies the same mathematics — the laws that govern how bodies fall around one another, and the careful conventions that pin down where a thing is and when. This is the exacting foundation that turns the moving sky into something we can compute." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore celestial mechanics</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BE_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={celestialMechanicsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-halo hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="dynamics-heading">
          <h2 id="dynamics-heading" className="font-display text-2xl font-bold">The mechanics of orbits</h2>
          <div className="mt-4"><CmCards records={e.dynamics()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each orbital-mechanics concept, reference frame, ephemeris system, and time standard is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the universal-gravitation theory, Kepler and Newton, JPL, the Jupiter resonances, the TAI and UTC standards, the precession discovery, and JWST already in the graph. Curated from JPL, the IAU, and the US Naval Observatory. Only well-established constants are stated. See{" "}<Link href="/transparency/source-quality" className="text-halo underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
