import { getEntityById, type GraphEntity } from "@/knowledge-graph";

/**
 * Localization architecture.
 *
 * The platform is built for multilingual operation. The hard rule: **entity
 * identifiers are never localized** — only the human-facing title, description,
 * and aliases are. Translations live separately from the graph, keyed by the
 * permanent entity id, so the same entity is one global object across every
 * language.
 *
 * No fabricated translations exist: the registry ships empty and every locale
 * falls back to the canonical English text until verified translations are
 * added.
 */

export interface Locale {
  code: LocaleCode;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  status: "active" | "planned";
}

export type LocaleCode =
  | "en" | "es" | "de" | "fr" | "it" | "pt"
  | "ja" | "zh" | "ar" | "hi" | "uk";

export const DEFAULT_LOCALE: LocaleCode = "en";

export const LOCALES: Locale[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr", status: "active" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr", status: "planned" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr", status: "planned" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr", status: "planned" },
  { code: "it", name: "Italian", nativeName: "Italiano", dir: "ltr", status: "planned" },
  { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr", status: "planned" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr", status: "planned" },
  { code: "zh", name: "Chinese", nativeName: "中文", dir: "ltr", status: "planned" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", status: "planned" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr", status: "planned" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", dir: "ltr", status: "planned" },
];

const LOCALE_CODES = new Set(LOCALES.map((l) => l.code));

/** A translation of an entity's human-facing text. The id is NEVER localized. */
export interface LocalizedEntityText {
  /** Permanent entity id — the join key, never translated. */
  entityId: string;
  locale: LocaleCode;
  title: string;
  description?: string;
  aliases?: string[];
}

/** No fabricated translations: real translations are added here over time. */
export const ENTITY_LOCALIZATIONS: LocalizedEntityText[] = [];

const LOCALIZATION_INDEX = new Map<string, LocalizedEntityText>(
  ENTITY_LOCALIZATIONS.map((t) => [`${t.entityId}@${t.locale}`, t]),
);

export interface LocalizedEntity {
  /** Permanent, language-independent identifier. */
  id: string;
  locale: LocaleCode;
  title: string;
  description?: string;
  aliases: string[];
  /** False when falling back to canonical English (no translation yet). */
  localized: boolean;
}

/**
 * Resolve an entity's text in a locale, falling back to canonical English.
 * The returned `id` is always the permanent identifier.
 */
export function getLocalizedEntity(
  entity: GraphEntity,
  locale: LocaleCode = DEFAULT_LOCALE,
): LocalizedEntity {
  const t = LOCALIZATION_INDEX.get(`${entity.id}@${locale}`);
  return {
    id: entity.id,
    locale,
    title: t?.title ?? entity.name,
    description: t?.description ?? entity.description,
    aliases: t?.aliases ?? entity.aliases ?? [],
    localized: Boolean(t),
  };
}

/** Validate the localization registry (structure + readiness). */
export function validateLocalization(items = ENTITY_LOCALIZATIONS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const t of items) {
    const key = `${t.entityId}@${t.locale}`;
    if (seen.has(key)) issues.push(`duplicate localization: ${key}`);
    seen.add(key);
    if (!LOCALE_CODES.has(t.locale)) issues.push(`${key}: unknown locale "${t.locale}"`);
    if (!getEntityById(t.entityId)) issues.push(`${key}: unknown entity id`);
    if (!t.title?.trim()) issues.push(`${key}: missing localized title`);
    // Identifiers must never be used as a localized title.
    if (t.title?.includes(":")) issues.push(`${key}: localized title looks like an identifier`);
  }
  return issues;
}

export const LOCALIZATION_STATS = {
  locales: LOCALES.length,
  active: LOCALES.filter((l) => l.status === "active").length,
  translations: ENTITY_LOCALIZATIONS.length,
} as const;
