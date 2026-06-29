import { SectionGrid } from "@/components/sections/SectionGrid";
import { entityGraphPath, getConnections } from "@/knowledge-graph";

/**
 * Missions connected to an entry's graph entity (e.g. spacecraft that targeted
 * this object). Graph-derived; renders nothing when there are none.
 */
export function EntryRelatedMissions({ entityId }: { entityId: string }) {
  const missions = getConnections(entityId)
    .filter((c) => c.other.type === "space_mission")
    .map((c) => c.other);

  // Dedupe (an entity may connect to a mission via more than one relation).
  const unique = Array.from(new Map(missions.map((m) => [m.id, m])).values()).sort(
    (a, b) => a.name.localeCompare(b.name),
  );
  if (unique.length === 0) return null;

  const items = unique.map((m) => ({
    title: m.name,
    description: m.description,
    href: entityGraphPath(m),
    accent: "halo" as const,
    eyebrow: "Space mission",
  }));

  return (
    <section aria-labelledby="related-missions-heading">
      <h2 id="related-missions-heading" className="font-display text-xl font-semibold text-fg">
        Related missions
      </h2>
      <SectionGrid items={items} columns={3} className="mt-4" />
    </section>
  );
}
