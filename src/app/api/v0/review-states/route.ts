import { apiResponse } from "@/platform/open-data";
import { contributionsEngine, STATE_LABELS, STATE_DESCRIPTIONS } from "@/platform/contributions";

/**
 * GET /api/v0/review-states — the contribution review-state machine: every
 * state with its description and valid next states. Read-only. No writes.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const states = contributionsEngine.states().map((s) => ({
    id: s,
    label: STATE_LABELS[s],
    description: STATE_DESCRIPTIONS[s],
    next: contributionsEngine.nextStates(s),
  }));
  return apiResponse(
    { count: states.length, states },
    {
      provenance: "The review-state machine from the contributions engine. Every listed transition is valid; no state history is fabricated.",
      count: states.length,
    },
  );
}
