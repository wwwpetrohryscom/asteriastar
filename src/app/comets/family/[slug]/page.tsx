import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CometGroupView } from "@/components/comets/CometGroupView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { cometFamilyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.comets.families().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comets/family/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.comets.resolveCometFamily(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: cometFamilyPath(slug) });
}

export default async function CometFamilyPage({ params }: PageProps<"/comets/family/[slug]">) {
  const { slug } = await params;
  const d = engine.comets.resolveCometFamily(slug);
  if (!d) notFound();
  return <CometGroupView d={d} kindLabel="Comet family" url={cometFamilyPath(slug)} />;
}
