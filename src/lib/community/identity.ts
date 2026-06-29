/**
 * Community identity model — ARCHITECTURE ONLY.
 *
 * No authentication, no database, no persistence, and no real or fabricated
 * users are implemented in this phase. These are typed models and a vocabulary
 * for a future scientific community whose contributions enrich the knowledge
 * graph. The graph remains the single source of truth; community objects only
 * ever *reference* graph entities by id — never duplicate their data.
 */

/** Kinds of identity the platform is designed to support. */
export const IDENTITY_TYPES = [
  "person",
  "organization",
  "observatory",
  "research_group",
  "university",
  "museum",
  "space_agency",
  "amateur_astronomer",
  "astrophotographer",
  "educator",
  "student",
  "science_communicator",
] as const;
export type IdentityType = (typeof IDENTITY_TYPES)[number];

export const IDENTITY_TYPE_LABELS: Record<IdentityType, string> = {
  person: "Person",
  organization: "Organization",
  observatory: "Observatory",
  research_group: "Research group",
  university: "University",
  museum: "Museum",
  space_agency: "Space agency",
  amateur_astronomer: "Amateur astronomer",
  astrophotographer: "Astrophotographer",
  educator: "Educator",
  student: "Student",
  science_communicator: "Science communicator",
};

/** Verification is designed-for but NOT implemented. */
export type VerificationStatus = "unverified" | "pending" | "verified";

export interface VerificationBadge {
  status: VerificationStatus;
  /** What kind of identity was verified (e.g. an observatory, an agency). */
  identityType?: IdentityType;
  /** Who attested it (a future trusted authority). Never invented. */
  attestedBy?: string;
}
