import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DsoDetail } from "@/components/deep-sky-encyclopedia/DsoDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { deepSkyEncyclopediaPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.deepSkyEncyclopedia.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-sky-encyclopedia/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.deepSkyEncyclopedia.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: deepSkyEncyclopediaPath(slug) });
}

export default async function DeepSkyEncyclopediaEntryPage({ params }: PageProps<"/deep-sky-encyclopedia/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSkyEncyclopedia.resolveEntry(slug);
  if (!d) notFound();
  return <DsoDetail d={d} />;
}
