import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompactDetail } from "@/components/compact-objects/CompactDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { compactObjectsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.compactObjects.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/compact-objects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.compactObjects.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: compactObjectsPath(slug) });
}

export default async function CompactObjectEntryPage({ params }: PageProps<"/compact-objects/[slug]">) {
  const { slug } = await params;
  const d = engine.compactObjects.resolveEntry(slug);
  if (!d) notFound();
  return <CompactDetail d={d} />;
}
