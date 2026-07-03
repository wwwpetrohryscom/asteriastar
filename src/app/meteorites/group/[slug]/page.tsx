import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeteoriteGroupView } from "@/components/meteorites/MeteoriteGroupView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { meteoriteGroupPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.meteorites.groups().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meteorites/group/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.meteorites.resolveGroup(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: meteoriteGroupPath(slug) });
}

export default async function MeteoriteGroupPage({ params }: PageProps<"/meteorites/group/[slug]">) {
  const { slug } = await params;
  const d = engine.meteorites.resolveGroup(slug);
  if (!d) notFound();
  return <MeteoriteGroupView d={d} kindLabel="Meteorite group" url={meteoriteGroupPath(slug)} />;
}
