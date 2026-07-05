import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GaDetail } from "@/components/galactic-astronomy/GaDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { galacticAstronomyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.galacticAstronomy.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/galactic-astronomy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.galacticAstronomy.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: galacticAstronomyPath(slug) });
}

export default async function GalacticAstronomyPage({ params }: PageProps<"/galactic-astronomy/[slug]">) {
  const { slug } = await params;
  const d = engine.galacticAstronomy.resolveEntry(slug);
  if (!d) notFound();
  return <GaDetail d={d} />;
}
