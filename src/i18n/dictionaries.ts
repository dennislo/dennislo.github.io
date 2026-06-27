import { enGB } from "./translations/en-GB";
import { enUS } from "./translations/en-US";
import { zhHans } from "./translations/zh-Hans";
import { zhHant } from "./translations/zh-Hant";
import type { Locale } from "./config";
import type { TranslationDictionary } from "./types";

export const dictionaries: Record<Locale, TranslationDictionary> = {
  "en-GB": enGB,
  "en-US": enUS,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
};

/**
 * Returns the translation dictionary for the given locale.
 * Lives in its own module (no React/context imports) so both LocaleContext
 * and index.ts can import it with static ESM imports — no circular deps.
 */
export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale];
}
