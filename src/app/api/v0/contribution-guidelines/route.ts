import { apiResponse } from "@/platform/open-data";
import { contributionsEngine } from "@/platform/contributions";

/**
 * GET /api/v0/contribution-guidelines — the workflow's core principle,
 * contribution types, review states, roles, and security model. Read-only.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return apiResponse(contributionsEngine.guidelines(), {
    provenance: "Contribution guidelines from the contributions engine. Architecture only: no accounts, no persistence, no live submissions. Contributions are proposals, not truth.",
  });
}
