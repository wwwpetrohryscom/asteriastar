/**
 * Near-Earth objects & planetary defence (Program CK).
 *
 * Live close approaches, the Sentry impact-risk table, recent database entries and the MPC's
 * unconfirmed candidates — all through the live-provider runtime's honesty envelope.
 *
 * The program's governing restraint: no impact probability is ever computed here. JPL's Sentry
 * system publishes them, with JPL's own caveat about their accuracy, and that is the only source
 * any number on these pages comes from. Nothing is described as dangerous unless a published scale
 * says so, and a close approach at ten lunar distances is described as what it is — routine.
 */
export * from "@/platform/neo/model";
export * as neoClients from "@/platform/neo/clients";
export * from "@/platform/neo/service";
