import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExoScienceDetail } from "@/components/exoplanet-science/ExoScienceDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { exoplanetSciencePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.exoplanetScience.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exoplanet-science/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.exoplanetScience.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: exoplanetSciencePath(slug) });
}

export default async function ExoplanetScienceEntryPage({ params }: PageProps<"/exoplanet-science/[slug]">) {
  const { slug } = await params;
  const d = engine.exoplanetScience.resolveEntry(slug);
  if (!d) notFound();
  return <ExoScienceDetail d={d} />;
}
