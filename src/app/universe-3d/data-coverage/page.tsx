import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { engine } from "@/platform/data-engine";
import { COVERAGE_LABEL } from "@/knowledge-graph/data/webgl-universe-catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, universeScenePath } from "@/lib/routes";
import { computeUniverseCoverage } from "@/lib/universe-3d/scene-data";

const DESCRIPTION =
  "An honest accounting of what the 3D Universe can and cannot show. Where the catalogue carries measured distances and coordinates, objects are placed in true 3D; where it carries only directions or descriptive scale labels, the scene says so and places nothing at a guessed position.";

export const metadata: Metadata = buildMetadata({ title: "3D Universe — Data Coverage", description: DESCRIPTION, path: `${ROUTES.universe3d}/data-coverage` });

export default function DataCoveragePage() {
  const c = computeUniverseCoverage();
  const scenes = engine.webglUniverse.all();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "3D Universe", url: ROUTES.universe3d },
    { name: "Data coverage", url: `${ROUTES.universe3d}/data-coverage` },
  ];
  const rows: { label: string; value: string; note: string }[] = [
    { label: "Stars with a measured distance", value: `${c.starsWithDistance.toLocaleString()} of ${c.starsTotal.toLocaleString()}`, note: "Placed in true 3D in the stellar-neighbourhood scene (parallax distance)." },
    { label: "Stars without a measured distance", value: c.starsWithoutDistance.toLocaleString(), note: "Excluded from every distance-true scene — never placed at a guessed position." },
    { label: "Stars with a measured direction", value: c.starsWithDirection.toLocaleString(), note: "Right ascension and declination — enough for the celestial-sphere (direction-only) scenes." },
    { label: "Deep-sky objects with a direction", value: `${c.deepSkyWithDirection.toLocaleString()} of ${c.deepSkyTotal.toLocaleString()}`, note: "Direction and angular size only." },
    { label: "Deep-sky objects with a distance", value: c.deepSkyWithDistance.toLocaleString(), note: "The catalogue carries no line-of-sight distance for deep-sky objects, so none is placed in true 3D." },
    { label: "Planets with a real orbit", value: c.planetsWithOrbit.toLocaleString(), note: "Real semi-major axes drive the to-scale Solar System scene." },
    { label: "Galactic structures (Milky Way)", value: c.galacticStructures.toLocaleString(), note: "Descriptive only — no numeric galactic geometry, so no galaxy-scale scene is fabricated." },
    { label: "Cosmic structures (Local Group +)", value: c.galaxyStructures.toLocaleString(), note: "Descriptive scale labels only — no numeric inter-galactic distances." },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Transparency · 3D Universe</span>}
        title="What can be shown in true 3D"
        lead="A three-dimensional universe is only as honest as its coordinates. This page states exactly which objects have measured positions and distances — and which do not — so every scene can be read for what it is."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="counts">
          <h2 id="counts" className="font-display text-2xl font-bold">The measured data</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-faint">
                  <th scope="col" className="px-4 py-2 font-medium">Measure</th>
                  <th scope="col" className="px-4 py-2 font-medium">Count</th>
                  <th scope="col" className="px-4 py-2 font-medium">What the scenes do with it</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-white/5">
                    <td className="px-4 py-2 text-fg">{r.label}</td>
                    <td className="px-4 py-2 font-medium text-nasa whitespace-nowrap">{r.value}</td>
                    <td className="px-4 py-2 text-muted">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section aria-labelledby="modes">
          <h2 id="modes" className="font-display text-2xl font-bold">How each scene is drawn</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {scenes.map((s) => (
              <li key={s.id} className="scientific-card p-4">
                <div className="flex items-center gap-2">
                  <Link href={universeScenePath(s.slug)} className="font-display text-base font-semibold text-fg hover:text-nasa">{s.name}</Link>
                  {s.interactive ? (
                    <span className="rounded-full border border-nasa/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-nasa">Interactive</span>
                  ) : (
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-faint">Descriptive</span>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-muted">{COVERAGE_LABEL[s.coverageMode]}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.coordinateBasis}</p>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="promise" className="scientific-card p-5">
          <h2 id="promise" className="font-display text-base font-semibold text-fg">The rule</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            No position, distance, or coordinate is ever fabricated. An object with no measured distance is never placed in a distance-true scene; a structure with only a descriptive scale label is never given invented coordinates. See{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
