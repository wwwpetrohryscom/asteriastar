import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PopulationView } from "@/components/asteroids/PopulationView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { asteroidFamilyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.asteroids.families().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/family/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.asteroids.resolveFamily(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: asteroidFamilyPath(slug) });
}

export default async function AsteroidFamilyPage({ params }: PageProps<"/asteroids/family/[slug]">) {
  const { slug } = await params;
  const d = engine.asteroids.resolveFamily(slug);
  if (!d) notFound();
  return <PopulationView d={d} kindLabel="Asteroid family" url={asteroidFamilyPath(slug)} />;
}
