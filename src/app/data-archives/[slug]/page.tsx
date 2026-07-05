import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArDetail } from "@/components/data-archives/ArDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { dataArchivesPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.dataArchives.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/data-archives/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.dataArchives.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: dataArchivesPath(slug) });
}

export default async function DataArchivesPage({ params }: PageProps<"/data-archives/[slug]">) {
  const { slug } = await params;
  const d = engine.dataArchives.resolveEntry(slug);
  if (!d) notFound();
  return <ArDetail d={d} />;
}
