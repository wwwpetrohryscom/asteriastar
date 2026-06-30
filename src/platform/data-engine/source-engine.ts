import {
  getAllSources,
  getSource,
  getSources,
  AUTHORITY_TYPE_LABELS,
  type Source,
  type SourceKey,
  type AuthorityType,
} from "@/lib/sources";

/**
 * Source Engine — access to the authoritative source registry.
 */
export const sourceEngine = {
  all: (): Source[] => getAllSources(),
  get: (key: SourceKey): Source => getSource(key),
  resolve: (keys: readonly SourceKey[] = []): Source[] => getSources(keys),
  authorityLabel: (type: AuthorityType): string => AUTHORITY_TYPE_LABELS[type],
};
