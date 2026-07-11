import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OpenPlatformNav } from "@/components/open-platform/OpenPlatformNav";
import { computeDownloadManifest, formatBytes } from "@/lib/open-platform/downloads";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "Bulk downloads of the whole knowledge graph, each with a real byte size and SHA-256 checksum computed from the exact bytes served, its licence, and its release. No download is fabricated — verify the checksum against the file.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — Downloads", description: DESCRIPTION, path: `${ROUTES.openPlatform}/downloads` });

export default function OpenPlatformDownloadsPage() {
  const manifest = computeDownloadManifest();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "Downloads", url: `${ROUTES.openPlatform}/downloads` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · Bulk downloads</span>} title="Downloads & releases" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="downloads" />
        <ul className="space-y-4">
          {manifest.map((d) => (
            <li key={d.path} className="scientific-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-fg">{d.name}</h3>
                  <p className="text-xs text-faint">{d.format} · {formatBytes(d.bytes)} · release {d.release} · {d.license}</p>
                </div>
                <Link href={d.path} className="rounded-lg border border-nasa/40 px-4 py-2 text-sm text-nasa hover:bg-nasa/10">Download →</Link>
              </div>
              <dl className="mt-3 grid gap-1 text-sm">
                <div className="flex flex-wrap gap-2">
                  <dt className="text-faint">SHA-256</dt>
                  <dd className="break-all font-mono text-xs text-muted">{d.sha256}</dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="text-faint">Bytes</dt>
                  <dd className="font-mono text-xs text-muted">{d.bytes.toLocaleString()}</dd>
                </div>
              </dl>
              {d.limitations && <p className="mt-2 text-xs leading-relaxed text-faint">{d.limitations}</p>}
            </li>
          ))}
        </ul>
        <section className="mt-8 scientific-card p-5">
          <h2 className="font-display text-base font-semibold text-fg">How the checksums are computed</h2>
          <p className="mt-2 text-sm text-muted">
            Each SHA-256 is a real digest of the exact bytes the export route serves — the same serialiser backs both — so you can verify a download with, for example, <code className="rounded bg-white/5 px-1">shasum -a 256 graph.json</code>. Per-dataset JSON/CSV exports are in the{" "}
            <Link href={ROUTES.datasets} className="text-nasa underline-offset-4 hover:underline">dataset catalogue</Link>. DOI-minted releases are architecture-ready — see the{" "}
            <Link href={`${ROUTES.openPlatform}/roadmap`} className="text-nasa underline-offset-4 hover:underline">roadmap</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
