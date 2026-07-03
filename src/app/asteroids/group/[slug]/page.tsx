import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PopulationView } from "@/components/asteroids/PopulationView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { asteroidGroupPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.asteroids.groups().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/group/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.asteroids.resolveGroup(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: asteroidGroupPath(slug) });
}

export default async function AsteroidGroupPage({ params }: PageProps<"/asteroids/group/[slug]">) {
  const { slug } = await params;
  const d = engine.asteroids.resolveGroup(slug);
  if (!d) notFound();
  return <PopulationView d={d} kindLabel="Minor-planet group" url={asteroidGroupPath(slug)} />;
}
