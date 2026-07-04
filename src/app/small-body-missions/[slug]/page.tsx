import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MissionDetail } from "@/components/small-body-missions/MissionDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.smallBodyMissions.missions().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/small-body-missions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.smallBodyMissions.resolveMission(slug);
  if (!d) return {};
  // For a reused mission the canonical stays its main mission page; new missions are
  // canonical here. This keeps the themed view from competing for search rank.
  return buildMetadata({ title: `${d.record.name} — Mission`, description: d.record.description, path: d.canonicalHref });
}

export default async function SmallBodyMissionPage({ params }: PageProps<"/small-body-missions/[slug]">) {
  const { slug } = await params;
  const d = engine.smallBodyMissions.resolveMission(slug);
  if (!d) notFound();
  return <MissionDetail d={d} />;
}
