import type { Metadata } from "next";
import Link from "next/link";
import { CommunityLanding } from "@/components/community/CommunityLanding";
import { COLLECTION_TEMPLATES } from "@/lib/community";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const PATH = "/community/collections";
const DESCRIPTION =
  "The future collections system — curate stars, missions, galaxies, images, and more into personal collections that reference graph entities and never duplicate data.";

export const metadata: Metadata = buildMetadata({ title: "Collections", description: DESCRIPTION, path: PATH });

export default function CollectionsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Community", url: ROUTES.community },
    { name: "Collections", url: PATH },
  ];
  return (
    <CommunityLanding
      title="Collections"
      lead="Curate the universe. Collections gather the entities you care about — favorite stars, missions, galaxies, images — as references into the knowledge graph, never copies."
      path={PATH}
      description={DESCRIPTION}
      crumbs={crumbs}
    >
      <section aria-labelledby="examples-heading">
        <h2 id="examples-heading" className="font-display text-2xl font-bold">Example collections</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Illustrative templates of what collections will look like. They hold
          only entity references — explore the real objects today.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {COLLECTION_TEMPLATES.map((c) => (
            <li key={c.title} className="scientific-card p-5">
              <h3 className="font-display text-lg font-semibold text-fg">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="references-heading">
        <h2 id="references-heading" className="font-display text-2xl font-bold">References, never copies</h2>
        <p className="mt-2 max-w-2xl text-muted">
          A collection stores stable graph entity ids (e.g.
          <code className="text-faint"> star:sirius</code>) and content paths —
          so the knowledge stays in one place and collections always reflect the
          latest data. Start by exploring entities in the{" "}
          <Link href={ROUTES.explore} className="text-faint underline-offset-4 hover:underline">Knowledge Explorer</Link>.
        </p>
      </section>
    </CommunityLanding>
  );
}
