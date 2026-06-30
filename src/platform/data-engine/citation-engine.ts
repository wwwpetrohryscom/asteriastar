import {
  formatCitation,
  formatCitationAll,
  CITATION_STYLES,
  type Citation,
  type CitationStyle,
} from "@/lib/citations";

/**
 * Citation Engine — formats a structured Citation into standard styles. A thin
 * facade over the citation formatter; never fabricates fields.
 */
export const citationEngine = {
  styles: CITATION_STYLES,
  format: (c: Citation, style: CitationStyle): string => formatCitation(c, style),
  formatAll: (c: Citation) => formatCitationAll(c),
};
