import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtlasDetail } from "@/components/sky-atlas/AtlasDetail";
import { SkyChart } from "@/components/sky-atlas/SkyChart";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { skyAtlasPath } from "@/lib/routes";
import { starsToPoints, deepSkyToPoints } from "@/lib/sky-atlas/chart-data";
import type { SkyPoint } from "@/lib/sky-atlas/projection";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.skyAtlas.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sky-atlas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.skyAtlas.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: skyAtlasPath(slug) });
}

type StarRec = { id: string; name: string; ra?: number; dec?: number; apparentMagnitude?: number };
type DeepSkyRec = { id?: string; entityId?: string; name: string; raHours?: number; decDeg?: number; apparentMagnitude?: number };

/** Build the real chart points and caption for a sky-chart view, drawn from measured coordinates. */
function chartFor(slug: string, dataSource: string | undefined): { points: SkyPoint[]; caption: string } | null {
  // Star-backed charts. The constellation atlas traces the 88 patterns with the same catalogued stars.
  if (dataSource === "engine.star" || dataSource === "engine.constellations") {
    const all = engine.star.all() as StarRec[];
    const bright = slug === "bright-star-map"
      ? all.filter((r) => typeof r.apparentMagnitude === "number" && (r.apparentMagnitude as number) <= 4)
      : all;
    const points = starsToPoints(bright);
    const suffix = slug === "constellation-atlas" ? ", tracing the 88 constellations" : "";
    return { points, caption: `${points.length} catalogued stars plotted at their measured right ascension and declination${suffix} (equirectangular projection; dot size scales with apparent magnitude).` };
  }
  if (dataSource === "engine.deepSky") {
    const isMessier = slug === "messier-atlas";
    const records = (isMessier ? engine.deepSky.byCatalog("messier") : engine.deepSky.all()) as DeepSkyRec[];
    const points = deepSkyToPoints(records);
    const noun = isMessier ? "Messier objects" : "catalogued deep-sky objects";
    return { points, caption: `${points.length} ${noun} plotted at their measured coordinates (equirectangular projection).` };
  }
  return null;
}

export default async function SkyAtlasPage({ params }: PageProps<"/sky-atlas/[slug]">) {
  const { slug } = await params;
  const d = engine.skyAtlas.resolveEntry(slug);
  if (!d) notFound();
  const r = d.record;
  const chartData = r.kind === "view" && r.renderMode === "sky-chart" ? chartFor(slug, r.dataSource) : null;
  return (
    <AtlasDetail
      d={d}
      chart={chartData ? <SkyChart points={chartData.points} /> : undefined}
      chartCaption={chartData?.caption}
    />
  );
}
