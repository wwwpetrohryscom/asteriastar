import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReferenceCards } from "@/components/reference-systems/ReferenceCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, referenceSystemsDiscoveryPath } from "@/lib/routes";
import { CF_DISCOVERIES } from "@/app/reference-systems/discovery";

const DESCRIPTION =
  "The astrometry and time foundation — how astronomers say exactly where and when. New coordinate systems: right ascension and declination, the equatorial, galactic, ecliptic, horizontal, and supergalactic systems, and the celestial sphere. New reference frames: FK4, FK5, and the quasar-based ICRF3. The Julian date. New astrometric effects: precession, nutation, the aberration of light, atmospheric refraction, light-time correction, and the Earth orientation parameters. And the IAU and IERS as the defining bodies. Reuses the existing frames (ICRS, BCRS, GCRS, J2000, B1950, the ecliptic), the time scales (TAI, UTC, UT1, TT, TDB, GPS, sidereal, the leap second), the parallax and proper-motion methods, the ephemeris systems, and Gaia and Hipparcos. Only well-established, standard definitions are stated; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Astronomical Coordinates, Time & Reference Systems", description: DESCRIPTION, path: ROUTES.referenceSystems });

// Frames, time scales and methods already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "reference_frame:icrs",
  "reference_frame:j2000",
  "reference_frame:b1950",
  "time_standard:tai",
  "time_standard:utc",
  "time_standard:ut1",
  "time_standard:sidereal-time",
  "astronomy_method:parallax",
  "astronomy_method:proper-motion",
  "space_telescope:gaia",
  "satellite:hipparcos",
  "ephemeris_system:spice-toolkit",
];

export default function ReferenceSystemsHubPage() {
  const e = engine.referenceSystems;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Coordinates & Time", url: ROUTES.referenceSystems },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astronomical Coordinates, Time & Reference Systems", description: DESCRIPTION, url: ROUTES.referenceSystems })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>Encyclopedia · {e.count} entries · saying exactly where and when</span>}
        title="Astronomical Coordinates, Time & Reference Systems"
        lead="Pointing at a star precisely takes more than a name. It takes a coordinate system to give its place, a reference frame and epoch to anchor that place against a slowly turning sky, a time scale to say when, and a set of corrections — precession, aberration, refraction — for all the ways the measured position differs from the true one. This is the astrometric foundation beneath every catalogue and observation."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the foundation</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CF_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={referenceSystemsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-comet hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="coords-heading">
          <h2 id="coords-heading" className="font-display text-2xl font-bold">Coordinate systems</h2>
          <div className="mt-4"><ReferenceCards records={e.coordinates()} /></div>
        </section>

        <section aria-labelledby="frames-heading">
          <h2 id="frames-heading" className="font-display text-2xl font-bold">Reference frames</h2>
          <div className="mt-4"><ReferenceCards records={e.frames()} /></div>
        </section>

        <section aria-labelledby="time-heading">
          <h2 id="time-heading" className="font-display text-2xl font-bold">Time representation</h2>
          <div className="mt-4"><ReferenceCards records={e.timescales()} /></div>
        </section>

        <section aria-labelledby="effects-heading">
          <h2 id="effects-heading" className="font-display text-2xl font-bold">Astrometric effects</h2>
          <div className="mt-4"><ReferenceCards records={e.effects()} /></div>
        </section>

        <section aria-labelledby="bodies-heading">
          <h2 id="bodies-heading" className="font-display text-2xl font-bold">Defining bodies</h2>
          <div className="mt-4"><ReferenceCards records={e.bodies()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The frames, time scales, methods, and missions this foundation builds on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the existing reference frames (ICRS, BCRS, GCRS, J2000, B1950, the ecliptic), the time scales (TAI, UTC, UT1, TT, TDB, GPS, sidereal, the leap second), the parallax and proper-motion methods, the ephemeris systems, and Gaia and Hipparcos already in the graph. Only well-established, standard definitions are stated; values appear only where firm, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-comet underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
