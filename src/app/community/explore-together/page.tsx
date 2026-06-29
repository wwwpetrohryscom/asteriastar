import type { Metadata } from "next";
import Link from "next/link";
import { CommunityLanding, FeatureGrid } from "@/components/community/CommunityLanding";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const PATH = "/community/explore-together";
const DESCRIPTION =
  "Explore together — a future people-discovery layer based entirely on the knowledge graph: find others around the objects, missions, and topics you study.";

export const metadata: Metadata = buildMetadata({ title: "Explore Together", description: DESCRIPTION, path: PATH });

export default function ExploreTogetherPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Community", url: ROUTES.community },
    { name: "Explore Together", url: PATH },
  ];
  return (
    <CommunityLanding
      title="Explore Together"
      lead="People discovery, done the Asteria Star way — connect with others through the knowledge graph, around the objects and topics you actually study. No follower counts, no popularity contests."
      path={PATH}
      description={DESCRIPTION}
      crumbs={crumbs}
    >
      <section aria-labelledby="discover-heading">
        <h2 id="discover-heading" className="font-display text-2xl font-bold">Discover people through the graph</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Community discovery will be derived from graph relationships, never from
          engagement metrics. For example:
        </p>
        <div className="mt-6">
          <FeatureGrid
            items={[
              { title: "People interested in Orion", description: "Grouped by the constellation entity, not by who is popular." },
              { title: "People observing Jupiter", description: "Connected through observations that reference the planet." },
              { title: "Astrophotographers", description: "By the identity type and the objects they image." },
              { title: "Telescope experts", description: "By contributions and observations using specific instruments." },
              { title: "Planetary observers", description: "By the entities they most observe." },
              { title: "Mission enthusiasts", description: "Connected through the missions they follow and contribute to." },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="connects-heading">
        <h2 id="connects-heading" className="font-display text-2xl font-bold">The graph connects everything</h2>
        <p className="mt-2 max-w-2xl text-muted">
          A future profile (e.g. an observer) connects to the entities they
          observe — Jupiter, its place in the Solar System, the telescope used,
          the image captured, the location. Everything references existing graph
          entities; nothing duplicates them. Begin in the{" "}
          <Link href={ROUTES.explore} className="text-comet underline-offset-4 hover:underline">Knowledge Explorer</Link>.
        </p>
      </section>
    </CommunityLanding>
  );
}
