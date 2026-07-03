import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { AsteroidsCards } from "@/components/asteroids/AsteroidsCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, asteroidImpactPath, asteroidDiscoveryPath } from "@/lib/routes";

const DESCRIPTION =
  "How near-Earth asteroids are discovered, tracked, and — should it ever prove necessary — deflected. A factual overview of survey telescopes, the Torino and Palermo hazard scales, the international coordination offices, and the deflection techniques demonstrated by DART and studied by Hera. Described as a scientific monitoring effort, without alarm.";

export const metadata: Metadata = buildMetadata({ title: "Planetary Defense", description: DESCRIPTION, path: "/asteroids/planetary-defense" });

function surveyLink(id: string, fallback: string) {
  const e = getEntityById(id);
  return e ? <Link href={entityGraphPath(e)} className="text-nebula underline-offset-4 hover:underline">{e.name}</Link> : <span>{fallback}</span>;
}

export default function PlanetaryDefensePage() {
  const pd = engine.asteroids.resolvePlanetaryDefense();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Asteroids", url: ROUTES.asteroids },
    { name: "Planetary Defense", url: "/asteroids/planetary-defense" },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Planetary Defense", description: DESCRIPTION, url: "/asteroids/planetary-defense" })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Asteroids · knowledge layer</span>}
        title="Planetary Defense"
        lead="Finding, tracking, and — if ever needed — deflecting the near-Earth asteroids. A routine scientific monitoring effort, described factually and without alarm."
      />

      <Container className="mt-8 mb-14 space-y-10">
        <section aria-labelledby="finding">
          <h2 id="finding" className="font-display text-2xl font-bold">Finding near-Earth objects</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Dedicated survey telescopes scan the sky nightly for moving points of light and compute the orbits of everything they find. The most productive include {surveyLink("observatory:pan-starrs", "Pan-STARRS")} in Hawaiʻi, the Catalina Sky Survey in Arizona, and ATLAS, with the {surveyLink("observatory:vera-rubin-observatory", "Vera C. Rubin Observatory")} and NASA&apos;s planned NEO Surveyor infrared space telescope expected to greatly expand the catalogue. The overall effort traces back to the 1990s <em>Spaceguard</em> goal of cataloguing the large near-Earth asteroids.
          </p>
        </section>

        <section aria-labelledby="risk">
          <h2 id="risk" className="font-display text-2xl font-bold">Assessing risk</h2>
          <p className="mt-3 leading-relaxed text-muted">
            When a new object&apos;s orbit is uncertain, astronomers estimate its impact probability and communicate it on two scales. The <strong>Torino Scale</strong> is a 0–10 public-facing scale combining impact probability and energy; almost every object sits at 0, and values are routinely revised down to 0 as more observations refine the orbit. The <strong>Palermo Scale</strong> is a finer logarithmic scale used by specialists to compare a hazard against the background impact risk. These are communication tools, not predictions — objects are added and then removed as tracking improves, which is the system working as intended.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href={asteroidDiscoveryPath("potentially-hazardous")} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-nebula hover:border-white/25">Potentially hazardous asteroids →</Link>
            <Link href={asteroidDiscoveryPath("near-earth-objects")} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-nebula hover:border-white/25">Near-Earth objects →</Link>
          </div>
        </section>

        <section aria-labelledby="coordination">
          <h2 id="coordination" className="font-display text-2xl font-bold">Coordination</h2>
          <p className="mt-3 leading-relaxed text-muted">
            NASA&apos;s Planetary Defense Coordination Office (PDCO) leads U.S. efforts, working with ESA&apos;s Space Safety programme and, internationally, with the UN-endorsed International Asteroid Warning Network (IAWN) and Space Mission Planning Advisory Group (SMPAG). Orbits and observations are collected by the IAU Minor Planet Center, and impact-monitoring systems at NASA/JPL&apos;s CNEOS and ESA continuously reassess the known catalogue.
          </p>
        </section>

        <section aria-labelledby="deflection">
          <h2 id="deflection" className="font-display text-2xl font-bold">Deflection techniques</h2>
          <ul className="mt-3 space-y-3 text-muted">
            <li><strong className="text-fg">Kinetic impact</strong> — striking an asteroid with a spacecraft to nudge its orbit. This was demonstrated in 2022, when NASA&apos;s DART deliberately hit the moonlet Dimorphos and measurably shortened its orbit around Didymos — the first time humanity changed the motion of a celestial body. ESA&apos;s Hera, launched in 2024, will survey the aftermath in detail.</li>
            <li><strong className="text-fg">Gravity tractor</strong> — a spacecraft station-keeping near an asteroid for years, using its own gravity to slowly tug the asteroid onto a new path. A concept, not yet demonstrated.</li>
            <li><strong className="text-fg">Nuclear deflection</strong> — using a stand-off nuclear detonation to vaporise surface material and push an asteroid, considered only for large or short-warning cases. This is a studied concept, clearly theoretical, and has never been tested.</li>
          </ul>
          <p className="mt-3 text-sm text-faint">The right technique depends on the object&apos;s size and how many years of warning are available — which is why early discovery is the foundation of planetary defense.</p>
        </section>

        {pd.deflectionTargets.length ? (
          <section aria-labelledby="targets">
            <h2 id="targets" className="font-display text-2xl font-bold">Deflection-test bodies</h2>
            <p className="mt-1 text-sm text-faint">The bodies at the centre of the DART and Hera planetary-defense missions.</p>
            <div className="mt-3"><AsteroidsCards records={pd.deflectionTargets} /></div>
          </section>
        ) : null}

        <section aria-labelledby="phas">
          <h2 id="phas" className="font-display text-2xl font-bold">Potentially hazardous asteroids</h2>
          <p className="mt-1 text-sm text-faint">Modelled near-Earth asteroids meeting the objective PHA size-and-distance criterion — a monitoring category, not a prediction of impact.</p>
          <div className="mt-3"><AsteroidsCards records={pd.potentiallyHazardous} /></div>
        </section>

        <section aria-labelledby="impacts">
          <h2 id="impacts" className="font-display text-2xl font-bold">Impact history</h2>
          <p className="mt-1 text-sm text-faint">Well-studied past impacts — the reason the surveys exist.</p>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {pd.impactEvents.map((i) => (
              <li key={i.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={asteroidImpactPath(i.slug)} className="font-medium text-fg hover:text-nebula">{i.name}</Link>
                {i.impactDate && <div className="mt-1 text-xs text-faint">{i.impactDate}</div>}
              </li>
            ))}
          </ul>
        </section>

        <SourceList keys={["nasa", "esa", "jpl"]} title="Sources" />
      </Container>
    </>
  );
}
