import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PopulationView } from "@/components/asteroids/PopulationView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { asteroidNearEarthPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.asteroids.neoClasses().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/near-earth/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.asteroids.resolveNEO(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: asteroidNearEarthPath(slug) });
}

export default async function AsteroidNearEarthPage({ params }: PageProps<"/asteroids/near-earth/[slug]">) {
  const { slug } = await params;
  const d = engine.asteroids.resolveNEO(slug);
  if (!d) notFound();
  return <PopulationView d={d} kindLabel="Near-Earth object class" url={asteroidNearEarthPath(slug)} />;
}
