import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeteoriteGroupView } from "@/components/meteorites/MeteoriteGroupView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { meteoriteClassPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.meteorites.classes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meteorites/class/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.meteorites.resolveMeteoriteClass(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: meteoriteClassPath(slug) });
}

export default async function MeteoriteClassPage({ params }: PageProps<"/meteorites/class/[slug]">) {
  const { slug } = await params;
  const d = engine.meteorites.resolveMeteoriteClass(slug);
  if (!d) notFound();
  return <MeteoriteGroupView d={d} kindLabel="Meteorite class" url={meteoriteClassPath(slug)} />;
}
