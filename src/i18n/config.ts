export const locales = ["en-GB", "en-US", "zh-Hans", "es-ES"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en-GB";

export interface LocaleMeta {
  label: string;
  flag: string;
  htmlLang: string;
  ogLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  "en-GB": {
    label: "English (UK)",
    flag: "🇬🇧",
    htmlLang: "en-GB",
    ogLocale: "en_GB",
  },
  "en-US": {
    label: "English (US)",
    flag: "🇺🇸",
    htmlLang: "en-US",
    ogLocale: "en_US",
  },
  "zh-Hans": {
    label: "简体中文",
    flag: "🇨🇳",
    htmlLang: "zh-Hans",
    ogLocale: "zh_CN",
  },
  "es-ES": {
    label: "Español (España)",
    flag: "🇪🇸",
    htmlLang: "es-ES",
    ogLocale: "es_ES",
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Returns the path prefixed with the locale segment.
 * The default locale (en-GB) lives at the root with no prefix.
 * Other locales are prefixed: /zh-Hans/, /en-US/, etc.
 *
 * Handles trailing hash fragments: localizePath("/#about", "zh-Hans") => "/zh-Hans/#about"
 *
 * NOTE: `path` must be a base path with NO existing locale prefix. If you have a
 * possibly-localized path (e.g. from the current location), call `stripLocale` first
 * and pass the returned `basePath`, otherwise the prefix will be doubled.
 */
export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return path;
  }

  // Split off any hash fragment before manipulating the path.
  const hashIndex = path.indexOf("#");
  const pathPart = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const hashPart = hashIndex === -1 ? "" : path.slice(hashIndex);

  // Ensure pathPart starts with /
  const normalizedPath = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;

  // Build prefix: /<locale>
  const prefix = `/${locale}`;

  if (normalizedPath === "/") {
    return `${prefix}/${hashPart}`;
  }

  return `${prefix}${normalizedPath}${hashPart}`;
}

/**
 * Inverse of localizePath. Given any path, returns the detected locale
 * and the base path stripped of any locale prefix.
 *
 * Also strips the optional /en-GB/ alias for the default locale, so the base path is
 * round-trip stable through the LanguageSwitcher.
 *
 * stripLocale("/zh-Hans/contact-form/") => { locale: "zh-Hans", basePath: "/contact-form/" }
 * stripLocale("/en-GB/contact-form/")   => { locale: "en-GB",   basePath: "/contact-form/" }
 * stripLocale("/contact-form/")         => { locale: "en-GB",   basePath: "/contact-form/" }
 */
export function stripLocale(path: string): {
  locale: Locale;
  basePath: string;
} {
  // Match every locale prefix, including the default-locale /en-GB/ alias, so that
  // landing on the alias does not double-prefix when switching locales.
  for (const locale of locales) {
    const prefix = `/${locale}`;
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      const basePath = path.slice(prefix.length) || "/";
      return { locale, basePath };
    }
  }
  return { locale: defaultLocale, basePath: path };
}
