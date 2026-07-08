import { locales, isLocale } from "./config";
import type { Locale } from "./config";

function primarySubtag(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

/**
 * Resolves a list of browser-preferred language tags (e.g. from
 * `navigator.languages`) to the closest supported Locale.
 *
 * For each tag, in priority order: an exact match against a supported
 * locale wins immediately. Otherwise, a primary-subtag prefix match
 * (e.g. "en-AU" -> "en") resolves to the first supported locale sharing
 * that primary subtag. If a tag produces no match at all, the next tag
 * in the list is tried. Returns null when nothing matches.
 */
export function detectLocaleFromLanguages(
  languages: readonly string[],
): Locale | null {
  for (const lang of languages) {
    if (isLocale(lang)) return lang;

    const primary = primarySubtag(lang);
    const match = locales.find((locale) => primarySubtag(locale) === primary);
    if (match) return match;
  }

  return null;
}
