import type { Metadata } from "next";
import { CommunityLanding } from "@/components/community/CommunityLanding";
import {
  CONTRIBUTION_TYPES,
  CONTRIBUTION_TYPE_LABELS,
  EXCLUDED_REPUTATION_SIGNALS,
  REPUTATION_DIMENSIONS,
  REPUTATION_DIMENSION_LABELS,
} from "@/lib/community";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const PATH = "/community/contributors";
const DESCRIPTION =
  "How contributors are recognized on Asteria Star — a reputation model built on scientific quality, not likes or followers. Architecture preview; no profiles yet.";

export const metadata: Metadata = buildMetadata({ title: "Contributors", description: DESCRIPTION, path: PATH });

export default function ContributorsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Community", url: ROUTES.community },
    { name: "Contributors", url: PATH },
  ];
  return (
    <CommunityLanding
      title="Contributors"
      lead="Recognition earned through scientific contribution — not likes, not followers. Contributors enrich the knowledge graph, and their standing reflects the quality of that work."
      path={PATH}
      description={DESCRIPTION}
      crumbs={crumbs}
    >
      <section aria-labelledby="contribute-heading">
        <h2 id="contribute-heading" className="font-display text-2xl font-bold">Ways to contribute</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every contribution targets a graph entity (or proposes a new one).
          There is no editing workflow yet — this is the planned model.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {CONTRIBUTION_TYPES.map((t) => (
            <li key={t} className="rounded-full border border-white/12 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted">
              {CONTRIBUTION_TYPE_LABELS[t]}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="reputation-heading">
        <h2 id="reputation-heading" className="font-display text-2xl font-bold">Reputation, done right</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Reputation is scored across dimensions of scientific quality and trust:
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REPUTATION_DIMENSIONS.map((d) => (
            <li key={d} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-medium text-fg">
              {REPUTATION_DIMENSION_LABELS[d]}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-faint">
          Explicitly excluded — and never to be added: {EXCLUDED_REPUTATION_SIGNALS.join(", ")}.
        </p>
      </section>
    </CommunityLanding>
  );
}
