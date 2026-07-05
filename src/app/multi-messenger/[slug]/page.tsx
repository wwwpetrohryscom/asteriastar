import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MmDetail } from "@/components/multi-messenger/MmDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { multiMessengerPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.multiMessenger.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/multi-messenger/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.multiMessenger.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: multiMessengerPath(slug) });
}

export default async function MultiMessengerPage({ params }: PageProps<"/multi-messenger/[slug]">) {
  const { slug } = await params;
  const d = engine.multiMessenger.resolveEntry(slug);
  if (!d) notFound();
  return <MmDetail d={d} />;
}
