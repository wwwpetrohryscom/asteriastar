import { getEntityForEntry } from "@/content/entries";
import { getConnections } from "@/knowledge-graph";
import { GraphConnections } from "@/components/graph/GraphConnections";
import type { Entry } from "@/lib/content/entry-types";

/**
 * "Knowledge connections" for an entry — resolves the entry's graph entity and
 * renders its connections in strictly-separate, labeled groups (via
 * GraphConnections). Renders nothing if the entry has no graph entity or no
 * connections.
 */
export function KnowledgeConnections({ entry }: { entry: Entry }) {
  const entity = getEntityForEntry(entry);
  if (!entity) return null;
  if (getConnections(entity.id).length === 0) return null;

  return (
    <section aria-labelledby="kg-heading">
      <h2 id="kg-heading" className="font-display text-xl font-semibold text-fg">
        Knowledge connections
      </h2>
      <p className="mt-1 text-sm text-faint">
        How this connects across Asteria Star — scientific, cultural, and
        astrological links are kept separate.
      </p>
      <div className="mt-4">
        <GraphConnections entityId={entity.id} />
      </div>
    </section>
  );
}
