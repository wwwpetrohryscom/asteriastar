import type { Metadata } from "next";
import Link from "next/link";
import { CommunityLanding, FeatureGrid } from "@/components/community/CommunityLanding";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const PATH = "/community/astrophotography";
const DESCRIPTION =
  "The future astrophotography platform — share images with full equipment, license, and credit metadata, each linked to the objects depicted in the knowledge graph.";

export const metadata: Metadata = buildMetadata({ title: "Astrophotography", description: DESCRIPTION, path: PATH });

export default function AstrophotographyPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Community", url: ROUTES.community },
    { name: "Astrophotography", url: PATH },
  ];
  return (
    <CommunityLanding
      title="Astrophotography"
      lead="A home for astrophotography that treats provenance as seriously as the science — every image carries its equipment, license, and credit, and links to the objects it shows."
      path={PATH}
      description={DESCRIPTION}
      crumbs={crumbs}
    >
      <section aria-labelledby="image-fields-heading">
        <h2 id="image-fields-heading" className="font-display text-2xl font-bold">What each image will carry</h2>
        <div className="mt-6">
          <FeatureGrid
            items={[
              { title: "Object", description: "The graph entity depicted (e.g. the Orion Nebula) — every image links into the graph." },
              { title: "Equipment", description: "Camera, lens, and telescope (referenced as a graph entity where applicable)." },
              { title: "Capture", description: "Exposure and acquisition details for reproducibility." },
              { title: "Location & date", description: "Where and when the image was captured." },
              { title: "License & credit", description: "Explicit license and required attribution for every image." },
              { title: "Observation link", description: "Optionally tied to the observation it came from." },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="image-platform-heading">
        <h2 id="image-platform-heading" className="font-display text-2xl font-bold">Built on the image platform</h2>
        <p className="mt-2 max-w-2xl text-muted">
          User astrophotography extends the same provenance discipline as the
          Observatory&apos;s <Link href="/observatory/image-library" className="text-faint underline-offset-4 hover:underline">image platform</Link>:
          no fabricated or unlicensed imagery, and a clear license on everything.
          See the <Link href="/sources-policy" className="text-faint underline-offset-4 hover:underline">sources &amp; licensing policy</Link>.
        </p>
      </section>
    </CommunityLanding>
  );
}
