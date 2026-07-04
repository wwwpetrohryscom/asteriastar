import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MissionClassView } from "@/components/small-body-missions/MissionClassView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { smallBodyTypePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.smallBodyMissions.classes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/small-body-missions/type/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.smallBodyMissions.resolveMissionClass(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: smallBodyTypePath(slug) });
}

export default async function MissionClassPage({ params }: PageProps<"/small-body-missions/type/[slug]">) {
  const { slug } = await params;
  const d = engine.smallBodyMissions.resolveMissionClass(slug);
  if (!d) notFound();
  return <MissionClassView d={d} />;
}
