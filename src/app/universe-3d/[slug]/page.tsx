import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SceneDetail } from "@/components/universe-3d/SceneDetail";
import { StaticUniverse } from "@/components/universe-3d/StaticUniverse";
import { UniverseViewer } from "@/components/universe-3d/UniverseViewer";
import { SceneObjectTable } from "@/components/universe-3d/SceneObjectTable";
import { engine } from "@/platform/data-engine";
import { entityGraphPath, getEntityById } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { universeScenePath } from "@/lib/routes";
import { buildSolarSystemScene, buildStellarNeighborhoodScene, buildFeaturedConstellationScene } from "@/lib/universe-3d/scene-data";
import type { Scene3D } from "@/lib/universe-3d/projection3d";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.webglUniverse.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/universe-3d/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.webglUniverse.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: universeScenePath(slug) });
}

/** Build the real interactive scene for an interactive slug (server-side, from measured data). */
function sceneFor(slug: string): { scene: Scene3D; unit: string; valueLabel: string } | null {
  if (slug === "solar-system") {
    const scene = buildSolarSystemScene();
    return { scene, unit: "AU", valueLabel: "Semi-major axis (AU)" };
  }
  if (slug === "stars") {
    const scene = buildStellarNeighborhoodScene(160);
    return { scene, unit: "ly", valueLabel: "Distance (light-years)" };
  }
  if (slug === "constellations") {
    const { scene } = buildFeaturedConstellationScene();
    return { scene, unit: "ly", valueLabel: "Distance (light-years)" };
  }
  return null;
}

/** Descriptive content for a scene with no numeric geometry — the reused structure entities, honestly. */
function DescriptiveStructures({ ids, heading }: { ids: string[]; heading: string }) {
  const items = ids
    .map((id) => {
      const e = getEntityById(id);
      return e ? { id, name: e.name, href: entityGraphPath(e), description: e.description } : null;
    })
    .filter(Boolean) as { id: string; name: string; href: string; description?: string }[];
  if (!items.length) return null;
  return (
    <section aria-labelledby="structures">
      <h2 id="structures" className="font-display text-2xl font-bold">{heading}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((x) => (
          <li key={x.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <Link href={x.href} className="font-display text-base font-semibold text-fg hover:text-nebula">{x.name}</Link>
            {x.description ? <p className="mt-1 text-sm leading-relaxed text-muted line-clamp-3">{x.description}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function UniverseScenePage({ params }: PageProps<"/universe-3d/[slug]">) {
  const { slug } = await params;
  const d = engine.webglUniverse.resolveEntry(slug);
  if (!d) notFound();
  const r = d.record;

  // Interactive scenes: real 3D viewer (with the static SVG as its no-JS fallback) + accessibility table.
  if (r.interactive) {
    const built = sceneFor(slug);
    if (built) {
      const { scene, unit, valueLabel } = built;
      const tableRows = scene.points.filter((p) => p.id !== "body:the-sun" && p.id !== "star:sun");
      return (
        <SceneDetail
          d={d}
          viewer={<UniverseViewer scene={scene} fallback={<StaticUniverse scene={scene} ariaLabel={`${r.name} — ${scene.points.length} objects at their measured positions`} />} />}
          table={
            <SceneObjectTable
              points={tableRows}
              unit={unit}
              valueLabel={valueLabel}
              caption={`${tableRows.length} objects in this scene, with their measured ${unit === "AU" ? "orbital distance" : "distance"}.`}
            />
          }
        />
      );
    }
  }

  // Descriptive scenes: no numeric geometry exists, so show the real reused structures — no fabricated scene.
  const descriptive =
    slug === "milky-way" ? (
      <DescriptiveStructures ids={engine.galacticAstronomy.structure().map((s) => s.id)} heading="The structure of the Galaxy" />
    ) : slug === "local-group" ? (
      <DescriptiveStructures
        ids={[...engine.galaxies.structures().map((s) => s.id), "galaxy:milky-way", "galaxy:andromeda-galaxy"]}
        heading="The Local Group"
      />
    ) : undefined;

  return <SceneDetail d={d} descriptive={descriptive} />;
}
