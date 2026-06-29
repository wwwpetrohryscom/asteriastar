import type { Metadata } from "next";
import Link from "next/link";
import { CommunityLanding, FeatureGrid } from "@/components/community/CommunityLanding";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const PATH = "/community/observations";
const DESCRIPTION =
  "The future observation system — log what you see under the sky, with every observation linked to a knowledge-graph entity. Architecture preview; no data yet.";

export const metadata: Metadata = buildMetadata({ title: "Observations", description: DESCRIPTION, path: PATH });

export default function ObservationsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Community", url: ROUTES.community },
    { name: "Observations", url: PATH },
  ];
  return (
    <CommunityLanding
      title="Observations"
      lead="A scientific observation log where every entry is tied to the object you observed — never an isolated record, always a link into the knowledge graph."
      path={PATH}
      description={DESCRIPTION}
      crumbs={crumbs}
    >
      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="font-display text-2xl font-bold">How it will work</h2>
        <p className="mt-2 max-w-2xl text-muted">
          An observation references the graph entity observed (e.g. Jupiter),
          optionally the equipment used, and the sky conditions — so your records
          become part of the connected knowledge of the platform.
        </p>
        <div className="mt-6">
          <FeatureGrid
            items={[
              { title: "Object", description: "The graph entity you observed — the required anchor for every observation." },
              { title: "Date & location", description: "When and where you observed (location reference, privacy-first)." },
              { title: "Equipment", description: "Telescopes and instruments, referenced as graph entities where applicable." },
              { title: "Sky conditions", description: "Weather, transparency, and light-pollution (Bortle) context." },
              { title: "Notes", description: "Your written record of what you saw." },
              { title: "Images", description: "Linked astrophotographs, with full provenance." },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="graph-anchored-heading">
        <h2 id="graph-anchored-heading" className="font-display text-2xl font-bold">Graph-anchored by design</h2>
        <p className="mt-2 max-w-2xl text-muted">
          The data model requires a graph entity for every observation
          (<code className="text-faint">objectEntity</code>), so there are no
          orphaned records. Observations enrich the graph; they never duplicate
          it. See the <Link href="/community" className="text-comet underline-offset-4 hover:underline">community architecture</Link>.
        </p>
      </section>
    </CommunityLanding>
  );
}
