import {
  TOPICS,
  getTopic,
  getTopicEntities,
  RELATIONSHIP_PAGES,
  type Topic,
} from "@/lib/discovery";
import type { GraphEntity } from "@/knowledge-graph";
import { traversalEngine, type TraversalNode } from "@/platform/data-engine/traversal-engine";

/**
 * Discovery Engine — exploration paths and browse surfaces. Delegates to the
 * discovery registry and uses the traversal engine to generate dynamic
 * exploration paths from any starting entity.
 */
export const discoveryEngine = {
  topics: (): Topic[] => TOPICS,
  topic: (slug: string): Topic | undefined => getTopic(slug),
  topicEntities: (topic: Topic): GraphEntity[] => getTopicEntities(topic),
  relationshipPages: () => RELATIONSHIP_PAGES,

  /**
   * A dynamic scientific exploration path from a starting entity: a
   * breadth-first scientific walk, returned as an ordered list of nodes.
   */
  explorationPath(startId: string, steps = 8): TraversalNode[] {
    const result = traversalEngine.traverse(startId, {
      maxDepth: 3,
      domain: "scientific",
      maxNodes: steps,
    });
    return result ? result.nodes : [];
  },
};
