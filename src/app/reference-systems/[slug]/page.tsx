import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReferenceDetail } from "@/components/reference-systems/ReferenceDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { referenceSystemsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.referenceSystems.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/reference-systems/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.referenceSystems.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: referenceSystemsPath(slug) });
}

export default async function ReferenceSystemsEntryPage({ params }: PageProps<"/reference-systems/[slug]">) {
  const { slug } = await params;
  const d = engine.referenceSystems.resolveEntry(slug);
  if (!d) notFound();
  return <ReferenceDetail d={d} />;
}
