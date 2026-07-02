import { apiResponse } from "@/platform/open-data";
import { contributionsEngine } from "@/platform/contributions";

/**
 * GET /api/v0/contribution-types — the typed contribution models the scientific
 * review workflow accepts. Read-only, deterministic, engine-backed. No writes.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const contributionTypes = contributionsEngine.types().map((t) => ({
    id: t.id,
    label: t.label,
    description: t.description,
    track: t.track,
    requiredTargets: t.requiredTargets,
    optionalTargets: t.optionalTargets,
    requiresSource: t.requiresSource,
    requiresImageProvenance: t.requiresImageProvenance,
    proposesNew: t.proposesNew,
    impact: t.impact,
  }));
  return apiResponse(
    { count: contributionTypes.length, contributionTypes },
    {
      provenance: "The contribution-type registry from the contributions engine. Contributions are proposals, never direct graph changes.",
      count: contributionTypes.length,
    },
  );
}
