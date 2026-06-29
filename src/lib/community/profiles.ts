import type { IdentityType, VerificationBadge } from "@/lib/community/identity";
import type {
  CollectionId,
  EntityRef,
  ObservationId,
  ProfileId,
  Visibility,
} from "@/lib/community/ids";

/**
 * Profile model — ARCHITECTURE ONLY (no login, no persistence). Interests and
 * favorites are stored as graph `EntityRef`s, never as copies of entity data.
 */

export interface Achievement {
  /** Stable key, e.g. "first-observation". */
  key: string;
  label: string;
  description: string;
}

export interface ContributionSummary {
  observations: number;
  photos: number;
  corrections: number;
  sources: number;
  acceptedSuggestions: number;
}

export interface Profile {
  id: ProfileId;
  identityType: IdentityType;
  displayName: string;
  username: string;
  avatarMediaId?: string;
  biography?: string;
  location?: string;
  languages?: string[];
  /** Areas of interest as graph entity / topic references. */
  interests: EntityRef[];
  /** Favorited graph entities. */
  favoriteEntities: EntityRef[];
  observationIds: ObservationId[];
  collectionIds: CollectionId[];
  achievements: Achievement[];
  verification: VerificationBadge;
  contributionSummary: ContributionSummary;
  visibility: Visibility;
}
