import type { RuntimeEntity } from "@/platform/runtime";
import { GRAPH_RELEASED } from "@/knowledge-graph/version";
import { absoluteUrl } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * Universal metadata generation.
 *
 * Every entity exposes a complete set of metadata facets — canonical,
 * structured (JSON-LD), SEO, Open Graph, citation, dataset, graph, and machine —
 * all GENERATED from the entity runtime. Nothing is hand-duplicated: a single
 * RuntimeEntity is the source for every facet, so the website, API, AI clients,
 * and search engines all see consistent metadata.
 */

export interface EntityMetadata {
  canonical: {
    id: string;
    name: string;
    type: string;
    domain: string;
    url: string;
  };
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords: string[];
  };
  openGraph: {
    title: string;
    description: string;
    type: "article" | "website";
    url: string;
    siteName: string;
  };
  citation: {
    title: string;
    organization: string;
    url: string;
    accessed: string;
    license: string;
  };
  dataset: {
    member: { slug: string; title: string }[];
  };
  graph: {
    relationCount: number;
    connectedTypes: string[];
    domain: string;
    graphVersion: string;
    schemaVersion: string;
  };
  machine: {
    "@id": string;
    "@type": string;
    identifier: string;
    name: string;
    exports: { json: string; jsonld: string };
  };
}

function describe(rt: RuntimeEntity): string {
  if (rt.description) return rt.description;
  return `${rt.name} — a ${rt.typeLabel.toLowerCase()} in the ${SITE.name} knowledge graph, with ${rt.relationCount} connection${rt.relationCount === 1 ? "" : "s"}.`;
}

/** Build the full metadata set for a resolved entity. All facets generated. */
export function buildEntityMetadata(rt: RuntimeEntity): EntityMetadata {
  const url = absoluteUrl(rt.canonicalPath);
  const description = describe(rt);
  const connectedTypes = [...new Set(rt.related.map((e) => e.type))];
  const keywords = [rt.name, ...rt.aliases, rt.typeLabel, "astronomy", "knowledge graph"];

  return {
    canonical: {
      id: rt.id,
      name: rt.name,
      type: rt.type,
      domain: rt.domain,
      url,
    },
    seo: {
      title: `${rt.name} — ${rt.typeLabel}`,
      description,
      canonicalUrl: url,
      keywords,
    },
    openGraph: {
      title: rt.name,
      description,
      type: rt.status === "documented" ? "article" : "website",
      url,
      siteName: SITE.name,
    },
    citation: {
      title: `${rt.name} — ${SITE.name}`,
      organization: SITE.name,
      url,
      accessed: GRAPH_RELEASED,
      license: "CC BY-SA 4.0",
    },
    dataset: {
      member: rt.datasets.map((d) => ({ slug: d.slug, title: d.title })),
    },
    graph: {
      relationCount: rt.relationCount,
      connectedTypes,
      domain: rt.domain,
      graphVersion: rt.version.graphVersion,
      schemaVersion: rt.version.schemaVersion,
    },
    machine: {
      "@id": url,
      "@type": rt.type,
      identifier: rt.id,
      name: rt.name,
      exports: {
        json: absoluteUrl("/data/graph.json"),
        jsonld: absoluteUrl("/data/graph.jsonld"),
      },
    },
  };
}
