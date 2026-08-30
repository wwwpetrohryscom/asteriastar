/**
 * Renders one or more Schema.org JSON-LD blocks. Server component — the JSON is serialized and
 * emitted as `<script type="application/ld+json">`.
 *
 * The serialisation escapes `<`, `>` and `&` as JSON `\u` sequences before the string reaches
 * `dangerouslySetInnerHTML`. Inside a `<script>` element the HTML parser is in raw-text mode, where
 * the ONLY thing that ends the block is the literal sequence `</script`; a JSON string containing it
 * therefore closes the script and everything after it is parsed as markup. `JSON.parse` treats
 * `<` and `<` as the same character, so consumers see identical data and the breakout is
 * impossible.
 *
 * Every call site today passes compile-time constants, so this is not a live hole. It is written
 * this way because the calendar is the first surface to pipe provider-derived strings towards this
 * component, and the only thing standing between a hostile launch title and this markup is a
 * boolean in another file. A serialiser that is safe by construction does not depend on that.
 */
function serialise(block: Record<string, unknown>): string {
  return JSON.stringify(block).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

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
          dangerouslySetInnerHTML={{ __html: serialise(block) }}
        />
      ))}
    </>
  );
}
