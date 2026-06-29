# Localization

The platform is built for multilingual operation
([`src/platform/localization.ts`](../src/platform/localization.ts)). The hard
rule: **entity identifiers are never localized** — only the human-facing title,
description, and aliases are.

## Locales

English (active) plus Spanish, German, French, Italian, Portuguese, Japanese,
Chinese, Arabic (RTL), Hindi, and Ukrainian (planned). More can be added to the
`LOCALES` registry without code changes elsewhere.

## Model

Translations live separately from the graph, keyed by the permanent entity id:

```ts
interface LocalizedEntityText {
  entityId: string;   // permanent join key — never translated
  locale: LocaleCode;
  title: string;
  description?: string;
  aliases?: string[];
}
```

`getLocalizedEntity(entity, locale)` returns the localized text, **falling back
to canonical English** when no translation exists. The returned `id` is always
the permanent identifier.

## No fabricated translations

The translation registry ships **empty**. Real translations (verified, not
machine-guessed) are added over time; until then every locale renders the
canonical English text. `validateLocalization()` checks that each record uses a
known locale, references a real entity, has a non-empty title, and never uses an
identifier as a title.

See [Entity Identifiers](./ENTITY_IDENTIFIERS.md) for the identifier rules and
[Platform Architecture](./PLATFORM_ARCHITECTURE.md) for where localization sits.
