# Versioning (object-level)

Object-level version + change-log architecture
([`src/platform/authority/versioning.ts`](../src/platform/authority/versioning.ts)).
Where [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md) covers the **graph as a
whole**, this models the history of **individual objects**. Browsable at
[`/transparency/version-policy`](../src/app/transparency).

## Object kinds

entity · relationship · dataset · article · learning-path · timeline · image.

## VersionRecord

```ts
VersionRecord {
  objectId: string;
  objectKind: ObjectKind;
  current: string;            // current semantic version
  previous?: string[];        // earlier versions (excludes current)
  changeSummary?: string;
  changeDate?: string;
  reason?: string;
  compatibility?: "compatible" | "breaking";
  migrationNotes?: string;
  history?: ChangeLogEntry[]; // created · updated · reviewed · verified · deprecated · replaced
}
```

## Rules

- **No persistence** — the `VERSIONS` registry ships empty; this is the typed
  contract for a future public history.
- **Stable identifiers never change.** Versioning records how an object's content
  evolves; its id stays permanent.
- `validateVersions()` rejects duplicate records, invalid object kinds, missing
  `current`, broken version chains (current listed as previous, or duplicate
  previous versions), invalid change types, a `replaced` change with no
  `replacedBy`, and a `replacedBy` that does not resolve to a known object.

See [SCIENTIFIC_AUTHORITY.md](./SCIENTIFIC_AUTHORITY.md).
