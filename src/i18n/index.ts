// Re-export config primitives
export {
  locales,
  defaultLocale,
  localeMeta,
  isLocale,
  localizePath,
  stripLocale,
} from "./config";
export type { Locale, LocaleMeta } from "./config";

// Re-export types
export type { TranslationDictionary, TranslationKey } from "./types";

// Re-export context and hook
export { LocaleProvider } from "./LocaleContext";
export { useLocale } from "./useLocale";

// Re-export dictionaries map + lookup (defined in dictionaries.ts to avoid cycles)
export { dictionaries, getDictionary } from "./dictionaries";
