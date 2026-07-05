import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DlDetail } from "@/components/distance-ladder/DlDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { distanceLadderPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.distanceLadder.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/distance-ladder/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.distanceLadder.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: distanceLadderPath(slug) });
}

export default async function DistanceLadderPage({ params }: PageProps<"/distance-ladder/[slug]">) {
  const { slug } = await params;
  const d = engine.distanceLadder.resolveEntry(slug);
  if (!d) notFound();
  return <DlDetail d={d} />;
}
