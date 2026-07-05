import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GxDetail } from "@/components/galaxies/GxDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { galaxiesPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.galaxies.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/galaxies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.galaxies.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: galaxiesPath(slug) });
}

export default async function GalaxiesPage({ params }: PageProps<"/galaxies/[slug]">) {
  const { slug } = await params;
  const d = engine.galaxies.resolveEntry(slug);
  if (!d) notFound();
  return <GxDetail d={d} />;
}
