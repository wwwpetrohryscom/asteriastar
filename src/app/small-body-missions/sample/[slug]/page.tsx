import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SampleView } from "@/components/small-body-missions/SampleView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { smallBodySamplePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.smallBodyMissions.samples().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/small-body-missions/sample/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.smallBodyMissions.resolveReturnedSample(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: smallBodySamplePath(slug) });
}

export default async function ReturnedSamplePage({ params }: PageProps<"/small-body-missions/sample/[slug]">) {
  const { slug } = await params;
  const d = engine.smallBodyMissions.resolveReturnedSample(slug);
  if (!d) notFound();
  return <SampleView d={d} />;
}
