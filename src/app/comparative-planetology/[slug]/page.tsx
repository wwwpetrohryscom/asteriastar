import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CpDetail } from "@/components/comparative-planetology/CpDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { comparativePlanetologyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.comparativePlanetology.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comparative-planetology/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.comparativePlanetology.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: comparativePlanetologyPath(slug) });
}

export default async function ComparativePlanetologyPage({ params }: PageProps<"/comparative-planetology/[slug]">) {
  const { slug } = await params;
  const d = engine.comparativePlanetology.resolveEntry(slug);
  if (!d) notFound();
  return <CpDetail d={d} />;
}
