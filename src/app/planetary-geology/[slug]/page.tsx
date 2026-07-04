import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeoDetail } from "@/components/planetary-geology/GeoDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { planetaryGeologyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.planetaryGeology.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/planetary-geology/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.planetaryGeology.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: planetaryGeologyPath(slug) });
}

export default async function PlanetaryGeologyPage({ params }: PageProps<"/planetary-geology/[slug]">) {
  const { slug } = await params;
  const d = engine.planetaryGeology.resolveEntry(slug);
  if (!d) notFound();
  return <GeoDetail d={d} />;
}
