import { citationsForEntity, formatCitation, getCitation, type Citation } from "@/lib/citations";
import { COLLECTION_KIND_LABELS, type WorkspaceState } from "@/lib/workspace/types";

/**
 * Workspace exports (Program BV). Pure functions that turn the local workspace into portable formats —
 * JSON, Markdown, BibTeX, and CSV — entirely in the browser. Citations are rendered by the platform's
 * existing citation engine (formatCitation), which never fabricates a field; the workspace only
 * references REAL citation records and entity citations, so an export invents nothing.
 */

export type ExportFormat = "json" | "markdown" | "bibtex" | "csv";

export const EXPORT_FORMATS: { id: ExportFormat; name: string; extension: string; mime: string }[] = [
  { id: "json", name: "JSON", extension: "json", mime: "application/json" },
  { id: "markdown", name: "Markdown", extension: "md", mime: "text/markdown" },
  { id: "bibtex", name: "BibTeX", extension: "bib", mime: "application/x-bibtex" },
  { id: "csv", name: "CSV", extension: "csv", mime: "text/csv" },
];

/** The real citation records referenced by the workspace citation folder (deduplicated). */
export function resolveWorkspaceCitations(state: WorkspaceState): Citation[] {
  const out: Citation[] = [];
  const seen = new Set<string>();
  for (const ref of state.citations) {
    if (ref.citationId) {
      const c = getCitation(ref.citationId);
      if (c && !seen.has(c.id)) { seen.add(c.id); out.push(c); }
    }
    if (ref.entityId) {
      for (const c of citationsForEntity(ref.entityId)) {
        if (!seen.has(c.id)) { seen.add(c.id); out.push(c); }
      }
    }
  }
  return out;
}

export function toJSON(state: WorkspaceState): string {
  return JSON.stringify(state, null, 2);
}

export function toBibTeX(state: WorkspaceState): string {
  const cites = resolveWorkspaceCitations(state);
  if (!cites.length) return "% This workspace has no citations in its citation folder yet.";
  return cites.map((c) => formatCitation(c, "bibtex")).join("\n\n");
}

export function toMarkdown(state: WorkspaceState): string {
  const lines: string[] = ["# AsteriaStar research workspace", ""];
  const byId = new Map(state.savedEntities.map((e) => [e.id, e]));

  if (state.savedEntities.length) {
    lines.push(`## Saved entities (${state.savedEntities.length})`, "");
    for (const e of state.savedEntities) lines.push(`- **${e.name}** — ${e.type} — ${e.href}`);
    lines.push("");
  }
  if (state.collections.length) {
    lines.push(`## Collections (${state.collections.length})`, "");
    for (const c of state.collections) {
      lines.push(`### ${c.name} — ${COLLECTION_KIND_LABELS[c.kind]}`);
      if (c.description) lines.push("", c.description);
      lines.push("");
      for (const id of c.entityIds) {
        const e = byId.get(id);
        lines.push(`- ${e ? `**${e.name}** — ${e.href}` : id}`);
      }
      lines.push("");
    }
  }
  if (state.notes.length) {
    lines.push(`## Notes (${state.notes.length})`, "");
    for (const n of state.notes) {
      const on = n.entityId ? byId.get(n.entityId) : undefined;
      lines.push(`### ${n.title}${on ? ` — on ${on.name}` : ""}`, "", n.body, "");
    }
  }
  const cites = resolveWorkspaceCitations(state);
  if (cites.length) {
    lines.push(`## Citations (${cites.length})`, "");
    for (const c of cites) lines.push(`- ${formatCitation(c, "apa")}`);
    lines.push("");
  }
  return lines.join("\n");
}

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function toCSV(state: WorkspaceState): string {
  const rows: string[] = ["type,name,detail,href"];
  for (const e of state.savedEntities) rows.push(["saved-entity", e.name, e.type, e.href].map(csvCell).join(","));
  for (const c of state.collections) rows.push(["collection", c.name, `${COLLECTION_KIND_LABELS[c.kind]} (${c.entityIds.length})`, ""].map(csvCell).join(","));
  for (const n of state.notes) rows.push(["note", n.title, n.body.replace(/\s+/g, " ").slice(0, 200), ""].map(csvCell).join(","));
  for (const c of resolveWorkspaceCitations(state)) rows.push(["citation", c.title, c.organization, c.url].map(csvCell).join(","));
  return rows.join("\n");
}

export function exportWorkspace(state: WorkspaceState, format: ExportFormat): string {
  switch (format) {
    case "json": return toJSON(state);
    case "markdown": return toMarkdown(state);
    case "bibtex": return toBibTeX(state);
    case "csv": return toCSV(state);
  }
}
