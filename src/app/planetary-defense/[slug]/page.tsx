import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PdDetail } from "@/components/planetary-defense/PdDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { planetaryDefensePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.planetaryDefense.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/planetary-defense/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.planetaryDefense.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: planetaryDefensePath(slug) });
}

export default async function PlanetaryDefensePage({ params }: PageProps<"/planetary-defense/[slug]">) {
  const { slug } = await params;
  const d = engine.planetaryDefense.resolveEntry(slug);
  if (!d) notFound();
  return <PdDetail d={d} />;
}
