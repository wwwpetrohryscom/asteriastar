import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpsDetail } from "@/components/mission-operations/OpsDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { missionOperationsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.missionOperations.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/mission-operations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.missionOperations.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: missionOperationsPath(slug) });
}

export default async function MissionOperationsPage({ params }: PageProps<"/mission-operations/[slug]">) {
  const { slug } = await params;
  const d = engine.missionOperations.resolveEntry(slug);
  if (!d) notFound();
  return <OpsDetail d={d} />;
}
