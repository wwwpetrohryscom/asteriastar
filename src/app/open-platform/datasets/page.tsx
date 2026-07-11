import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OpenPlatformNav } from "@/components/open-platform/OpenPlatformNav";
import { CapabilityCards } from "@/components/open-platform/CapabilityCards";
import { engine } from "@/platform/data-engine";
import { DATASETS } from "@/lib/datasets";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "Every curated dataset, exportable as JSON and CSV with real record counts, licences, and provenance — a focused slice of the graph for a specific need.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — Datasets", description: DESCRIPTION, path: `${ROUTES.openPlatform}/datasets` });

export default function OpenPlatformDatasetsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "Datasets", url: `${ROUTES.openPlatform}/datasets` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · {DATASETS.length} datasets</span>} title="Dataset exports" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="datasets" />
        <CapabilityCards records={engine.openPlatform.byCategory("datasets")} />
        <p className="mt-8 text-sm text-muted">
          Browse and export all {DATASETS.length} datasets in the{" "}
          <Link href={ROUTES.datasets} className="text-nasa underline-offset-4 hover:underline">dataset catalogue</Link>, or list them via the{" "}
          <Link href="/api/v0/datasets" className="text-nasa underline-offset-4 hover:underline">/api/v0/datasets</Link> endpoint.
        </p>
      </Container>
    </>
  );
}
