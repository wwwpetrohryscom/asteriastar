import { IMPLEMENTED_ENDPOINTS, type EndpointDef } from "@/platform/open-data/endpoints";
import { GRAPH_VERSION_INFO } from "@/knowledge-graph/version";
import { API_VERSION, API_LICENSE } from "@/platform/open-data/api";
import { SITE_URL } from "@/lib/site";

/**
 * OpenAPI 3.1 document builder.
 *
 * Built ONLY from implemented endpoints — planned endpoints never enter the
 * spec. The document is deterministic (no timestamps or per-request values) so
 * it is safe to cache and diff across releases.
 */

function operationFor(e: EndpointDef) {
  const parameters = e.params.map((p) => ({
    name: p.name,
    in: p.in,
    required: p.required,
    description: p.description,
    // OpenAPI 3.1: examples belong on the schema, not the parameter.
    schema: { type: p.type, ...(p.example != null ? { examples: [p.example] } : {}) },
  }));
  return {
    operationId: e.id.replace(/-/g, "_"),
    summary: e.summary,
    description: e.description,
    tags: [e.group],
    parameters,
    responses: {
      "200": {
        description: e.returns,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiEnvelope" },
          },
        },
      },
      ...(e.params.some((p) => p.required)
        ? { "400": { description: "A required parameter is missing or invalid." } }
        : {}),
      ...(e.path.includes("{")
        ? { "404": { description: "No resource exists for the given id." } }
        : {}),
    },
  };
}

export function buildOpenApiSpec() {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const e of IMPLEMENTED_ENDPOINTS) {
    paths[e.path] = { ...(paths[e.path] ?? {}), get: operationFor(e) };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "Asteria Star Open Data API",
      version: `${API_VERSION} (data ${GRAPH_VERSION_INFO.graphVersion}, schema ${GRAPH_VERSION_INFO.schemaVersion})`,
      description:
        "Read-only scientific data API. Every response is a deterministic projection of the Asteria Star knowledge graph and Scientific Data Engine, wrapped in a provenance envelope. There are no write, authentication, or rate-limited endpoints. This document lists only implemented endpoints.",
      license: { name: API_LICENSE, url: "https://creativecommons.org/licenses/by-sa/4.0/" },
    },
    servers: [{ url: SITE_URL, description: "Production" }],
    tags: [...new Set(IMPLEMENTED_ENDPOINTS.map((e) => e.group))].map((t) => ({ name: t })),
    paths,
    components: {
      schemas: {
        ApiMeta: {
          type: "object",
          required: ["apiVersion", "schemaVersion", "dataVersion", "generatedAt", "source", "license", "attribution", "provenance"],
          properties: {
            apiVersion: { type: "string" },
            schemaVersion: { type: "string" },
            dataVersion: { type: "string" },
            generatedAt: { type: "string", format: "date-time" },
            source: { type: "string" },
            license: { type: "string" },
            attribution: { type: "string" },
            provenance: { type: "string" },
            docs: { type: "string" },
            stale: { type: "boolean" },
          },
        },
        ApiEnvelope: {
          type: "object",
          required: ["meta", "data"],
          properties: {
            meta: { $ref: "#/components/schemas/ApiMeta" },
            count: { type: "integer" },
            data: {},
          },
        },
        Entity: {
          type: "object",
          required: ["id", "type", "name", "domain", "path"],
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            name: { type: "string" },
            domain: { type: "string" },
            path: { type: "string" },
            description: { type: "string" },
            aliases: { type: "array", items: { type: "string" } },
          },
        },
        Relationship: {
          type: "object",
          required: ["id", "from", "type", "to", "confidence", "domain"],
          properties: {
            id: { type: "string" },
            from: { type: "string" },
            type: { type: "string" },
            to: { type: "string" },
            confidence: { type: "string" },
            domain: { type: "string" },
          },
        },
      },
    },
  };
}

export type OpenApiSpec = ReturnType<typeof buildOpenApiSpec>;
