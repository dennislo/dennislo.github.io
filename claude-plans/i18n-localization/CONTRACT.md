# i18n Implementation Contract (single source of truth for agents)

This file fixes the exact API, file layout, and dictionary schema so test-writer,
senior-frontend-engineer, and code-reviewer stay aligned. Do **not** diverge from these signatures.

## Locales

```ts
// src/i18n/config.ts
export const locales = ["en-GB", "en-US", "zh-Hans", "zh-Hant"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en-GB";

export interface LocaleMeta {
  label: string; // native name shown in switcher, e.g. "English (UK)", "简体中文"
  flag: string; // emoji flag, e.g. "🇬🇧" "🇺🇸" "🇨🇳" "🇹🇼"
  htmlLang: string; // value for <html lang>, e.g. "en-GB", "zh-Hans"
  ogLocale: string; // value for og:locale, e.g. "en_GB", "zh_CN", "zh_TW"
}
export const localeMeta: Record<Locale, LocaleMeta>;

export function isLocale(value: string): value is Locale;

// Path helpers. Default locale lives at root "/"; others are prefixed.
// localizePath("/", "en-GB")  => "/"
// localizePath("/", "zh-Hans") => "/zh-Hans/"
// localizePath("/contact-form/", "zh-Hant") => "/zh-Hant/contact-form/"
// Preserves a trailing hash if present: localizePath("/#about","zh-Hans") => "/zh-Hans/#about"
export function localizePath(path: string, locale: Locale): string;

// Inverse: given any path, return { locale, basePath } where basePath has no locale prefix.
// stripLocale("/zh-Hans/contact-form/") => { locale: "zh-Hans", basePath: "/contact-form/" }
// stripLocale("/contact-form/") => { locale: "en-GB", basePath: "/contact-form/" }
export function stripLocale(path: string): { locale: Locale; basePath: string };
```

## Dictionary schema

`src/i18n/types.ts` derives `TranslationDictionary` from the en-GB dictionary so all locales must
have identical keys (compile-time parity):

```ts
import { enGB } from "./translations/en-GB";
export type TranslationDictionary = typeof enGB;
```

Each `src/i18n/translations/<locale>.ts` exports a const of type `TranslationDictionary`.
Structure (nested objects, NOT flat) — extend as needed during extraction but keep keys identical
across locales:

```ts
export const enGB = {
  nav: {
    primaryAriaLabel: "Primary",
    mobileMenuAriaLabel: "Mobile primary menu",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    menu: "Menu",
    gists: "Gists",
    about: "About",
    projects: "Projects",
    activity: "Activity",
    experience: "Experience",
    education: "Education",
  },
  languageSwitcher: { ariaLabel: "Select language" },
  hero: {
    /* headings, tagline, CTA + social aria-labels */
  },
  about: {
    heading: "About" /* aboutMe, agileIT, skills section headings, etc. */,
  },
  projects: {
    heading: "Projects",
    viewProjectAria: "View {name}" /* note interpolation */,
  },
  experience: { heading: "Experience" },
  education: { heading: "Education" },
  githubActivity: {
    heading: "Activity",
    loadingAria: "Loading GitHub activity",
    listAria: "Recent GitHub activity",
  },
  themeToggle: {
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
  },
  footer: {
    emailAria: "Email Dennis Lo",
    githubAria: "Dennis Lo on GitHub",
    linkedinAria: "Dennis Lo on LinkedIn",
    instagramAria: "Dennis Lo on Instagram",
  },
  contact: {
    /* page title, field labels, placeholders, validation, submit, aria-describedby copy */
  },
  notFound: {
    /* 404 copy */
  },
  seo: {
    siteTitle: "...",
    description: "..." /* og/twitter, jsonld jobTitle/description */,
  },
  // Locale-variant *content* arrays (funFacts text, project descriptions, experience bullets,
  // education achievements, client/industry names) live here too, keyed stably.
} as const;
```

- **Interpolation:** `t("projects.viewProjectAria", { name })` replaces `{name}`. Implement a tiny
  replace; no ICU.
- Locale-**invariant** data stays in `src/config.ts` (URLs, emails, social hrefs, dateRanges,
  accentColor, raw skill names that remain English). Only translate human-readable prose + labels.

## Runtime API

```tsx
// src/i18n/LocaleContext.tsx
export const LocaleProvider: React.FC<{
  locale: Locale;
  children: React.ReactNode;
}>;

// src/i18n/useLocale.ts
export function useLocale(): {
  locale: Locale;
  dict: TranslationDictionary;
  t: (key: string, vars?: Record<string, string | number>) => string; // dot-path lookup
  localizePath: (path: string) => string; // bound to current locale
};
```

`t()` behavior: resolve dot-path against active dict; if missing, fall back to en-GB dict and
`console.warn` in development (`process.env.NODE_ENV !== "production"`); if still missing, return the
key string. Returns string only (arrays/objects accessed via `dict`).

## Routing

`gatsby-node.ts` `onCreatePage`: for every auto-created page (skip the 404), delete it and create one
page per locale:

- en-GB → original path (e.g. `/`, `/contact-form/`) **and** an alias `/en-GB/...`
- others → `/<locale>/...`
  Each gets `context.locale`. Pages render via `wrapPageElement` (in BOTH `gatsby-ssr.ts` and
  `gatsby-browser.ts`) that wraps element in `<LocaleProvider locale={props.pageContext.locale ?? defaultLocale}>`.

## SEO (Head)

`Head.tsx` accepts `locale`. Must emit: localized `<title>`/description/OG/Twitter, `og:locale`,
`<link rel="canonical">` (en-GB alias canonicalizes to root), and `<link rel="alternate" hreflang>`
for all four locales + `hreflang="x-default"` → root. `<html lang>` set in `gatsby-ssr.ts`
`onRenderBody` via `setHtmlAttributes({ lang })` keyed off the page's locale (use a module-level
ref set in wrapPageElement, or read from pathname). schemas.ts builders accept the active dict +
locale and add `inLanguage`.

## Conventions

- TypeScript strict; match existing Tailwind + dark-mode class patterns.
- Tests: Jest + RTL, project `src/test/test-utils.ts`. E2E: Playwright per `.claude/skills/e2e-testing`.
- No new runtime deps.
