import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CometDetail } from "@/components/comets/CometDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { cometDormantPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.comets.dormantComets().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comets/dormant/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.comets.resolveComet(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: cometDormantPath(slug) });
}

export default async function DormantCometPage({ params }: PageProps<"/comets/dormant/[slug]">) {
  const { slug } = await params;
  const d = engine.comets.resolveComet(slug);
  if (!d || d.record.kind !== "dormant-comet") notFound();
  return <CometDetail d={d} kindLabel="Dormant comet" url={cometDormantPath(slug)} />;
}
