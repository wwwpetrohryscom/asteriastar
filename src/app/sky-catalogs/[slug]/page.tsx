import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogDetail } from "@/components/sky-catalogs/CatalogDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { skyCatalogsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.skyCatalogs.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sky-catalogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.skyCatalogs.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: skyCatalogsPath(slug) });
}

export default async function SkyCatalogEntryPage({ params }: PageProps<"/sky-catalogs/[slug]">) {
  const { slug } = await params;
  const d = engine.skyCatalogs.resolveEntry(slug);
  if (!d) notFound();
  return <CatalogDetail d={d} />;
}
