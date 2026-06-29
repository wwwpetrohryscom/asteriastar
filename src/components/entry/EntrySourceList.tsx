import { SourceList } from "@/components/ui/SourceList";
import type { SourceKey } from "@/lib/sources";

/**
 * Entry source list. Thin wrapper over the shared SourceList so entry pages
 * present sources consistently with the rest of the site.
 */
export function EntrySourceList({ keys }: { keys: readonly SourceKey[] }) {
  if (keys.length === 0) return null;
  return <SourceList keys={keys} />;
}
