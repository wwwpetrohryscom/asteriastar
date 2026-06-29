/**
 * Renders one or more Schema.org JSON-LD blocks. Server component — the JSON
 * is serialized at build time and emitted as <script type="application/ld+json">.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={`${String(block["@type"] ?? "ld")}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
