import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import type { Entry } from "@/lib/content/entry-types";

/**
 * Renders the interpretive disclaimer for entries that require it (astrology
 * and other interpretive content). Returns null otherwise, so astronomy and
 * other factual entries never carry it.
 */
export function EntryDisclaimer({ entry }: { entry: Entry }) {
  if (!entry.disclaimerRequired) return null;
  return <DisclaimerBox message={entry.disclaimer} />;
}
