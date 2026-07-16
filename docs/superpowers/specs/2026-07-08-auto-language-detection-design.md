# Auto Language Detection — Design Spec

Date: 2026-07-08

## Problem

The site supports four locales (`en-GB`, `en-US`, `zh-Hans`, `es-ES`), each accessible via
locale-prefixed URLs (`en-GB` unprefixed at the root). Language selection today is entirely
manual, via `LanguageSwitcher`. A previously-stored preference (`localStorage.preferredLocale`)
is respected on return visits via `resolveRedirectTarget`, but nothing inspects the browser's
actual language — first-time visitors always see `en-GB`, regardless of their browser settings.

This spec adds automatic detection of the visitor's preferred language on first visit, defaulting
to `en-GB` when no supported language can be determined.

## Scope

- Detection runs client-side only (the site is a static Gatsby build with no server-rendering
  step to inspect `Accept-Language`).
- Detection applies **only** to the unprefixed root path (`/`). Any URL that already specifies a
  locale via its prefix (e.g. `/es-ES/about/`) is left untouched — deep links, shared URLs, and
  search-engine-indexed pages are never overridden.
- Detection applies **only** on first visit — i.e. only when there is no stored preference yet. A
  stored preference (whether set manually via the switcher or by a prior auto-detection) always
  wins over re-detecting.
- Out of scope: server-side/`Accept-Language` header detection (not applicable — static site, no
  server request in the loop for a cached page).

## Detection logic

New pure function in `src/i18n/detect.ts`:

```ts
function detectLocaleFromLanguages(languages: readonly string[]): Locale | null;
```

Walks `languages` (i.e. `navigator.languages`, browser-preference-ordered) in order. For each
entry:

1. Exact match against the 4 supported locale codes (`isLocale`).
2. If no exact match, a language-prefix match: compare the base subtag (before the first `-`)
   case-insensitively against each supported locale's base subtag, taking the **first** matching
   locale in `locales` array order. This means an ambiguous `en-*` (e.g. `en-AU`, or bare `en`)
   resolves to `en-GB`, since `en-GB` appears first in the `locales` array and is the site default.
   `zh-*` resolves to `zh-Hans`; `es-*` resolves to `es-ES`.

The first entry in the list that produces a match (exact or prefix) wins. If no entry matches
anything, the function returns `null` — meaning "no supported language detected, stay on the
default."

## Redirect flow

`resolveRedirectTarget` (in `src/i18n/persistence.ts`) gains a third parameter:

```ts
function resolveRedirectTarget(
  pathname: string,
  stored: Locale | null,
  detected: Locale | null,
): string | null;
```

Behaviour:

- Only ever produces a target for `pathname === "/"`. All other paths return `null` unchanged.
- If `stored` is non-null, behave exactly as today: redirect to `stored` unless it's the default
  (stored preference always wins, including an explicit choice to stay on `en-GB`).
- If `stored` is `null`, fall back to `detected`: redirect to `detected` unless it's `null` or the
  default.

`gatsby-browser.ts`'s `onClientEntry` is updated to compute `navigator.languages` and pass it
through `detectLocaleFromLanguages`, then call the extended `resolveRedirectTarget`. When a
redirect happens specifically because of detection (`stored` was `null` and `detected` drove the
redirect), two additional side effects occur before navigating:

1. `storeLocale(detected)` — the detected locale is persisted exactly as if the user had picked it
   from the switcher. From this point on it's an explicit stored preference; detection never runs
   again for this browser unless storage is cleared.
2. `markAutoDetectedNotice(detected)` — writes a `sessionStorage` flag recording that this
   session's locale was auto-detected (not manually chosen), so the notice banner (below) knows to
   render.

All browser API access (`navigator.languages`, `sessionStorage`, `localStorage`) is guarded the
same way existing code guards it: `typeof window === "undefined"` checks and try/catch that
default to `null`/no-op on any failure. Detection or storage failure never breaks page load; the
worst case is simply no redirect and no notice.

## Notice banner

New component `src/components/LocaleAutoDetectNotice/LocaleAutoDetectNotice.tsx`, mounted once
in the shared layout (`wrapPageElement`) so it persists across client-side navigation within a
session.

- On mount, reads the `sessionStorage` auto-detected flag. If present, and the session-scoped
  "dismissed" flag is not set, renders a small Tailwind-styled banner (dark-mode aware, consistent
  with existing component styling) with copy such as: _"We switched to Español based on your
  browser. [View in English]"_.
- The "View in English" link targets the `en-GB` version of the **current** page (using
  `stripLocale`/`localizePath`, the same helpers `LanguageSwitcher` already uses) — not
  necessarily `/`, since the user may have navigated further into the site since the redirect.
- A dismiss control sets a `sessionStorage` "dismissed" flag. Once dismissed, the banner stays
  hidden for the rest of the browser session (tab close clears `sessionStorage`, so a genuinely new
  session can show it again if detection fires once more — e.g. `localStorage` was cleared).
- New translation keys added to all four locale dictionaries (`localeNotice.message`,
  `localeNotice.dismiss`, `localeNotice.viewInEnglish` or equivalent), following the existing
  `t()`/interpolation conventions in `src/i18n/useLocale.ts`.

## Testing

- Unit tests (`src/i18n/detect.test.ts`): exact match, prefix match, ordering/priority across
  multiple `navigator.languages` entries, no-match fallback to `null`.
- Unit tests (`src/i18n/persistence.test.ts`, extended): stored-preference-wins, detected-fallback
  when nothing stored, no-op on non-root paths, no-op when detected is `null` or the default.
- Component tests (`LocaleAutoDetectNotice.test.tsx`): renders when the session flag is present and
  undismissed, hidden when absent or dismissed, correct dismiss behaviour, correct "View in
  English" link target.
- One Playwright end-to-end test (per `.claude/skills/e2e-testing`) simulating a fresh browser
  (no `localStorage`) with an overridden `navigator.languages`, verifying: redirect to the matched
  locale, banner appears, dismiss hides it, and a stored preference on a subsequent visit skips
  detection entirely.

## Non-goals

- No UI for choosing "always ask" vs "remember" — behaviour is fixed: detect once, then remember.
- No geo-IP-based detection — browser language only.
- No change to how `LanguageSwitcher` or manual selection works; auto-detection only changes what
  happens on a first visit to `/`.
