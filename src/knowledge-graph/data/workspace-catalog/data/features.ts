import type { WorkspaceFeatureRecord } from "@/knowledge-graph/data/workspace-catalog/types";

/** Research Workspace features (Program BV). Each is a capability of the privacy-first, local-only
 *  workspace. Features are cross-linked to their siblings so the workspace forms a connected subgraph;
 *  they are meta-nodes and never surface as scientific facts. */
const feat = (r: Omit<WorkspaceFeatureRecord, "id" | "sources" | "storage"> & { slug: string; sources?: WorkspaceFeatureRecord["sources"]; storage?: WorkspaceFeatureRecord["storage"] }): WorkspaceFeatureRecord => ({
  sources: ["nasa"],
  storage: "local-only",
  ...r,
  id: `workspace_feature:${r.slug}`,
});

export const features: WorkspaceFeatureRecord[] = [
  feat({
    slug: "saved-entities",
    name: "Saved Entities",
    category: "saving",
    capability: "Save any knowledge-graph entity to a local workspace",
    description:
      "Bookmark any entity in the knowledge graph — a planet, star, mission, galaxy, method — to your own workspace with a single click. Saved entities are stored only in your browser and are the raw material of collections, notes, and citations. Nothing is sent to a server.",
    relatedKeys: ["workspace_feature:collections", "workspace_feature:notes", "workspace_feature:privacy"],
    highlights: ["One-click save of any real graph entity — stored only in your browser"],
  }),
  feat({
    slug: "collections",
    name: "Collections",
    category: "organising",
    capability: "Group saved entities into named collections",
    description:
      "Organise saved entities into named collections — a research theme, a set of targets, a topic to revisit. Collections live in your browser and can be exported or printed. A collection references entities by id; it never copies or alters the underlying data.",
    relatedKeys: ["workspace_feature:saved-entities", "workspace_feature:reading-lists", "workspace_feature:observation-projects", "workspace_feature:exports"],
    highlights: ["Named collections of real entities, organised your way"],
  }),
  feat({
    slug: "reading-lists",
    name: "Reading Lists",
    category: "organising",
    capability: "Build ordered reading lists of entities and articles",
    description:
      "An ordered reading list — a path through the encyclopedia you intend to follow. A reading list is a collection whose order is meaningful, so you can sequence a study plan. Stored locally; nothing is tracked about what you read.",
    relatedKeys: ["workspace_feature:collections", "workspace_feature:saved-entities"],
    highlights: ["A study plan you sequence yourself — never tracked"],
  }),
  feat({
    slug: "observation-projects",
    name: "Observation Projects",
    category: "organising",
    capability: "Plan an observing project around a set of targets",
    description:
      "Gather the objects you plan to observe into an observation project — a set of targets you can pair with the observing planners and the live-sky tools. An observation project is a local collection of real targets; it computes nothing and fabricates no ephemeris.",
    relatedKeys: ["workspace_feature:collections", "workspace_feature:notes"],
    highlights: ["Your own target list — pairs with the observing suite"],
  }),
  feat({
    slug: "notes",
    name: "Notes",
    category: "notes",
    capability: "Attach free-text notes to entities and collections",
    description:
      "Write your own notes and attach them to a saved entity or keep them free-standing — questions, observations, connections you have spotted. Notes are yours alone, held only in your browser, and are included in exports and the printable packet.",
    relatedKeys: ["workspace_feature:saved-entities", "workspace_feature:exports"],
    highlights: ["Your own research notes — private to your browser"],
  }),
  feat({
    slug: "citation-folder",
    name: "Citation Folder",
    category: "citations",
    capability: "Collect real citations and export them (APA, BibTeX, RIS…)",
    description:
      "Collect the citations behind the entities you study into a citation folder, and export them in APA, Chicago, MLA, Harvard, BibTeX, or RIS. It REUSES the platform's citation engine over real, source-backed references — every field comes from a verifiable citation record; none is invented.",
    relatedKeys: ["workspace_feature:saved-entities", "workspace_feature:exports"],
    highlights: ["Real, source-backed citations — exported in standard styles"],
  }),
  feat({
    slug: "exports",
    name: "Exports & Printable Packet",
    category: "exports",
    capability: "Export the workspace to JSON, Markdown, BibTeX, CSV — or print",
    description:
      "Export your whole workspace — saved entities, collections, notes, and citations — to JSON, Markdown, BibTeX, or CSV, or print a clean research packet. Exports are generated in your browser from your local data; nothing is uploaded, and JSON can be re-imported to move your workspace between devices yourself.",
    relatedKeys: ["workspace_feature:collections", "workspace_feature:citation-folder", "workspace_feature:privacy"],
    highlights: ["JSON · Markdown · BibTeX · CSV · print — all in your browser"],
  }),
  feat({
    slug: "privacy",
    name: "Privacy",
    category: "privacy",
    capability: "Local-only by construction — no account, no server, no tracking",
    description:
      "The workspace is private by construction. It stores everything in your browser's localStorage under a single key, holds no account, sets no cookie, makes no network request, and records no analytics. Your data never leaves your device, and a single control erases all of it. This is a guarantee of the design, not a policy promise.",
    relatedKeys: ["workspace_feature:saved-entities", "workspace_feature:exports"],
    highlights: ["No account · no server · no cookie · no tracking — by design"],
  }),
];
