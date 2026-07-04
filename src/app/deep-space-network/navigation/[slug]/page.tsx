import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfraDetail } from "@/components/deep-space-comms/InfraDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { dsnNavigationPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.deepSpaceCommunications.navigationMethods().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-network/navigation/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveNavigationMethod(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: dsnNavigationPath(slug) });
}

export default async function NavigationPage({ params }: PageProps<"/deep-space-network/navigation/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveNavigationMethod(slug);
  if (!d) notFound();
  return <InfraDetail d={d} />;
}
