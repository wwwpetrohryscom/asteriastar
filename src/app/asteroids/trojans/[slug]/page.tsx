import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PopulationView } from "@/components/asteroids/PopulationView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { asteroidTrojanPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.asteroids.trojans().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/trojans/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.asteroids.resolveTrojan(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: asteroidTrojanPath(slug) });
}

export default async function AsteroidTrojanPage({ params }: PageProps<"/asteroids/trojans/[slug]">) {
  const { slug } = await params;
  const d = engine.asteroids.resolveTrojan(slug);
  if (!d) notFound();
  return <PopulationView d={d} kindLabel="Trojan group" url={asteroidTrojanPath(slug)} />;
}
