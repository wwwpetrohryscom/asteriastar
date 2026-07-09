import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TechniqueDetail } from "@/components/observation-techniques/TechniqueDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { observationTechniquesPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.observationTechniques.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observation-techniques/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.observationTechniques.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: observationTechniquesPath(slug) });
}

export default async function ObservationTechniqueEntryPage({ params }: PageProps<"/observation-techniques/[slug]">) {
  const { slug } = await params;
  const d = engine.observationTechniques.resolveEntry(slug);
  if (!d) notFound();
  return <TechniqueDetail d={d} />;
}
