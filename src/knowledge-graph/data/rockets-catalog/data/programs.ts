import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Launch programs — existing `mission_program:*` entities enriched as the programs
 * that flagship launch vehicles served. All `existing: true` (never recreated);
 * record slugs are chosen distinct from vehicle slugs to avoid slug collisions.
 */
type Pg = {
  slug: string; // catalogue slug (unique across the catalog)
  id: string; // existing mission_program id
  name: string;
  country: string;
  startYear?: string;
  endYear?: string;
  sources?: SourceKey[];
  description: string;
};
const mk = (p: Pg): RocketRecord => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  kind: "program",
  existing: true,
  description: p.description,
  sources: p.sources ?? ["nasa"],
  country: p.country,
  startYear: p.startYear,
  endYear: p.endYear,
});

export const programs: RocketRecord[] = [
  mk({ slug: "apollo", id: "mission_program:apollo", name: "Apollo program", country: "United States", startYear: "1961", endYear: "1972", sources: ["nasa"], description: "NASA's program to land humans on the Moon, launched by the Saturn IB and Saturn V." }),
  mk({ slug: "gemini", id: "mission_program:gemini", name: "Gemini program", country: "United States", startYear: "1961", endYear: "1966", sources: ["nasa"], description: "NASA's two-person spaceflight program that developed rendezvous and EVA techniques, launched by the human-rated Titan II." }),
  mk({ slug: "artemis", id: "mission_program:artemis", name: "Artemis program", country: "United States", startYear: "2017", sources: ["nasa"], description: "NASA's program to return humans to the Moon, launched by the Space Launch System." }),
  mk({ slug: "space-shuttle-program", id: "mission_program:space-shuttle", name: "Space Shuttle program", country: "United States", startYear: "1972", endYear: "2011", sources: ["nasa"], description: "NASA's Space Transportation System program, which flew the reusable Space Shuttle on 135 missions." }),
  mk({ slug: "skylab", id: "mission_program:skylab", name: "Skylab program", country: "United States", startYear: "1973", endYear: "1979", sources: ["nasa"], description: "NASA's first space station, launched by a Saturn V and crewed by Saturn IB flights." }),
];
