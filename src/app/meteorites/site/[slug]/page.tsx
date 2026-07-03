import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeteoriteGroupView } from "@/components/meteorites/MeteoriteGroupView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { meteoriteSitePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.meteorites.sites().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meteorites/site/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.meteorites.resolveSite(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: meteoriteSitePath(slug) });
}

export default async function RecoverySitePage({ params }: PageProps<"/meteorites/site/[slug]">) {
  const { slug } = await params;
  const d = engine.meteorites.resolveSite(slug);
  if (!d) notFound();
  return <MeteoriteGroupView d={d} kindLabel="Recovery site" url={meteoriteSitePath(slug)} />;
}
