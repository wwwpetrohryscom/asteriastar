import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CometGroupView } from "@/components/comets/CometGroupView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { cometClassPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.comets.classes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comets/class/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.comets.resolveCometClass(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: cometClassPath(slug) });
}

export default async function CometClassPage({ params }: PageProps<"/comets/class/[slug]">) {
  const { slug } = await params;
  const d = engine.comets.resolveCometClass(slug);
  if (!d) notFound();
  return <CometGroupView d={d} kindLabel="Comet class" url={cometClassPath(slug)} />;
}
