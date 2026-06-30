import {
  LOCALES,
  getLocalizedEntity,
  DEFAULT_LOCALE,
  type Locale,
  type LocaleCode,
  type LocalizedEntity,
} from "@/platform/localization";
import { getEntityById } from "@/knowledge-graph";

/**
 * Localization Engine — resolve an entity's human-facing text in a locale.
 * Identifiers are never localized; missing translations fall back to canonical
 * English (no fabricated translations).
 */
export const localizationEngine = {
  locales: (): Locale[] => LOCALES,
  default: DEFAULT_LOCALE,
  localize: (id: string, locale: LocaleCode = DEFAULT_LOCALE): LocalizedEntity | null => {
    const e = getEntityById(id);
    return e ? getLocalizedEntity(e, locale) : null;
  },
};
