import { formatCitationAll, type Citation } from "@/lib/citations";

/**
 * Live demonstration of the citation engine. Renders one real, verifiable
 * reference in every supported style — generated entirely from structured
 * metadata. The engine never fabricates fields.
 */
const EXAMPLE: Citation = {
  id: "nasa-mars-fact-sheet",
  title: "Mars Fact Sheet",
  organization: "NASA Goddard Space Flight Center",
  url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html",
  date: "2024",
  type: "dataset",
  source: "nasa",
};

export function CitationDemo({ citation = EXAMPLE }: { citation?: Citation }) {
  const formatted = formatCitationAll(citation);
  return (
    <div className="space-y-3">
      {formatted.map((f) => (
        <div key={f.style} className="scientific-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-faint">{f.name}</p>
          <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-muted">{f.text}</pre>
        </div>
      ))}
    </div>
  );
}
