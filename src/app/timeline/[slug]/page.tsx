import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TimelineDetail } from "@/components/timeline/TimelineDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { spaceflightTimelinePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.spaceflightHistory.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/timeline/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.spaceflightHistory.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: spaceflightTimelinePath(slug) });
}

export default async function TimelinePage({ params }: PageProps<"/timeline/[slug]">) {
  const { slug } = await params;
  const d = engine.spaceflightHistory.resolveEntry(slug);
  if (!d) notFound();
  return <TimelineDetail d={d} />;
}
