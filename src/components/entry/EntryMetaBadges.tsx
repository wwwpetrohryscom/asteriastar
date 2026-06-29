import { Badge } from "@/components/ui/Badge";
import type { EntryDifficulty, EntryKind } from "@/lib/content/entry-types";

const KIND_LABEL: Record<EntryKind, string> = {
  science: "Science",
  interpretive: "Astrology · interpretive",
  cultural: "Cultural",
  historical: "History",
  tool: "Tool",
};

const DIFFICULTY_LABEL: Record<EntryDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Small badge row describing an entry's nature and reading level. */
export function EntryMetaBadges({
  kind,
  difficulty,
}: {
  kind: EntryKind;
  difficulty: EntryDifficulty;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone={kind === "interpretive" ? "tradition" : "accent"}>
        {KIND_LABEL[kind]}
      </Badge>
      <Badge tone="neutral">{DIFFICULTY_LABEL[difficulty]}</Badge>
    </div>
  );
}
