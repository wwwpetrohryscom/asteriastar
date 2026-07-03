import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeteoriteEventView } from "@/components/meteorites/MeteoriteEventView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { meteoriteImpactStructurePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.meteorites.structures().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meteorites/impact-structure/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.meteorites.resolveImpact(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: meteoriteImpactStructurePath(slug) });
}

export default async function ImpactStructurePage({ params }: PageProps<"/meteorites/impact-structure/[slug]">) {
  const { slug } = await params;
  const d = engine.meteorites.resolveImpact(slug);
  if (!d) notFound();
  return <MeteoriteEventView d={d} kindLabel="Impact structure" url={meteoriteImpactStructurePath(slug)} />;
}
