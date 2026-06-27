import { useLocaleContext } from "./LocaleContext";
import { localizePath as localizePathFn } from "./config";
import type { Locale } from "./config";
import type { TranslationDictionary } from "./types";
import { enGB } from "./translations/en-GB";

/**
 * Resolves a dot-separated key path against a nested dictionary object.
 * Returns the leaf string value, or undefined if not found.
 */
function resolvePath(obj: unknown, keys: string[]): string | undefined {
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current === "string") return current;
  return undefined;
}

/**
 * Replaces {varName} placeholders in a template string with the provided values.
 */
function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

export function useLocale(): {
  locale: Locale;
  dict: TranslationDictionary;
  t: (key: string, vars?: Record<string, string | number>) => string;
  localizePath: (path: string) => string;
} {
  const { locale, dict } = useLocaleContext();

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const keys = key.split(".");

    // Try active dictionary first.
    let value = resolvePath(dict, keys);

    if (value === undefined) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          locale === "en-GB"
            ? `[i18n] Missing translation key "${key}" in all dictionaries.`
            : `[i18n] Missing translation key "${key}" for locale "${locale}". Falling back to en-GB.`,
        );
      }
      // Fall back to the en-GB dictionary (no-op when already en-GB).
      value = resolvePath(enGB, keys);
    }

    if (value === undefined) {
      // Key not found in en-GB either — return the key string itself.
      return key;
    }

    if (vars && Object.keys(vars).length > 0) {
      return interpolate(value, vars);
    }

    return value;
  };

  const boundLocalizePath = (path: string): string =>
    localizePathFn(path, locale);

  return {
    locale,
    dict,
    t,
    localizePath: boundLocalizePath,
  };
}
