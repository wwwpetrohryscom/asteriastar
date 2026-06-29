# Platform Extensions

The core is closed for modification but open for extension
([`src/platform/extensions.ts`](../src/platform/extensions.ts)). New
capabilities register against a typed extension point **without changing the
core**.

## Extension points

`entity-type`, `dataset`, `calculator`, `timeline`, `gallery`, `learning-path`,
`explorer`, `metadata-provider`, `search-provider`.

## Contract

```ts
interface Extension {
  id: string;            // namespaced, e.g. "core:datasets" or "community:asteroid-tracker"
  point: ExtensionPoint;
  name: string;
  description: string;
  version: string;
  status: "core" | "official" | "community" | "planned";
}

registerExtension(ext);            // throws on duplicate id / unknown point
getExtensions(point?);             // enumerate
```

The capabilities the platform ships today are modeled as `core` extensions, so
the contract is real and populated — not a placeholder for future features.
`validateExtensions()` enforces unique, well-formed namespaced ids and known
points.

## Why this matters

Future entity types, datasets, calculators, timelines, galleries, learning
paths, and explorers — including community contributions — plug in through these
points. The Graph, Registry, and Data layers stay stable while the platform
grows. See [Platform Architecture](./PLATFORM_ARCHITECTURE.md).
