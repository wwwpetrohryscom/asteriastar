import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PopulationView } from "@/components/asteroids/PopulationView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { asteroidResonancePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.asteroids.resonances().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/resonance/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.asteroids.resolveResonance(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: asteroidResonancePath(slug) });
}

export default async function AsteroidResonancePage({ params }: PageProps<"/asteroids/resonance/[slug]">) {
  const { slug } = await params;
  const d = engine.asteroids.resolveResonance(slug);
  if (!d) notFound();
  return <PopulationView d={d} kindLabel="Orbital resonance" url={asteroidResonancePath(slug)} />;
}
