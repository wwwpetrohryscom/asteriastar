import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MethodView } from "@/components/interstellar/MethodView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { interstellarDetectionPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.interstellarObjects.detectionMethods().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/interstellar-objects/detection/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.interstellarObjects.resolveDetectionMethod(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: interstellarDetectionPath(slug) });
}

export default async function DetectionMethodPage({ params }: PageProps<"/interstellar-objects/detection/[slug]">) {
  const { slug } = await params;
  const d = engine.interstellarObjects.resolveDetectionMethod(slug);
  if (!d) notFound();
  return <MethodView d={d} />;
}
