import { CITATION_TYPE_LABELS, formatCitation, type Citation } from "@/lib/citations";

/**
 * Renders a list of scientific citations through the Citation Engine. Every
 * field is real; DOIs and formats are generated from the structured record, not
 * fabricated. Peer-reviewed papers are shown first (primary sources), then
 * datasets/catalogues, then institutional references.
 */

const TYPE_ACCENT: Record<string, string> = {
  peer_reviewed_paper: "text-success-strong border-success/40 bg-success/10",
  dataset: "text-muted border-white/20 bg-white/[0.045]",
  catalogue: "text-muted border-white/20 bg-white/[0.045]",
  archive_page: "text-muted border-white/20 bg-white/[0.045]",
  image_archive: "text-muted border-white/20 bg-white/[0.045]",
  historical_reference: "text-nasa border-nasa/40 bg-nasa/10",
  press_release: "text-nasa border-nasa/40 bg-nasa/10",
  standards_reference: "text-nasa border-nasa/40 bg-nasa/10",
};

/** Primary (peer-reviewed) first, then datasets/catalogues, then the rest. */
const ORDER: Record<string, number> = { peer_reviewed_paper: 0, dataset: 1, catalogue: 1, archive_page: 2, mission_page: 3, institutional_page: 4 };
function rank(c: Citation): number {
  return ORDER[c.type] ?? 5;
}

export function CitationList({ citations }: { citations: Citation[] }) {
  const sorted = citations.slice().sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));
  return (
    <ul className="space-y-3">
      {sorted.map((c) => {
        const accent = TYPE_ACCENT[c.type] ?? "text-muted border-white/20 bg-white/[0.045]";
        const meta = [c.authors?.length ? (c.authors.length > 2 ? `${c.authors[0]} et al.` : c.authors.join(" & ")) : null, c.publication, c.date].filter(Boolean).join(" · ");
        return (
          <li key={c.id} className="border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${accent}`}>
                {CITATION_TYPE_LABELS[c.type]}
              </span>
              <a href={c.url} target="_blank" rel="noreferrer nofollow" className="text-sm font-medium text-fg underline-offset-4 hover:text-nasa hover:underline">
                {c.title}
              </a>
            </div>
            {meta && <p className="mt-1 text-xs text-muted">{meta}</p>}
            <p className="mt-0.5 text-xs text-faint">
              {c.organization}
              {c.doi ? <> · <span className="font-mono">doi:{c.doi}</span></> : null}
            </p>
            <details className="mt-1">
              <summary className="cursor-pointer text-[0.7rem] text-faint hover:text-muted">Cite (APA / BibTeX)</summary>
              <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-[0.7rem] leading-relaxed text-faint">{formatCitation(c, "apa")}{"\n\n"}{formatCitation(c, "bibtex")}</pre>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
